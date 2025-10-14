import GenericTabs from "@/components/tabs";
import GenericCard from "@/components/card";
import GenericSection from "@/components/section";
import { CareerPathInterface } from "@/types/courses";
import { getCareerPathApi } from "@/utils/_apis/courses-apis";
import { useEffect, useState } from "react";
import { CareerIcon } from "@/utils/getIcon";

export default function CareerPathsContent() {
  const [tab, setTab] = useState("all");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [careerPath, setCareerPath] = useState<CareerPathInterface[]>([]);

  async function fetchcareerPath() {
    setLoading(true);
    setError(null);
    try {
      const res = await getCareerPathApi();
      setCareerPath(res);
    } catch (err) {
      setError("حدث خطأ أثناء تحميل البيانات. الرجاء المحاولة لاحقاً.");
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    fetchcareerPath();
  }, []);

  const data = {
    all: careerPath,
  };

  const tabs = [{ label: "الكل", value: "all", count: careerPath.length }];

  return (
    <div className="overflow-y-auto">
      <GenericSection
        title="المسار المهني"
        description="اختر مسارك المهني بثقة من خلال برامج تعليمية مصممة بعناية، تبدأ من المفاهيم الأساسية وصولًا إلى المهارات المتقدمة. تغطي هذه المسارات مجالات حيوية مثل تطوير البرمجيات، تحليل البيانات، الذكاء الاصطناعي، وتصميم واجهات المستخدم، لتمنحك التأهيل الكامل لدخول سوق العمل بكفاءة."
      />

      <GenericTabs
        tabs={tabs}
        activeTab={tab}
        onChange={setTab}
        data={data}
        onRetry={fetchcareerPath}
        loading={loading}
        error={error}
        renderItem={(careerPath, index) => (
          <GenericCard
            id={careerPath.id}
            icon={<CareerIcon title={careerPath.title} />}
            key={index}
            title={careerPath.title}
            description={careerPath.description}
            className={index === 0 ? "md:col-span-2 sm:col-span-1" : ""}
            link={`/dashboard/careerPath/${careerPath.id}`}
          ></GenericCard>
        )}
      />
    </div>
  );
}
