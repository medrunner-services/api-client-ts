import { defineConfig } from "vitepress";

import pkg from "../../package.json";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Medrunner Docs",
  description: "Documentation for the medrunner services",
  head: [["link", { rel: "icon", href: "/favicon.png" }]],
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: "/logo.svg",

    search: {
      provider: "local",
    },

    nav: [
      {
        text: "Guides",
        link: "/guides/getting-started",
        activeMatch: "/guides/",
      },
      {
        text: "Reference",
        link: "/reference/websockets-events",
        activeMatch: "/reference/",
      },
      {
        text: pkg.version,
        items: [
          {
            text: "Changelog",
            link: "https://github.com/medrunner-services/api-client-ts/releases",
          },
          {
            text: "Contributing",
            link: "https://github.com/medrunner-services/api-client-ts/blob/main/CONTRIBUTING.md",
          },
        ],
      },
    ],

    sidebar: [
      {
        text: "Guides",
        items: [
          { text: "Getting started", link: "/guides/getting-started" },
          { text: "Authentication", link: "/guides/authentication" },
          { text: "Real time data", link: "/guides/real-time-data" },
          { text: "Error handling", link: "/guides/error-handling" },
          { text: "Pagination", link: "/guides/pagination" },
        ],
      },
      {
        text: "Reference",
        items: [
          { text: "Websockets events", link: "/reference/websockets-events" },
          {
            text: "Types",
            link: "/reference/types",
            items: [
              { text: "Enumerations", link: "/reference/types/#enumerations" },
              { text: "Classes", link: "/reference/types/#classes" },
              { text: "Interfaces", link: "/reference/types/#interfaces" },
            ],
          },
        ],
      },
    ],

    socialLinks: [
      { icon: "github", link: "https://github.com/medrunner-services" },
      { icon: "x", link: "https://twitter.com/MedrunnerSC" },
      {
        icon: {
          svg: '<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M22.957 7.21c-.004-3.064-2.391-5.576-5.191-6.482-3.478-1.125-8.064-.962-11.384.604C2.357 3.231 1.093 7.391 1.046 11.54c-.039 3.411.302 12.396 5.369 12.46 3.765.047 4.326-4.804 6.068-7.141 1.24-1.662 2.836-2.132 4.801-2.618 3.376-.836 5.678-3.501 5.673-7.031Z" /></svg>',
        },
        link: "https://www.patreon.com/medrunner",
      },
    ],

    footer: {
      message: "Released under the GPL-3.0 License.",
      copyright: "© 2954 Medrunner Services.",
    },
  },
});
