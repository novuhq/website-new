const config = {
  projectName: "Novu",
  logo: "/images/logo.svg",
  metaThemeColor: "#00d5ff",
  defaultTitle: "Novu - The open-source notification infrastructure",
  defaultDescription:
    "The ultimate library for managing multi-channel transactional notifications with a single API.",
  defaultSocialImage: "/social-previews/index.jpg",
  githubOrg: "novuhq",
  githubRepo: "website-new",
  blog: {
    postsPerPage: 10,
    postContentWidth: 704,
    postCardCoverWidth: 480,
    featuredPostCount: 4,
    coverAspectRatio: 16 / 9,
    contentDir: "src/content/blog",
    relatedPostsLimit: 3,
  },
  integrations: {
    contentDir: "src/content/integrations",
    visibleCardsCount: 9, // Number of cards to show on the integrations page
  },
}

export default config
