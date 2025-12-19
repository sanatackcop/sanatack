import { useTranslation } from "react-i18next";
import Recent from "@/pages/dashboard/workspaces/Recent";
import Spaces from "@/pages/dashboard/spaces/Index";
import { useEffect, useMemo, useState } from "react";
import { getLearningHabitsApi } from "@/utils/_apis/dashboard-api";
import {
  LearningHabitKey,
  LearningHabitProgress,
  LearningHabitTask,
} from "@/types/dashboard";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getStreakReportApi } from "@/utils/_apis/dashboard-api";
import { CoursesReport } from "@/types/courses";
import { useUserContext } from "@/context/UserContext";

export default function LearningDashboard() {
  const { i18n, t } = useTranslation();
  const isRTL = i18n.language === "ar";
  const [refresh, setRefresh] = useState(false);
  const [habits, setHabits] = useState<LearningHabitProgress | null>(null);
  const [habitsLoading, setHabitsLoading] = useState(true);
  const [habitsError, setHabitsError] = useState<string | null>(null);
  const [report, setReport] = useState<CoursesReport | null>(null);
  const [reportLoading, setReportLoading] = useState(true);
  const [reportError, setReportError] = useState<string | null>(null);

  const taskLabels: Record<LearningHabitKey, string> = useMemo(
    () => ({
      create_three_workspaces: t(
        "dashboard.habits.createWorkspaces",
        "Create your first 3 workspaces"
      ),
      create_three_spaces: t(
        "dashboard.habits.createSpaces",
        "Create 3 spaces and organize your workspaces"
      ),
      create_three_quizzes_flashcards: t(
        "dashboard.habits.createQuizzes",
        "Create 3 quizzes and flashcards"
      ),
      upload_one_document: t(
        "dashboard.habits.uploadDocument",
        "Upload 1 document"
      ),
    }),
    [t]
  );

  const fetchHabits = async () => {
    try {
      setHabitsLoading(true);
      setHabitsError(null);
      const data = await getLearningHabitsApi();
      setHabits(data);
    } catch (error) {
      console.error("Failed to load learning habits", error);
      setHabitsError(
        t("dashboard.habits.error", "We couldn't load your learning checklist.")
      );
    } finally {
      setHabitsLoading(false);
    }
  };

  const fetchReport = async () => {
    try {
      setReportLoading(true);
      setReportError(null);
      const data = await getStreakReportApi();
      setReport(data);
    } catch (error) {
      console.error("Failed to load streak report", error);
      setReportError(
        t("dashboard.streak.error", "We couldn't load your streak.")
      );
    } finally {
      setReportLoading(false);
    }
  };

  useEffect(() => {
    fetchHabits();
    fetchReport();
  }, []);

  const placeholderTasks: LearningHabitTask[] = useMemo(
    () => [
      {
        key: "create_three_workspaces",
        completed: false,
        current: 0,
        target: 3,
      },
      {
        key: "create_three_spaces",
        completed: false,
        current: 0,
        target: 3,
      },
      {
        key: "create_three_quizzes_flashcards",
        completed: false,
        current: 0,
        target: 3,
      },
      {
        key: "upload_one_document",
        completed: false,
        current: 0,
        target: 1,
      },
    ],
    []
  );

  const { auth } = useUserContext();

  return (
    <>
      <section className="p-5 px-6 sm:px-10 md:px-16 lg:px-28">
        <h2
          className={`text-2xl font-medium text-zinc-900 dark:text-zinc-100 mb-5`}
        >
          {t("welcome")} {auth.user.firstName}!
        </h2>

        <div className="mb-10 grid gap-6 xl:grid-cols-[1.4fr,1fr]">
          <div
            className={`flex flex-col gap-4 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 `}
          >
            <div className="flex-1 space-y-4">
              <div className={`flex items-start justify-between gap-3`}>
                <div className="space-y-1">
                  <p className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
                    {t(
                      "dashboard.habits.title",
                      "Take your first steps to building a learning habit."
                    )}
                  </p>
                  <p className="text-sm text-zinc-500">
                    {habits
                      ? t("dashboard.habits.progress", {
                          completed: habits.completedCount,
                          total: habits.totalCount,
                        })
                      : null}
                  </p>
                </div>
              </div>

              {habitsLoading ? (
                <div className="space-y-2">
                  {[1, 2, 3, 4].map((item) => (
                    <div
                      key={item}
                      className="h-4 rounded bg-zinc-200 dark:bg-zinc-800 animate-pulse"
                    />
                  ))}
                </div>
              ) : habitsError ? (
                <div
                  className={`flex items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800 dark:border-red-800/50 dark:bg-red-900/40 dark:text-red-100`}
                >
                  <span>{habitsError}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={fetchHabits}
                    className="shrink-0"
                  >
                    {t("dashboard.habits.retry", "Retry")}
                  </Button>
                </div>
              ) : (
                <ul className="space-y-2">
                  {(habits?.tasks || placeholderTasks).map((task) => (
                    <li
                      key={task.key}
                      className={`flex items-center justify-between rounded-xl bg-zinc-50 px-3 py-2 text-sm dark:bg-zinc-800/80`}
                    >
                      <div className="flex items-center gap-2 text-zinc-800 dark:text-zinc-100">
                        <span>{taskLabels[task.key]}</span>
                        {!task.completed && task.target > 1 ? (
                          <span className="text-xs text-zinc-500">
                            ({Math.min(task.current, task.target)}/{task.target}
                            )
                          </span>
                        ) : null}
                      </div>
                      <div
                        className={`flex h-7 w-7 items-center justify-center rounded-full border text-[11px] font-semibold ${
                          task.completed
                            ? "border-emerald-500 bg-emerald-500 text-white"
                            : "border-zinc-300 bg-white text-zinc-500 dark:border-zinc-700 dark:bg-zinc-900"
                        }`}
                      >
                        {task.completed ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <span>
                            {Math.min(task.current, task.target)}/{task.target}
                          </span>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          <div className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-gradient-to-br from-emerald-500 via-emerald-600 to-emerald-700 p-6 text-white shadow-lg dark:border-emerald-800/60">
            <div className="absolute right-6 top-6 h-20 w-20 rounded-full bg-white/10 blur-2xl" />
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium uppercase tracking-widest text-white/80">
                  {t("dashboard.streak.title", "Current streak")}
                </p>
                <p className="text-lg font-semibold">
                  {t("dashboard.streak.subtitle", "Keep the momentum going")}
                </p>
              </div>
            </div>

            {reportLoading ? (
              <div className="mt-6 space-y-3">
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="h-3 rounded bg-white/20 animate-pulse"
                  />
                ))}
                <div className="h-10 rounded-lg bg-white/15 animate-pulse" />
              </div>
            ) : reportError ? (
              <div className="mt-6 flex items-center justify-between gap-3 rounded-xl bg-white/10 px-3 py-2 text-sm">
                <span>{reportError}</span>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={fetchReport}
                  className="bg-white text-emerald-700 hover:bg-white/90"
                >
                  {t("dashboard.streak.retry", "Retry")}
                </Button>
              </div>
            ) : (
              <>
                <div className="mt-6 flex items-center justify-between rounded-2xl bg-white/10 px-4 py-3">
                  <div className="flex items-baseline gap-2">
                    <div className="text-5xl font-bold leading-none">
                      {report?.streakDays ?? 0}
                    </div>
                    <span className="text-sm text-white/80">
                      {t("dashboard.streak.daysLabel", "day streak")}
                    </span>
                  </div>
                  <div className="text-xs text-white/80">
                    {t(
                      "dashboard.streak.keepGoing",
                      "Complete something today to extend it."
                    )}
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-1">
                  {/* <MetricTile
                    label={t("dashboard.streak.hours", "Hours learned")}
                    value={report?.totalHours ?? 0}
                    helper={t(
                      "dashboard.streak.hoursHelper",
                      "Across all activity"
                    )}
                  /> */}
                  <MetricTile
                    label={t(
                      "dashboard.streak.totalWorkspaces",
                      "Total workspaces"
                    )}
                    value={report?.totalWorkspaces ?? 0}
                    helper={t(
                      "dashboard.streak.totalWorkspacesHelper",
                      "Created so far"
                    )}
                  />
                  {/* <MetricTile
                    label={t(
                      "dashboard.streak.totalMaterials",
                      "Materials generated"
                    )}
                    value={report?.totalMaterials ?? 0}
                    helper={t(
                      "dashboard.streak.totalMaterialsHelper",
                      "Quizzes, cards, summaries"
                    )}
                  /> */}
                </div>
              </>
            )}
          </div>
        </div>

        <header className="mb-2">
          <h2
            className={`text-2xl font-medium  text-zinc-900 dark:text-zinc-100 mb-5 ${
              isRTL ? "text-right" : "text-left"
            }`}
          >
            {t("common.workspaceTitle")}
          </h2>
        </header>
        <Recent setParentRefresh={setRefresh} refreshParent={refresh} />
        <Spaces setParentRefresh={setRefresh} refreshParent={refresh} />
      </section>
    </>
  );
}

function MetricTile({
  label,
  value,
  helper,
}: {
  label: string;
  value: number;
  helper: string;
}) {
  return (
    <div className="rounded-2xl bg-white/12 px-4 py-3 backdrop-blur-sm">
      <div className="text-3xl font-bold">{value}</div>
      <div className="text-sm font-semibold text-white/90">{label}</div>
      <div className="text-xs text-white/70">{helper}</div>
    </div>
  );
}
