import { createContext, useContext } from "react";
import { useLocation } from "react-router-dom";
import { isCountryCode, type CountryCode } from "@/lib/demo-data";
import { usePersona } from "./persona-context";

/** Lets a page pin the country, e.g. to the country an entry in Builder preview is targeted to. */
const CountryOverrideContext = createContext<CountryCode | null>(null);
export const CountryOverrideProvider = CountryOverrideContext.Provider;

export function useRouteCountry(): CountryCode | null {
  const { pathname } = useLocation();
  const segment = pathname.split("/")[1];
  return isCountryCode(segment) ? segment : null;
}

export function useViewer() {
  const { persona } = usePersona();
  const routeCountry = useRouteCountry();
  const override = useContext(CountryOverrideContext);
  const country: CountryCode = override ?? routeCountry ?? persona.countries[0];
  return { persona, country, targetGroup: persona.targetGroup };
}
