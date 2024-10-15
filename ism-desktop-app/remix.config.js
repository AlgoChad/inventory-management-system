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
}