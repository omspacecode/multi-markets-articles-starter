import { useEffect, useRef, type ReactNode } from "react";
import { Button, Drawer, Grid, Steps, Switch, Table, Tooltip } from "antd";
import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  CheckCircleFilled,
  CloseCircleOutlined,
  ExportOutlined,
  MinusCircleFilled,
} from "@ant-design/icons";
import { cn } from "@/lib/utils";
import { TOPIC_META, TOPIC_ORDER, useGuide } from "@/context/guide-context";
import { CodeBlock } from "./CodeBlock";
import { GUIDE_TOPICS, type GuideOption } from "./guide-topics";
import { TopicLiveStatus } from "./TopicLiveStatus";

type Access = "yes" | "no" | { partial: string };

const ROLE_COLUMNS = ["Article author", "Editor", "Developer", "Admin"];
const ROLE_NOTES = ["Custom role", "Built-in", "Built-in", "Built-in"];

const ROLE_MATRIX: { capability: string; access: Access[] }[] = [
  { capability: "Create and edit articles", access: ["yes", "yes", "yes", "yes"] },
  {
    capability: "Publish articles",
    access: [{ partial: "Optional: grant publish, or require approval with a workflow" }, "yes", "yes", "yes"],
  },
  { capability: "Edit homepage texts and images", access: ["no", "yes", "yes", "yes"] },
  {
    capability: "Add or remove homepage sections",
    access: ["no", { partial: "Can rearrange, but can't insert sections that require editDesigns" }, "yes", "yes"],
  },
  { capability: "Change styles and design", access: ["no", "no", "yes", "yes"] },
  { capability: "Change models and fields", access: ["no", "no", "yes", "yes"] },
  { capability: "Manage users and roles", access: ["no", "no", "no", "yes"] },
];

const FIELD_MAP: [string, string][] = [
  ["Title", "Headline and carousel slide"],
  ["Excerpt", "Lead paragraph and slide text"],
  ["Hero image", "Article hero and slide image"],
  ["Category", "Category tag"],
  ["Countries", "Which country homepages show it"],
  ["Target groups", "Who sees it"],
  ["Author", "Byline"],
  ["Body", "Article text (rich text)"],
  ["Featured", "Pinned to the first slide"],
];

function AccessIcon({ access }: { access: Access }) {
  if (access === "yes") return <CheckCircleFilled className="text-lg text-pine-500" aria-label="Allowed" />;
  if (access === "no") return <CloseCircleOutlined className="text-lg text-ink-300" aria-label="Not allowed" />;
  return (
    <Tooltip title={access.partial}>
      <MinusCircleFilled className="cursor-help text-lg text-[#C58B1A]" aria-label={`Partly: ${access.partial}`} />
    </Tooltip>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-10">
      <h3 className="mb-4 text-[13px] font-semibold uppercase tracking-[0.14em] text-ink-500">{title}</h3>
      {children}
    </section>
  );
}

const optionColumns = [
  { title: "Option", dataIndex: "option", key: "option", render: (v: string) => <span className="font-medium">{v}</span> },
  { title: "Best for", dataIndex: "bestFor", key: "bestFor" },
  { title: "How it works", dataIndex: "howItWorks", key: "howItWorks" },
  {
    title: "In this demo",
    dataIndex: "inDemo",
    key: "inDemo",
    render: (v: string) => (
      <span className={cn(v.startsWith("Used") && "font-medium text-pine-600")}>{v}</span>
    ),
  },
];

