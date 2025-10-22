import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Youtube, Plus, ListPlus, FolderMinus } from "lucide-react";

type VideoItem = {
  id: string;
  title: string;
  channelTitle: string;
  description: string;
  thumbnail: string;
  publishedAt: string;
};

type Playlist = {
  id: string;
  name: string;
  videos: VideoItem[];
  createdAt: number;
};

const STORAGE_KEY = "discover.playlists";

const DiscoverPage = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === "rtl";

  const [query, setQuery] = useState("learning technology");
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [activePlaylistId, setActivePlaylistId] = useState<string | null>(null);

  const apiKey = useMemo(
    () => import.meta.env.VITE_YOUTUBE_API_KEY as string | undefined,
    []
  );

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as Playlist[];
        setPlaylists(parsed);
        if (parsed.length > 0) {
          setActivePlaylistId(parsed[0].id);
        }
      }
    } catch {
      setPlaylists([]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(playlists));
  }, [playlists]);

  const mapItemToVideo = (item: any): VideoItem => ({
    id: item.id.videoId ?? item.id.channelId ?? item.id.playlistId ?? item.id,
    title: item.snippet.title,
    channelTitle: item.snippet.channelTitle,
    description: item.snippet.description,
    thumbnail:
      item.snippet.thumbnails?.medium?.url ||
      item.snippet.thumbnails?.high?.url ||
      item.snippet.thumbnails?.default?.url ||
      "",
    publishedAt: item.snippet.publishedAt,
  });

  const fetchVideos = useCallback(
    async (searchTerm: string) => {
      if (!apiKey) {
        setError(t("discover.errors.missingKey"));
        return;
      }

      const trimmed = searchTerm.trim();
      if (!trimmed) {
        setError(t("discover.errors.emptyQuery"));
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams({
          part: "snippet",
          type: "video",
          maxResults: "12",
          q: trimmed,
          key: apiKey,
        });
        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/search?${params.toString()}`
        );
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        const data = await response.json();
        const mapped =
          data.items?.map((item: any) => mapItemToVideo(item)) ?? [];
        setVideos(mapped);
        if (mapped.length === 0) {
          setError(t("discover.errors.noResults"));
        }
      } catch (err: any) {
        setError(
          err?.message
            ? t("discover.errors.requestFailedWith", {
                message: err.message,
              })
            : t("discover.errors.generic")
        );
      } finally {
        setLoading(false);
      }
    },
    [apiKey, t]
  );

  useEffect(() => {
    fetchVideos(query);
  }, [fetchVideos]);

  const handleCreatePlaylist = () => {
    const name = newPlaylistName.trim();
    if (!name) {
      toast.error(t("discover.playlists.validation"));
      return;
    }
    const newPlaylist: Playlist = {
      id: `${Date.now()}`,
      name,
      videos: [],
      createdAt: Date.now(),
    };
    setPlaylists((prev) => [...prev, newPlaylist]);
    setNewPlaylistName("");
    setActivePlaylistId(newPlaylist.id);
    toast.success(t("discover.playlists.created", { name }));
  };

  const handleAddVideoToPlaylist = (video: VideoItem) => {
    if (!activePlaylistId) {
      toast.error(t("discover.playlists.selectFirst"));
      return;
    }
    setPlaylists((prev) =>
      prev.map((playlist) => {
        if (playlist.id !== activePlaylistId) return playlist;
        const exists = playlist.videos.some((item) => item.id === video.id);
        if (exists) {
          toast.info(t("discover.playlists.videoExists"));
          return playlist;
        }
        const updated = {
          ...playlist,
          videos: [{ ...video }, ...playlist.videos],
        };
        toast.success(
          t("discover.playlists.addedTo", {
            title: video.title,
            playlist: playlist.name,
          })
        );
        return updated;
      })
    );
  };

  const handleRemoveVideo = (playlistId: string, videoId: string) => {
    setPlaylists((prev) =>
      prev.map((playlist) =>
        playlist.id === playlistId
          ? {
              ...playlist,
              videos: playlist.videos.filter((video) => video.id !== videoId),
            }
          : playlist
      )
    );
  };

  const handleDeletePlaylist = (playlistId: string) => {
    setPlaylists((prev) =>
      prev.filter((playlist) => playlist.id !== playlistId)
    );
    if (activePlaylistId === playlistId) {
      setActivePlaylistId(() => {
        const next = playlists.find((playlist) => playlist.id !== playlistId);
        return next?.id ?? null;
      });
    }
  };

  return (
    <section
      dir={isRTL ? "rtl" : "ltr"}
      className="p-6 md:p-8 lg:p-10 space-y-8"
    >
      <header className="space-y-2">
        <div className="flex items-center gap-3 text-zinc-900 dark:text-zinc-100">
          <Youtube className="w-6 h-6 text-red-500" />
          <h1 className="text-2xl md:text-3xl font-semibold">
            {t("discover.title")}
          </h1>
        </div>
        <p className="text-sm md:text-base text-zinc-600 dark:text-zinc-400 max-w-3xl">
          {t("discover.subtitle")}
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-[360px,1fr] xl:grid-cols-[380px,1fr]">
        <Card className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950/60 shadow-sm dark:shadow-none backdrop-blur-sm">
          <CardContent className="p-5 space-y-6">
            <div className="space-y-2">
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                {t("discover.playlists.title")}
              </h2>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                {t("discover.playlists.description")}
              </p>
            </div>

            <div className="space-y-3">
              <Label
                htmlFor="playlist-name"
                className="text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400"
              >
                {t("discover.playlists.nameLabel")}
              </Label>
              <div className="flex gap-2">
                <Input
                  id="playlist-name"
                  value={newPlaylistName}
                  onChange={(event) => setNewPlaylistName(event.target.value)}
                  placeholder={t("discover.playlists.placeholder")}
                  className="flex-1 bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100"
                />
                <Button
                  onClick={handleCreatePlaylist}
                  variant="default"
                  className="inline-flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" />
                  {t("discover.actions.create")}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="active-playlist"
                className="text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400"
              >
                {t("discover.playlists.activeLabel")}
              </Label>
              <select
                id="active-playlist"
                value={activePlaylistId ?? ""}
                onChange={(event) =>
                  setActivePlaylistId(event.target.value || null)
                }
                className="w-full rounded-md border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 text-sm py-2 px-3 text-zinc-800 dark:text-zinc-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 dark:focus-visible:ring-zinc-600"
              >
                <option value="">
                  {t("discover.playlists.choosePlaceholder")}
                </option>
                {playlists.map((playlist) => (
                  <option key={playlist.id} value={playlist.id}>
                    {playlist.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-2">
                <ListPlus className="w-4 h-4 text-emerald-500" />
                {t("discover.playlists.currentTitle")}
              </h3>

              {playlists.length === 0 ? (
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  {t("discover.playlists.empty")}
                </p>
              ) : (
                <div className="space-y-4 max-h-[380px] overflow-y-auto pr-1">
                  {playlists
                    .slice()
                    .sort((a, b) => b.createdAt - a.createdAt)
                    .map((playlist) => (
                      <Card
                        key={playlist.id}
                        className={`border ${
                          playlist.id === activePlaylistId
                            ? "border-emerald-400 dark:border-emerald-500/70"
                            : "border-zinc-200 dark:border-zinc-800"
                        } bg-zinc-50 dark:bg-zinc-900/60 shadow-none`}
                      >
                        <CardContent className="p-4 space-y-3">
                          <div className="flex items-center justify-between gap-3">
                            <div>
                              <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                                {playlist.name}
                              </p>
                              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                                {t("discover.playlists.count", {
                                  count: playlist.videos.length,
                                })}
                              </p>
                            </div>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="text-zinc-500 hover:text-red-500 dark:text-zinc-400"
                              onClick={() => handleDeletePlaylist(playlist.id)}
                            >
                              <FolderMinus className="w-4 h-4" />
                            </Button>
                          </div>
                          {playlist.videos.length > 0 && (
                            <div className="space-y-2">
                              {playlist.videos.slice(0, 4).map((video) => (
                                <div
                                  key={video.id}
                                  className="flex items-center gap-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-950/60 p-2"
                                >
                                  <img
                                    src={video.thumbnail}
                                    alt={video.title}
                                    className="w-12 h-12 rounded-md object-cover"
                                  />
                                  <div className="min-w-0 flex-1">
                                    <p className="text-xs font-medium text-zinc-800 dark:text-zinc-200 truncate">
                                      {video.title}
                                    </p>
                                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate">
                                      {video.channelTitle}
                                    </p>
                                  </div>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="text-xs text-red-500 hover:text-red-600"
                                    onClick={() =>
                                      handleRemoveVideo(playlist.id, video.id)
                                    }
                                  >
                                    {t("discover.actions.remove")}
                                  </Button>
                                </div>
                              ))}
                              {playlist.videos.length > 4 && (
                                <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                                  {t("discover.playlists.moreCount", {
                                    count: playlist.videos.length - 4,
                                  })}
                                </p>
                              )}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950/60 shadow-sm dark:shadow-none backdrop-blur-sm">
            <CardContent className="p-5 space-y-4">
              <div className="space-y-2">
                <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                  {t("discover.explore.title")}
                </h2>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  {t("discover.explore.description")}
                </p>
              </div>
              <div className="flex flex-col gap-3 md:flex-row">
                <Input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      fetchVideos(query);
                    }
                  }}
                  placeholder={t("discover.explore.placeholder")}
                  className="flex-1 bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100"
                />
                <Button
                  onClick={() => fetchVideos(query)}
                  disabled={loading}
                  className="whitespace-nowrap"
                >
                  {loading
                    ? t("discover.actions.searching")
                    : t("discover.actions.search")}
                </Button>
              </div>
              {error && (
                <p className="text-sm text-red-500 dark:text-red-400">
                  {error}
                </p>
              )}
            </CardContent>
          </Card>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {loading
              ? Array.from({ length: 6 }).map((_, index) => (
                  <Card
                    key={`skeleton-${index}`}
                    className="border border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/60 shadow-sm dark:shadow-none"
                  >
                    <div className="w-full h-44 bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
                    <CardContent className="p-4 space-y-3">
                      <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded-md animate-pulse" />
                      <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded-md animate-pulse w-1/2" />
                      <div className="h-9 bg-zinc-200 dark:bg-zinc-800 rounded-md animate-pulse" />
                    </CardContent>
                  </Card>
                ))
              : videos.map((video) => (
                  <Card
                    key={video.id}
                    className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950/60 shadow-sm dark:shadow-none hover:shadow-lg dark:hover:shadow-zinc-900/40 transition-all duration-200 flex flex-col"
                  >
                    <div className="relative w-full h-44 overflow-hidden">
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    </div>
                    <CardContent className="p-4 space-y-3 flex flex-col flex-1">
                      <div className="space-y-1">
                        <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-100 line-clamp-2">
                          {video.title}
                        </h3>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">
                          {video.channelTitle}
                        </p>
                      </div>
                      <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-3">
                        {video.description}
                      </p>
                      <div className="flex items-center justify-between mt-auto pt-2">
                        <span className="text-[11px] text-zinc-500 dark:text-zinc-400">
                          {new Date(video.publishedAt).toLocaleDateString(
                            i18n.language
                          )}
                        </span>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleAddVideoToPlaylist(video)}
                        >
                          {t("discover.actions.addToPlaylist")}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default DiscoverPage;
