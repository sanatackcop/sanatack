import { ArticlesFilter } from "@/types/articles/articles";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

export default function ArticleController({
  filter,
  setFilter,
  articlesPerPage,
  setArticlesPerPage,
  view,
  setView,
}: ArticlesFilter) {
  return (
    <>
      <div className="flex md:flex-row justify-between items-center gap-4 mb-6">
        <Input
          type="text"
          placeholder="ابحث..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
        <select
          value={articlesPerPage}
          onChange={(e) => setArticlesPerPage(Number(e.target.value))}
          className="border p-2 rounded shadow-sm focus:ring bg-gray-800 text-white"
        >
          {[5, 10, 15, 20].map((limit) => (
            <option key={limit} value={limit}>
              {limit} لكل صفحة
            </option>
          ))}
        </select>
        <Button
          className="border p-2 rounded shadow-sm bg-[#0C0C0C] text-white focus:ring focus:ring-indigo-800"
          onClick={() => setView(view === "grid" ? "row" : "grid")}
        >
          التبديل إلى وضع {view === "grid" ? "الصف" : "الشبكة"}
        </Button>
      </div>
    </>
  );
}
