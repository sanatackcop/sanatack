import { TextIcon, Play } from "lucide-react";
import React, {
  useCallback,
  useRef,
  useEffect,
  useState,
  useMemo,
} from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useTranslation } from "react-i18next";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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

interface TranscriptSegment {
  text: string;
  start: number; // seconds
  duration: number; // seconds
  timestamp?: string;
}

type SegmentWithIndex = TranscriptSegment & { __idx: number };

interface TranscriptSection {
  title: string;
  startTime: number;
  segments: SegmentWithIndex[];
}

interface TranscriptData {
  segments: number;
  transcript: string;
  transcriptSegments: TranscriptSegment[];
}

interface YouTubePlayerProps {
  videoId?: string;
  onVideoSelect?: (videoId: string) => void;
  onTimeUpdate?: (currentTime: number, duration: number) => void;
  onPlay?: () => void;
  onPause?: () => void;
  onReady?: () => void;
  onTranscriptLoad?: (transcript: any) => void;
  className?: string;
  transcript?: TranscriptData | null;
  /**
   * Adjusts when highlighting switches, in seconds. Positive leads the audio slightly,
   * negative lags. Tweak if you feel a small desync.
   */
  syncOffsetSec?: number;
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
  videoId,
  onTimeUpdate,
  onPlay,
  onPause,
  onReady,
  transcript,
  className = "",
  syncOffsetSec = 0.25,
}) => {
  const { t } = useTranslation();
  const playerRef = useRef<any>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);
  const timeUpdateIntervalRef = useRef<number | null>(null);

  // Refs for auto-scrolling to the active transcript segment
  const segmentRefs = useRef<(HTMLDivElement | null)[]>([]);
  const transcriptScrollRootRef = useRef<HTMLDivElement>(null);

  const [apiReady, setApiReady] = useState(false);
  const [activeTab, setActiveTab] = useState("transcript");
  const [activeSegmentIndex, setActiveSegmentIndex] = useState(-1);
  const [hideYoutubeVideo, setHideYoutubeVideo] = useState(false);

  const [playerState, setPlayerState] = useState<YouTubePlayerState>({
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 100,
    isFullscreen: false,
    playbackRate: 1,
    isLoading: true,
  });

  // A flat, sorted list of segments with a stable global index
  const flatSegments: SegmentWithIndex[] = useMemo(() => {
    const base = transcript?.transcriptSegments ?? [];
    return base
      .slice()
      .sort((a, b) => a.start - b.start)
      .map((s, i) => ({ ...s, __idx: i }));
  }, [transcript]);

  const flatStarts = useMemo(
    () => flatSegments.map((s) => s.start),
    [flatSegments]
  );

  // Sections built from the flat list, so indices stay consistent
  const transcriptSections = useMemo((): TranscriptSection[] => {
    if (!flatSegments.length) return [];

    const sections: TranscriptSection[] = [];

    const sectionBreaks = [
      { time: 0, title: "Introduction" },
      { time: 89, title: "Understanding Monte Carlo" },
      { time: 221, title: "Implementation Setup" },
      { time: 335, title: "Running Simulations" },
      { time: 471, title: "Reading Results" },
      { time: 575, title: "Conclusion" },
    ];

    for (let i = 0; i < sectionBreaks.length; i++) {
      const currentBreak = sectionBreaks[i];
      const nextBreak = sectionBreaks[i + 1];
      const endTime = nextBreak ? nextBreak.time : Number.MAX_SAFE_INTEGER;

      const sectionSegments = flatSegments.filter(
        (seg) => seg.start >= currentBreak.time && seg.start < endTime
      );

      if (sectionSegments.length > 0) {
        sections.push({
          title: currentBreak.title,
          startTime: currentBreak.time,
          segments: sectionSegments,
        });
      }
    }

    return sections;
  }, [flatSegments]);

  const clearTimeUpdateInterval = useCallback(() => {
    if (timeUpdateIntervalRef.current) {
      clearInterval(timeUpdateIntervalRef.current);
      timeUpdateIntervalRef.current = null;
    }
  }, []);

  // Binary search to find the active index at a given time
  const findActiveIndex = useCallback(
    (tSec: number) => {
      if (!flatStarts.length) return -1;
      const x = tSec + syncOffsetSec;
      let lo = 0,
        hi = flatStarts.length; // [lo, hi)
      while (lo < hi) {
        const mid = (lo + hi) >>> 1;
        if (flatStarts[mid] <= x) lo = mid + 1;
        else hi = mid;
      }
      const idx = Math.max(0, Math.min(flatStarts.length - 1, lo - 1));
      return idx;
    },
    [flatStarts, syncOffsetSec]
  );

  const startTimeUpdateInterval = useCallback(() => {
    clearTimeUpdateInterval();
    timeUpdateIntervalRef.current = window.setInterval(() => {
      if (playerRef.current && playerRef.current.getCurrentTime) {
        const currentTime = playerRef.current.getCurrentTime();
        const duration = playerRef.current.getDuration();
        onTimeUpdate?.(currentTime, duration);
        setPlayerState((prev) => ({ ...prev, currentTime, duration }));

        const idx = findActiveIndex(currentTime);
        setActiveSegmentIndex(idx);
      }
    }, 250);
  }, [onTimeUpdate, clearTimeUpdateInterval, findActiveIndex]);

  const initializePlayer = useCallback(() => {
    if (!playerContainerRef.current || !window.YT || !window.YT.Player) return;

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

  const onPlayerReady = useCallback(
    (event: any) => {
      const player = event.target;
      setPlayerState((prev) => ({
        ...prev,
        duration: player.getDuration() || 0,
        volume: player.getVolume() || 100,
        isLoading: false,
      }));
      onReady?.();
    },
    [onReady]
  );

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

  const handleTranscriptClick = useCallback((segment: TranscriptSegment) => {
    if (playerRef.current && playerRef.current.seekTo) {
      playerRef.current.seekTo(segment.start, true);
      setPlayerState((prev) => ({ ...prev, currentTime: segment.start }));
    }
  }, []);

  const formatTime = useCallback((seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }, []);

  // Auto-load the YT iframe API
  useEffect(() => {
    if (typeof window !== "undefined" && window.YT && window.YT.Player) {
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

  // Pause the video when the user hides it
  useEffect(() => {
    if (hideYoutubeVideo && playerRef.current?.pauseVideo) {
      try {
        playerRef.current.pauseVideo();
      } catch {}
    }
  }, [hideYoutubeVideo]);

  // Re-init player if the container returns after being hidden and player was destroyed
  useEffect(() => {
    if (!hideYoutubeVideo && apiReady && !playerRef.current) {
      initializePlayer();
    }
  }, [hideYoutubeVideo, apiReady, initializePlayer]);

  // ===== Auto-scroll: only scroll the transcript viewport (not the whole page) =====
  const scrollSegmentIntoView = useCallback(
    (index: number, behavior: ScrollBehavior = "smooth") => {
      const viewport = transcriptScrollRootRef.current?.querySelector(
        "[data-radix-scroll-area-viewport]"
      ) as HTMLDivElement | null;
      const el = segmentRefs.current[index] as HTMLDivElement | null;
      if (!viewport || !el) return;
      const vr = viewport.getBoundingClientRect();
      const er = el.getBoundingClientRect();
      const target =
        viewport.scrollTop +
        (er.top - vr.top) -
        (viewport.clientHeight / 2 - er.height / 2);
      viewport.scrollTo({ top: Math.max(0, target), behavior });
    },
    []
  );

  useEffect(() => {
    if (activeTab !== "transcript") return;
    if (activeSegmentIndex == null || activeSegmentIndex < 0) return;
    scrollSegmentIntoView(activeSegmentIndex, "smooth");
  }, [activeSegmentIndex, activeTab, scrollSegmentIntoView]);

  const TABS_CONFIG = [
    { id: "transcript", labelKey: "tabs.transcript", icon: TextIcon },
  ] as const;

  return (
    <div className={`flex flex-col h-full min-h-0 ${className}`}>
      {/* Video */}
      <div
        className={`w-full flex-shrink-0 mb-4 ${
          hideYoutubeVideo ? "hidden" : ""
        }`}
      >
        <div className="bg-white border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-md rounded-3xl">
          <div
            className="relative rounded-3xl bg-black w-full"
            style={{ aspectRatio: "16/9" }}
          >
            {playerState.isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-10 transition-opacity duration-300 rounded-3xl">
                <div className="flex flex-col items-center text-white">
                  <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mb-3"></div>
                  <span className="text-sm animate-pulse">
                    {t("loading.video", "Loading video...")}
                  </span>
                </div>
              </div>
            )}

            <div ref={playerContainerRef} className="w-full h-full rounded-3xl">
              <div id="youtube-player" className="w-full h-full rounded-3xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs wrapper holds both header (TabsList) and content (TabsContent) to satisfy Radix */}
      <Tabs
        defaultValue="transcript"
        value={activeTab}
        onValueChange={setActiveTab}
        className="flex flex-col h-full"
      >
        {/* Sticky header (inside Tabs) */}
        <div className="sticky top-0 z-20 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
          <div className="flex items-center justify-between px-2 py-2">
            <TabsList className="rounded-2xl border py-4">
              {TABS_CONFIG.map((tab) => {
                const IconComponent = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <TabsTrigger
                    key={tab.id}
                    value={tab.id}
                    className={`relative flex items-center justify-center gap-2 rounded-lg py-1.5 px-3 transition-all duration-200 font-normal ${
                      isActive
                        ? "text-green-700"
                        : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {isActive ? (
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      ) : (
                        <IconComponent size={16} />
                      )}
                      <span>
                        {t(
                          tab.labelKey,
                          tab.id === "transcript" ? "Transcript" : "Explanation"
                        )}
                      </span>
                    </div>
                  </TabsTrigger>
                );
              })}
            </TabsList>

            <Button
              size="sm"
              variant="outline"
              className="rounded-full"
              onClick={() => setHideYoutubeVideo((v) => !v)}
              title={
                hideYoutubeVideo
                  ? t("video.show", "Show video")
                  : t("video.hide", "Hide video")
              }
            >
              <Play className="w-4 h-4 mr-2" />
              {hideYoutubeVideo
                ? t("video.show", "Show video")
                : t("video.hide", "Hide video")}
            </Button>
          </div>
        </div>

        <TabsContent
          value="transcript"
          className="flex-1 min-h-0 m-0 data-[state=active]:flex data-[state=active]:flex-col"
        >
          <ScrollArea ref={transcriptScrollRootRef} className="h-full">
            <div className="space-y-6 p-2">
              {transcriptSections.length ? (
                transcriptSections.map((section, sectionIndex) => (
                  <div key={`section-${sectionIndex}`} className="space-y-3">
                    {/* Optional section heading */}
                    {/* <div className="text-xs uppercase tracking-wide text-gray-500 ml-4">{section.title}</div> */}
                    <div className="space-y-2 ml-4">
                      {section.segments.map((segment) => {
                        const globalIndex = segment.__idx;
                        return (
                          <div
                            key={`seg-${segment.__idx}`}
                            ref={(el) => {
                              segmentRefs.current[globalIndex] = el;
                            }}
                          >
                            <Card
                              className={`group cursor-pointer p-3 rounded-xl shadow-none border-none hover:bg-gray-50 transition-all duration-200 border hover:border-gray-200 ${
                                activeSegmentIndex === globalIndex
                                  ? "bg-gray-50 border-gray-200"
                                  : ""
                              }`}
                              onClick={() => handleTranscriptClick(segment)}
                            >
                              <div className="flex flex-col items-start gap-3">
                                <div className="flex-shrink-0 flex items-center gap-2">
                                  <span
                                    className={`text-xs font-mono px-2.5 py-1 rounded-lg transition-colors ${
                                      activeSegmentIndex === globalIndex
                                        ? "bg-gray-100 text-gray-700"
                                        : "bg-gray-100 text-gray-600"
                                    }`}
                                  >
                                    {segment.timestamp ||
                                      formatTime(segment.start)}
                                  </span>
                                </div>
                                <p
                                  className={`text-xl leading-relaxed flex-1 transition-colors ${
                                    activeSegmentIndex === globalIndex
                                      ? "text-gray-900"
                                      : "text-gray-700"
                                  }`}
                                >
                                  {segment.text}
                                </p>
                              </div>
                            </Card>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))
              ) : (
                <div className="h-full flex items-center justify-center text-gray-500">
                  <div className="text-center py-8">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                      <TextIcon size={24} className="text-gray-400" />
                    </div>
                    <h4 className="text-sm font-medium text-gray-700 mb-1">
                      {t("transcript.noData", "No transcript available")}
                    </h4>
                    <p className="text-xs text-gray-500 max-w-xs mx-auto">
                      {t(
                        "transcript.willAppear",
                        "Transcript will appear here when available"
                      )}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default YouTubeReader;
