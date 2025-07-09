import { useSettings } from "@/context/SettingsContexts";
import { Video } from "@/types/courses";
import { MaterialType } from "@/utils/types/adminTypes";
import { Video as VideoIcon, Clock, PlayCircle } from "lucide-react";
import { useEffect, useRef } from "react";

function extractYouTubeId(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  return match ? match[1] : null;
}

export function VideoView({ video }: { video: Video }) {
  const { updateCurrentCheck: updateCurrentMaterial } = useSettings();
  const playerRef = useRef<HTMLDivElement>(null);
  const ytPlayerInstance = useRef<any>(null);

  useEffect(() => {
    const embedId = extractYouTubeId(video.data.youtubeId);
    if (!embedId) return;

    if (ytPlayerInstance.current && ytPlayerInstance.current.loadVideoById) {
      ytPlayerInstance.current.loadVideoById(embedId);
      updateCurrentMaterial({
        ...video.data,
        type: MaterialType.VIDEO,
        duration: 0,
      });
    }
  }, [video.data.youtubeId]);

  // Load player once when first mounted
  useEffect(() => {
    const embedId = extractYouTubeId(video.data.youtubeId);
    if (!embedId || !playerRef.current) return;

    const loadPlayer = () => {
      ytPlayerInstance.current = new (window as any).YT.Player(
        playerRef.current,
        {
          height: "100%",
          width: "100%",
          videoId: embedId,
          playerVars: {
            modestbranding: 1,
            rel: 0,
          },
          events: {
            onStateChange: (event: any) => {
              if (event.data === (window as any).YT.PlayerState.ENDED) {
                console.log("Video ended");
                updateCurrentMaterial(video);
              }
            },
          },
        }
      );
    };

    if (!(window as any).YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      (window as any).onYouTubeIframeAPIReady = loadPlayer;
      document.body.appendChild(tag);
    } else {
      loadPlayer();
    }
  }, []);

  // Update player when video changes
  useEffect(() => {
    const embedId = extractYouTubeId(video.data.youtubeId);
    if (!embedId) return;

    // If player already exists, just update it
    if (ytPlayerInstance.current && ytPlayerInstance.current.loadVideoById) {
      ytPlayerInstance.current.loadVideoById(embedId);
    }

    updateCurrentMaterial({
      ...video,
      type: MaterialType.VIDEO,
      duration: 0,
    });
  }, [video]);

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
                  {video.data.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="w-full max-w-7xl mx-auto mb-40">
          <div className="relative w-full bg-black shadow-2xl rounded-xl overflow-hidden aspect-video">
            <div ref={playerRef} className="w-full h-full" />
          </div>
        </div>
      </div>

      <div className="w-full px-6 py-8">
        <div className="max-w-7xl mx-auto"></div>
      </div>
    </div>
  );
}
