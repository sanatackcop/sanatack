// types/youtube.ts
export interface YouTubeVideoSnippet {
  publishedAt: string;
  channelId: string;
  title: string;
  description: string;
  thumbnails: {
    default: { url: string; width: number; height: number };
    medium: { url: string; width: number; height: number };
    high: { url: string; width: number; height: number };
  };
  channelTitle: string;
  publishTime: string;
}

export interface YouTubeVideoId {
  kind: string;
  videoId: string;
}

export interface YouTubeSearchItem {
  kind: string;
  etag: string;
  id: YouTubeVideoId;
  snippet: YouTubeVideoSnippet;
}

export interface YouTubeSearchResponse {
  kind: string;
  etag: string;
  nextPageToken?: string;
  regionCode: string;
  pageInfo: {
    totalResults: number;
    resultsPerPage: number;
  };
  items: YouTubeSearchItem[];
}

export interface VideoCardData {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  channelTitle: string;
  publishedAt: string;
  category: string;
  categoryIcon: string;
  url: string;
}

export interface EducationalTopic {
  query: string;
  category: string;
  icon: string;
  color: string;
}

import { t } from "i18next";
// components/Explore.tsx
import React, { useState, useEffect } from "react";

const YOUTUBE_API_KEY = "AIzaSyCoNBlmAd4ARvhgrQVGt1hI0-F-xkTXQw0";
const YOUTUBE_API_URL = "https://www.googleapis.com/youtube/v3/search";

const EDUCATIONAL_TOPICS: EducationalTopic[] = [
  {
    query: "computer science tutorial programming",
    category: "Computer Science",
    icon: "💻",
    color: "bg-blue-100 text-blue-800 border-blue-200",
  },
  {
    query: "mathematics calculus algebra tutorial",
    category: "Mathematics",
    icon: "📐",
    color: "bg-green-100 text-green-800 border-green-200",
  },
  {
    query: "physics quantum mechanics tutorial",
    category: "Physics",
    icon: "⚛️",
    color: "bg-purple-100 text-purple-800 border-purple-200",
  },
  {
    query: "javascript python react programming tutorial",
    category: "Programming",
    icon: "🚀",
    color: "bg-red-100 text-red-800 border-red-200",
  },
  {
    query: "data structures algorithms coding interview",
    category: "Algorithms",
    icon: "🧮",
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
  },
  {
    query: "machine learning AI neural networks",
    category: "Machine Learning",
    icon: "🤖",
    color: "bg-indigo-100 text-indigo-800 border-indigo-200",
  },
  {
    query: "web development HTML CSS JavaScript",
    category: "Web Development",
    icon: "🌐",
    color: "bg-teal-100 text-teal-800 border-teal-200",
  },
  {
    query: "software engineering design patterns",
    category: "Software Engineering",
    icon: "⚙️",
    color: "bg-gray-100 text-gray-800 border-gray-200",
  },
];

