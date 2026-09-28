import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

export type TopicId = "overview" | "markets" | "tabs" | "editing" | "publishing";
export type MarkerTopic = Exclude<TopicId, "overview">;

export const TOPIC_ORDER: TopicId[] = ["overview", "markets", "tabs", "editing", "publishing"];

export const TOPIC_META: Record<TopicId, { number?: number; title: string }> = {
  overview: { title: "Overview" },
  markets: { number: 1, title: "Content per market" },
  tabs: { number: 2, title: "Market tabs" },
  editing: { number: 3, title: "Editing & preview" },
  publishing: { number: 4, title: "Approval & publishing" },
};

const MARKERS_KEY = "more.markers";

interface GuideContextValue {
  isOpen: boolean;
  topic: TopicId;
  openGuide: (topic?: TopicId) => void;
  closeGuide: () => void;
  setTopic: (topic: TopicId) => void;
  markersVisible: boolean;
  setMarkersVisible: (visible: boolean) => void;
}

const GuideContext = createContext<GuideContextValue | null>(null);

export function GuideProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [topic, setTopic] = useState<TopicId>("overview");
  const [markersVisible, setMarkersState] = useState(() => window.localStorage.getItem(MARKERS_KEY) !== "off");

  const openGuide = useCallback((next?: TopicId) => {
    if (next) setTopic(next);
    setIsOpen(true);
  }, []);

  const closeGuide = useCallback(() => setIsOpen(false), []);

  const setMarkersVisible = useCallback((visible: boolean) => {
    window.localStorage.setItem(MARKERS_KEY, visible ? "on" : "off");
    setMarkersState(visible);
  }, []);

  const value = useMemo(
    () => ({ isOpen, topic, openGuide, closeGuide, setTopic, markersVisible, setMarkersVisible }),
    [isOpen, topic, openGuide, closeGuide, markersVisible, setMarkersVisible],
  );

  return <GuideContext.Provider value={value}>{children}</GuideContext.Provider>;
}

export function useGuide() {
  const context = useContext(GuideContext);
  if (!context) throw new Error("useGuide must be used inside <GuideProvider>");
  return context;
}
