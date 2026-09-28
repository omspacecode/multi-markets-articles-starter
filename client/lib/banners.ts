import { fetchEntries, type BuilderContent } from "@builder.io/sdk-react";
import { BUILDER_API_KEY, MODELS } from "./builder";

/**
 * Picks the banner for the viewer's target group, falling back to the "Everyone" banner.
 * `targetGroup` is also sent as a user attribute, so entry targeting rules apply as soon as
 * the attribute is added under Space settings → Custom targeting attributes.
 */
export async function fetchAudienceBanner(targetGroup: string, country: string): Promise<BuilderContent | null> {
  const results =
    (await fetchEntries({
      model: MODELS.banner,
      apiKey: BUILDER_API_KEY,
      query: { "data.targetGroup": { $in: [targetGroup, "all"] } },
      userAttributes: { targetGroup, urlPath: `/${country}` },
      limit: 10,
    })) ?? [];

  return (
    results.find((banner) => banner.data?.targetGroup === targetGroup) ??
    results.find((banner) => banner.data?.targetGroup === "all") ??
    null
  );
}
