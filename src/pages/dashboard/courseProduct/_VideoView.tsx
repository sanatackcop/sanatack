import { Video } from "@/types/courses";
import { Video as VideoIcon, Clock, PlayCircle } from "lucide-react";

export function VideoView({ video }: { video: Video }) {
  console.log({ video });
  const isYouTube = video.youtubeId?.match(/youtu\.?(be|be\.com)/);
  let embedUrl = video.youtubeId;
  if (isYouTube && video.youtubeId) {
    embedUrl = video.youtubeId
      .replace("watch?v=", "embed/")
      .replace("youtu.be/", "www.youtube.com/embed/");
  }
  return (
    <div className="w-full bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 overflow-y-auto">
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200/50 dark:border-gray-700/50 top-0 z-10">
        <div className="w-full px-6 py-6">
          <div className="flex items-center justify-between" dir="rtl">
            <div className="flex items-start gap-4 flex-1">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg">
                <VideoIcon className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300">
                    <PlayCircle className="w-3 h-3" />
                    درس فيديو
                  </span>
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300">
                    <Clock className="w-3 h-3" />
                    {video.duration}
                  </span>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3 leading-tight">
                  {video.title}
                </h1>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg max-w-4xl">
                  {video.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="w-full max-w-7xl mx-auto mb-40">
          {isYouTube && embedUrl && (
            <div className="relative w-full bg-black shadow-2xl rounded-xl overflow-hidden aspect-video">
              <iframe
                className="w-full h-full"
                src={embedUrl}
                title={video.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}
        </div>
      </div>

      <div className="w-full px-6 py-8">
        <div className="max-w-7xl mx-auto"></div>
      </div>
    </div>
  );
}
