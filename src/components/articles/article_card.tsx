import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import Label from "./Label";
import { Article, Labels } from "@/types/articles/articles";
import {
  ArrowDown,
  ArrowUp,
  MessageCircle,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const ArticleCard = ({
  view,
  articlesList,
  lables,
}: {
  view: string;
  articlesList: Article[];
  lables: Labels;
}) => {
  return (
    <div
      className={`${
        view === "grid"
          ? "grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-6"
          : "flex flex-col gap-6"
      }`}
    >
      {articlesList.map((article) => (
        <Card
          key={article.id}
          // onClick={to={`/article/${article.id}`}}
          className="border-opacity-20 rounded-md 
          grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols2
   bg-gradient-to-r cursor-pointer from-black to-gray-900
  overflow-hidden transition-transform transform hover:scale-105"
        >
          <div className="relative h-full">
            <img
              src={article.image}
              alt={article.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>

          <div>
            <CardHeader className="p-4 text-white">
              <div className="flex items-center gap-2">
                <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>OZ</AvatarFallback>
                </Avatar>
                <p className="text-white">USER NAME</p>
              </div>
              <CardTitle className="text-lg font-bold text-white">
                {article.title}
              </CardTitle>
              <CardDescription className="text-sm text-gray-400 ">
                {article.description.length > 100
                  ? `${article.description.slice(0, 100)}...`
                  : article.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Label
                label_name={lables.label_name}
                label_catagory={lables.label_catagory}
                label_color={lables.label_color || "default"}
              />
            </CardContent>

            <CardFooter
              className="flex items-center
             md:flex-col md:items-start md:justify-start lg:justify-between "
            >
              <div className="flex items-center gap-4 text-gray-400 text-sm">
                <div className="flex items-center gap-1">
                  <span>100,100</span>
                  <ArrowUp size={16} className="text-green-400" />
                </div>
                <div className="flex items-center gap-1">
                  <span>12,21</span>
                  <ArrowDown size={16} className="text-red-400" />
                </div>
                <div className="flex items-center gap-1">
                  <span>231</span>
                  <MessageCircle size={16} />
                </div>
              </div>

              <Link to={`/article/${article.id}`}>
                <Button
                  className="text-sm bg-none pt-10 mt-4
                   font-semibold px-4 py-2 overflow-hidden
                   text-white  transition"
                >
                  اقرأ المزيد
                </Button>
              </Link>
            </CardFooter>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default ArticleCard;
