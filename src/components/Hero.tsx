import { Button } from "./ui/button";
import { Input } from "./ui/input";

const Hero = () => {
  return (
    <div className="relative text-center py-10">
      <div
        className="absolute top-0 left-0 w-full h-full bg-gradient-to-b 
      from-transparent to-black opacity-50 -z-10"
      />
      <div className="max-w-4xl mx-auto px-4">
        <div className="inline-block bg-[#0044ff56] border border-[#ffffff77] text-white px-4 py-1 rounded-full mb-8">
          مرحباً في النسخة التجريبية
        </div>

        <h1 className="text-4xl md:text-5xl  font-bold text-white mb-6 leading-tight">
          ارتقِ بمسيرتك المهنية إلى آفاق جديدة من خلال تعلم أهم مجالات التقنية
          المطلوبة، واصقل مهاراتك الاحترافية
        </h1>
        <p className="text-[#6B737D] mb-8">
          عبر التطبيق العملي والتعليم التفاعلي
        </p>
        <div
          className="flex justify-center space-x-2
        space-x-reverse "
        >
          <Input
            type="email"
            placeholder="ادخل الايميل"
            // vaildae on change to green
            className="px-6 py-6 rounded-lg focus-within:border-red-400
             placeholder:text-white placeholder:font-bold
             w-64 border border-[#AFBCCD] bg-[#1d212a94] text-right"
          />
          <Button
          // if vaild turn on green automatcic
            className="py-6  bg-transparent border
           border-[#585E67] text-white px-14 font-bold 
          rounded-lg  hover:bg-[#001aff1f]
           transition-colors duration-1000 ease-out"
          >
            سجل
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
