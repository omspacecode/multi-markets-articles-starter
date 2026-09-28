import { useSyncExternalStore } from "react";

export interface LiveStatus {
  homepage?: { id?: string; name?: string; urlPath: string; found: boolean };
  banner?: { id?: string; name?: string; targetGroup?: string; isFallback: boolean };
  carousel?: {
    count: number;
    checkedAt: number;
    country: string;
    targetGroup: string | null;
    refreshSeconds: number;
    newestTitle?: string;
  };
}

let state: LiveStatus = {};
const listeners = new Set<() => void>();

export function reportLiveStatus(patch: Partial<LiveStatus>) {
  state = { ...state, ...patch };
  listeners.forEach((listener) => listener());
}

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

export const useLiveStatus = () => useSyncExternalStore(subscribe, () => state);
