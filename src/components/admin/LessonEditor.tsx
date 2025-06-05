import React, { useCallback } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../ui/select";
import { X, Plus } from "lucide-react";
import {
  LessonInput,
  ResourceInput,
  QuizInput,
  VideoInput,
} from "@/utils/types/adminTypes";

const ResourceItem: React.FC<{
  resource: ResourceInput;
  index: number;
  onChange: (data: Partial<ResourceInput>) => void;
  onRemove: () => void;
}> = ({ resource, index, onChange, onRemove }) => (
  <li className="flex flex-col gap-2 rounded-md border p-3 bg-muted/20">
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium">Resource {index + 1}</span>
      <Button size="icon" variant="ghost" type="button" onClick={onRemove}>
        <X size={16} />
      </Button>
    </div>

    <Input
      placeholder="Title"
      value={resource.title}
      onChange={(e) => onChange({ title: e.target.value })}
      className="h-8"
    />

    <Textarea
      placeholder="Description (optional)"
      value={resource.description ?? ""}
      onChange={(e) => onChange({ description: e.target.value })}
      rows={2}
    />

    <Select
      value={resource.type}
      onValueChange={(value) =>
        onChange({ type: value as ResourceInput["type"] })
      }
    >
      <SelectTrigger className="h-8">
        <SelectValue placeholder="Type" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="video">Video</SelectItem>
        <SelectItem value="document">Document</SelectItem>
        <SelectItem value="link">Link</SelectItem>
        <SelectItem value="code">Code</SelectItem>
      </SelectContent>
    </Select>

    {resource.type === "code" ? (
      <Textarea
        placeholder="Paste code here…"
        value={resource.content ?? ""}
        onChange={(e) => onChange({ content: e.target.value })}
        rows={4}
      />
    ) : (
      <Input
        placeholder={resource.type === "video" ? "Video URL" : "URL"}
        value={resource.url ?? ""}
        onChange={(e) => onChange({ url: e.target.value })}
        className="h-8"
      />
    )}
  </li>
);

const QuizItem: React.FC<{
  quiz: QuizInput;
  index: number;
  onChange: (data: Partial<QuizInput>) => void;
  onRemove: () => void;
}> = ({ quiz, index, onChange, onRemove }) => (
  <li className="flex flex-col gap-2 rounded-md border p-3 bg-muted/20">
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium">Quiz {index + 1}</span>
      <Button size="icon" variant="ghost" type="button" onClick={onRemove}>
        <X size={16} />
      </Button>
    </div>

    <Textarea
      placeholder="Question"
      value={quiz.question}
      onChange={(e) => onChange({ question: e.target.value })}
      rows={2}
    />

    <Textarea
      placeholder="Comma‑separated options"
      value={quiz.options.join(", ")}
      onChange={(e) =>
        onChange({ options: e.target.value.split(/\s*,\s*/).filter(Boolean) })
      }
      rows={2}
    />

    <Input
      placeholder="Correct answer (exact text)"
      value={quiz.correctAnswer}
      onChange={(e) => onChange({ correctAnswer: e.target.value })}
      className="h-8"
    />

    <Textarea
      placeholder="Explanation (optional)"
      value={quiz.explanation ?? ""}
      onChange={(e) => onChange({ explanation: e.target.value })}
      rows={2}
    />
  </li>
);

const VideoItem: React.FC<{
  video: VideoInput;
  index: number;
  onChange: (data: Partial<VideoInput>) => void;
  onRemove: () => void;
}> = ({ video, index, onChange, onRemove }) => (
  <li className="flex flex-col gap-2 rounded-md border p-3 bg-muted/20">
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium">Video {index + 1}</span>
      <Button size="icon" variant="ghost" type="button" onClick={onRemove}>
        <X size={16} />
      </Button>
    </div>

    <Input
      placeholder="Enter Video URL"
      value={video.youtubeId}
      onChange={(e) => onChange({ youtubeId: e.target.value })}
      className="h-8"
    />
  </li>
);

