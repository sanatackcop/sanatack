import { Skeleton } from "@/components/ui/skeleton";
import { GenerationStatus } from "@/lib/types";
import { AlertTriangle, Clock3, Loader2 } from "lucide-react";

export const ContentSkeleton = () => (
  <div className="w-full h-full flex flex-col space-y-4 p-4">
    <Skeleton className="h-8 w-3/4" />
    <div className="flex-1 bg-gray-100 rounded-lg animate-pulse" />
    <div className="flex space-x-2">
      <Skeleton className="h-10 w-20" />
      <Skeleton className="h-10 w-20" />
      <Skeleton className="h-10 w-20" />
    </div>
  </div>
);

export const TabsSkeleton = () => (
  <div className="h-full flex flex-col">
    <div className="p-2 pt-0 flex-shrink-0">
      <div className="flex space-x-2 rounded-2xl bg-gray-100 p-1 w-fit mx-auto">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-12 w-24 rounded-xl" />
        ))}
      </div>
    </div>
    <div className="flex-1 p-4">
      <div className="space-y-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <div className="space-y-2 mt-8">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    </div>
  </div>
);

export const ChatSkeleton = () => (
  <div className="flex-1 flex flex-col p-4 space-y-4">
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className={`flex ${i % 2 === 0 ? "justify-end" : "justify-start"}`}
        >
          <div
            className={`flex space-x-2 max-w-xs ${
              i % 2 === 0 ? "flex-row-reverse space-x-reverse" : ""
            }`}
          >
            <Skeleton className="h-8 w-8 rounded-full flex-shrink-0" />
            <div className="space-y-1">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        </div>
      ))}
    </div>
    <div className="mt-auto">
      <Skeleton className="h-12 w-full rounded-xl" />
    </div>
  </div>
);

export const reducer = (state: any, action: any): any => {
  switch (action.type) {
    case "SET_TAB":
      return { ...state, tab: action.tab };
    case "SET_CONTENT":
      return {
        ...state,
        workspaceType: action.workspaceType,
        status: { kind: "loading", for: action.workspaceType },
      };
    case "SET_SRC":
      return { ...state, src: action.src };
    case "SET_PAGE":
      return { ...state, page: Math.max(1, action.page) };
    case "SET_PAGE_COUNT":
      return { ...state, pageCount: action.pageCount };
    case "NEXT_PAGE":
      return {
        ...state,
        page: state.pageCount
          ? Math.min(state.pageCount, state.page + 1)
          : state.page + 1,
      };
    case "PREV_PAGE":
      return { ...state, page: Math.max(1, state.page - 1) };
    case "SET_STATUS":
      return { ...state, status: action.status };
    case "SET_PROMPT":
      return { ...state, prompt: action.prompt };
    case "SET_NOTES":
      return { ...state, notes: action.notes };
    case "ZOOM_IN":
      return { ...state, zoom: Math.min(3.0, +(state.zoom + 0.2).toFixed(2)) };
    case "ZOOM_OUT":
      return { ...state, zoom: Math.max(0.4, +(state.zoom - 0.2).toFixed(2)) };
    case "RESET_ZOOM":
      return { ...state, zoom: 1 };
    case "TOGGLE_SIDEBAR":
      return { ...state, sidebarOpen: !state.sidebarOpen };
    case "ADD_HIGHLIGHT":
      return {
        ...state,
        highlights: [...(state.highlights || []), action.highlight],
      };
    case "REMOVE_HIGHLIGHT":
      return {
        ...state,
        highlights: (state.highlights || []).filter(
          (h: any) => h.id !== action.id
        ),
      };
    case "SET_HIGHLIGHTS":
      return { ...state, highlights: action.highlights || [] };
    case "SET_SELECTED_TEXT":
      return { ...state, selectedText: action.text };
    case "ADD_TO_CHAT":
      return {
        ...state,
        tab: "chat",
        prompt: action.text,
      };
    case "SET_YOUTUBE_VIDEO":
      return { ...state, youtubeVideoId: action.videoId };
    case "SET_YOUTUBE_TIME":
      return {
        ...state,
        youtubeCurrentTime: action.currentTime,
        youtubeDuration: action.duration,
      };
    case "SET_YOUTUBE_PLAYING":
      return { ...state, youtubeIsPlaying: action.isPlaying };
    case "ADD_CHAT_MESSAGE":
      return {
        ...state,
        chatMessages: [...(state.chatMessages || []), action.message],
        prompt: "",
      };
    case "SET_CHAT_INPUT":
      return { ...state, chatInput: action.input };
    case "CLEAR_CHAT":
      return { ...state, chatMessages: [] };
    case "SET_CHAT_LOADING":
      return { ...state, chatLoading: action.loading };
    case "SET_STREAMING_MESSAGE":
      return { ...state, streamingMessage: action.content };
    case "ADD_STREAMING_CHUNK":
      return {
        ...state,
        streamingMessage: (state.streamingMessage || "") + action.chunk,
      };
    case "COMPLETE_STREAMING_MESSAGE":
      const completedMessage: any = {
        id: Date.now().toString(),
        type: "assistant",
        content: state.streamingMessage || action.content,
        timestamp: new Date(),
        isComplete: true,
      };
      return {
        ...state,
        chatMessages: [...(state.chatMessages || []), completedMessage],
        streamingMessage: "",
        chatLoading: false,
      };
    // Fixed workspace action - matches the dispatch call
    case "SET_WORKSPACE":
      return {
        ...state,
        workspace: action.workspace,
        chatMessages: [...Object.values(action.workspace.chatMessages)],
        title:
          action.workspace?.workspaceName || action.workspace?.title || null,
        youtubeVideoId: action.workspace?.youtubeUrl
          ? extractYouTubeId(action.workspace.youtubeUrl)
          : state.youtubeVideoId,
        workspaceType: action.workspace?.workspaceType || state.workspaceType,
        src: action.workspace?.pdfUrl || state.src,
        transcript: action.workspace?.transcript || null,
      };
    case "SET_TITLE":
      return { ...state, title: action.title };
    case "SET_TRANSCRIPT":
      return { ...state, transcript: action.transcript };
    case "SET_TRANSCRIPT_LOADING":
      return { ...state, transcriptLoading: action.loading };
    default:
      return state;
  }
};

