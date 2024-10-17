import { json, LoaderFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import RestClient from "~/data/rest/RestClient";
import { buttonVariants } from "~/components/ui/button";

export const loader: LoaderFunction = async ({ request }) => {
    const API_BASE_URL = process.env.API_BASE_URL as string;
    const API_TOKEN = process.env.API_TOKEN as string;
    const restClient = new RestClient(API_BASE_URL, API_TOKEN);

    return json({ success: true });
};

export default () => {
   
    return (
        <main>
			<h1>Welcome to Remix</h1>
            <Link to="/tools" className={buttonVariants({ variant: "default" })}>Click here</Link>
		</main>
    );
}
