import { GlobalOutlined, TeamOutlined } from "@ant-design/icons";
import { cn } from "@/lib/utils";
import { COUNTRY_LABELS, TARGET_GROUP_LABELS } from "@/lib/demo-data";

export function CategoryPill({ category, className }: { category: string; className?: string }) {
  return (
    <span className={cn("rounded-full bg-pine-50 px-2.5 py-1 text-xs font-medium text-pine-700", className)}>
      {category}
    </span>
  );
}

const joinLabels = (values: string[], labels: Record<string, string>, fallback: string) =>
  values.length ? values.map((value) => labels[value] ?? value).join(", ") : fallback;

export function AudienceLine({
  groups,
  countries,
  className,
}: {
  groups: string[];
  countries: string[];
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-1 text-xs text-ink-500", className)}>
      <span className="inline-flex items-center gap-1.5">
        <TeamOutlined className="text-ink-400" />
        For {joinLabels(groups, TARGET_GROUP_LABELS, "no target group yet")}
      </span>
      <span className="inline-flex items-center gap-1.5">
        <GlobalOutlined className="text-ink-400" />
        {joinLabels(countries, COUNTRY_LABELS, "No countries yet")}
      </span>
    </div>
  );
}
