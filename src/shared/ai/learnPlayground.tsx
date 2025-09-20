import React, { useCallback, useEffect, useReducer, useState } from "react";
import { ResizablePanelGroup, ResizablePanel } from "@/components/ui/resizable";

import { ToolTipNav } from "./ToolTipNav";
import PdfReader from "./PdfReader";
import { State, Action } from "./types";

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_TAB":
      return { ...state, tab: action.tab };
    case "SET_CONTENT":
      return {
        ...state,
        contentType: action.contentType,
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
        highlights: (state.highlights || []).filter((h) => h.id !== action.id),
      };
    case "SET_HIGHLIGHTS":
      return { ...state, highlights: action.highlights || [] };
    case "SET_SELECTED_TEXT":
      return { ...state, selectedText: action.text };
    case "ADD_TO_CHAT":
      return {
        ...state,
        tab: "chat",
        prompt: `يرجى شرح النص المحدد التالي:\n\n"${action.text}"\n\n`,
      };
    default:
      return state;
  }
};

const useLocalStorageHighlights = (
  key: string
): [Highlight[], (highlights: Highlight[]) => void] => {
  const [highlights, setHighlights] = useState<Highlight[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(key);
      if (stored) {
        const parsed = JSON.parse(stored);
        setHighlights(Array.isArray(parsed) ? parsed : []);
      }
    } catch (error) {
      console.error("Error loading highlights:", error);
      setHighlights([]);
    }
  }, [key]);

  const updateHighlights = useCallback(
    (newHighlights: Highlight[]) => {
      const safeHighlights = Array.isArray(newHighlights) ? newHighlights : [];
      setHighlights(safeHighlights);
      try {
        localStorage.setItem(key, JSON.stringify(safeHighlights));
      } catch (error) {
        console.error("Error saving highlights:", error);
      }
    },
    [key]
  );

  return [highlights, updateHighlights];
};

const initialState: State = {
  tab: "flashcards",
  contentType: "pdf",
  src: "https://arxiv.org/pdf/1706.03762",
  page: 1,
  pageCount: null,
  zoom: 1,
  status: { kind: "idle" },
  prompt: "",
  notes: "",
  sidebarOpen: true,
  highlights: [],
  selectedText: "",
};

const LearnPlaygroundRoot: React.FC = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [highlights, setHighlights] = useLocalStorageHighlights(
    `pdf-highlights-${state.src}`
  );

  // useEffect(() => {
  //   dispatch({ type: "SET_HIGHLIGHTS", highlights: highlights || [] });
  // }, [highlights]);

  // Safe access to highlights with fallback
  const safeHighlights = state.highlights || [];

  return (
    <div dir="rtl" className="flex flex-col px-4 overflow-hidden">
      <div className="flex-1 min-h-0">
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel defaultSize={50} minSize={30}>
            <div className="pl-4 h-[56rem]">
              <PdfReader
                src={state.src}
                page={state.page}
                zoom={state.zoom}
                status={state.status}
                selectedText={state.selectedText}
                // highlights={safeHighlights}
                onLoaded={(pageCount) => {
                  dispatch({ type: "SET_PAGE_COUNT", pageCount });
                  dispatch({
                    type: "SET_STATUS",
                    status: { kind: "idle" },
                  });
                }}
                onError={(message) => {
                  dispatch({
                    type: "SET_STATUS",
                    status: { kind: "error", message },
                  });
                }}
                onNext={() => dispatch({ type: "NEXT_PAGE" })}
                onPrev={() => dispatch({ type: "PREV_PAGE" })}
                onGoto={(p) => dispatch({ type: "SET_PAGE", page: p })}
                onZoomIn={() => dispatch({ type: "ZOOM_IN" })}
                onZoomOut={() => dispatch({ type: "ZOOM_OUT" })}
                onResetZoom={() => dispatch({ type: "RESET_ZOOM" })}
                onTextSelect={(text) =>
                  dispatch({ type: "SET_SELECTED_TEXT", text })
                }
                // onAddHighlight={(highlight: Highlight) => {
                //   dispatch({ type: "ADD_HIGHLIGHT", highlight });
                //   setHighlights([...highlights, highlight]);
                // }}
                onAddToChat={(text) => dispatch({ type: "ADD_TO_CHAT", text })}
                pageCount={state.pageCount}
              />
            </div>
          </ResizablePanel>

          {state.sidebarOpen && (
            <ToolTipNav
              dispatch={dispatch}
              state={state}
              safeHighlights={safeHighlights}
              setHighlights={setHighlights}
              highlights={highlights}
            />
          )}
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default function LearnPlayGround() {
  return <LearnPlaygroundRoot />;
}
