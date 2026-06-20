"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import "./orbit-loader.css";

type OrbitApp = { appId: string; logoUrl: string; appName: string };

const MAX_ORBIT_APPS = 8;
const CACHE_KEY = "orbit-apps-v1";
const CACHE_TTL_MS = 5 * 60 * 1000;

let inflight: Promise<OrbitApp[]> | null = null;

function readSessionCache(): OrbitApp[] | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { ts: number; apps: OrbitApp[] };
    if (Date.now() - parsed.ts > CACHE_TTL_MS) return null;
    return parsed.apps;
  } catch {
    return null;
  }
}

function writeSessionCache(apps: OrbitApp[]) {
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), apps }));
  } catch {
    // ignore quota errors
  }
}

async function fetchOrbitApps(): Promise<OrbitApp[]> {
  const cached = readSessionCache();
  if (cached) return cached;

  if (!inflight) {
    inflight = fetch("/api/deletion/apps")
      .then((res) => res.json())
      .then((data) => {
        const apps = ((data.apps || []) as OrbitApp[]).slice(0, MAX_ORBIT_APPS);
        writeSessionCache(apps);
        return apps;
      })
      .catch(() => [] as OrbitApp[])
      .finally(() => {
        inflight = null;
      });
  }

  return inflight;
}

export default function AppOrbitLoader() {
  const [apps, setApps] = useState<OrbitApp[]>(() => readSessionCache() ?? []);
  const [ready, setReady] = useState(() => Boolean(readSessionCache()?.length));

  useEffect(() => {
    let cancelled = false;

    fetchOrbitApps().then((list) => {
      if (cancelled) return;
      setApps(list);
      setReady(true);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  const orbitApps =
    apps.length > 0
      ? apps
      : Array.from({ length: 4 }, (_, i) => ({
          appId: `placeholder-${i}`,
          logoUrl: "/logo.png",
          appName: "App",
        }));

  const count = orbitApps.length;

  return (
    <div className="orbit-loader" role="status" aria-label="Loading">
      <div className="orbit-loader__center">
        <div className="orbit-loader__center-ring" aria-hidden="true" />
        <Image
          src="/logo.png"
          alt="AppsByHussnain"
          width={64}
          height={64}
          priority
          className="relative h-14 w-14 sm:h-16 sm:w-16 rounded-2xl object-contain drop-shadow-md"
        />
      </div>

      <div className={`orbit-loader__track transition-opacity duration-300 ${ready ? "opacity-100" : "opacity-40"}`}>
        {orbitApps.map((app, index) => (
          <div
            key={app.appId}
            className="orbit-loader__item"
            style={{ "--angle": `${(360 / count) * index}deg` } as React.CSSProperties}
          >
            <div className="orbit-loader__item-pos">
              <div className="orbit-loader__item-inner">
                {!ready && apps.length === 0 ? (
                  <div className="orbit-loader__placeholder" aria-hidden="true" />
                ) : (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={app.logoUrl}
                    alt=""
                    width={40}
                    height={40}
                    decoding="async"
                    className="orbit-loader__item-img"
                  />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <p className="sr-only">Loading page content</p>
    </div>
  );
}