const LessonEditor = React.memo<{
  lesson: LessonInput;
  index: number;
  onUpdate: (data: Partial<LessonInput>) => void;
  onRemove: () => void;
}>(({ lesson, index, onUpdate, onRemove }) => {
  const handleAddResource = useCallback(() => {
    const newResource: ResourceInput = {
      id: crypto.randomUUID(),
      title: "",
      type: "link",
      description: "",
      url: "",
    };
    onUpdate({ resources: [...lesson.resources, newResource] });
  }, [lesson.resources, onUpdate]);

  const handleUpdateResource = useCallback(
    (idx: number, patch: Partial<ResourceInput>) => {
      const next = lesson.resources.map((r, i) =>
        i === idx ? { ...r, ...patch } : r
      );
      onUpdate({ resources: next });
    },
    [lesson.resources, onUpdate]
  );

  const handleRemoveResource = useCallback(
    (idx: number) => {
      const next = lesson.resources.filter((_, i) => i !== idx);
      onUpdate({ resources: next });
    },
    [lesson.resources, onUpdate]
  );

  const handleAddQuiz = useCallback(() => {
    const newQuiz: QuizInput = {
      id: crypto.randomUUID(),
      question: "",
      options: [],
      correctAnswer: "",
    };
    onUpdate({ quizzes: [...lesson.quizzes, newQuiz] });
  }, [lesson.quizzes, onUpdate]);

  const handleUpdateQuiz = useCallback(
    (idx: number, patch: Partial<QuizInput>) => {
      const next = lesson.quizzes.map((q, i) =>
        i === idx ? { ...q, ...patch } : q
      );
      onUpdate({ quizzes: next });
    },
    [lesson.quizzes, onUpdate]
  );

  const handleRemoveQuiz = useCallback(
    (idx: number) => {
      const next = lesson.quizzes.filter((_, i) => i !== idx);
      onUpdate({ quizzes: next });
    },
    [lesson.quizzes, onUpdate]
  );

  const handleAddVideo = useCallback(() => {
    const newVideo: VideoInput = {
      title: "",
      description: "",
      youtubeId: "",
      duration: 0,
    };
    onUpdate({ videos: [...lesson.videos, newVideo] });
  }, [lesson.videos, onUpdate]);

  const handleUpdateVideo = useCallback(
    (idx: number, patch: Partial<VideoInput>) => {
      const next = lesson.videos.map((q, i) =>
        i === idx ? { ...q, ...patch } : q
      );
      onUpdate({ videos: next });
    },
    [lesson.videos, onUpdate]
  );

  const handleRemoveVideo = useCallback(
    (idx: number) => {
      const next = lesson.videos.filter((_, i) => i !== idx);
      onUpdate({ videos: next });
    },
    [lesson.videos, onUpdate]
  );

  return (
    <li className="flex flex-col gap-4 rounded-md border p-4 bg-background">
      <div className="flex items-start justify-between">
        <span className="text-sm font-medium">
          {index + 1}. {lesson.isExisting ? lesson.name : "New lesson"}
        </span>
        <Button size="icon" variant="ghost" type="button" onClick={onRemove}>
          <X size={16} />
        </Button>
      </div>

      {!lesson.isExisting && (
        <>
          <Input
            placeholder="Lesson name"
            value={lesson.name}
            onChange={(e) => onUpdate({ name: e.target.value })}
            className="h-8"
          />

          <Textarea
            placeholder="Lesson description"
            value={lesson.description}
            onChange={(e) => onUpdate({ description: e.target.value })}
            rows={2}
          />
        </>
      )}

      {/* Videos --------------------------------------------------------- */}
      <section className="flex flex-col gap-2 pt-2 border-t">
        <h4 className="font-medium">Videos</h4>
        <ul className="flex flex-col gap-3">
          {lesson.videos.map((v, i) => (
            <VideoItem
              key={i}
              video={v}
              index={i}
              onChange={(patch) => handleUpdateVideo(i, patch)}
              onRemove={() => handleRemoveVideo(i)}
            />
          ))}
        </ul>
        <Button variant="outline" type="button" onClick={handleAddVideo}>
          <Plus size={14} className="mr-2" /> Add Video
        </Button>
      </section>

      {/* Resources ------------------------------------------------------ */}
      <section className="flex flex-col gap-2">
        <h4 className="font-medium">Resources</h4>
        <ul className="flex flex-col gap-3">
          {lesson.resources.map((r, i) => (
            <ResourceItem
              key={r.id}
              resource={r}
              index={i}
              onChange={(patch) => handleUpdateResource(i, patch)}
              onRemove={() => handleRemoveResource(i)}
            />
          ))}
        </ul>
        <Button variant="outline" type="button" onClick={handleAddResource}>
          <Plus size={14} className="mr-2" /> Add resource
        </Button>
      </section>

      {/* Quizzes --------------------------------------------------------- */}
      <section className="flex flex-col gap-2 pt-2 border-t">
        <h4 className="font-medium">Quizzes</h4>
        <ul className="flex flex-col gap-3">
          {lesson.quizzes.map((q, i) => (
            <QuizItem
              key={q.id}
              quiz={q}
              index={i}
              onChange={(patch) => handleUpdateQuiz(i, patch)}
              onRemove={() => handleRemoveQuiz(i)}
            />
          ))}
        </ul>
        <Button variant="outline" type="button" onClick={handleAddQuiz}>
          <Plus size={14} className="mr-2" /> Add quiz
        </Button>
      </section>
    </li>
  );
});
LessonEditor.displayName = "LessonEditor";

export default LessonEditor;
