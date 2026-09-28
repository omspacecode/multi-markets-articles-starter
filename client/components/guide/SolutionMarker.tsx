import { Tooltip } from "antd";
import { cn } from "@/lib/utils";
import { TOPIC_META, useGuide, type TopicId } from "@/context/guide-context";

interface SolutionMarkerProps {
  topic: TopicId;
  withLabel?: boolean;
  className?: string;
}

export function SolutionMarker({ topic, withLabel = false, className }: SolutionMarkerProps) {
  const { markersVisible, openGuide } = useGuide();
  if (!markersVisible) return null;

  const { number, title } = TOPIC_META[topic];

  return (
    <Tooltip
      title={
        <span>
          Question {number}: {title}
          <br />
          <span className="opacity-70">Click to see how it's solved</span>
        </span>
      }
    >
      <button
        type="button"
        onClick={() => openGuide(topic)}
        aria-label={`Question ${number}: ${title}. Open the solution guide`}
        className={cn(
          "group relative inline-flex shrink-0 items-center gap-1.5 rounded-full bg-coral-500 font-semibold text-white shadow-[0_0_0_4px_rgba(255,92,57,0.16)] transition hover:bg-coral-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coral-500",
          withLabel ? "h-6 py-0 pl-1 pr-2.5 text-[11px]" : "h-6 w-6 justify-center text-[11px]",
          className,
        )}
      >
        <span className="absolute inset-0 -z-10 rounded-full bg-coral-500 animate-live-ping" aria-hidden="true" />
        <span
          className={cn(
            "inline-flex items-center justify-center",
            withLabel && "h-4 w-4 rounded-full bg-white text-[10px] text-coral-600",
          )}
        >
          {number}
        </span>
        {withLabel && <span className="whitespace-nowrap">{title}</span>}
      </button>
    </Tooltip>
  );
}
