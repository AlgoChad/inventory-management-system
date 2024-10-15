import { redirect } from "@remix-run/react";
import { URL } from "url";

const useClearEmptyParams = (url: URL) => {
    let shouldRedirect = false
    for (const [key, value] of url.searchParams.entries()) {
        url.searchParams.set(key,value.trim())
        if (value === "") {
            url.searchParams.delete(key)
            shouldRedirect = true
        }
    }
    if (shouldRedirect) {
        throw redirect(url.toString())
    }
}

export default useClearEmptyParams;