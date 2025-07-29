import config from "@/configs/website-config"

import { ROUTE } from "./routes"

export const SEO_DATA = {
  notFound: {
    title: `Page not found | ${config.projectName}`,
    description: "Sorry, we couldn't find the page you're looking for",
    pathname: "",
  },
  index: {
    title: `${config.projectName} - Open-source notifications infrastructure for devs and product teams`,
    description: `${config.projectName} is an open-source notification platform that empowers developers to create robust, multi-channel notifications for web and mobile apps. With powerful workflows, seamless integrations, and a flexible API-first approach, ${config.projectName} enables product teams to manage notifications without breaking production.`,
    pathname: "",
  },
  changelog: {
    title: `Changelog | ${config.projectName}`,
    description: `Stay up-to-date with ${config.projectName}`,
    pathname: ROUTE.changelog as string,
  },
}
