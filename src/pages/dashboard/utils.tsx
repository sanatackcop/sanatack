import { Skeleton } from "@/components/ui/skeleton";
import { GenerationStatus, Status, Workspace } from "@/lib/types";
import { AlertTriangle, Clock3, Loader2 } from "lucide-react";

export const ContentSkeleton = () => (
  <div className="w-full h-full flex flex-col space-y-4 p-4">
    <Skeleton className="h-8 w-3/4" />
    <div className="flex-1 bg-zinc-100 rounded-lg animate-pulse dark:bg-zinc-900/60" />
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
      <div className="flex space-x-2 rounded-2xl bg-zinc-100 p-1 w-fit mx-auto dark:bg-zinc-900/60">
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

interface State {
  tab: string;
  type: "video" | "document" | null;
  src: string | null;
  page: number;
  pageCount: number | null;
  status: { kind: string; message?: string; for?: string };
  prompt: string;
  notes: string;
  zoom: number;
  sidebarOpen: boolean;
  highlights: any[];
  selectedText: string | null;
  youtubeVideoId: string | null;
  youtubeCurrentTime: number;
  youtubeDuration: number;
  youtubeIsPlaying: boolean;
  chatMessages: any;
  chatInput: string;
  chatLoading: boolean;
  streamingMessage: string;
  workspace: Workspace | null;
  title: string | null;
  transcript: string | null;
  transcriptLoading: boolean;
  isLoading: boolean;
}

type Action =
  | { type: "SET_TAB"; tab: string }
  | { type: "SET_WORKSPACE_TYPE"; workspaceType: "video" | "document" }
  | { type: "SET_CONTENT"; contentType: string }
  | { type: "SET_SRC"; src: string }
  | { type: "SET_PAGE"; page: number }
  | { type: "SET_PAGE_COUNT"; pageCount: number }
  | { type: "NEXT_PAGE" }
  | { type: "PREV_PAGE" }
  | {
      type: "SET_STATUS";
      status: Status;
    }
  | { type: "SET_PROMPT"; prompt: string }
  | { type: "SET_NOTES"; notes: string }
  | { type: "ZOOM_IN" }
  | { type: "ZOOM_OUT" }
  | { type: "RESET_ZOOM" }
  | { type: "TOGGLE_SIDEBAR" }
  | { type: "ADD_HIGHLIGHT"; highlight: any }
  | { type: "REMOVE_HIGHLIGHT"; id: string }
  | { type: "SET_HIGHLIGHTS"; highlights: any[] }
  | { type: "SET_SELECTED_TEXT"; text: string | null }
  | { type: "ADD_TO_CHAT"; text: string }
  | { type: "SET_YOUTUBE_VIDEO"; videoId: string }
  | { type: "SET_YOUTUBE_TIME"; currentTime: number; duration: number }
  | { type: "SET_YOUTUBE_PLAYING"; isPlaying: boolean }
  | { type: "ADD_CHAT_MESSAGE"; message: any }
  | { type: "SET_CHAT_INPUT"; input: string }
  | { type: "CLEAR_CHAT" }
  | { type: "SET_CHAT_LOADING"; loading: boolean }
  | { type: "SET_STREAMING_MESSAGE"; content: string }
  | { type: "ADD_STREAMING_CHUNK"; chunk: string }
  | { type: "COMPLETE_STREAMING_MESSAGE"; content?: string }
  | { type: "SET_WORKSPACE"; workspace: Workspace }
  | { type: "SET_TITLE"; title: string }
  | { type: "SET_TRANSCRIPT"; transcript: string }
  | { type: "SET_TRANSCRIPT_LOADING"; loading: boolean };

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_TAB":
      return { ...state, tab: action.tab };

    case "SET_WORKSPACE_TYPE":
      return { ...state, type: action.workspaceType };

    case "SET_CONTENT":
      return {
        ...state,
        type: action.contentType as "video" | "document",
        status: { kind: "loading", for: action.contentType },
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

    case "UPDATE_MESSAGE_ATTACHMENTS": {
      const { messageId, attachments } = action;
      if (!messageId) return state;
      const updatedMessages = (state.chatMessages || []).map((msg: any) =>
        msg.id === messageId
          ? {
              ...msg,
              metadata: {
                ...(msg.metadata || {}),
                attachments,
              },
            }
          : msg
      );
      return { ...state, chatMessages: updatedMessages };
    }

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

    case "COMPLETE_STREAMING_MESSAGE": {
      const completedMessage: any = {
        id: Date.now().toString(),
        type: "assistant",
        role: "assistant",
        content: state.streamingMessage || action.content || "",
        timestamp: new Date(),
        isComplete: true,
        metadata: action.metadata,
      };
      return {
        ...state,
        chatMessages: [...(state.chatMessages || []), completedMessage],
        streamingMessage: "",
        chatLoading: false,
      };
    }

    case "SET_WORKSPACE": {
      const rawMessages =
        action.workspace?.chatMessages?.messages ?? [];
      const normalizedMessages = (Array.isArray(rawMessages)
        ? rawMessages
        : Object.values(rawMessages)
      ).map((msg: any) => ({
        id: msg.id ?? `${Date.now()}-${Math.random()}`,
        type: msg.type ?? msg.role ?? "assistant",
        role: msg.role ?? msg.type ?? "assistant",
        content: msg.content ?? "",
        timestamp: msg.timestamp ? new Date(msg.timestamp) : new Date(),
        metadata: msg.metadata
          ? {
              ...msg.metadata,
              attachments: Array.isArray(msg.metadata.attachments)
                ? msg.metadata.attachments.map((attachment: any) => ({
                    ...attachment,
                    status:
                      attachment.status ??
                      (attachment.url ? "uploaded" : undefined),
                  }))
                : undefined,
            }
          : undefined,
      }));

      return {
        ...state,
        workspace: action.workspace,
        chatMessages: normalizedMessages,
        title:
          action.workspace?.workspaceName || action.workspace?.title || null,
        type: action.workspace?.type || state.type,
        src:
          action.workspace?.documentUrl ||
          action.workspace?.video?.url ||
          state.src,
      };
    }

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
