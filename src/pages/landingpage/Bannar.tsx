import ImageGallery from "./ImageGallery";

export default function Bannar10x() {
  return (
    <div className="px-10 py-10 bg-gradient-to-br from-gray-100 via-white to-gray-50 dark:from-gray-900 dark:via-black dark:to-gray-800 ">
      <section className=" text-white py-5 rounded-2xl">
        <div
          className="max-w-7xl mx-auto px-4 text-gray-900 dark:text-white"
          dir="rtl"
        >
          <h2 className="text-2xl md:text-3xl font-medium mb-4">
            تعلم بشكل افضل و ثقه اكبر
          </h2>
          <div className="flex items-baseline mb-6 space-x-reverse space-x-2">
            <h1 className="text-[11vw] leading-none tracking-tight font-extrabold">
              10x
            </h1>
            <span className="text-5xl md:text-7xl font-bold">اسرع</span>
          </div>
          <p className="text-lg md:text-xl mb-3 max-w-3xl leading-relaxed">
            تم تصميم هذه الدورة بطريقة تفاعلية تعتمد على النصوص
            <span className="text-orange-500 font-semibold mx-1">
              بالتحديات العملية
            </span>
            مما يجعل معسكر&nbsp;SQL التدريبي هذا يتميز بخصائص فريدة تجعله
            استثنائياً.
          </p>
          <ImageGallery />
        </div>
      </section>
    </div>
  );
}
