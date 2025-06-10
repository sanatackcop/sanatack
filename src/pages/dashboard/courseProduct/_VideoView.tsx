// import { useState } from "react";
import { Download, Share2, Video, Bookmark } from "lucide-react";

export const VideoView = ({ material }: any) => {
  // const [videoEnded, setVideoEnded] = useState(false);

  const isYouTube = !!material.url?.match(/youtu\.?(be|be\.com)/);
  let embedUrl = material.url;

  if (isYouTube && material.url) {
    embedUrl = material.url
      .replace("watch?v=", "embed/")
      .replace("youtu.be/", "www.youtube.com/embed/");
  }

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 flex-shrink-0">
        <div className="max-w-4xl mx-auto text-right" dir="rtl">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 dark:bg-red-900/20 rounded-xl flex items-center justify-center">
                <Video className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                <p>درس فيديو • {material.duration}</p>
                <p>الوحدة الأولى</p>
              </div>
            </div>
            <div className="flex-1 mr-4">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {material.title}
              </h1>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {material.description}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-4xl">
          {isYouTube && embedUrl ? (
            <div className="relative aspect-video rounded-xl overflow-hidden shadow-xl bg-black">
              <iframe
                className="w-full h-full"
                src={embedUrl}
                title={material.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : (
            <div className="relative aspect-video rounded-xl overflow-hidden shadow-xl bg-black">
              <video
                className="w-full h-full object-cover"
                src={material.url}
                controls
                // onEnded={() => setVideoEnded(true)}
              />
            </div>
          )}

          <div className="mt-4 flex items-center justify-center gap-3">
            <button className="flex items-center gap-2 px-3 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors text-sm">
              <Download className="w-4 h-4" />
              تحميل
            </button>
            <button className="flex items-center gap-2 px-3 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors text-sm">
              <Bookmark className="w-4 h-4" />
              حفظ
            </button>
            <button className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm">
              <Share2 className="w-4 h-4" />
              مشاركة
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
