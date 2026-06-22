export default function Loading() {
  return (
    <main>
      {/* Hero placeholder */}
      <section className="relative overflow-hidden border-b border-line bg-white">
        <div className="pointer-events-none absolute inset-0 bg-radial-accent" aria-hidden="true" />
        <div className="relative mx-auto flex max-w-7xl flex-col items-center gap-5 px-4 py-20 lg:px-8 lg:py-24">
          <div className="h-7 w-72 animate-pulse rounded-full bg-brand-100/80" />
          <div className="h-14 w-80 animate-pulse rounded-2xl bg-brand-100/80 sm:w-[28rem]" />
          <div className="h-5 w-96 max-w-full animate-pulse rounded bg-brand-100/80" />
          <div className="h-14 w-full max-w-xl animate-pulse rounded-2xl bg-brand-100/80" />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pt-12 lg:px-8">
        <div className="mb-6 flex items-end justify-between">
          <div className="space-y-2">
            <div className="h-7 w-32 animate-pulse rounded bg-brand-100/80" />
            <div className="h-4 w-40 animate-pulse rounded bg-brand-100/80" />
          </div>
          <div className="hidden gap-2 sm:flex">
            <div className="h-9 w-36 animate-pulse rounded-xl bg-brand-100/80" />
            <div className="h-9 w-32 animate-pulse rounded-xl bg-brand-100/80" />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="overflow-hidden rounded-2xl border border-line bg-white shadow-soft"
            >
              <div className="aspect-[4/3] animate-pulse bg-brand-100/80" />
              <div className="space-y-3 p-4">
                <div className="h-3 w-1/2 animate-pulse rounded bg-brand-100/80" />
                <div className="h-5 w-3/4 animate-pulse rounded bg-brand-100/80" />
                <div className="flex items-end justify-between pt-2">
                  <div className="space-y-2">
                    <div className="h-5 w-24 animate-pulse rounded bg-brand-100/80" />
                    <div className="h-3 w-20 animate-pulse rounded bg-brand-100/80" />
                  </div>
                </div>
                <div className="h-10 w-full animate-pulse rounded-xl bg-brand-100/80" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
