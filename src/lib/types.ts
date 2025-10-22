import { Space } from "@/types/courses";

export type ContentType = "document" | "youtube";

export type Status =
  | { kind: "idle" }
  | { kind: "loading"; for: ContentType }
  | { kind: "error"; message: string };

export type TabKey =
  | "chat"
  | "flashcards"
  | "quizzes"
  | "summary"
  | "chapters"
  | "notes";

export enum GenerationStatus {
  PENDING = "pending",
  PROCESSING = "processing",
  COMPLETED = "completed",
  FAILED = "failed",
}

export interface HighlightRect {
  left: number;
  top: number;
  width: number;
  height: number;
}

export interface Highlight {
  id: string;
  text: string;
  page: number;
  timestamp: string;
  color: string;
  rects: HighlightRect[];
  zoom: number;
}

// Chat Message Interface
export interface ChatMessage {
  id: string;
  type: "user" | "bot" | any;
  content: string;
  timestamp: Date;
  metadata?: any;
}

// Transcript Interface
export interface TranscriptSegment {
  text: string;
  start: number;
  duration: number;
}

export interface YouTubeTranscript {
  segments: TranscriptSegment[];
  language?: string;
  isGenerated?: boolean;
}

// Fixed Workspace interface (flattened)
export interface Workspace {
  id: string;
  workspaceName: string;
  youtubeVideo?: {
    transcribe?: { data?: { url?: string } };
  };
  documentUrl?: string;
  workspaceType: "youtube" | "document" | "chat" | "other";
  pdfUrl?: string;
  createdAt: string;
  updatedAt: string;
  thumbnail?: string;
  duration?: string;
  progress?: number;
  spaceId: string | null;
  space?: Space;
}

export interface State {
  tab: TabKey;
  workspaceType: ContentType;
  src: string;
  page: number;
  pageCount: number | null;
  zoom: number;
  status: Status;
  prompt: string;
  notes: string;
  sidebarOpen: boolean;
  highlights: Highlight[];
  selectedText: string;

  // YouTube related
  youtubeVideoId: string;
  youtubeCurrentTime: number;
  youtubeDuration: number;
  youtubeIsPlaying: boolean;

  // Chat related
  chatMessages: ChatMessage[];
  chatInput: string;

  // Workspace related (fixed naming)
  workspace: any | null;
  title: string | null;

  // Transcript related
  transcript: YouTubeTranscript | null;
  transcriptLoading: boolean;
}

export type Action =
  | { type: "SET_TAB"; tab: TabKey }
  | { type: "SET_CONTENT"; contentType: ContentType }
  | { type: "SET_SRC"; src: string }
  | { type: "SET_PAGE"; page: number }
  | { type: "SET_PAGE_COUNT"; pageCount: number | null }
  | { type: "NEXT_PAGE" }
  | { type: "PREV_PAGE" }
  | { type: "SET_STATUS"; status: Status }
  | { type: "SET_PROMPT"; prompt: string }
  | { type: "SET_NOTES"; notes: string }
  | { type: "ZOOM_IN" }
  | { type: "ZOOM_OUT" }
  | { type: "RESET_ZOOM" }
  | { type: "TOGGLE_SIDEBAR" }
  | { type: "ADD_HIGHLIGHT"; highlight: Highlight }
  | { type: "REMOVE_HIGHLIGHT"; id: string }
  | { type: "SET_HIGHLIGHTS"; highlights: Highlight[] }
  | { type: "SET_SELECTED_TEXT"; text: string }
  | { type: "ADD_TO_CHAT"; text: string }
  | { type: "SET_YOUTUBE_VIDEO"; videoId: string }
  | { type: "SET_YOUTUBE_TIME"; currentTime: number; duration: number }
  | { type: "SET_YOUTUBE_PLAYING"; isPlaying: boolean }
  | { type: "ADD_CHAT_MESSAGE"; message: ChatMessage }
  | { type: "SET_CHAT_INPUT"; input: string }
  | { type: "CLEAR_CHAT" }
  | { type: "SET_WORKSPACE"; workspace: Workspace }
  | { type: "SET_TITLE"; title: string }
  | { type: "SET_TRANSCRIPT"; transcript: YouTubeTranscript }
  | { type: "SET_TRANSCRIPT_LOADING"; loading: boolean }
  | { type: "REORDER_TABS"; newOrder: string[] };

export const LANGUAGES = [
  { name: "English", value: "en" },
  { name: "العربية", value: "ar" },
];
