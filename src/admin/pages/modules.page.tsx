import { DataTable } from "@/components/ui/data-table";
import { ModuleLessons } from "../columns";
import { useEffect, useState } from "react";
import { Module } from "@/utils/types";
import { fetchAllModules } from "@/utils/_apis/admin-api";
import { CustomError } from "@/utils/_apis/api";
import ModuleCreate from "../components/modules.create";

export default function ModulesPage() {
  const [modules, setModules] = useState<Module[]>([]);
  const [error, setError] = useState<string | null>(null);

  const getAllModules = async () => {
    try {
      const modules = await fetchAllModules<Module[]>();
      if (modules && modules.length) setModules(modules);
    } catch (err: unknown) {
      console.log(err);
      if ((err as CustomError).error.type == "network")
        setError("Error when trying to fetch data.");
    }
  };

  useEffect(() => {
    getAllModules();
  }, []);

  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      <div className=" mb-2">
        <ModuleCreate updateTable={() => getAllModules()} />
      </div>
      <DataTable columns={ModuleLessons} data={modules} />
    </div>
  );
}
