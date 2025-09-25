import { User, TextIcon } from "lucide-react";
import React, { useCallback, useRef, useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslation } from "react-i18next"; // Add i18next import

declare global {
  interface Window {
    YT: {
      Player: any;
      PlayerState: {
        UNSTARTED: number;
        ENDED: number;
        PLAYING: number;
        PAUSED: number;
        BUFFERING: number;
        CUED: number;
      };
    };
    onYouTubeIframeAPIReady: () => void;
  }
}

interface YouTubePlayerProps {
  videoId?: string;
  onVideoSelect?: (videoId: string) => void;
  onTimeUpdate?: (currentTime: number, duration: number) => void;
  onPlay?: () => void;
  onPause?: () => void;
  className?: string;
}

interface YouTubePlayerState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isFullscreen: boolean;
  playbackRate: number;
  isLoading: boolean;
}

const YouTubeReader: React.FC<YouTubePlayerProps> = ({
  videoId = "dQw4w9WgXcQ",
  onTimeUpdate,
  onPlay,
  onPause,
  className = "",
}) => {
  const { t } = useTranslation(); // Initialize translation hook
  const playerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const timeUpdateIntervalRef = useRef<number | null>(null);
  const [apiReady, setApiReady] = useState(false);
  const [activeTab, setActiveTab] = useState("transcript");
  const [playerState, setPlayerState] = useState<YouTubePlayerState>({
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 100,
    isFullscreen: false,
    playbackRate: 1,
    isLoading: true,
  });

  const clearTimeUpdateInterval = useCallback(() => {
    if (timeUpdateIntervalRef.current) {
      clearInterval(timeUpdateIntervalRef.current);
      timeUpdateIntervalRef.current = null;
    }
  }, []);

  const startTimeUpdateInterval = useCallback(() => {
    clearTimeUpdateInterval();
    timeUpdateIntervalRef.current = setInterval(() => {
      if (playerRef.current && playerRef.current.getCurrentTime) {
        const currentTime = playerRef.current.getCurrentTime();
        const duration = playerRef.current.getDuration();
        onTimeUpdate?.(currentTime, duration);
        setPlayerState((prev) => ({ ...prev, currentTime, duration }));
      }
    }, 1000);
  }, [onTimeUpdate, clearTimeUpdateInterval]);

  const initializePlayer = useCallback(() => {
    if (!containerRef.current || !window.YT || !window.YT.Player) return;

    if (playerRef.current && playerRef.current.destroy) {
      playerRef.current.destroy();
    }

    playerRef.current = new window.YT.Player("youtube-player", {
      height: "100%",
      width: "100%",
      videoId: videoId,
      playerVars: {
        playsinline: 1,
        controls: 1,
        rel: 0,
        modestbranding: 1,
        fs: 1,
        cc_load_policy: 0,
        iv_load_policy: 3,
        autohide: 0,
      },
      events: {
        onReady: onPlayerReady,
        onStateChange: onPlayerStateChange,
        onError: onPlayerError,
      },
    });
  }, [videoId]);

  const onPlayerReady = useCallback((event: any) => {
    const player = event.target;
    setPlayerState((prev) => ({
      ...prev,
      duration: player.getDuration() || 0,
      volume: player.getVolume() || 100,
      isLoading: false,
    }));
  }, []);

  const onPlayerStateChange = useCallback(
    (event: any) => {
      const player = event.target;
      const state = event.data;

      const isPlaying = state === window.YT.PlayerState.PLAYING;
      const isLoading = state === window.YT.PlayerState.BUFFERING;

      setPlayerState((prev) => ({
        ...prev,
        isPlaying,
        currentTime: player.getCurrentTime() || 0,
        duration: player.getDuration() || 0,
        playbackRate: player.getPlaybackRate() || 1,
        isLoading,
      }));

      if (state === window.YT.PlayerState.PLAYING) {
        onPlay?.();
        startTimeUpdateInterval();
      } else {
        if (state === window.YT.PlayerState.PAUSED) {
          onPause?.();
        }
        clearTimeUpdateInterval();
      }
    },
    [onPlay, onPause, startTimeUpdateInterval, clearTimeUpdateInterval]
  );

  const onPlayerError = useCallback(
    (event: any) => {
      console.error(t("errors.youtubePlayerError"), event.data);
      setPlayerState((prev) => ({ ...prev, isLoading: false }));
      clearTimeUpdateInterval();
    },
    [clearTimeUpdateInterval, t]
  );

  useEffect(() => {
    if (window.YT && window.YT.Player) {
      setApiReady(true);
      return;
    }

    if (document.querySelector('script[src*="youtube.com/iframe_api"]')) {
      return;
    }

    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    tag.async = true;

    window.onYouTubeIframeAPIReady = () => {
      setApiReady(true);
    };

    const firstScriptTag = document.getElementsByTagName("script")[0];
    if (firstScriptTag && firstScriptTag.parentNode) {
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    } else {
      document.head.appendChild(tag);
    }

    return () => {
      clearTimeUpdateInterval();
    };
  }, [clearTimeUpdateInterval]);

  useEffect(() => {
    if (apiReady) {
      initializePlayer();
    }
  }, [apiReady, initializePlayer]);

  useEffect(() => {
    if (playerRef.current && playerRef.current.loadVideoById && videoId) {
      playerRef.current.loadVideoById(videoId);
      setPlayerState((prev) => ({ ...prev, isLoading: true }));
    }
  }, [videoId]);

  useEffect(() => {
    return () => {
      clearTimeUpdateInterval();
      if (playerRef.current && playerRef.current.destroy) {
        playerRef.current.destroy();
      }
    };
  }, [clearTimeUpdateInterval]);

  const TABS_CONFIG = [
    { id: "transcript", labelKey: "tabs.transcript", icon: TextIcon },
    { id: "explanation", labelKey: "tabs.explanation", icon: User },
  ] as const;

  return (
    <div className={`mx-auto ${className} rounded-3xl`}>
      <div className="bg-white border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-md rounded-3xl">
        <div
          className="relative rounded-3xl bg-black"
          style={{ aspectRatio: "16/9" }}
        >
          {playerState.isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-10 transition-opacity duration-300">
              <div className="flex flex-col items-center text-white">
                <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mb-3"></div>
                <span className="text-sm animate-pulse">
                  {t("loading.video")}
                </span>
              </div>
            </div>
          )}

          <div ref={containerRef} className="w-full h-full rounded-3xl">
            <div id="youtube-player" className="w-full h-full rounded-3xl" />
          </div>
        </div>
      </div>

      <Tabs
        defaultValue="transcript"
        value={activeTab}
        onValueChange={setActiveTab}
        className="bg-gray-50 backdrop-blur-sm rounded-3xl mt-4 shadow-none border border-gray-200/50 p-1 w-fit"
      >
        <TabsList className="bg-gray-50 rounded-2xl">
          {TABS_CONFIG.map((tab) => {
            const IconComponent = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className={`relative flex items-center justify-center gap-2 rounded-3xl py-2 transition-all duration-200 ${
                  isActive
                    ? "bg-white text-green-600"
                    : "text-gray-600 hover:text-gray-800 hover:bg-white/50"
                }`}
              >
                <div className="flex items-center gap-2">
                  {isActive ? (
                    <div className="w-2.5 h-2.5 bg-green-500 rounded-full"></div>
                  ) : (
                    <IconComponent size={16} />
                  )}
                  <span className="font-medium">{t(tab.labelKey)}</span>
                </div>
              </TabsTrigger>
            );
          })}
        </TabsList>
      </Tabs>
    </div>
  );
};

export default YouTubeReader;
