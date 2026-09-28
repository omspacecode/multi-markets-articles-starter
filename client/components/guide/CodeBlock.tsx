import { useMemo, type ReactNode } from "react";
import { App, Button } from "antd";
import { CopyOutlined } from "@ant-design/icons";

const TOKEN =
  /(\/\/[^\n]*)|('(?:[^'\\\n]|\\.)*'|"(?:[^"\\\n]|\\.)*"|`(?:[^`\\]|\\.)*`)|\b(const|let|await|async|return|import|from|export|function|new|true|false|null|if)\b/g;

function highlight(code: string) {
  const nodes: ReactNode[] = [];
  let last = 0;
  for (const match of code.matchAll(TOKEN)) {
    const index = match.index ?? 0;
    if (index > last) nodes.push(code.slice(last, index));
    const [text, comment, string] = match;
    const className = comment ? "text-ink-400 italic" : string ? "text-coral-300" : "text-pine-300";
    nodes.push(
      <span key={index} className={className}>
        {text}
      </span>,
    );
    last = index + text.length;
  }
  if (last < code.length) nodes.push(code.slice(last));
  return nodes;
}

export function CodeBlock({ code, title }: { code: string; title?: string }) {
  const { message } = App.useApp();
  const content = useMemo(() => highlight(code), [code]);

  const copy = async () => {
    await navigator.clipboard.writeText(code);
    message.success("Copied to clipboard");
  };

  return (
    <div className="overflow-hidden rounded-2xl bg-ink ring-1 ring-black/5">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-2">
        <span className="font-mono text-[11px] text-ink-300">{title ?? "example.tsx"}</span>
        <Button
          size="small"
          type="text"
          icon={<CopyOutlined />}
          onClick={copy}
          className="!text-ink-300 hover:!text-white"
          aria-label="Copy code"
        >
          Copy
        </Button>
      </div>
      <pre className="overflow-x-auto px-4 py-4 font-mono text-[12.5px] leading-relaxed text-sand-200">
        <code>{content}</code>
      </pre>
    </div>
  );
}
