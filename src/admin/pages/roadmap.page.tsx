import { useEffect, useState } from "react";
import { getAllRoadmaps } from "@/utils/_apis/admin-api";
import { Roadmap } from "@/utils/types";
import { DataTable } from "@/components/ui/data-table";
import { RoadmapColumns } from "../columns";
import CourseCreate from "../components/course.create";

export default function RoadmapsPage() {
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([]);
  const [error, setError] = useState("");

  async function fetchRoadmaps() {
    try {
      const res = await getAllRoadmaps<Roadmap[]>({});
      if (res) {
        setRoadmaps(res);
      }
    } catch (err: any) {
      console.error(err);
      setError(err?.error?.body ?? "Error Occurred");
    }
  }

  useEffect(() => {
    fetchRoadmaps();
  }, []);

  if (error) return <p className=" text-center text-red-500">{error}</p>;

  return (
    <div className=" w-full ">
      <div className="mb-5">
        <CourseCreate updateTable={() => fetchRoadmaps()} />
      </div>

      <DataTable columns={RoadmapColumns} data={roadmaps} />
    </div>
  );
}
