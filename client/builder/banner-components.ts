import type { RegisteredComponent } from "@builder.io/sdk-react";
import { MODELS } from "@/lib/builder";
import { SPOTLIGHT_TONES, SpotlightCard } from "./components/SpotlightCard";

export const bannerComponents: RegisteredComponent[] = [
  {
    component: SpotlightCard,
    name: "Spotlight Card",
    group: "Relay banners",
    models: [MODELS.banner],
    inputs: [
      { name: "label", type: "text", defaultValue: "For store teams" },
      { name: "title", type: "text", required: true, defaultValue: "Something worth knowing" },
      { name: "body", type: "longText" },
      { name: "ctaLabel", friendlyName: "Button label", type: "text" },
      {
        name: "ctaUrl",
        friendlyName: "Button link",
        type: "text",
        helperText: "Internal paths can use {country}, e.g. /{country}/articles/<article id>.",
      },
      { name: "image", type: "file", allowedFileTypes: ["jpeg", "jpg", "png", "webp"] },
      { name: "tone", type: "text", enum: SPOTLIGHT_TONES, defaultValue: "pine" },
    ],
  },
];
