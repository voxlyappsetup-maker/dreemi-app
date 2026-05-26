"use client";

import { useEffect } from "react";
import { isAuthenticated } from "../lib/storage";
import { pingBackend } from "../lib/api";

const INTERVAL_MS = 14 * 60 * 1000;

export function KeepAlive() {
  useEffect(() => {
    if (!isAuthenticated()) return;

    pingBackend();
    const id = setInterval(() => {
      if (isAuthenticated()) pingBackend();
    }, INTERVAL_MS);

    return () => clearInterval(id);
  }, []);

  return null;
}
