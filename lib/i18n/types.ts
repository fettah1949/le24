import type { Locale } from "./config";

export interface Dictionary {
  meta: {
    siteTitle: string;
    siteDescription: string;
  };
  nav: {
    home: string;
    about: string;
    contact: string;
    privacy: string;
    search: string;
    all: string;
    mainNav: string;
  };
  home: {
    topStories: string;
    topStoriesSub: string;
    latestNews: string;
    trending: string;
    trendingSub: string;
    categories: string;
    articles: string;
  };
  article: {
    breaking: string;
    minRead: string;
    views: string;
    related: string;
  };
  search: {
    title: string;
    placeholder: string;
    minChars: string;
    noResults: string;
    results: string;
  };
  newsletter: {
    title: string;
    description: string;
    placeholder: string;
    subscribe: string;
    loading: string;
    success: string;
  };
  footer: {
    description: string;
    usefulLinks: string;
    rights: string;
  };
  breadcrumb: {
    aria: string;
    home: string;
  };
  pagination: {
    prev: string;
    next: string;
    aria: string;
  };
  common: {
    articles: string;
    noArticles: string;
    published: string;
  };
  about: {
    title: string;
    missionTitle: string;
    missionText: string;
    valuesTitle: string;
    values: string[];
  };
  contact: {
    title: string;
    intro: string;
    editorial: string;
    advertising: string;
  };
  privacy: {
    title: string;
    updated: string;
    collectTitle: string;
    collectText: string;
    useTitle: string;
    useText: string;
    rightsTitle: string;
    rightsText: string;
  };
  category: {
    titleSuffix: string;
  };
  author: {
    titleSuffix: string;
    publishedCount: string;
  };
  tag: {
    titlePrefix: string;
  };
  notFound: {
    title: string;
    message: string;
    backHome: string;
  };
  language: {
    switch: string;
  };
  ads: {
    label: string;
  };
}

export type DictionaryKey = keyof Dictionary;
