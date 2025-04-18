"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Plus } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import CourseModal from "@/components/admin/UploadNewCourseModal";
import { getListCoursesApi } from "@/utils/_apis/admin-api";

interface Course {
  id: string;
  title: string;
  description: string;
}

export default function AdminDashboard() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [showDialog, setShowDialog] = useState<boolean>(false);

  async function fetchCourses() {
    setLoading(true);
    try {
      const res = await getListCoursesApi({});
      setCourses(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <div className="p-6 space-y-6 text-black">
      <div className="flex items-center justify-between">
        <Button onClick={() => setShowDialog(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          Upload New Course
        </Button>
        <h1 className="text-3xl font-bold">Courses</h1>
      </div>

      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle>Course List</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="animate-spin w-6 h-6" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Description</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Id</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="text-left">
                {courses.map((c, index) => (
                  <TableRow key={index}>
                    <TableCell>{c.description}</TableCell>
                    <TableCell className="font-medium">{c.title}</TableCell>
                    <TableCell className="font-medium">{c.id}</TableCell>
                  </TableRow>
                ))}
                {courses.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center italic">
                      No courses available
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <AnimatePresence>
        <CourseModal setShowDialog={setShowDialog} showDialog={showDialog} />
      </AnimatePresence>
    </div>
  );
}
