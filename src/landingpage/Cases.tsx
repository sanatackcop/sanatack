import PixelCard from "@/components/PixelCard";
import { motion } from "framer-motion";
import { Document, Page } from "react-pdf";
import { useState } from "react";
import { Loader2Icon } from "lucide-react";
import { useLocaleDirection } from "@/hooks/useLocaleDirection";

interface ContentFeature {
  thumbnail?: string;
  pdfUrl?: string;
  link: string;
  titleEn: string;
  titleAr: string;
  descriptionEn: string;
  descriptionAr: string;
  variant: "pink" | "blue" | "purple";
  type: "video" | "pdf";
}

export function UseCases() {
  const { isRTL: isRtl } = useLocaleDirection();
  const [, setPdfError] = useState<{ [key: number]: boolean }>({});

  const features: ContentFeature[] = [
    {
      thumbnail: "https://img.youtube.com/vi/ba-HMvDn_vU/maxresdefault.jpg",
      link: "https://www.youtube.com/watch?v=ba-HMvDn_vU",
      titleEn: "Introduction to the Human Brain",
      titleAr: "مقدمة عن الدماغ البشري",
      descriptionEn: "MIT 9.13 The Human Brain, Spring 2019",
      descriptionAr: "MIT 9.13 الدماغ البشري، ربيع 2019",
      variant: "pink",
      type: "video",
    },
    {
      thumbnail: "https://img.youtube.com/vi/6rAWxGAG6EI/maxresdefault.jpg",
      link: "https://www.youtube.com/watch?v=6rAWxGAG6EI",
      titleEn: "Teaching CS50 with AI",
      titleAr: "تدريس CS50 باستخدام الذكاء الاصطناعي",
      descriptionEn: "Leveraging Generative AI in Computer Science Education",
      descriptionAr: "الاستفادة من الذكاء الاصطناعي في تعليم علوم الحاسوب",
      variant: "blue",
      type: "video",
    },
    {
      pdfUrl:
        "https://projects.iq.harvard.edu/files/lifesciences1abookv1/files/11_-_a_primer_on_gene_regulation_revised_9-24-2018.pdf",
      link: "https://projects.iq.harvard.edu/files/lifesciences1abookv1/files/11_-_a_primer_on_gene_regulation_revised_9-24-2018.pdf",
      titleEn: "The Genetic Code & Translation",
      titleAr: "الشفرة الوراثية والترجمة",
      descriptionEn:
        "DNA translates to protein sequences - Harvard Life Sciences",
      descriptionAr:
        "ترجمة الحمض النووي إلى تسلسلات البروتين - علوم الحياة بجامعة هارفارد",
      variant: "purple",
      type: "pdf",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const handleCardClick = (link: string) => {
    window.open(link, "_blank", "noopener,noreferrer");
  };

  const handlePdfLoadError = (index: number) => {
    setPdfError((prev) => ({ ...prev, [index]: true }));
  };

  return (
    <section id="use-cases" className="relative py-24 px-4 sm:px-6 lg:px-8">
      <div className="relative mx-auto max-w-6xl text-center space-y-6 mb-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl tracking-tight text-gray-900 dark:text-white leading-tight mt-6">
            {isRtl ? "مبني لأي حالة استخدام" : "Built for any use case"}
          </h2>

          <p className="text-md text-gray-600 dark:text-gray-400 mt-3 max-w-3xl mx-auto leading-relaxed">
            {isRtl
              ? "انقر على محتوى التعلم أدناه، وابدأ رحلتك التعليمية ↙"
              : "Click on a learning content below, and start your learning journey ↘"}
          </p>
        </motion.div>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        className="relative mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {features.map((feature, index) => (
          <motion.div
            key={index}
            variants={cardVariants}
            className="min-h-[400px] cursor-pointer group"
            onClick={() => handleCardClick(feature.link)}
          >
            <PixelCard variant={feature.variant as any} className="!w-full">
              <div className="absolute inset-0 flex flex-col p-6">
                <div className="relative w-full aspect-video mb-6 rounded-2xl overflow-hidden bg-white shadow-inner">
                  {feature.type === "video" && feature.thumbnail && (
                    <>
                      <img
                        src={feature.thumbnail}
                        alt={isRtl ? feature.titleAr : feature.titleEn}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      {/* Play Icon Overlay for Videos */}
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
                        <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                          <svg
                            className="w-8 h-8 text-gray-900 ml-1"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      </div>
                    </>
                  )}

                  {/* PDF First Page - No Overlay Icon */}
                  {feature.type === "pdf" && feature.pdfUrl && (
                    <div className="w-full h-full flex items-center justify-center bg-white overflow-hidden">
                      <Document
                        file={feature.pdfUrl}
                        onLoadError={() => handlePdfLoadError(index)}
                        loading={
                          <div className="flex items-center justify-center h-full w-full">
                            <Loader2Icon className="w-8 h-8 animate-spin text-purple-500" />
                          </div>
                        }
                      >
                        <Page
                          pageNumber={1}
                          scale={0.5}
                          renderAnnotationLayer={false}
                          renderTextLayer={false}
                          className="transition-transform duration-300 group-hover:scale-105"
                        />
                      </Document>
                    </div>
                  )}

                  {/* Type Badge */}
                  <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full z-10">
                    <span className="text-white text-xs font-medium uppercase">
                      {feature.type}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 space-y-3">
                  <h3 className="text-xl font-bold text-white group-hover:underline">
                    {isRtl ? feature.titleAr : feature.titleEn}
                  </h3>

                  <p className="text-white/90 text-sm leading-relaxed">
                    {isRtl ? feature.descriptionAr : feature.descriptionEn}
                  </p>
                </div>

                {/* External Link Indicator */}
                <div className="mt-4 flex items-center text-white/70 text-xs group-hover:text-white/90 transition-colors">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                  <span>
                    {isRtl ? "فتح في نافذة جديدة" : "Open in new tab"}
                  </span>
                </div>
              </div>
            </PixelCard>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
