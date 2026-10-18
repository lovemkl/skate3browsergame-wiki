import type { Metadata } from "next";
import { getMessages } from "next-intl/server";
import { JsonLd, WikiSidebar } from "@/components/site";
import { getAllContent, getDynamicNavigation, type ContentItem, CONTENT_TYPES } from "@/lib/content";
import { routing, type Locale } from "@/i18n/routing";
import en from "@/locales/en.json";
import HomePageClient from "./HomePageClient";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://skate3browsergame.wiki";

type Messages = typeof en;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const messages = (await getMessages({ locale })) as Messages;
  return {
    title: messages.home.meta.title,
    description: messages.home.meta.description,
    alternates: { canonical: locale === "en" ? "/" : `/${locale}`, languages: { en: "/", es: "/es", pt: "/pt", de: "/de" } },
    openGraph: { title: messages.home.meta.title, description: messages.home.meta.description, url: siteUrl, images: [`${siteUrl}/images/hero.webp`] },
  };
}

export default async function LocaleHomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const loc = locale as Locale;
  const messages = (await getMessages({ locale })) as Messages;
  const navGroups = getDynamicNavigation(loc);
  const webSite = { "@context": "https://schema.org", "@type": "WebSite", name: "Skate 3 Browser Game Wiki", url: siteUrl, description: messages.home.meta.description };
  const videoGame = { "@context": "https://schema.org", "@type": "VideoGame", name: "Skate 3 Browser Game", description: "Skate 3 Browser Game is the community phenomenon of 2026: an 18-year-old student's browser-hosted port of EA's 2010 skateboarding classic, built on a Chrome-compatible RPCS3 (PS3 emulator) core that runs the full game engine in the browser — no download, no console, playable on almost any device. This wiki covers both ways to skate in a browser: the unofficial web port and the official Xbox Cloud Gaming route.", genre: ["Sports", "Skateboarding", "Emulation"], gamePlatform: ["Web Browser", "PC", "Mobile"], playMode: ["SinglePlayer", "MultiPlayer"], applicationCategory: "Game", publisher: { "@type": "Organization", name: "Community Port" }, url: siteUrl, image: `${siteUrl}/images/hero.webp` };
  const faqData = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: messages.home.faq.items.map((item) => ({ "@type": "Question", name: item.question, acceptedAnswer: { "@type": "Answer", text: item.answer } })) };

  // 动态加载所有 content 目录下的文章
  const allArticles: ContentItem[] = [];
  for (const contentType of CONTENT_TYPES) {
    const items = await getAllContent(contentType, loc);
    allArticles.push(...items);
  }

  // 取最近更新的 8 篇文章（按 date 倒序）
  const recentArticles = [...allArticles]
    .sort((a, b) => {
      const dateA = a.metadata.lastModified || a.metadata.date;
      const dateB = b.metadata.lastModified || b.metadata.date;
      return dateB.localeCompare(dateA);
    })
    .slice(0, 8);

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <JsonLd data={webSite} />
      <JsonLd data={videoGame} />
      <JsonLd data={faqData} />
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_300px]">
        <HomePageClient home={messages.home} locale={locale} articles={allArticles} recentArticles={recentArticles} />
        <WikiSidebar locale={locale} navGroups={navGroups} />
      </div>
    </main>
  );
}
