import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import React from "react";

const TagList = React.memo<{
  tags: string[];
  onRemove: (tag: string) => void;
}>(({ tags, onRemove }) => (
  <div className="flex flex-wrap gap-2 pt-2">
    {tags.map((tag) => (
      <Badge
        key={tag}
        className="pr-1 pl-2 py-1 cursor-pointer"
        onClick={() => onRemove(tag)}
      >
        {tag} <X size={14} className="ml-1" />
      </Badge>
    ))}
  </div>
));
TagList.displayName = "TagList";

export default TagList;
