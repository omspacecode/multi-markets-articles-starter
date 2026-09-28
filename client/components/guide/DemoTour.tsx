import type { ReactNode } from "react";
import { Tour, type TourProps } from "antd";
import { useGuide } from "@/context/guide-context";

const byTour = (name: string) => () =>
  document.querySelector<HTMLElement>(`[data-tour="${name}"]`) as HTMLElement;

function StepTitle({ number, children }: { number?: number; children: ReactNode }) {
  return (
    <span className="flex items-center gap-2">
      {number && (
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-coral-500 text-[11px] font-semibold text-white">
          {number}
        </span>
      )}
      {children}
    </span>
  );
}

const steps: TourProps["steps"] = [
  {
    title: <StepTitle number={3}>One tab per country</StepTitle>,
    description:
      "Tabs come from the signed-in person's profile. Each tab loads that country's homepage entry from Builder.",
    target: byTour("countries"),
  },
  {
    title: <StepTitle number={1}>Switch who's signed in</StepTitle>,
    description:
      "Each person has a target group and a list of countries, like an SSO profile would. Try Lars (four countries) or Ingrid (one).",
    target: byTour("persona"),
  },
  {
    title: <StepTitle number={4}>A carousel that fills itself</StepTitle>,
    description:
      "It queries published News articles for this country and target group, and checks for new ones every 15 seconds.",
    target: byTour("carousel"),
  },
  {
    title: <StepTitle number={1}>Content for your target group</StepTitle>,
    description: "This banner is picked by the viewer's target group, with a fallback for everyone.",
    target: byTour("banner"),
  },
  {
    title: <StepTitle>Every answer, with setup steps</StepTitle>,
    description:
      "Setup steps, options, a role matrix and the code for each question. Open any article to see the fixed template (question 2).",
    target: byTour("guide"),
  },
];

export function DemoTour() {
  const { tourOpen, setTourOpen } = useGuide();

  return (
    <Tour
      open={tourOpen}
      onClose={() => setTourOpen(false)}
      onFinish={() => setTourOpen(false)}
      steps={steps}
      mask={{ color: "rgba(22, 24, 29, 0.55)" }}
      scrollIntoViewOptions={{ block: "center", behavior: "smooth" }}
      indicatorsRender={(current, total) => (
        <span className="text-xs text-ink-500">
          {current + 1} / {total}
        </span>
      )}
    />
  );
}
