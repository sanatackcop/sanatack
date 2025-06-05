import React, { useEffect, useState } from "react";
import { CardHeader } from "@/components/ui/card";
import { MaterialViewerProps } from "./type";
import { iconMap } from "./const";

export default function MaterialViewer({
  material,
  onComplete,
}: MaterialViewerProps) {
  // const [videoEnded, setVideoEnded] = useState(false);
  const [_, setVideoEnded] = useState(false);

  if (!material) {
    return (
      <p className="mt-8 text-center text-gray-500 dark:text-gray-400">
        اختر مادة من القائمة لبدء التعلم
      </p>
    );
  }

  useEffect(() => {
    onComplete(material);
  }, []);

  if (material.type === "video") {
    const isYouTube = !!material.url?.match(/youtu\.?(be|be\.com)/);
    let embedUrl: string | undefined;
    if (isYouTube && material.url) {
      embedUrl = material.url
        .replace("watch?v=", "embed/")
        .replace("youtu.be/", "www.youtube.com/embed/");
    }

    return (
      <div className="flex-col">
        <CardHeader className="flex items-right gap-3 px-6">
          {React.createElement(iconMap[material.type], {
            className: "h-6 w-6 text-white/90",
          })}
          <h1 className="flex-1 text-right text-lg font-semibold line-clamp-2 dark:text-white/90">
            {material.title}
          </h1>

          {material.description && (
            <p className="mt-4 px-6 w-full max-w-4xl text-right text-gray-700 dark:text-gray-300">
              {material.description}
            </p>
          )}
        </CardHeader>

        <div className="mt-2 w-full flex justify-start px-6">
          {isYouTube && embedUrl ? (
            <iframe
              className="w-full max-w-full max-h-[700px] aspect-video rounded-3xl shadow-md"
              src={embedUrl}
              title={material.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <video
              className="w-full max-w-4xl rounded-lg shadow-md"
              src={String(material.url)}
              controls
              onEnded={() => setVideoEnded(true)}
            />
          )}
        </div>
      </div>
    );
  }

  return null;
}
