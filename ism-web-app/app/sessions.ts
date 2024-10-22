import { createCookieSessionStorage } from "@remix-run/node";

const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
    throw new Error("SESSION_SECRET must be set");
}

const { getSession, commitSession, destroySession } = createCookieSessionStorage({
    cookie: {
        name: "__session",
        secrets: [sessionSecret],
        sameSite: "lax",
        path: "/",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
    },
});

export { getSession, commitSession, destroySession };
