import { GenerationStatus } from "../types";

export interface Note {
  id: string;
  created_at: string;
  updated_at: string;
  user_id?: string;
  userId?: string; // Keep for backward compatibility
  workspaceId?: string;
  workspace?: { id: string };
  videoId?: string;
  documentId?: string | null;
  language?: string;
  status?: GenerationStatus;
  title: string;
  content: string; // HTML content from Quill
  payload?: NotePayload;
  failureReason?: string | null;
}

export interface NotePayload {
  title: string;
  content: string; // HTML content
  plainText?: string; // Plain text version
  tags?: string[];
  created_at?: string;
}

export interface NoteListProps {
  workspaceId: string;
}

export interface NoteViewProps {
  note: Note;
  onClose: () => void;
  onSave: (note: Note) => void;
  onDelete?: (noteId: string) => Promise<void>;
}

export interface NoteEditorProps {
  note?: Note | null;
  onSave: (title: string, content: string) => Promise<void>;
  onClose: () => void;
  isNew?: boolean;
}
