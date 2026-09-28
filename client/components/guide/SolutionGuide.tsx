import { useEffect, useRef, type ReactNode } from "react";
import { Button, Drawer, Grid, Steps, Switch, Table } from "antd";
import { ArrowLeftOutlined, ArrowRightOutlined, CompassOutlined, ExportOutlined } from "@ant-design/icons";
import { cn } from "@/lib/utils";
import { TOPIC_META, TOPIC_ORDER, useGuide, type MarkerTopic } from "@/context/guide-context";
import { CodeBlock } from "./CodeBlock";
import {
  GUIDE_TOPICS,
  OPEN_DECISIONS,
  OVERVIEW_GOAL,
  REQUIREMENTS,
  RESOURCES,
  SUGGESTED_PATH,
  type GuideOption,
} from "./guide-topics";

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-10">
      <h3 className="mb-4 text-[13px] font-semibold uppercase tracking-[0.14em] text-ink-500">{title}</h3>
      {children}
    </section>
  );
}

function LinkList({ links }: { links: { label: string; href: string }[] }) {
  return (
    <ul className="flex flex-wrap gap-2">
      {links.map((link) => (
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
  );
}

function MobileLabel({ children }: { children: string }) {
  return (
    <span className="mb-0.5 block text-[11px] font-medium uppercase tracking-wide text-ink-400 md:hidden">{children}</span>
  );
}

function NumberedList({ items }: { items: ReactNode[] }) {
  return (
    <ol className="space-y-3">
      {items.map((item, i) => (
        <li key={i} className="flex gap-3 text-[14.5px] leading-relaxed text-ink-700">
          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-coral-100 text-[11px] font-semibold text-coral-700">
            {i + 1}
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ol>
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
    render: (v: string) => <span className={cn(v === "Used" && "font-medium text-pine-600")}>{v}</span>,
  },
];

function Overview() {
  const { setTopic } = useGuide();

  return (
    <>
      <p className="eyebrow mt-9 text-coral-600">What Bestseller wants to achieve</p>
      <p className="mt-3 font-display text-[26px] leading-[1.2] text-ink md:text-[30px]">{OVERVIEW_GOAL}</p>

      <Section title="What we heard → what we recommend">
        <div className="overflow-hidden rounded-2xl border border-border bg-white">
          <table className="w-full text-left text-[13px] max-md:block">
            <thead className="max-md:hidden">
              <tr className="bg-sand-100 text-ink-500">
                <th className="px-4 py-3 font-medium">What we heard</th>
                <th className="px-4 py-3 font-medium">Recommendation</th>
                <th className="px-4 py-3 font-medium">In the demo</th>
              </tr>
            </thead>
            <tbody className="max-md:block">
              {REQUIREMENTS.map((row) => (
                <tr
                  key={row.heard}
                  className="border-t border-sand-200 align-top max-md:block max-md:py-2 max-md:first:border-t-0"
                >
                  <td className="px-4 py-3 font-medium text-ink max-md:block max-md:pb-1.5">{row.heard}</td>
                  <td className="px-4 py-3 leading-relaxed text-ink-600 max-md:block max-md:py-1.5">
                    <MobileLabel>Recommendation</MobileLabel>
                    {row.recommendation}
                  </td>
                  <td className="px-4 py-3 text-ink-600 max-md:block max-md:pt-1.5">
                    <MobileLabel>In the demo</MobileLabel>
                    {row.inDemo}
                    {row.topic && (
                      <button
                        type="button"
                        onClick={() => setTopic(row.topic!)}
                        className="mt-1 block text-[12px] font-medium text-pine-700 hover:underline"
                      >
                        {TOPIC_META[row.topic].number}. {TOPIC_META[row.topic].title} →
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="Suggested path: dev first, content second">
        <Steps
          orientation="vertical"
          size="small"
          items={SUGGESTED_PATH.map((step) => ({
            title: (
              <span className="font-medium">
                {step.title}
                <span className="ml-2 rounded-full bg-sand-200 px-2 py-0.5 text-[11px] font-medium text-ink-600">
                  {step.owner}
                </span>
              </span>
            ),
            content: <span className="text-[13.5px] leading-relaxed text-ink-500">{step.description}</span>,
            status: "process" as const,
          }))}
        />
      </Section>

      <Section title="Open decisions for the working session">
        <NumberedList items={OPEN_DECISIONS} />
      </Section>

      <Section title="Resources">
        <LinkList links={RESOURCES} />
      </Section>
    </>
  );
}

function TopicPage({ topic }: { topic: MarkerTopic }) {
  const data = GUIDE_TOPICS[topic];

  return (
    <>
      <p className="eyebrow mt-9 text-coral-600">What we heard</p>
      <p className="mt-3 font-display text-[24px] leading-[1.25] text-ink md:text-[28px]">{data.heard}</p>

      <div className="mt-8 rounded-2xl border border-pine-100 bg-pine-50 p-5">
        <p className="eyebrow text-pine-600">Our recommendation</p>
        <p className="mt-2 text-[15px] leading-relaxed text-ink-700">{data.answer}</p>
      </div>

      <Section title="Try it in this demo">
        <NumberedList items={data.tryIt} />
      </Section>

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

      {data.worthKnowing && (
        <Section title="Worth knowing">
          <ul className="space-y-3">
            {data.worthKnowing.map((item, i) => (
              <li key={i} className="flex gap-3 text-[14px] leading-relaxed text-ink-700">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-coral-500" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </Section>
      )}

      <Section title="The code in this demo">
        <CodeBlock code={data.code.code} title={data.code.title} />
      </Section>

      <Section title="Further reading">
        <LinkList links={data.links} />
      </Section>
    </>
  );
}

export function SolutionGuide() {
  const { isOpen, topic, setTopic, closeGuide, markersVisible, setMarkersVisible } = useGuide();
  const screens = Grid.useBreakpoint();
  const topRef = useRef<HTMLDivElement>(null);
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
          <span className="text-xs font-normal text-ink-500">What we heard on the call, and how this demo answers it</span>
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
          <Button icon={<ArrowLeftOutlined />} disabled={index === 0} onClick={() => setTopic(TOPIC_ORDER[index - 1])}>
            Previous
          </Button>
          <span className="text-xs text-ink-500">
            {index + 1} of {TOPIC_ORDER.length}
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
      <nav className="grid grid-cols-2 gap-2 md:grid-cols-5" aria-label="Guide topics">
        {TOPIC_ORDER.map((id) => {
          const active = id === topic;
          const { number, title } = TOPIC_META[id];
          return (
            <button
              key={id}
              type="button"
              onClick={() => setTopic(id)}
              aria-current={active ? "true" : undefined}
              className={cn(
                "flex items-center gap-2.5 rounded-xl border px-3 py-2.5 text-left text-[13px] font-medium leading-tight transition",
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
                {number ?? <CompassOutlined />}
              </span>
              {title}
            </button>
          );
        })}
      </nav>

      <div key={topic} className="animate-fade-up">
        {topic === "overview" ? <Overview /> : <TopicPage topic={topic} />}
      </div>
    </Drawer>
  );
}
