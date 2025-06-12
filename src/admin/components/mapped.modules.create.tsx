import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Module } from "@/utils/types";
import { fetchAllModules, linkModuleToCourse } from "@/utils/_apis/admin-api";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { ModuleLessons } from "../columns";
import { Label } from "@radix-ui/react-dropdown-menu";

export default function MappedModulesCreate({ id }: { id: string }) {
  const [order, setOrder] = useState<number | "">("");
  const [modules, setModules] = useState<Module[]>([]);

  async function fetchLessons() {
    try {
      const modules = await fetchAllModules<Module[]>();
      if (modules && modules.length) setModules(modules);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    fetchLessons();
  }, []);

  const ModuleColumnsLink: ColumnDef<Module>[] = [
    ...ModuleLessons,
    {
      header: "Link",
      cell: ({ row }) => {
        return (
          <Button
            onClick={async () =>
              await linkModuleToCourse(
                {
                  module_id: row.original.id,
                  order: order || 0,
                },
                id ?? ""
              )
            }
          >
            Link
          </Button>
        );
      },
    },
  ];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Link A Module</Button>
      </DialogTrigger>
      <DialogContent className="w-full max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Link A New Module</DialogTitle>
        </DialogHeader>
        <div className="w-full flex flex-col  items-end">
          <Label>Set Counter</Label>
          <Input
            type="number"
            value={order}
            onChange={(e) => {
              const value = e.target.value;
              setOrder(value === "" ? "" : Number(value));
            }}
            className="w-20 mb-5"
          />
          <Button onClick={() => setOrder(order == "" ? 0 : order + 1)}>
            Increment Order
          </Button>
          <p>Current Order: {order || 0}</p>
        </div>
        <DataTable data={modules} columns={ModuleColumnsLink} />
      </DialogContent>
    </Dialog>
  );
}