export function SolutionGuide() {
  const { isOpen, topic, setTopic, closeGuide, markersVisible, setMarkersVisible } = useGuide();
  const screens = Grid.useBreakpoint();
  const topRef = useRef<HTMLDivElement>(null);
  const data = GUIDE_TOPICS[topic];
  const meta = TOPIC_META[topic];
  const index = TOPIC_ORDER.indexOf(topic);

  useEffect(() => {
    topRef.current?.scrollIntoView({ block: "start" });
  }, [topic]);

  return (
    <Drawer
      open={isOpen}
      onClose={closeGuide}
      size={screens.md ? 780 : "100%"}
      title={
        <div className="flex flex-col">
          <span className="font-display text-[26px] font-normal leading-tight">Solution guide</span>
          <span className="text-xs font-normal text-ink-500">Your four questions, answered with a working setup</span>
        </div>
      }
      extra={
        <label className="flex cursor-pointer items-center gap-2 text-xs text-ink-500">
          <Switch size="small" checked={markersVisible} onChange={setMarkersVisible} />
          Markers
        </label>
      }
      footer={
        <div className="flex items-center justify-between py-1">
          <Button
            icon={<ArrowLeftOutlined />}
            disabled={index === 0}
            onClick={() => setTopic(TOPIC_ORDER[index - 1])}
          >
            Previous
          </Button>
          <span className="text-xs text-ink-500">
            Question {meta.number} of {TOPIC_ORDER.length}
          </span>
          <Button
            type="primary"
            disabled={index === TOPIC_ORDER.length - 1}
            onClick={() => setTopic(TOPIC_ORDER[index + 1])}
          >
            Next <ArrowRightOutlined />
          </Button>
        </div>
      }
    >
      <div ref={topRef} className="scroll-mt-6" />
      <nav className="grid grid-cols-2 gap-2 md:grid-cols-4" aria-label="Questions">
        {TOPIC_ORDER.map((id) => {
          const active = id === topic;
          return (
            <button
              key={id}
              type="button"
              onClick={() => setTopic(id)}
              aria-current={active ? "true" : undefined}
              className={cn(
                "flex items-center gap-2.5 rounded-xl border px-3 py-2.5 text-left text-[13px] font-medium transition",
                active
                  ? "border-ink bg-ink text-white"
                  : "border-border bg-white text-ink-600 hover:border-ink-300 hover:text-ink",
              )}
            >
              <span
                className={cn(
                  "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold",
                  active ? "bg-coral-500 text-white" : "bg-sand-200 text-ink-600",
                )}
              >
                {TOPIC_META[id].number}
              </span>
              {TOPIC_META[id].title}
            </button>
          );
        })}
      </nav>

      <div key={topic} className="animate-fade-up">
        <p className="eyebrow mt-9 text-coral-600">Question {meta.number} from your team</p>
        <blockquote className="mt-3 font-display text-[26px] leading-[1.2] text-ink md:text-[30px]">
          “{data.question}”
        </blockquote>

        <div className="mt-8 rounded-2xl border border-pine-100 bg-pine-50 p-5">
          <p className="eyebrow text-pine-600">Our recommendation</p>
          <p className="mt-2 text-[15px] leading-relaxed text-ink-700">{data.answer}</p>
        </div>

        <div className="mt-4">
          <TopicLiveStatus topic={topic} />
        </div>

        <Section title="Try it in this demo">
          <ol className="space-y-3">
            {data.tryIt.map((item, i) => (
              <li key={i} className="flex gap-3 text-[14.5px] leading-relaxed text-ink-700">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-coral-100 text-[11px] font-semibold text-coral-700">
                  {i + 1}
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ol>
        </Section>

        {topic === "templates" && (
          <>
            <Section title="The fixed template: field → where it appears">
              <div className="overflow-hidden rounded-2xl border border-border bg-white">
                {FIELD_MAP.map(([field, usage]) => (
                  <div
                    key={field}
                    className="flex items-center justify-between gap-4 border-b border-sand-200 px-4 py-2.5 text-sm last:border-b-0"
                  >
                    <code className="inline-code">{field}</code>
                    <span className="text-right text-ink-500">{usage}</span>
                  </div>
                ))}
              </div>
            </Section>
            <Section title="Who can do what">
              <div className="overflow-x-auto rounded-2xl border border-border bg-white">
                <table className="w-full min-w-[560px] text-sm">
                  <thead>
                    <tr className="bg-sand-100 text-left">
                      <th className="px-4 py-3 font-medium text-ink-500">Capability</th>
                      {ROLE_COLUMNS.map((role, i) => (
                        <th key={role} className="px-3 py-3 text-center font-medium text-ink">
                          {role}
                          <span className="block text-[11px] font-normal text-ink-400">{ROLE_NOTES[i]}</span>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {ROLE_MATRIX.map((row) => (
                      <tr key={row.capability} className="border-t border-sand-200">
                        <td className="px-4 py-3 text-ink-700">{row.capability}</td>
                        {row.access.map((access, i) => (
                          <td key={i} className="px-3 py-3 text-center">
                            <AccessIcon access={access} />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-3 text-xs text-ink-500">
                Custom roles are an Enterprise add-on and can be scoped per model and per locale. Built-in roles apply to the whole space.
              </p>
            </Section>
          </>
        )}

        <Section title="How to set it up">
          <Steps
            orientation="vertical"
            size="small"
            items={data.setup.map((step) => ({
              title: <span className="font-medium">{step.title}</span>,
              content: <span className="text-[13.5px] leading-relaxed text-ink-500">{step.description}</span>,
              status: "process" as const,
            }))}
          />
        </Section>

        {data.options && (
          <Section title="Your options">
            <Table<GuideOption>
              rowKey="option"
              size="middle"
              pagination={false}
              columns={optionColumns}
              dataSource={data.options}
              scroll={{ x: 620 }}
              className="overflow-hidden rounded-2xl border border-border"
            />
          </Section>
        )}

        <Section title="The code in this demo">
          <CodeBlock code={data.code.code} title={data.code.title} />
        </Section>

        <Section title="Further reading">
          <ul className="flex flex-wrap gap-2">
            {data.links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white px-3 py-1.5 text-[13px] text-ink-600 transition hover:border-ink-300 hover:text-ink"
                >
                  {link.label} <ExportOutlined className="text-[11px]" />
                </a>
              </li>
            ))}
          </ul>
        </Section>
      </div>
    </Drawer>
  );
}
