import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

export type TopicId = "target-groups" | "templates" | "multi-country" | "carousel";

export const TOPIC_ORDER: TopicId[] = ["target-groups", "templates", "multi-country", "carousel"];

export const TOPIC_META: Record<TopicId, { number: number; title: string }> = {
  "target-groups": { number: 1, title: "Target groups" },
  templates: { number: 2, title: "Templates & access" },
  "multi-country": { number: 3, title: "Multi-country" },
  carousel: { number: 4, title: "Automatic carousel" },
};

const MARKERS_KEY = "relay.markers";

interface GuideContextValue {
  isOpen: boolean;
  topic: TopicId;
  openGuide: (topic?: TopicId) => void;
  closeGuide: () => void;
  setTopic: (topic: TopicId) => void;
  markersVisible: boolean;
  setMarkersVisible: (visible: boolean) => void;
  tourOpen: boolean;
  setTourOpen: (open: boolean) => void;
}

const GuideContext = createContext<GuideContextValue | null>(null);

export function GuideProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [topic, setTopic] = useState<TopicId>("target-groups");
  const [tourOpen, setTourOpen] = useState(false);
  const [markersVisible, setMarkersState] = useState(
    () => window.localStorage.getItem(MARKERS_KEY) !== "off",
  );

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
    () => ({
      isOpen,
      topic,
      openGuide,
      closeGuide,
      setTopic,
      markersVisible,
      setMarkersVisible,
      tourOpen,
      setTourOpen,
    }),
    [isOpen, topic, openGuide, closeGuide, markersVisible, setMarkersVisible, tourOpen],
  );

  return <GuideContext.Provider value={value}>{children}</GuideContext.Provider>;
}

export function useGuide() {
  const context = useContext(GuideContext);
  if (!context) throw new Error("useGuide must be used inside <GuideProvider>");
  return context;
}
