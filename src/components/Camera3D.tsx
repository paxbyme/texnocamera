'use client';

import Image from 'next/image';
import cameraImg from '../../public/camera-3d.png';

/**
 * Camera3D — the real rendered bullet-camera image presented as a 3D motion
 * centerpiece: a gentle perspective tilt + float (so it reads as a hovering 3D
 * object), an ambient crimson/gold glow, a soft ground shadow, and a pulsing
 * "live" glow over the lens. All motion is paused by the global
 * `prefers-reduced-motion` rule in globals.css.
 */
export function Camera3D() {
  return (
    <div className="cam3d" aria-hidden="true">
      <div className="cam3d__glow" />

      <div className="cam3d__tilt">
        <div className="cam3d__bob">
          <Image
            src={cameraImg}
            alt=""
            priority
            sizes="(min-width: 1024px) 360px, 280px"
            className="cam3d__img"
          />
          {/* live recording glow over the lens */}
          <span className="cam3d__live" />
        </div>
      </div>

      <div className="cam3d__shadow" />
    </div>
  );
}
