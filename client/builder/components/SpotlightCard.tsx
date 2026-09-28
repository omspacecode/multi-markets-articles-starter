import { ArrowRightOutlined, ExportOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useViewer } from "@/context/viewer";
import { sizedImage } from "@/lib/images";

const TONES = {
  pine: {
    card: "bg-pine-700 text-white",
    label: "bg-white/15 text-white",
    body: "text-pine-100",
    button: "bg-white text-ink hover:bg-sand-100",
  },
  coral: {
    card: "bg-coral-100 text-ink",
    label: "bg-coral-500 text-white",
    body: "text-ink-600",
    button: "bg-ink text-white hover:bg-ink-700",
  },
  sand: {
    card: "bg-sand-200 text-ink",
    label: "bg-ink text-white",
    body: "text-ink-600",
    button: "bg-ink text-white hover:bg-ink-700",
  },
  ink: {
    card: "bg-ink text-white",
    label: "bg-coral-500 text-white",
    body: "text-ink-300",
    button: "bg-white text-ink hover:bg-sand-100",
  },
} as const;

export type SpotlightTone = keyof typeof TONES;
export const SPOTLIGHT_TONES = Object.keys(TONES) as SpotlightTone[];

export interface SpotlightCardProps {
  label?: string;
  title?: string;
  body?: string;
  ctaLabel?: string;
  /** Internal paths may use {country}, e.g. /{country}/articles/123. */
  ctaUrl?: string;
  image?: string;
  tone?: SpotlightTone;
}

export function SpotlightCard({ label, title, body, ctaLabel, ctaUrl, image, tone = "pine" }: SpotlightCardProps) {
  const { country } = useViewer();
  const styles = TONES[tone] ?? TONES.pine;
  const href = ctaUrl?.replace(/\{country\}/g, country);
  const buttonClass = cn(
    "inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition",
    styles.button,
  );

  return (
    <article className={cn("grid overflow-hidden rounded-[28px] md:grid-cols-[1.25fr_1fr]", styles.card)}>
      <div className="flex flex-col justify-center p-7 sm:p-9 md:p-11">
        {label && (
          <span
            className={cn(
              "self-start rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em]",
              styles.label,
            )}
          >
            {label}
          </span>
        )}
        <h3 className="mt-5 font-display text-[34px] leading-[1.04] tracking-[-0.01em] md:text-[44px]">{title}</h3>
        {body && <p className={cn("mt-4 max-w-lg text-[15px] leading-relaxed", styles.body)}>{body}</p>}
        {ctaLabel && href && (
          <div className="mt-8">
            {href.startsWith("/") ? (
              <Link to={href} className={buttonClass}>
                {ctaLabel} <ArrowRightOutlined />
              </Link>
            ) : (
              <a href={href} target="_blank" rel="noreferrer" className={buttonClass}>
                {ctaLabel} <ExportOutlined />
              </a>
            )}
          </div>
        )}
      </div>
      {image && (
        <div className="relative min-h-[220px] md:min-h-[320px]">
          <img src={sizedImage(image, 1000)} alt="" className="absolute inset-0 h-full w-full object-cover" />
        </div>
      )}
    </article>
  );
}
