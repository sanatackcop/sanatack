import React, { useState } from "react";

const interests: string[] = [
  "Programming",
  "Data Science",
  "Technology",
  "Self Dev",
  "Writing",
  "Relationships",
  "Machine Learning",
  "Productivity",
  "Politics",
  "Cryptocurrency",
  "Psychology",
  "Money",
  "Business",
  "Python",
  "Health",
  "Science",
  "Mental Health",
  "Life",
  "Software Development",
  "Startup",
  "Design",
  "JavaScript",
  "AI",
  "Culture",
  "Software Engineering",
  "Blockchain",
  "Coding",
  "React",
  "UX",
  "Education",
  "History",
  "Humor",
  "Web Development",
  "Work",
  "Lifestyle",
  "Society",
  "Deep Learning",
  "Marketing",
  "Books",
  "NFT",
  "Social Media",
  "Leadership",
  "Android",
  "Apple",
];

const Preference: React.FC = () => {
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((item) => item !== interest)
        : [...prev, interest]
    );
  };

  return (
    <div className="flex flex-col items-center justify-center p-6">
      <div
        className="grid grid-cols-2 md:grid-cols-3 round
      lg:grid-cols-4 gap-4 w-full max-w-5xl"
      >
        {interests.map((interest) => (
          <button
            key={interest}
            onClick={() => toggleInterest(interest)}
            className={`w-full rounded-2xl px-4 py-2 text-sm 
              font-medium border transition-all flex \
              items-center justify-center ${
              selectedInterests.includes(interest)
                ? "bg-green-500 text-white border-green-500"
                : "text-white border-zinc-600"
            } hover:shadow-md hover:scale-105`}
          >
            {interest}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Preference;
