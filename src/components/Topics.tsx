import { Brain, ChartLine, Code, Cpu, Database, GitFork } from "lucide-react";

export default function Topics() {
  const topics = [
    { title: "علم البينات", icon: <Database className="text-black" /> },
    { title: "الذكاء الاصطناعي", icon: <Brain className="text-black" /> },
    { title: "هندسه البرمجيات", icon: <Code className="text-black" /> },
    { title: "تحليل البينات", icon: <ChartLine className="text-black" /> },
    { title: "تصميم الانظمه", icon: <GitFork className="text-black" /> },
    { title: "علوم الحاسب", icon: <Cpu className="text-black" /> },
  ];

  const duplicatedTopics = [...topics, ...topics].reverse();

  return (
    <div className="w-full  py-10 overflow-hidden">
      <div className="w-full flex">
        <div className="w-full overflow-hidden relative">
          <div className="flex space-x-10 animate-scroll">
            {duplicatedTopics.map((topic, index) => (
              <div
                key={index}
                className="w-48 h-48 bg-[#0D0D0D] border border-white border-opacity-20 shadow-lg flex-shrink-0 ml-10 flex flex-col items-center justify-center text-white text-lg rounded-xl transition-transform hover:scale-95 cursor-pointer"
              >
                <div className="text-center font-semibold">{topic.title}</div>
                <div className="w-20 h-20 bg-white rounded-lg flex items-center justify-center mt-4 shadow-md">
                  {topic.icon}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
