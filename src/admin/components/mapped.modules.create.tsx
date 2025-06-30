import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Module } from "@/utils/types";
import { fetchAllModules, linkModuleToCourse } from "@/utils/_apis/admin-api";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { ModuleLessons } from "../columns";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface LinkedModule {
  module_id: string;
  order: number;
}

export default function MappedModulesCreate({ id }: { id: string }) {
  const [modules, setModules] = useState<Module[]>([]);
  const [linkedModules, setLinkedModules] = useState<LinkedModule[]>([]);

  useEffect(() => {
    fetchAllModules<Module[]>()
      .then((res) => {
        if (res && res.length) setModules(res);
      })
      .catch(console.error);
  }, []);

  const addModule = (moduleId: string) => {
    if (!linkedModules.find((m) => m.module_id === moduleId)) {
      setLinkedModules((prev) => [
        ...prev,
        { module_id: moduleId, order: prev.length },
      ]);
    }
  };

  const removeModule = (moduleId: string) => {
    setLinkedModules((prev) =>
      prev
        .filter((m) => m.module_id !== moduleId)
        .map((m, idx) => ({ ...m, order: idx }))
    );
  };

  const handleSubmit = async () => {
    try {
      await Promise.all(linkedModules.map((lm) => linkModuleToCourse(lm, id)));
      setLinkedModules([]);
    } catch (err) {
      console.error("Failed to patch modules:", err);
    }
  };

  const ModuleColumnsLink: ColumnDef<Module>[] = [
    ...ModuleLessons(),
    {
      header: "Link",
      cell: ({ row }) => {
        const isLinked = linkedModules.some(
          (m) => m.module_id === row.original.id
        );
        return (
          <Button
            variant="secondary"
            onClick={() => addModule(row.original.id)}
            disabled={isLinked}
          >
            {isLinked ? "Linked" : "Link"}
          </Button>
        );
      },
    },
  ];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Link a Module</Button>
      </DialogTrigger>
      <DialogContent className="w-full max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Link a New Module</DialogTitle>
        </DialogHeader>

        <div className="flex flex-wrap gap-2 items-center mb-4">
          {linkedModules.map((mod) => {
            const full = modules.find((m) => m.id === mod.module_id);
            return (
              <Badge key={mod.module_id} className="flex items-center gap-2">
                {full?.title || mod.module_id}
                <button onClick={() => removeModule(mod.module_id)}>
                  <X className="w-3 h-3 ml-1" />
                </button>
              </Badge>
            );
          })}
        </div>

        <DataTable data={modules} columns={ModuleColumnsLink} />

        {linkedModules.length > 0 && (
          <div className="mt-6 text-right">
            <Button onClick={handleSubmit}>Save Modules</Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
