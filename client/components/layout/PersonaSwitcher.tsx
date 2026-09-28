import { useState } from "react";
import { App, Avatar, Dropdown } from "antd";
import { CheckOutlined, DownOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Flag } from "@/components/brand/Flag";
import { SolutionMarker } from "@/components/guide/SolutionMarker";
import { usePersona } from "@/context/persona-context";
import { useRouteCountry } from "@/context/viewer";
import { COUNTRIES, TARGET_GROUP_LABELS, initialsOf, type Persona } from "@/lib/demo-data";

function PersonaAvatar({ persona, size = 32 }: { persona: Persona; size?: number }) {
  return (
    <Avatar size={size} style={{ backgroundColor: persona.color, fontSize: size * 0.38, fontWeight: 600 }}>
      {initialsOf(persona.name)}
    </Avatar>
  );
}

export function PersonaSwitcher() {
  const { persona, personas, setPersona } = usePersona();
  const routeCountry = useRouteCountry();
  const navigate = useNavigate();
  const { message } = App.useApp();
  const [open, setOpen] = useState(false);

  const choose = (next: Persona) => {
    setOpen(false);
    if (next.id === persona.id) return;
    setPersona(next.id);
    if (routeCountry && !next.countries.includes(routeCountry)) {
      navigate(`/${next.countries[0]}`);
    }
    message.success(`Signed in as ${next.name} · ${TARGET_GROUP_LABELS[next.targetGroup]}`);
  };

  const panel = (
    <div className="w-[340px] rounded-2xl border border-border bg-white p-2 shadow-lift">
      <div className="px-3 pb-2 pt-2">
        <p className="text-sm font-medium text-ink">Switch signed-in person</p>
        <p className="text-xs text-ink-500">Stand-ins for the profile your SSO would provide.</p>
      </div>
      <ul className="space-y-1">
        {personas.map((p) => {
          const active = p.id === persona.id;
          return (
            <li key={p.id}>
              <button
                type="button"
                onClick={() => choose(p)}
                className={cn(
                  "flex w-full items-start gap-3 rounded-xl px-3 py-2.5 text-left transition",
                  active ? "bg-sand-100" : "hover:bg-sand-100",
                )}
              >
                <PersonaAvatar persona={p} size={36} />
                <span className="min-w-0 flex-1">
                  <span className="flex items-center justify-between gap-2">
                    <span className="text-sm font-medium text-ink">{p.name}</span>
                    {active && <CheckOutlined className="text-pine-600" />}
                  </span>
                  <span className="block text-xs text-ink-500">
                    {p.role} · {p.location}
                  </span>
                  <span className="mt-2 flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-pine-50 px-2 py-0.5 text-[11px] font-medium text-pine-700">
                      {TARGET_GROUP_LABELS[p.targetGroup]}
                    </span>
                    <span className="flex items-center gap-1">
                      {p.countries.map((code) => (
                        <span key={code} title={COUNTRIES[code].name}>
                          <Flag code={code} className="h-3 w-[18px]" />
                        </span>
                      ))}
                    </span>
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );

  return (
    <div className="flex items-center gap-2">
      <SolutionMarker topic="target-groups" className="hidden sm:inline-flex" />
      <Dropdown open={open} onOpenChange={setOpen} trigger={["click"]} placement="bottomRight" popupRender={() => panel}>
        <button
          type="button"
          data-tour="persona"
          className="flex items-center gap-2.5 rounded-full border border-border bg-white py-1 pl-1 pr-3 transition hover:border-ink-300"
          aria-label={`Signed in as ${persona.name}. Switch person`}
        >
          <PersonaAvatar persona={persona} />
          <span className="hidden text-left leading-tight md:block">
            <span className="block text-[13px] font-medium text-ink">{persona.name}</span>
            <span className="block text-[11px] text-ink-500">{TARGET_GROUP_LABELS[persona.targetGroup]}</span>
          </span>
          <DownOutlined className="text-[10px] text-ink-400" />
        </button>
      </Dropdown>
    </div>
  );
}
