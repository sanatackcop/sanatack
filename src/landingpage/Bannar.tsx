import { useTranslation } from "react-i18next";
import StanfordLogo from "@/assets/collages/stanford.avif";
import MichiganState from "@/assets/collages/Michigan_State_Athletics_logo.svg.png";
import MitLogo from "@/assets/collages/MIT_logo.svg.png";
import MichiganLogo from "@/assets/collages/2560px-Michigan_Wolverines_logo.svg.png";
import Princeton from "@/assets/collages/Princeton_seal.svg";
import Harvard from "@/assets/collages/Harvard_University_coat_of_arms.svg.png";
import King from "@/assets/collages/ksu_shieldlogo_colour_rgb.png";
import Boulder from "@/assets/collages/CU-Boulder-Symbol.png";

type College = { name: string; logo: string };

const colleges: College[] = [
  { name: "Stanford University", logo: StanfordLogo },
  { name: "Michigan State University", logo: MichiganState },
  { name: "Massachusetts Institute of Technology", logo: MitLogo },
  { name: "University of Michigan", logo: MichiganLogo },
  { name: "Princeton University", logo: Princeton },
  { name: "Harvard University", logo: Harvard },
  { name: "King Saud University", logo: King },
  { name: "University of Colorado Boulder", logo: Boulder },
];

export default function CollegesSupported() {
  const { t } = useTranslation();

  return (
    <section className="w-full py-16 bg-white dark:bg-[#09090b]">
      <div className="container mx-auto px-6 sm:px-8 max-w-7xl">
        <h2
          className="text-center text-zinc-900 dark:text-white/90 text-base sm:text-lg font-medium mb-10"
          aria-label={t("common.chosen_by_minds")}
        >
          {t("common.chosen_by_minds")}
        </h2>

        <div className="relative overflow-hidden">
          <div className="flex gap-12 animate-infinite-scroll hover:[animation-play-state:paused]">
            {colleges.map((college, idx) => (
              <div
                key={`first-${idx}`}
                className="flex-shrink-0 w-40 h-16 flex items-center justify-center"
              >
                <div
                  className="
                    relative
                    w-full
                    h-full
                    rounded-xl
                    grayscale opacity-70
                    transition
                    duration-300
                    ease-out
                    hover:grayscale-0 hover:opacity-100 hover:scale-105
                    focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-gray-300 dark:focus-within:ring-gray-600
                    [@media(prefers-reduced-motion:reduce)]:transition-none
                  "
                  title={college.name}
                >
                  <img
                    src={college.logo}
                    alt={college.name}
                    loading="lazy"
                    decoding="async"
                    width={176}
                    height={64}
                    className="absolute inset-0 m-auto max-h-full max-w-full object-contain"
                  />
                  <span className="sr-only">{college.name}</span>
                </div>
              </div>
            ))}

            {colleges.map((college, idx) => (
              <div
                key={`second-${idx}`}
                className="flex-shrink-0 w-40 h-16 flex items-center justify-center"
                aria-hidden="true"
              >
                <div
                  className="
                    relative
                    w-full
                    h-full
                    rounded-xl
                    grayscale opacity-70
                    transition
                    duration-300
                    ease-out
                    hover:grayscale-0 hover:opacity-100 hover:scale-105
                    focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-gray-300 dark:focus-within:ring-gray-600
                    [@media(prefers-reduced-motion:reduce)]:transition-none
                  "
                  title={college.name}
                >
                  <img
                    src={college.logo}
                    alt={college.name}
                    loading="lazy"
                    decoding="async"
                    width={64}
                    height={64}
                    className="absolute inset-0 m-auto max-h-full max-w-full object-contain"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
