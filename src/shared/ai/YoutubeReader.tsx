import { Card } from "@/components/ui/card";
import React, { useCallback, useRef, useEffect, useState } from "react";

// YouTube API type definitions
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

export const YouTubeEmbed: React.FC<{ src: string }> = ({ src }) => (
  <div className="w-full h-full">
    <iframe
      key={src}
      src={src}
      className="w-full h-full rounded-lg"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowFullScreen
    />
  </div>
);

interface Transcript {
  time: string;
  text: string;
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
  const playerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const timeUpdateIntervalRef = useRef<number | null>(null);
  const [apiReady, setApiReady] = useState(false);
  const [searchQuery, ,] = useState("");
  const [playerState, setPlayerState] = useState<YouTubePlayerState>({
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 100,
    isFullscreen: false,
    playbackRate: 1,
    isLoading: true,
  });

  // Sample transcripts data
  const [transcripts] = useState<Transcript[]>([
    {
      time: "00:03",
      text: "Welcome to CS50's Introduction to Programming with Python.",
    },
    {
      time: "00:08",
      text: "I'm David Malan, and this is lecture zero, our introduction.",
    },
    {
      time: "00:15",
      text: "Today we'll focus on functions and variables in Python.",
    },
    {
      time: "00:22",
      text: "These are the fundamental building blocks of programming.",
    },
    {
      time: "00:28",
      text: "By understanding these concepts, you'll be able to solve complex problems.",
    },
  ]);

  // Extract video ID from YouTube URL

  // Handle URL input change

  // Clear time update interval
  const clearTimeUpdateInterval = useCallback(() => {
    if (timeUpdateIntervalRef.current) {
      clearInterval(timeUpdateIntervalRef.current);
      timeUpdateIntervalRef.current = null;
    }
  }, []);

  // Start time update interval
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

  // Initialize player
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
      console.error("YouTube Player Error:", event.data);
      setPlayerState((prev) => ({ ...prev, isLoading: false }));
      clearTimeUpdateInterval();
    },
    [clearTimeUpdateInterval]
  );

  // Load YouTube API
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

  // Jump to time function
  const jumpToTime = useCallback((timeStr: string) => {
    const [minutes, seconds] = timeStr.split(":").map(Number);
    const totalSeconds = minutes * 60 + seconds;

    if (playerRef.current && playerRef.current.seekTo) {
      playerRef.current.seekTo(totalSeconds, true);
    }
  }, []);

  // Format time helper

  // Filter transcripts based on search
  const filteredTranscripts = transcripts.filter((transcript) =>
    transcript.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`mx-auto ${className}`}>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6 transition-all duration-300 hover:shadow-md">
        <div className="relative bg-black" style={{ aspectRatio: "16/9" }}>
          {playerState.isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-10 transition-opacity duration-300">
              <div className="flex flex-col items-center text-white">
                <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mb-3"></div>
                <span className="text-sm animate-pulse">Loading video...</span>
              </div>
            </div>
          )}

          <div ref={containerRef} className="w-full h-full">
            <div id="youtube-player" className="w-full h-full" />
          </div>
        </div>
      </div>

      <Card className="transition-all duration-300 hover:shadow-lg">
        <div className="border-b border-gray-200">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center space-x-2">
              <svg
                className="w-4 h-4 text-blue-600 transition-transform duration-200 group-hover:scale-110"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                />
              </svg>
              <span className="font-medium text-blue-600">Transcripts</span>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="space-y-3 max-h-[26rem] overflow-y-auto scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400 transition-all duration-200">
            {filteredTranscripts.length === 0 && searchQuery ? (
              <div className="text-gray-500 text-center py-8 transition-opacity duration-300">
                <p>No transcripts found matching "{searchQuery}"</p>
              </div>
            ) : (
              filteredTranscripts.map((transcript, index) => (
                <div
                  key={index}
                  onClick={() => jumpToTime(transcript.time)}
                  className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-all duration-200 ease-in-out transform hover:scale-[1.01] hover:shadow-sm active:scale-[0.99] group"
                  style={{
                    animationDelay: `${index * 50}ms`,
                  }}
                >
                  <div className="text-xs font-mono text-gray-500 mt-1 min-w-[50px] transition-colors duration-200 group-hover:text-blue-600">
                    {transcript.time}
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed group-hover:text-gray-900 transition-colors duration-200">
                    {transcript.text}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default YouTubeReader;
