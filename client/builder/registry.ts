import type { RegisteredComponent } from "@builder.io/sdk-react";
import { MODELS } from "@/lib/builder";
import { bannerComponents } from "./banner-components";
import { ArticleCarousel } from "./components/ArticleCarousel";
import { CountryHero } from "./components/CountryHero";
import { LOCAL_INFO_ICONS, LocalInfo } from "./components/LocalInfo";
import { TargetGroupBanner } from "./components/TargetGroupBanner";

const IMAGE_TYPES = ["jpeg", "jpg", "png", "webp"];

/**
 * Homepage building blocks. `models` keeps them out of other models, and
 * `requiredPermissions` means only designers, developers and admins can insert
 * the structural sections; editors can still edit their texts and images.
 */
export const homepageComponents: RegisteredComponent[] = [
  {
    component: CountryHero,
    name: "Country Hero",
    group: "Relay homepage",
    models: [MODELS.homepage],
    requiredPermissions: ["editDesigns"],
    inputs: [
      { name: "eyebrow", type: "text", defaultValue: "Relay Denmark", helperText: "Small label above the greeting." },
      {
        name: "greeting",
        type: "text",
        defaultValue: "Hej",
        helperText: "Shown before the viewer's first name, e.g. “Hej, Mette.”",
      },
      { name: "intro", type: "longText", defaultValue: "Here's what's happening this week." },
      { name: "image", type: "file", allowedFileTypes: IMAGE_TYPES },
      { name: "imageCaption", type: "text" },
      {
        name: "highlights",
        type: "list",
        subFields: [
          { name: "value", type: "text", required: true },
          { name: "label", type: "text", required: true },
        ],
        defaultValue: [
          { value: "64", label: "stores" },
          { value: "2,140", label: "colleagues" },
        ],
      },
    ],
  },
  {
    component: ArticleCarousel,
    name: "Article Carousel",
    group: "Relay homepage",
    models: [MODELS.homepage],
    requiredPermissions: ["editDesigns"],
    inputs: [
      { name: "title", type: "text", defaultValue: "Latest news" },
      {
        name: "maxArticles",
        friendlyName: "Max articles",
        type: "number",
        defaultValue: 8,
        min: 3,
        max: 12,
      },
      {
        name: "category",
        type: "text",
        enum: ["All", "News", "People", "Stores", "Sustainability", "Learning"],
        defaultValue: "All",
      },
      {
        name: "matchTargetGroup",
        friendlyName: "Only show the viewer's target group",
        type: "boolean",
        defaultValue: true,
      },
      { name: "autoplaySeconds", friendlyName: "Seconds per slide", type: "number", defaultValue: 7, min: 3, max: 30 },
      {
        name: "refreshSeconds",
        friendlyName: "Check for new articles every (seconds)",
        type: "number",
        defaultValue: 15,
        min: 5,
        advanced: true,
      },
    ],
  },
  {
    component: TargetGroupBanner,
    name: "Target Group Banner",
    group: "Relay homepage",
    models: [MODELS.homepage],
    requiredPermissions: ["editDesigns"],
    inputs: [
      {
        name: "label",
        type: "text",
        defaultValue: "For you",
        helperText: "The banner itself comes from the Target group banner model, matched to the viewer.",
      },
    ],
  },
  {
    component: LocalInfo,
    name: "Local Info",
    group: "Relay homepage",
    models: [MODELS.homepage],
    inputs: [
      { name: "title", type: "text", defaultValue: "Good to know" },
      {
        name: "items",
        type: "list",
        subFields: [
          { name: "icon", type: "text", enum: LOCAL_INFO_ICONS, defaultValue: "calendar" },
          { name: "label", type: "text", required: true },
          { name: "value", type: "text", required: true },
        ],
        defaultValue: [{ icon: "calendar", label: "Payday", value: "Last banking day of the month" }],
      },
    ],
  },
];

export const allComponents: RegisteredComponent[] = [...homepageComponents, ...bannerComponents];
