import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MaterialViewerProps } from "./type";
import { iconMap } from "./const";
import { Button } from "@/components/ui/button";

export default function MaterialViewer({
  material,
  onComplete,
}: MaterialViewerProps) {
  const [videoEnded, setVideoEnded] = useState(false);

  if (!material) {
    return (
      <p className="text-center text-[#34363F]  dark:text-white text-muted-foreground">
        اختر مادة من القائمة لبدء التعلم
      </p>
    );
  }

  const Header = (
    <CardHeader className="flex-row items-center gap-2">
      {React.createElement(iconMap[material.type], { className: "h-6 w-6" })}
      <CardTitle className="text-base font-semibold line-clamp-2 text-right flex-1">
        {material.title}
      </CardTitle>
    </CardHeader>
  );

  const done = () => onComplete(material);

  switch (material.type) {
    case "video":
      return (
        <Card className="w-full max-w-4xl shadow-xl bg-[#1B1B1B] text-white/90">
          {Header}
          <CardContent>
            {material.url ? (
              <div className="w-full aspect-video">
                {material.url.match(/youtu\.?(be)/) ? (
                  <>
                    <iframe
                      src={
                        material.url.replace("watch?v=", "embed/") +
                        "?enablejsapi=1"
                      }
                      title={material.title}
                      className="h-full w-full rounded-lg"
                      allowFullScreen
                    />
                    <div className="flex justify-end mt-2">
                      <Button size="sm" onClick={done}>
                        تم الانتهاء
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <video
                      src={material.url}
                      controls
                      className="h-full w-full rounded-lg"
                      onEnded={() => setVideoEnded(true)}
                    />
                    <div className="flex justify-end mt-2">
                      <Button size="sm" disabled={!videoEnded} onClick={done}>
                        تم الانتهاء
                      </Button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <p className="text-center py-10">لا يتوفر رابط للفيديو.</p>
            )}
          </CardContent>
        </Card>
      );

    case "reading":
      return (
        <Card className="w-full max-w-3xl shadow-xl bg-[#1B1B1B] text-white/90 overflow-hidden">
          {Header}
          <CardContent className="h-[70vh] overflow-y-auto">
            {material.url ? (
              <iframe
                src={material.url}
                title={material.title}
                className="h-full w-full rounded-lg border-none"
              />
            ) : material.content ? (
              <div className="prose prose-invert max-w-none" dir="rtl">
                {material.content}
              </div>
            ) : (
              <p className="text-center py-10">لا يتوفر محتوى للقراءة.</p>
            )}
          </CardContent>
          <CardContent className="pt-2 flex justify-end">
            <Button size="sm" onClick={done}>
              تم الانتهاء
            </Button>
          </CardContent>
        </Card>
      );

    case "quiz":
      return (
        <Card className="w-full max-w-xl shadow-xl bg-[#1B1B1B] text-white/90 p-6 flex flex-col items-center gap-4">
          {Header}
          <CardContent className="flex flex-col items-center gap-6">
            <p className="text-center">خاصية الاختبارات قيد التطوير ✨</p>
            <Button onClick={done}>ابدأ الاختبار (محاكي)</Button>
          </CardContent>
        </Card>
      );

    default:
      return null;
  }
}
