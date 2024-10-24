import { json, LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import liveWiseLogo from "~/assets/livewise.jpg";
import TileGallery from "./components/TileGallery";

import { shuffleArray } from "~/core/utils/helpers/GeneralHelpers"; // Utility function for shuffling arrays

export const loader: LoaderFunction = async () => {
    const imagePaths = Array.from({ length: 19 }, (_, i) => `app/assets/home/${i + 1}.jpg`);

    const shuffledImages = shuffleArray(imagePaths);

    const numberOfGroups = 6;
    const imageGroups: string[][] = Array.from({ length: numberOfGroups }, () => []);

    shuffledImages.forEach((image, index) => {
        const groupIndex = index % numberOfGroups;
        imageGroups[groupIndex].push(image);
    });

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
