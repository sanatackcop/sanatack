import WriterCard from "@/components/articles/WriterCard";
import AppLayout from "@/components/layout/Applayout";
import Navbar from "@/components/Navbar";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

interface Article {
  id: string;
  title: string;
  content: string;
  author?: string;
}

const ArticlePage: React.FC = () => {
  const { id } = useParams();
  if (!id) return;
  const [article, setArticle] = useState<Article | null>(null);

  useEffect(() => {
    const fetchArticle = async () => {
      const fetchedArticle = {
        id,
        title: "بناء تطبيق React من البداية",
        content: `
          <p>إن بناء تطبيق باستخدام React من البداية يعد تجربة رائعة. يتطلب الأمر العديد من الخطوات مثل إعداد البيئة، إنشاء المكونات، إدارة الحالة، والاتصال بالـ API.</p>
          <h2 class="text-xl font-semibold text-gray-200 mt-6 mb-4">إعداد البيئة</h2>
          <p>أول خطوة في بناء أي تطبيق باستخدام React هي إعداد البيئة. يتضمن ذلك تثبيت Node.js وإعداد خادم التطوير لـ React. يمكنك استخدام <code>create-react-app</code> أو إعداد التكوين الخاص بك باستخدام Webpack.</p>
          <h2 class="text-xl font-semibold text-gray-200 mt-6 mb-4">إنشاء المكونات</h2>
          <p>تُبنى تطبيقات React باستخدام المكونات. كل مكون هو دالة أو فئة تُرجع جزءًا من واجهة المستخدم. يمكن إعادة استخدام المكونات ودمجها لبناء واجهات مستخدم معقدة.</p>
          <h2 class="text-xl font-semibold text-gray-200 mt-6 mb-4">إدارة الحالة</h2>
          <p>إدارة الحالة في React هي أمر أساسي لتطوير التطبيقات الديناميكية. يمكنك استخدام الحالة المحلية للمكونات أو حلول أكثر تقدماً مثل Redux أو React Context.</p>
          <h2 class="text-xl font-semibold text-gray-200 mt-6 mb-4">التفاعل مع الـ API</h2>
          <p>في تطبيقات React الحديثة، تحتاج غالبًا إلى التفاعل مع API لجلب البيانات أو إرسالها. يمكنك استخدام <code>fetch</code> أو مكتبة مثل <code>axios</code> للتعامل مع الـ API.</p>
        `,
      };
      setArticle(fetchedArticle);
    };
    fetchArticle();
  }, [id]);

  if (!article) return <div>جاري التحميل...</div>;

  return (
    <>
      <AppLayout navbar={<Navbar />} permissions={["read"]}>
        <div
          className="max-w-[60rem] mx-auto p-6 bg-gray-900 text-white rounded-lg shadow-lg"
          dir="rtl"
        >
          <header className="mb-10">
            <h1 className="text-5xl font-semibold leading-tight text-white">
              {article.title}
            </h1>
            <WriterCard id={id} />
          </header>

          <article>
            <div
              className="prose prose-xl max-w-none text-gray-300"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
          </article>

          <footer className="mt-16">
            <hr className="border-gray-700 mb-6" />
            <div className="text-center text-gray-500">
              <p>شكرًا على قراءتك! استكشف المزيد من المقالات في مدونتنا.</p>
            </div>
          </footer>
        </div>

        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-4 right-2
           bg-gray-200 text-black rounded-full
            p-3 shadow-lg hover:bg-blue-700 hover:text-white
            focus:outline-none focus:ring-2 focus:ring-blue-400"
          aria-label="Back to top"
        >
          ↑
        </button>
      </AppLayout>
    </>
  );
};

export default ArticlePage;
