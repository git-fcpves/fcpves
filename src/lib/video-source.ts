export function youtubeEmbedUrl(href?: string): string | null {
  if (!href) return null;
  const url = new URL(href);
  const id = url.hostname === "youtu.be"
    ? url.pathname.slice(1)
    : url.searchParams.get("v");
  if (!id || !/^[\w-]{11}$/.test(id)) return null;
  return `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&playsinline=1&rel=0`;
}