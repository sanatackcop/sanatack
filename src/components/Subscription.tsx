import SpotlightCard from "./blocks/Components/SpotlightCard/SpotlightCard";
import { Button } from "./ui/button";
import { SparkleIcon } from "lucide-react";

const PlanCard = ({ plan }: any) => {
  const {
    label,
    price,
    period,
    buttonText,
    features,
    cardClass,
    marginTop,
    spotlightColor,
    priceTextColor,
    labelTextColor,
    spanTextColor,
    buttonClasses,
    featureRowClasses,
    sparkleFill,
  } = plan;

  return (
    <SpotlightCard
      className={`${cardClass} ${marginTop} !w-full md:!w-[24rem]`}
      spotlightColor={spotlightColor}
    >
      <p className={`${labelTextColor} text-xs font-medium text-right`}>
        {label}
      </p>
      <div className="mt-2">
        <h1
          className={`font-bold text-3xl md:text-4xl text-right ${priceTextColor}`}
        >
          {price}
          <span className={`${spanTextColor} text-sm p-1`}>{period}</span>
        </h1>
      </div>
      <Button className={buttonClasses}>{buttonText}</Button>
      {features.map((feature: any, idx: any) => (
        <p
          key={idx}
          className={`${featureRowClasses} flex justify-start gap-2 py-2`}
        >
          <SparkleIcon className="w-5 h-5 text-left" fill={sparkleFill} />
          <span className="text-right">{feature}</span>
        </p>
      ))}
    </SpotlightCard>
  );
};

export default function Subscription() {
  const featuresFree = [
    "مواد تعليمية حديثة ومتنوعة",
    "دورات متخصصة بمعايير عالمية",
    "تحديث مستمر للمحتوى التعليمي",
    "دعم فني وتعليمي متواصل",
    "تتبع وتقييم تقدم الطلاب",
    "مجتمع تفاعلي للمتعلمين",
  ];

  const featuresPro = [
    "مواد تعليمية حديثة ومتنوعة",
    "دورات متخصصة بمعايير عالمية",
    "تحديث مستمر للمحتوى التعليمي",
    "دعم فني وتعليمي متواصل",
    "تتبع وتقييم تقدم الطلاب",
    "مجتمع تفاعلي للمتعلمين",
    "مواد تعليمية حديثة ومتنوعة",
    "دورات متخصصة بمعايير عالمية",
    "تحديث مستمر للمحتوى التعليمي",
  ];

  const featuresPlus = [
    "مواد تعليمية حديثة ومتنوعة",
    "دورات متخصصة بمعايير عالمية",
    "تحديث مستمر للمحتوى التعليمي",
    "دعم فني وتعليمي متواصل",
    "تتبع وتقييم تقدم الطلاب",
    "مجتمع تفاعلي للمتعلمين",
    "مواد تعليمية حديثة ومتنوعة",
    "دورات متخصصة بمعايير عالمية",
    "تحديث مستمر للمحتوى التعليمي",
    "دورات متخصصة بمعايير عالمية",
    "تحديث مستمر للمحتوى التعليمي",
  ];

  const plans = [
    {
      key: "free",
      label: "مجانًا",
      price: "0",
      period: "/شهر",
      buttonText: "ابدأ مجانًا",
      features: featuresFree,
      cardClass:
        "bg-white shadow-lg flex-col justify-end items-end text-left text-black rounded-xl p-6 w-full md:w-72 border border-black border-opacity-5 hover:shadow-md transition-shadow cursor-pointer",
      marginTop: "mt-8 md:mt-[12rem]",
      spotlightColor: "rgba(0, 0, 0, 0.1)",
      priceTextColor: "text-black",
      labelTextColor: "text-[#6F6C90]",
      spanTextColor: "text-[#6F6C90]",
      buttonClasses:
        "font-bold hover:opacity-90 border-none shadow-none mt-6 w-full transition-all duration-300 !bg-black !text-white mb-5",
      featureRowClasses: "text-sm flex justify-start gap-2 py-2 text-black",
      sparkleFill: "gray",
    },
    {
      key: "pro",
      label: "Pro",
      price: "99",
      period: "/شهر",
      buttonText: "ابدأ مجانًا",
      features: featuresPro,
      cardClass:
        "bg-black shadow-lg flex-col justify-end items-end text-left rounded-xl p-6 w-full md:w-72 border border-black border-opacity-5 hover:shadow-md transition-shadow cursor-pointer",
      marginTop: "mt-8 md:mt-[5rem]",
      spotlightColor: "rgba(255, 215, 0, 0.3)",
      priceTextColor: "text-white",
      labelTextColor: "text-white",
      spanTextColor: "text-white",
      buttonClasses:
        "font-bold hover:opacity-90 border-none shadow-none mt-6 w-full transition-all duration-300 !bg-white !text-black mb-5",
      featureRowClasses: "text-sm flex justify-start gap-2 py-2 text-white",
      sparkleFill: "gold",
    },
    {
      key: "plus",
      label: "Plus",
      price: "200",
      period: "/شهر",
      buttonText: "ابدأ مجانًا",
      features: featuresPlus,
      cardClass:
        "bg-white shadow-lg flex-col justify-end items-end text-left text-black rounded-xl p-6 w-full md:w-72 border border-black border-opacity-5 hover:shadow-md transition-shadow cursor-pointer",
      marginTop: "",
      spotlightColor: "rgba(0, 0, 0, 0.1)",
      priceTextColor: "text-black",
      labelTextColor: "text-[#6F6C90]",
      spanTextColor: "text-[#6F6C90]",
      buttonClasses:
        "font-bold hover:opacity-90 border-none shadow-none mt-6 w-full transition-all duration-300 !bg-black !text-white mb-5",
      featureRowClasses: "text-sm flex justify-start gap-2 py-2 text-black",
      sparkleFill: "gray",
    },
  ];

  return (
    <section className="relative px-4 md:px-8 ">
      <div className="text-center mb-2">
        <span className="inline-block px-6 md:px-14 py-2 font-medium text-black border border-black border-opacity-20 rounded-full text-sm">
          <div className="flex gap-2">
            Boost your knowledge
            <SparkleIcon className="h-5 w-5" fill="gold" />
          </div>
        </span>
      </div>

      <div className="text-center mb-8">
        <h2 className="text-black text-3xl md:text-[48px] font-bold">
          اختر الخطة التي تناسبك.
        </h2>
      </div>

      <div className="flex flex-col md:flex-row gap-8 justify-center items-start p-4 md:p-8 mt-5">
        {plans.map((plan) => (
          <PlanCard key={plan.key} plan={plan} />
        ))}
      </div>
    </section>
  );
}
