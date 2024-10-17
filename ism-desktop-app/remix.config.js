const { flatRoutes } = require('remix-flat-routes');

/** @type {import("@remix-run/dev").AppConfig} */
module.exports = {
    serverModuleFormat: "cjs",
    tailwind: true,
    postcss: true,
    ignoredRouteFiles: ['**/*'],
    assets: ["./app/styles/tailwind.css"],
    routes: async (defineRoutes) => {
        return flatRoutes('routes', defineRoutes);
    },
    env: {
    API_BASE_URL: process.env.API_BASE_URL,
    API_TOKEN: process.env.API_TOKEN,
  },
}
