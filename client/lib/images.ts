/** Requests a resized image from the CDNs used in this demo (Pexels and Builder). */
export function sizedImage(src: string, width: number) {
  if (!src) return src;
  try {
    const url = new URL(src);
    if (url.hostname.endsWith("pexels.com")) {
      url.searchParams.set("auto", "compress");
      url.searchParams.set("cs", "tinysrgb");
      url.searchParams.set("w", String(width));
      return url.toString();
    }
    if (url.hostname.endsWith("builder.io")) {
      url.searchParams.set("width", String(width));
      return url.toString();
    }
    return src;
  } catch {
    return src;
  }
}
