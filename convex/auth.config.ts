const authConfig = {
  providers: [
    {
      // CONVEX_SITE_URL is set automatically by Convex.
      domain: process.env.CONVEX_SITE_URL,
      applicationID: "convex",
    },
  ],
};

export default authConfig;
