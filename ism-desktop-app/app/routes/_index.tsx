import { Link, useLoaderData } from "@remix-run/react"
import electron from "~/electron.server"
import { buttonVariants } from "~/components/ui/button"

export function loader() {
	return {
		userDataPath: electron.app.getPath("userData"),
	}
}

export default function Index() {
	const data = useLoaderData<typeof loader>()
	return (
		<main>
			<h1>Welcome to Remix</h1>
			<p>User data path: {data.userDataPath}</p>
            <Link to="/todos" className={buttonVariants({ variant: "default" })}>Click here</Link>
		</main>
	)
}
