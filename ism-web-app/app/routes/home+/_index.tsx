import { json, LoaderFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { buttonVariants } from "~/components/ui/button";
import liveWiseLogo from "~/assets/livewise.jpg";
import TileGallery from "./components/TileGallery";

export const loader: LoaderFunction = async () => {
    const imageGroups = [
        [
            "https://loremflickr.com/1080/720/construction?random=1",
            "https://loremflickr.com/1080/720/construction?random=2",
            "https://loremflickr.com/1080/720/construction?random=3",
            "https://loremflickr.com/1080/720/construction?random=4",
            "https://loremflickr.com/1080/720/construction?random=5",
        ],
        [
            "https://loremflickr.com/1080/720/construction?random=6",
            "https://loremflickr.com/1080/720/construction?random=7",
            "https://loremflickr.com/1080/720/construction?random=8",
            "https://loremflickr.com/1080/720/construction?random=9",
            "https://loremflickr.com/1080/720/construction?random=10",
        ],
        [
            "https://loremflickr.com/1080/720/construction?random=11",
            "https://loremflickr.com/1080/720/construction?random=12",
            "https://loremflickr.com/1080/720/construction?random=13",
            "https://loremflickr.com/1080/720/construction?random=14",
            "https://loremflickr.com/1080/720/construction?random=15",
        ],
        [
            "https://loremflickr.com/1080/720/construction?random=16",
            "https://loremflickr.com/1080/720/construction?random=17",
            "https://loremflickr.com/1080/720/construction?random=18",
            "https://loremflickr.com/1080/720/construction?random=19",
            "https://loremflickr.com/1080/720/construction?random=20",
        ],
        [
            "https://loremflickr.com/1080/720/construction?random=21",
            "https://loremflickr.com/1080/720/construction?random=22",
            "https://loremflickr.com/1080/720/construction?random=23",
            "https://loremflickr.com/1080/720/construction?random=24",
            "https://loremflickr.com/1080/720/construction?random=25",
        ],
        [
            "https://loremflickr.com/1080/720/construction?random=26",
            "https://loremflickr.com/1080/720/construction?random=27",
            "https://loremflickr.com/1080/720/construction?random=28",
            "https://loremflickr.com/1080/720/construction?random=29",
            "https://loremflickr.com/1080/720/construction?random=30",
        ],
    ];

    return json({ imageGroups });
};

export default function Index() {
    const { imageGroups } = useLoaderData<{ imageGroups: string[][] }>();

    return (
        <div className="flex flex-col items-center justify-center text-gray-800">
            <img
                src={liveWiseLogo}
                alt="LiveWise Construction"
                className="h-12 mb-4"
            />
            <h1 className="text-xl font-bold mb-4 text-center">
                Welcome to LiveWise Inventory Management System
            </h1>
            <TileGallery imageGroups={imageGroups} />
        </div>
    );
}