export const extractYouTubeId = (url: string): string => {
  const regExp =
    /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : "";
};

export const getErrorMessage = (err: unknown, fallback: string) => {
  if (typeof err === "string") return err;
  if (err && typeof err === "object") {
    const anyErr = err as {
      message?: unknown;
      error?: unknown;
      detail?: unknown;
    };
    if (typeof anyErr.message === "string") return anyErr.message;
    if (typeof anyErr.error === "string") return anyErr.error;
    if (typeof anyErr.detail === "string") return anyErr.detail;
  }
  return fallback;
};

export const StatusBadge: React.FC<{ status: GenerationStatus }> = ({
  status,
}) => {
  switch (status) {
    case GenerationStatus.PENDING:
      return (
        <span className="inline-flex items-center gap-1.5 text-[11px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 border border-gray-200">
          <Clock3 className="w-3.5 h-3.5" /> Pending
        </span>
      );
    case GenerationStatus.PROCESSING:
      return (
        <span className="inline-flex items-center gap-1.5 text-[11px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
          <Loader2 className="w-3.5 h-3.5 animate-spin" /> Generating…
        </span>
      );
    case GenerationStatus.FAILED:
      return (
        <span className="inline-flex items-center gap-1.5 text-[11px] px-2 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200">
          <AlertTriangle className="w-3.5 h-3.5" /> Failed
        </span>
      );
    case GenerationStatus.COMPLETED:
    default:
      return "";
  }
};

export const ProgressStrip: React.FC = () => (
  <div className="absolute bottom-0 left-0 right-0 h-1 overflow-hidden rounded-b-2xl">
    <div className="h-full w-full bg-gradient-to-r from-blue-200/60 via-blue-400/80 to-blue-200/60 animate-[shimmer_1.2s_linear_infinite] [background-size:200%_100%]" />
    <style>{`
      @keyframes shimmer {
        0% { background-position: 0% 0; }
        100% { background-position: -200% 0; }
      }
    `}</style>
  </div>
);

export const QueuedStrip: React.FC = () => (
  <div className="absolute bottom-0 left-0 right-0 h-1 overflow-hidden rounded-b-2xl">
    <div className="h-full w-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-[pulsebar_1.6s_ease_infinite]" />
    <style>{`
      @keyframes pulsebar {
        0%, 100% { opacity: .5; }
        50% { opacity: 1; }
      }
    `}</style>
  </div>
);
