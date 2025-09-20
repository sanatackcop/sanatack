export type ContentType = "pdf" | "youtube";
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

export interface State {
  tab: TabKey;
  contentType: ContentType;
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
  | { type: "ADD_TO_CHAT"; text: string };
