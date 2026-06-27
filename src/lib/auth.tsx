'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import { apiUrl } from './api-base';

export type AuthUser = {
  id: string;
  phone: string;
  roles: string[];
  fullName?: string | null;
};

export type Session = {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
};

type AuthContextValue = {
  /** True once localStorage has been read. */
  hydrated: boolean;
  user: AuthUser | null;
  login: (session: Session) => void;
  logout: () => Promise<void>;
  /**
   * fetch wrapper that targets the API, attaches the bearer token, and
   * transparently refreshes + retries once on a 401. Throws on auth failure.
   */
  authFetch: (path: string, init?: RequestInit) => Promise<Response>;
};

const STORAGE_KEY = 'texnocam.auth.v1';

const AuthContext = createContext<AuthContextValue | null>(null);

function readStored(): Session | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Session;
    if (parsed?.accessToken && parsed?.refreshToken && parsed?.user) {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [hydrated, setHydrated] = useState(false);
  // Ref mirror so authFetch always sees the latest tokens without re-creating.
  const sessionRef = useRef<Session | null>(null);

  const persist = useCallback((next: Session | null) => {
    sessionRef.current = next;
    setSession(next);
    try {
      if (next) {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } else {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      // Non-fatal: session stays in memory for this tab.
    }
  }, []);

  useEffect(() => {
    const stored = readStored();
    sessionRef.current = stored;
    setSession(stored);
    setHydrated(true);
  }, []);

  // Keep other tabs in sync (login/logout elsewhere).
  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY) {
        const next = readStored();
        sessionRef.current = next;
        setSession(next);
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const login = useCallback(
    (next: Session) => {
      persist(next);
    },
    [persist]
  );

  const logout = useCallback(async () => {
    const current = sessionRef.current;
    persist(null);
    if (current?.refreshToken) {
      try {
        await fetch(apiUrl('/api/v1/auth/logout'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken: current.refreshToken })
        });
      } catch {
        // Best-effort server revocation; local state is already cleared.
      }
    }
  }, [persist]);

  const refresh = useCallback(async (): Promise<string | null> => {
    const current = sessionRef.current;
    if (!current?.refreshToken) return null;
    try {
      const res = await fetch(apiUrl('/api/v1/auth/refresh'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: current.refreshToken })
      });
      if (!res.ok) return null;
      const data = (await res.json()) as {
        accessToken: string;
        refreshToken: string;
      };
      const next: Session = {
        ...current,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken
      };
      persist(next);
      return next.accessToken;
    } catch {
      return null;
    }
  }, [persist]);

  const authFetch = useCallback(
    async (path: string, init: RequestInit = {}): Promise<Response> => {
      const url = apiUrl(path);
      const token = sessionRef.current?.accessToken;

      const withAuth = (bearer?: string): RequestInit => ({
        ...init,
        headers: {
          ...(init.headers ?? {}),
          ...(bearer ? { Authorization: `Bearer ${bearer}` } : {})
        }
      });

      let response = await fetch(url, withAuth(token));
      if (response.status === 401 && sessionRef.current?.refreshToken) {
        const fresh = await refresh();
        if (fresh) {
          response = await fetch(url, withAuth(fresh));
        } else {
          persist(null);
        }
      }
      return response;
    },
    [refresh, persist]
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      hydrated,
      user: session?.user ?? null,
      login,
      logout,
      authFetch
    }),
    [hydrated, session, login, logout, authFetch]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
