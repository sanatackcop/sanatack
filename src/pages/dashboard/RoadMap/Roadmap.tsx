import GenericTabs from "@/components/tabs";
import GenericCard from "@/components/card";
import GenericSection from "@/components/section";
import { RoadMapInterface } from "@/types/courses";
import { getRoadMapApi } from "@/utils/_apis/courses-apis";
import { useEffect, useState } from "react";
import { CareerIcon } from "@/utils/getIcon";

export default function RoadmapContent() {
  const [tab, setTab] = useState("all");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [roadMap, setRoadMap] = useState<RoadMapInterface[]>([]);

  async function fetchRoadMap() {
    setLoading(true);
    setError(null);
    try {
      const res = await getRoadMapApi();
      setRoadMap(res);
    } catch (err) {
      setError("حدث خطأ أثناء تحميل البيانات. الرجاء المحاولة لاحقاً.");
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    fetchRoadMap();
  }, []);

  const data = {
    all: roadMap,
  };

  const tabs = [{ label: "الكل", value: "all", count: roadMap.length }];

  return (
    <div className="overflow-y-auto">
      <GenericSection
        title="المسارات"
        description="انطلق في رحلتك التعليمية من خلال مسارات مصممة لتلائم اهتماماتك المختلفة. تغطي هذه المسارات مجالات متنوعة في عالم التقنية والمعرفة، وتتيح لك التدرج من الأساسيات حتى الاحتراف، بما يساعدك على بناء مستقبل مهني واعد بخطى واثقة."
      />

      <GenericTabs
        tabs={tabs}
        activeTab={tab}
        onChange={setTab}
        data={data}
        onRetry={fetchRoadMap}
        loading={loading}
        error={error}
        renderItem={(roadMap, index) => (
          <GenericCard
            id={roadMap.id}
            icon={<CareerIcon title={roadMap.title} />}
            key={index}
            title={roadMap.title}
            description={roadMap.description}
            className={index === 0 ? "md:col-span-2 sm:col-span-1" : ""}
            link={`/dashboard/roadMap/${roadMap.id}`}
          ></GenericCard>
        )}
      />
    </div>
  );
}
