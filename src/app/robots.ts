import type { MetadataRoute } from "next";

// Required for `output: "export"` (Cloudflare Workers static deployment).
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://skate3browsergame.wiki";
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      { userAgent: ["GPTBot", "OAI-SearchBot", "ChatGPT-User", "ClaudeBot", "Claude-Web", "anthropic-ai", "PerplexityBot", "Perplexity-User", "GoogleOther", "Google-Extended", "DuckAssistBot", "CCBot", "Bytespider", "Applebot-Extended"], allow: "/" },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
