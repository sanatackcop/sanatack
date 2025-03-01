import { Labels } from "@/types/articles/articles";
import { Badge } from "../ui/badge";
import { TvIcon } from "lucide-react";

const Label = ({ label_name, label_catagory, label_color }: Labels) => {
  return (
    <div className="flex flex-wrap gap-2">
      <Badge variant={label_color} className={`rounded-sm px-2 py-1`}>
        {label_name}
      </Badge>
      <Badge
        className="gap-2 rounded-sm
       text-gray-300 px-2 py-1 text-xs"
      >
        <TvIcon className="h-5 w-5 text-white" />
        {label_catagory}
      </Badge>
    </div>
  );
};

export default Label;
