import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import AppLayout from "@/components/layout/Applayout";
import Navbar from "@/components/Navbar";
import { gsap } from "gsap";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationLink,
  PaginationEllipsis,
  PaginationNext,
} from "@/components/ui/pagination";
import {
  MessageCircle,
  Sparkle,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";

const ArticlesGrid: React.FC = () => {
  const [articles, setArticles] = useState<any[]>([]);
  const [filter] = useState<string>("");
  const [activeCategory, setActiveCategory] = useState<string>("View All");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const articlesPerPage = 6;
  const gridRef = useRef<HTMLDivElement>(null);

  // Load mock articles
  useEffect(() => {
    const mockArticles = Array.from({ length: 90 }, (_, i) => ({
      id: i + 1,
      title: `How to secure your crypto wallet`,
      description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros.`,
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTzN1b_b66S3Qw-v2-dQFtOwTaNCa9ZQgh7DA&s",
      categories: ["Backend", "DevOps", "Premium"],
      time: "5 min read",
      date: "Jan 2",
      likes: 231,
      dislikes: 90,
      comments: 102,
    }));
    setArticles(mockArticles);
  }, []);

  useEffect(() => {
    // GSAP Animation
    if (gridRef.current) {
      const cards = gridRef.current.querySelectorAll(".article-card");
      gsap.from(cards, {
        opacity: 0,
        y: 50,
        duration: 0.5,
        stagger: 0.1,
        ease: "power1.out",
      });
    }
  }, [currentPage, filter, activeCategory]);

  // Filter and paginate articles
  const filteredArticles = articles.filter((article) => {
    const matchesFilter = article.title.toLowerCase().includes(filter.toLowerCase());
    const matchesCategory =
      activeCategory === "View All" || article.categories.includes(activeCategory);
    return matchesFilter && matchesCategory;
  });

  const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);

  const paginatedArticles = filteredArticles.slice(
    (currentPage - 1) * articlesPerPage,
    currentPage * articlesPerPage
  );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <>
      <div className="relative">
        <div
          className="bg-[#0C0C0C] absolute h-[82%] w-full bottom-0
         rounded-tr-[4rem] rounded-tl-[4rem]"
        />
        <AppLayout navbar={<Navbar />}>
          <div className="relative min-h-screen text-white p-6">
            {/* Header Section */}
            <HeaderSection
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
            />
            {/* Articles Grid */}
            <div
              ref={gridRef}
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
            >
              {paginatedArticles.map((article) => (
                <div
                  key={article.id}
                  className="article-card p-4 bg-zinc-900 border border-gray-700 rounded-lg shadow-md"
                >
                  {/* Image Section */}
                  <div className="mb-4">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-40 object-cover rounded-md"
                    />
                  </div>
                  {/* Article Info */}
                  <div className="flex flex-wrap gap-2 mb-2">
                    {article.categories.map((category: any, index: any) => (
                      <Badge
                        key={index}
                        className={`px-2 py-1 text-xs rounded ${
                          category === "Premium"
                            ? "dark:bg-yellow-500 text-black"
                            : "bg-gray-600 text-white"
                        }`}
                      >
                        {category}
                      </Badge>
                    ))}
                    <span className="text-xs text-gray-400">
                      {article.time}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold">{article.title}</h3>
                  <p className="text-sm text-gray-400 mt-2">
                    {article.description}
                  </p>

                  {/* Engagement Section */}
                  <div
                    className="mt-4 flex items-center justify-end gap-4
                   text-gray-400 text-sm"
                  >
                    <span className="flex items-center gap-3">
                      {/* Likes */}
                      <span className="flex items-center gap-1">
                        <ThumbsUp className="h-4 w-4" />
                        {article.likes}
                      </span>
                      <span className="flex items-center gap-1">
                        <ThumbsDown className="h-4 w-4" />
                        {article.dislikes}
                      </span>
                      {/* Comments */}
                      <span className="flex items-center gap-1">
                        <MessageCircle className="h-4 w-4" />
                        {article.comments}
                      </span>
                      <span className="flex items-center gap-1">
                        {article.date}
                        <Sparkle className="h-4 w-4 text-yellow-400" fill="yellow" />
                      </span>
                    </span>
                  </div>

                  <Button className="mt-4 w-full bg-indigo-600 hover:bg-indigo-500">
                    Read more
                  </Button>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-20 flex justify-center">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={() => handlePageChange(currentPage - 1)}
                    />
                  </PaginationItem>
                  {Array.from({ length: totalPages }).map((_, index) => (
                    <PaginationItem key={index}>
                      <PaginationLink
                        href="#"
                        className={`${
                          currentPage === index + 1 ? "bg-white text-black" : ""
                        }`}
                        onClick={() => handlePageChange(index + 1)}
                      >
                        {index + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  {totalPages > 5 && (
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                  )}

                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={() => handlePageChange(currentPage + 1)}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </div>
        </AppLayout>
      </div>
    </>
  );
};

export default ArticlesGrid;

const HeaderSection: React.FC<{
  activeCategory: string;
  setActiveCategory: React.Dispatch<React.SetStateAction<string>>;
}> = ({ activeCategory, setActiveCategory }) => {
  const categories = [
    "Backend",
    "DevOps",
    "Data Engineering",
    "Machine Learning",
    "Business & Leadership",
    "LLMs",
  ];

  return (
    <div className="mb-5 flex justify-end flex-col lg:flex-row items-center gap-4">
      <div className="bg-[#1C1C1C] rounded-md flex flex-wrap gap-2 p-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-4 py-2 rounded-md text-white ${
              activeCategory === category ? "bg-gray-700" : "hover:bg-gray-600"
            }`}
          >
            {category}
          </button>
        ))}
        <button
          onClick={() => setActiveCategory("View All")}
          className={`px-4 py-2 rounded-md text-white ${
            activeCategory === "View All" ? "bg-gray-700" : "hover:bg-gray-600"
          }`}
        >
          View All
        </button>
      </div>
    </div>
  );
};
