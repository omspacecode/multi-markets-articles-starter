import { Popover, Tabs } from "antd";
import { useNavigate } from "react-router-dom";
import { Flag } from "@/components/brand/Flag";
import { SolutionMarker } from "@/components/guide/SolutionMarker";
import { usePersona } from "@/context/persona-context";
import { useRouteCountry } from "@/context/viewer";
import { COUNTRIES, COUNTRY_CODES, type CountryCode } from "@/lib/demo-data";

function UserAttributesChip({ country }: { country: CountryCode }) {
  const { persona } = usePersona();

  return (
    <Popover
      placement="bottomRight"
      content={
        <div className="max-w-[280px] text-xs leading-relaxed">
          <p className="font-medium text-ink">Sent to Builder with every request</p>
          <p className="mt-1 text-ink-500">
            Read from the signed-in profile and passed as <code className="inline-code">userAttributes</code>, so
            Builder returns the entries targeted to this person and country.
          </p>
        </div>
      }
    >
      <span className="hidden cursor-help items-center gap-2 rounded-full border border-border bg-white px-3 py-1 font-mono text-[11px] text-ink-500 lg:inline-flex">
        <span className="h-1.5 w-1.5 rounded-full bg-pine-400" />
        userAttributes {"{"} urlPath: <span className="text-pine-700">"/{country}"</span>, targetGroup:{" "}
        <span className="text-pine-700">"{persona.targetGroup}"</span> {"}"}
      </span>
    </Popover>
  );
}

export function CountryBar() {
  const { persona } = usePersona();
  const routeCountry = useRouteCountry();
  const navigate = useNavigate();
  const active = routeCountry ?? persona.countries[0];
  const codes = COUNTRY_CODES.filter((code) => persona.countries.includes(code) || code === routeCountry);

  return (
    <div className="relay-container flex min-h-12 items-center gap-3">
      <div data-tour="countries" className="flex min-w-0 flex-1 items-center gap-3">
        {codes.length > 1 ? (
          <Tabs
            className="relay-country-tabs min-w-0"
            activeKey={routeCountry ?? ""}
            onTabClick={(key) => navigate(`/${key}`)}
            items={codes.map((code) => ({
              key: code,
              label: (
                <span className="inline-flex items-center gap-2">
                  <Flag code={code} />
                  {COUNTRIES[code].name}
                  {!persona.countries.includes(code) && (
                    <span className="text-[11px] font-normal text-ink-400">(visiting)</span>
                  )}
                </span>
              ),
            }))}
          />
        ) : (
          <p className="flex min-w-0 items-center gap-2 py-3 text-[13px] text-ink-500">
            <Flag code={active} />
            <span className="truncate">
              <span className="font-medium text-ink">{COUNTRIES[active].name}</span> · {persona.firstName} works in
              one country, so no country tabs are shown
            </span>
          </p>
        )}
        <SolutionMarker topic="multi-country" />
      </div>
      <UserAttributesChip country={active} />
    </div>
  );
}
