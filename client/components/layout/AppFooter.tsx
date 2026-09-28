import { Logo } from "@/components/brand/Logo";
import { TOPIC_META, TOPIC_ORDER, useGuide } from "@/context/guide-context";

export function AppFooter() {
  const { openGuide } = useGuide();

  return (
    <footer className="mt-20 border-t border-border bg-sand-100/70">
      <div className="relay-container grid gap-10 py-12 md:grid-cols-[1.2fr_1fr]">
        <div>
          <Logo />
          <p className="mt-4 max-w-md text-sm leading-relaxed text-ink-500">
            A working reference for your Builder setup: target groups, fixed article templates with role-based
            access, country homepages and a carousel that fills itself.
          </p>
        </div>
        <div>
          <p className="eyebrow text-ink-400">Your four questions</p>
          <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
            {TOPIC_ORDER.map((id) => (
              <li key={id}>
                <button
                  type="button"
                  onClick={() => openGuide(id)}
                  className="group flex items-center gap-2.5 text-sm text-ink-600 transition hover:text-ink"
                >
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-[11px] font-semibold ring-1 ring-border transition group-hover:bg-coral-500 group-hover:text-white group-hover:ring-coral-500">
                    {TOPIC_META[id].number}
                  </span>
                  {TOPIC_META[id].title}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="relay-container flex flex-col gap-2 py-5 text-xs text-ink-400 sm:flex-row sm:items-center sm:justify-between">
          <span>
            Built with the Builder.io React SDK (<code className="font-mono">@builder.io/sdk-react</code>) and Ant
            Design.
          </span>
          <span>Demo content · Photos from Pexels</span>
        </div>
      </div>
    </footer>
  );
}
