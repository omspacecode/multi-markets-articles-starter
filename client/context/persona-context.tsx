import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { PERSONAS, type Persona } from "@/lib/demo-data";

const STORAGE_KEY = "relay.persona";

interface PersonaContextValue {
  persona: Persona;
  personas: Persona[];
  setPersona: (id: string) => void;
}

const PersonaContext = createContext<PersonaContextValue | null>(null);

function readStoredPersona() {
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return PERSONAS.some((p) => p.id === stored) ? (stored as string) : PERSONAS[0].id;
}

export function PersonaProvider({ children }: { children: ReactNode }) {
  const [personaId, setPersonaId] = useState(readStoredPersona);
  const persona = PERSONAS.find((p) => p.id === personaId) ?? PERSONAS[0];

  const setPersona = useCallback((id: string) => {
    window.localStorage.setItem(STORAGE_KEY, id);
    setPersonaId(id);
  }, []);

  const value = useMemo(() => ({ persona, personas: PERSONAS, setPersona }), [persona, setPersona]);

  return <PersonaContext.Provider value={value}>{children}</PersonaContext.Provider>;
}

export function usePersona() {
  const context = useContext(PersonaContext);
  if (!context) throw new Error("usePersona must be used inside <PersonaProvider>");
  return context;
}