const Explore: React.FC = () => {
  const [videos, setVideos] = useState<VideoCardData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  useEffect(() => {
    if (YOUTUBE_API_KEY) {
      fetchEducationalVideos();
    } else {
      setError(
        "YouTube API key is required. Please check your environment variables."
      );
      setLoading(false);
    }
  }, []);

  const fetchEducationalVideos = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const allVideos: VideoCardData[] = [];

      for (const topic of EDUCATIONAL_TOPICS) {
        const params = new URLSearchParams({
          key: YOUTUBE_API_KEY!,
          q: topic.query,
          part: "snippet",
          type: "video",
          maxResults: "6",
          order: "relevance",
          videoDuration: "medium",
          videoDefinition: "high",
          safeSearch: "strict",
        });

        const response = await fetch(`${YOUTUBE_API_URL}?${params}`);

        if (!response.ok) {
          throw new Error(
            `API Error: ${response.status} ${response.statusText}`
          );
        }

        const data: YouTubeSearchResponse = await response.json();

        const categoryVideos: VideoCardData[] = data.items.map((video) => ({
          id: video.id.videoId,
          title: video.snippet.title,
          description: video.snippet.description,
          thumbnail:
            video.snippet.thumbnails.medium?.url ||
            video.snippet.thumbnails.default?.url,
          channelTitle: video.snippet.channelTitle,
          publishedAt: video.snippet.publishedAt,
          category: topic.category,
          categoryIcon: topic.icon,
          url: `https://www.youtube.com/watch?v=${video.id.videoId}`,
        }));

        allVideos.push(...categoryVideos);

        // Rate limiting protection
        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      // Shuffle and limit results
      const shuffledVideos = allVideos
        .sort(() => Math.random() - 0.5)
        .slice(0, 32);

      setVideos(shuffledVideos);
    } catch (err) {
      console.error("Error fetching videos:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load educational content"
      );
    } finally {
      setLoading(false);
    }
  };

  const filteredVideos =
    selectedCategory === "all"
      ? videos
      : videos.filter(
          (video) =>
            video.category.toLowerCase() === selectedCategory.toLowerCase()
        );

  const categories = [
    "all",
    ...EDUCATIONAL_TOPICS.map((topic) => topic.category),
  ];

  const formatTimeAgo = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return t("common.1_day_ago", "1 day ago");
    if (diffDays < 7) return `${diffDays} ${t("common.days_ago", "days ago")}`;
    if (diffDays < 30)
      return `${Math.ceil(diffDays / 7)} ${t("common.weeks_ago", "weeks ago")}`;
    if (diffDays < 365)
      return `${Math.ceil(diffDays / 30)} ${t(
        "common.months_ago",
        "months ago"
      )}`;
    return `${Math.ceil(diffDays / 365)}  ${t(
      "common.years_ago",
      "years ago"
    )}`;
  };

  const truncateText = (text: string, maxLength: number): string => {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + "...";
  };

  const getCategoryColor = (categoryName: string): string => {
    const topic = EDUCATIONAL_TOPICS.find((t) => t.category === categoryName);
    return topic?.color || "bg-gray-100 text-gray-800 border-gray-200";
  };

  if (!YOUTUBE_API_KEY) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            API Key Required
          </h2>
          <p className="text-gray-600 mb-4">
            Please set your YouTube Data API v3 key:
          </p>
          <code className="bg-gray-100 p-3 rounded-lg text-sm block mb-4 font-mono">
            REACT_APP_YOUTUBE_API_KEY=your_api_key_here
          </code>
          <a
            href="https://console.developers.google.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Get API Key
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            🎓 Explore Knowledge
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover curated educational content across computer science,
            mathematics, physics, and other technical subjects
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {categories.map((category) => {
            const isActive = selectedCategory === category;
            const topic = EDUCATIONAL_TOPICS.find(
              (t) => t.category === category
            );

            return (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`
                  px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
                  border-2 hover:scale-105 active:scale-95
                  ${
                    isActive
                      ? "bg-blue-600 text-white border-blue-600 shadow-lg"
                      : "bg-white text-gray-700 border-gray-200 hover:border-blue-300 hover:shadow-md"
                  }
                `}
              >
                {category === "all"
                  ? "🔍 All Topics"
                  : `${topic?.icon} ${category}`}
              </button>
            );
          })}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600 mb-4"></div>
            <p className="text-gray-600 text-lg">
              Loading educational content...
            </p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center max-w-md mx-auto">
            <div className="text-5xl mb-4">❌</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              Something went wrong
            </h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={fetchEducationalVideos}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
            >
              🔄 Try Again
            </button>
          </div>
        )}

        {/* Content */}
        {!loading && !error && (
          <>
            {/* Results Info */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 bg-white rounded-lg p-4 shadow-sm">
              <span className="text-gray-600 font-medium mb-3 sm:mb-0">
                {filteredVideos.length} educational videos found
              </span>
              <button
                onClick={fetchEducationalVideos}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors inline-flex items-center gap-2 self-start sm:self-auto"
              >
                🔄 Refresh Content
              </button>
            </div>

            {/* Videos Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredVideos.map((video, index) => (
                <div
                  key={`${video.id}-${index}`}
                  className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group hover:scale-105"
                >
                  {/* Thumbnail */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      loading="lazy"
                    />

                    {/* Category Badge */}
                    <div
                      className={`absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-medium border ${getCategoryColor(
                        video.category
                      )}`}
                    >
                      {video.categoryIcon} {video.category}
                    </div>

                    {/* Play Overlay */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                      <div className="w-16 h-16 bg-white bg-opacity-90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <svg
                          className="w-6 h-6 text-red-600 ml-1"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="font-semibold text-gray-900 text-sm leading-6 mb-2 line-clamp-2">
                      {truncateText(video.title, 70)}
                    </h3>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {truncateText(video.description, 120)}
                    </p>

                    {/* Meta Information */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-xs text-gray-500">
                        <svg
                          className="w-4 h-4 mr-2"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M18 3a1 1 0 00-1.196-.98L8.617 4.626a1 1 0 01-.78 0L-.196 2.02A1 1 0 00-1 3v11.114a1 1 0 001.196.98l8.187-2.606a1 1 0 01.78 0l8.187 2.606A1 1 0 0018 14.114V3z" />
                        </svg>
                        {truncateText(video.channelTitle, 25)}
                      </div>

                      <div className="flex items-center text-xs text-gray-500">
                        <svg
                          className="w-4 h-4 mr-2"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {formatTimeAgo(video.publishedAt)}
                      </div>
                    </div>

                    {/* Watch Button */}
                    <a
                      href={video.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition-colors duration-200 text-center text-sm font-medium flex items-center justify-center gap-2"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                      </svg>
                      Watch Video
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Explore;
