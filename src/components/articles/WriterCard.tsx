import { useState } from "react";

const WriterCard = ({ id }: { id: string }) => {
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);

  const handleReaction = (reaction: "like" | "dislike") => {
    if (reaction === "like") {
      setLikes((prev) => prev + 1);
      triggerFloatingEmoji("❤️");
    } else {
      setDislikes((prev) => prev + 1);
      triggerFloatingEmoji("💔");
    }
  };

  const triggerFloatingEmoji = (emoji: string) => {
    const emojiElement = document.createElement("div");
    emojiElement.textContent = emoji;
    emojiElement.style.position = "absolute";
    emojiElement.style.fontSize = "2rem";
    emojiElement.style.animation = "floatUp 1.5s ease-in-out";
    emojiElement.style.pointerEvents = "none";
    emojiElement.style.zIndex = "1000";

    const container = document.getElementById(`reaction-container-${id}`);
    if (container) {
      container.appendChild(emojiElement);
      setTimeout(() => container.removeChild(emojiElement), 1500);
    }
  };

  const sharePost = () => {
    navigator.share
      ? navigator.share({
          title: "Check out this post!",
          text: `Read this amazing post by the writer with ID: ${id}.`,
          url: window.location.href,
        })
      : alert("Sharing is not supported on this browser.");
  };

  return (
    <div className="bg-gray-800 text-white rounded-lg p-4 shadow-lg max-w-sm mx-auto relative">
      <div id={`reaction-container-${id}`} className="absolute top-0 left-0 w-full h-full pointer-events-none"></div>
      <div className="flex items-center">
        {/* Profile Picture */}
        <img
          src="https://via.placeholder.com/64"
          alt="Profile"
          className="w-16 h-16 rounded-full border-2 border-gray-700"
        />

        {/* Profile Info */}
        <div className="flex flex-col ml-4 space-y-2">
          <span className="text-gray-400 text-sm">بواسطة الكاتب | 4 يناير 2025</span>
          <span className="text-gray-400 text-sm">ID: {id}</span>
          <div className="text-gray-400 text-sm">
            📖 30 دقيقة للقراءة | 💬 12 تعليق
          </div>
        </div>

        {/* Follow Button */}
        <button className="ml-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium transition">
          Follow
        </button>
      </div>

      {/* Reaction Section */}
      <div className="mt-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => handleReaction("like")}
            className="flex items-center space-x-2 text-green-400 hover:text-green-300 transition"
          >
            ❤️ <span>{likes}</span>
          </button>
          <button
            onClick={() => handleReaction("dislike")}
            className="flex items-center space-x-2 text-red-400 hover:text-red-300 transition"
          >
            💔 <span>{dislikes}</span>
          </button>
        </div>

        {/* Share Button */}
        <button
          onClick={sharePost}
          className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 text-sm font-medium transition"
        >
          🔗 Share
        </button>
      </div>

      {/* Floating Emoji Animation */}
      <style>
        {`
          @keyframes floatUp {
            0% {
              opacity: 1;
              transform: translateY(0);
            }
            100% {
              opacity: 0;
              transform: translateY(-100px);
            }
          }
        `}
      </style>
    </div>
  );
};

export default WriterCard;
