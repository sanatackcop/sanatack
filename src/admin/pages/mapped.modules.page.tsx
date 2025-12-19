import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { lazy } from "react";
import { Module } from "@/utils/types";
import { DataTable } from "@/components/ui/data-table";
import { getLinkedModulesCourses } from "@/utils/_apis/admin-api";
import { ColumnDef } from "@tanstack/react-table";
const MappedModulesCreate = lazy(
  () => import("../components/mapped.modules.create")
);

export declare type MappedModule = {
  order: number;
  lesson: Module;
};

export default function MappedModules() {
  const [mappedModules, setMappedModules] = useState<MappedModule[]>([]);
  const location = useLocation();
  const { pathname } = location;
  const id = pathname.split("/").at(-1) ?? "";

  async function fetchLessons() {
    try {
      const modules = await getLinkedModulesCourses<MappedModule[]>(id);
      if (modules && modules.length) setMappedModules(modules);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    fetchLessons();
  }, []);
  const LinkedLessonColumns: ColumnDef<MappedModule>[] = [
    {
      accessorKey: "module.title",
      header: "Name",
    },
    {
      accessorKey: "module.description",
      header: "Description",
    },
  ];

  return (
    <div>
      <div className="w-full flex justify-end">
        <Link to="/admin/courses">
          <Button>Back</Button>
        </Link>
      </div>

      <div className="mb-5">
        <MappedModulesCreate id={id} />
      </div>
      <DataTable
        columns={[
          ...LinkedLessonColumns,
          { accessorKey: "order", header: "Order" },
        ]}
        data={mappedModules}
      />
    </div>
  );
}
