import { TextIcon } from "lucide-react";
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

// Updated interfaces
interface TranscriptSegment {
  text: string;
  start: number;
  duration: number;
  timestamp?: string;
}

interface TranscriptSection {
  title: string;
  startTime: number;
  segments: TranscriptSegment[];
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
}) => {
  const { t } = useTranslation();
  const playerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const timeUpdateIntervalRef = useRef<number | null>(null);
  const transcriptRef = useRef<HTMLDivElement>(null);
  const [apiReady, setApiReady] = useState(false);
  const [activeTab, setActiveTab] = useState("transcript");
  const [activeSegmentIndex, setActiveSegmentIndex] = useState(-1);
  const [playerState, setPlayerState] = useState<YouTubePlayerState>({
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 100,
    isFullscreen: false,
    playbackRate: 1,
    isLoading: true,
  });

  // Generate transcript sections with titles
  const transcriptSections = useMemo((): TranscriptSection[] => {
    if (!transcript?.transcriptSegments) return [];

    const segments = transcript.transcriptSegments;
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

      const sectionSegments = segments.filter(
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
  }, [transcript]);

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

        if (transcript?.transcriptSegments) {
          const activeIndex = transcript.transcriptSegments.findIndex(
            (segment, index) => {
              const nextSegment = transcript.transcriptSegments[index + 1];
              return (
                currentTime >= segment.start &&
                (!nextSegment || currentTime < nextSegment.start)
              );
            }
          );
          setActiveSegmentIndex(activeIndex);
        }
      }
    }, 1000);
  }, [onTimeUpdate, clearTimeUpdateInterval, transcript]);

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

  // All useEffect hooks remain the same...
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
  ] as const;

  return (
    <div className={`flex flex-col w-full h-full ${className}`}>
      {/* YouTube Player */}
      <div className="w-full flex-shrink-0 mb-4">
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

            <div ref={containerRef} className="w-full h-full rounded-3xl">
              <div id="youtube-player" className="w-full h-full rounded-3xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section with proper height constraints */}
      <div className="flex-1 min-h-0 w-full">
        <div className="h-full max-h-[400px] sm:max-h-[450px] md:max-h-[350px] lg:max-h-[300px] xl:max-h-[350px]">
          <Tabs
            defaultValue="transcript"
            value={activeTab}
            onValueChange={setActiveTab}
            className="flex flex-col h-full"
          >
            {/* Tab Headers */}
            <div className="flex-shrink-0 mb-3">
              <TabsList className="rounded-2xl w-fit border py-5">
                {TABS_CONFIG.map((tab) => {
                  const IconComponent = tab.icon;
                  const isActive = activeTab === tab.id;

                  return (
                    <TabsTrigger
                      key={tab.id}
                      value={tab.id}
                      className={`relative flex items-center justify-center gap-2 rounded-lg  py-1.5 px-2 transition-all duration-200  font-normal ${
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
                            tab.id === "transcript"
                              ? "Transcript"
                              : "Explanation"
                          )}
                        </span>
                      </div>
                    </TabsTrigger>
                  );
                })}
              </TabsList>
            </div>

            <div className="flex-1 min-h-0">
              <TabsContent
                value="transcript"
                className="h-full m-0 data-[state=active]:flex data-[state=active]:flex-col"
              >
                <div className="flex flex-col h-full  rounded-xl overflow-hidden">
                  <div className="flex-1 min-h-0">
                    {transcriptSections && transcriptSections.length > 0 ? (
                      <ScrollArea className="h-full">
                        <div ref={transcriptRef}>
                          <div>
                            {transcriptSections.map((section, sectionIndex) => (
                              <div key={sectionIndex} className="space-y-3">
                                <div className="space-y-2 ml-4">
                                  {section.segments.map(
                                    (segment, segmentIndex) => {
                                      const globalIndex =
                                        transcript?.transcriptSegments.indexOf(
                                          segment
                                        ) ?? -1;
                                      return (
                                        <Card
                                          key={segmentIndex}
                                          className={`group cursor-pointer p-3 rounded-xl shadow-none border-none hover:bg-gray-50 transition-all duration-200 border hover:border-gray-200 ${
                                            activeSegmentIndex === globalIndex
                                              ? "bg-gray-50 border-gray-200"
                                              : ""
                                          }`}
                                          onClick={() =>
                                            handleTranscriptClick(segment)
                                          }
                                        >
                                          <div className="flex flex-col items-start gap-3">
                                            <div className="flex-shrink-0 flex items-center gap-2">
                                              <span
                                                className={`text-xs font-mono px-2.5 py-1 rounded-lg transition-colors ${
                                                  activeSegmentIndex ===
                                                  globalIndex
                                                    ? "bg-gray-100 text-gray-700"
                                                    : "bg-gray-100 text-gray-600"
                                                }`}
                                              >
                                                {segment.timestamp ||
                                                  formatTime(segment.start)}
                                              </span>
                                            </div>
                                            <p
                                              className={`text-lg leading-relaxed flex-1 transition-colors ${
                                                activeSegmentIndex ===
                                                globalIndex
                                                  ? "text-gray-900"
                                                  : "text-gray-700"
                                              }`}
                                            >
                                              {segment.text}
                                            </p>
                                          </div>
                                        </Card>
                                      );
                                    }
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </ScrollArea>
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
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default YouTubeReader;
