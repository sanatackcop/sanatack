import Bannar from "../../assets/Bannar.png";

export default function Bannar10x() {
  return (
    <div className="px-10 py-24">
      <section className="bg-[#151516] text-white py-24 rounded-2xl border      border-white border-opacity-20">
u        <div className="max-w-7xl mx-auto px-4" dir="rtl">
u          <h2 className="text-2xl md:text-3xl font-medium mb-4 text-gray-300">
            تعلم بشكل افضل و ثقه اكبر
          </h2>

u          <div className="flex items-baseline mb-6 space-x-reverse space-x-2">
            <h1 className="text-[11vw] leading-none tracking-tight font-extrabold">
              10x
            </h1>
            <span className="text-5xl md:text-7xl font-bold">اسرع</span>
          </div>

u          <p className="text-lg md:text-xl mb-10 max-w-3xl leading-relaxed">
            تم تصميم هذه الدورة بطريقة تفاعلية تعتمد على النصوص
            <span className="text-orange-500 font-semibold mx-1">
              بالتحديات العملية
            </span>
            مما يجعل معسكر&nbsp;SQL التدريبي هذا يتميز بخصائص فريدة تجعله
            استثنائياً.
          </p>

          <img src={String(Bannar)} />
        </div>
      </section>
    </div>
  );
}
