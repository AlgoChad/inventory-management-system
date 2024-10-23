import { useEffect, useState } from "react";

type TileGalleryProps = {
    imageGroups: string[][];
};

export default function TileGallery({ imageGroups }: TileGalleryProps) {
    const [currentIndexes, setCurrentIndexes] = useState<number[]>(() =>
        imageGroups.map(() => 0)
    );

    useEffect(() => {
        const intervals = imageGroups.map((_, groupIndex) =>
            setInterval(() => {
                setCurrentIndexes((prevIndexes) => {
                    const newIndexes = [...prevIndexes];
                    newIndexes[groupIndex] =
                        (newIndexes[groupIndex] + 1) % imageGroups[groupIndex].length;
                    return newIndexes;
                });
            }, Math.random() * (7000 - 5000) + 5000)
        );

        return () => {
            intervals.forEach(clearInterval);
        };
    }, [imageGroups]);

    const nextImage = (groupIndex: number) => {
        setCurrentIndexes((prevIndexes) => {
            const newIndexes = [...prevIndexes];
            newIndexes[groupIndex] =
                (newIndexes[groupIndex] + 1) % imageGroups[groupIndex].length;
            return newIndexes;
        });
    };

    const prevImage = (groupIndex: number) => {
        setCurrentIndexes((prevIndexes) => {
            const newIndexes = [...prevIndexes];
            newIndexes[groupIndex] =
                (newIndexes[groupIndex] - 1 + imageGroups[groupIndex].length) %
                imageGroups[groupIndex].length;
            return newIndexes;
        });
    };

    const tileSizes = [
        "col-span-1 row-span-1",
        "col-span-2 row-span-1",
        "col-span-1 row-span-2",
        "col-span-2 row-span-2",
    ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-1 p-1">
            {imageGroups.map((group, groupIndex) => (
                <div
                    key={groupIndex}
                    className={`relative overflow-hidden rounded-lg shadow-lg ${tileSizes[groupIndex % tileSizes.length]}`}
                >
                    <img
                        src={group[currentIndexes[groupIndex]]}
                        alt={`Group ${groupIndex + 1} Image ${currentIndexes[groupIndex] + 1}`}
                        className="w-full h-full object-cover"
                    />
                    <button
                        onClick={() => prevImage(groupIndex)}
                        className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-1 rounded-full"
                    >
                        &#10094;
                    </button>
                    <button
                        onClick={() => nextImage(groupIndex)}
                        className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-1 rounded-full"
                    >
                        &#10095;
                    </button>
                </div>
            ))}
        </div>
    );
}
