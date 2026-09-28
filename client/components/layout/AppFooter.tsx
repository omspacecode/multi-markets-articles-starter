import { ExportOutlined } from "@ant-design/icons";
import { Logo } from "@/components/brand/Logo";
import { MODEL_IDS, MODELS, builderModelUrl } from "@/lib/builder";

const FOOTER_MODELS: { key: keyof typeof MODELS; kind: string; description: string }[] = [
  { key: "article", kind: "Data model", description: "Articles, tagged with a Markets multi-select." },
  { key: "service", kind: "Data model", description: "Service tiles, tagged with the same Markets field." },
  { key: "template", kind: "Section model", description: "The article design, built from registered components." },
];

export function AppFooter() {
  return (
    <footer className="mt-20 border-t border-border bg-sand-100/70">
      <div className="more-container grid gap-10 py-12 lg:grid-cols-[1fr_2fr]">
        <div>
          <Logo />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink-500">
            A working reference for More: articles and services per market, market tabs, side-by-side preview and
            approval before anything goes live.
          </p>
        </div>
        <div>
          <p className="eyebrow text-ink-400">The Builder models behind this demo</p>
          <ul className="mt-4 grid gap-3 sm:grid-cols-3">
            {FOOTER_MODELS.map(({ key, kind, description }) => (
              <li key={key} className="flex flex-col rounded-2xl border border-border bg-white p-4">
                <span className="text-[11px] font-medium uppercase tracking-wide text-ink-400">{kind}</span>
                <code className="mt-1 break-words font-mono text-[12.5px] text-ink">{MODELS[key]}</code>
                <span className="mt-2 text-xs leading-relaxed text-ink-500">{description}</span>
                <a
                  href={builderModelUrl(MODEL_IDS[key])}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-auto inline-flex items-center gap-1.5 pt-3 text-xs font-medium text-pine-700 hover:underline"
                >
                  Open in Builder <ExportOutlined className="text-[10px]" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="more-container flex flex-col gap-2 py-5 text-xs text-ink-400 sm:flex-row sm:items-center sm:justify-between">
          <span>
            Built with the Builder.io React SDK (<code className="font-mono">@builder.io/sdk-react</code>) and Ant
            Design.
          </span>
          <span>Demo content · Photos from Lorem Picsum</span>
        </div>
      </div>
    </footer>
  );
}
