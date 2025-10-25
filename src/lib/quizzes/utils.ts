import { GenerationStatus } from "../types";
import { Question, Quiz, QuizPayload } from "./types";

const sumPoints = (questions: Question[]): number => {
  return questions.reduce((acc, question) => {
    const value = Number(question?.points);
    return acc + (Number.isFinite(value) ? value : 0);
  }, 0);
};

const toNullableNumber = (value: unknown): number | null => {
  if (value === undefined || value === null) return null;
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : null;
};

const extractQuestions = (payload: any): Question[] => {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload as Question[];
  if (Array.isArray(payload?.questions)) return payload.questions as Question[];
  if (Array.isArray(payload?.payload)) return payload.payload as Question[];
  return [];
};

export const normalizeQuizPayload = (
  rawPayload: any,
  context: {
    passingScore?: number | null;
    totalPoints?: number | null;
    durationMinutes?: number | null;
    title?: string | null;
    description?: string | null;
  } = {}
): QuizPayload => {
  const questions = extractQuestions(rawPayload);
  const base: Partial<QuizPayload> =
    rawPayload && !Array.isArray(rawPayload)
      ? (rawPayload as Partial<QuizPayload>)
      : {};

  const passingScore =
    toNullableNumber(
      (rawPayload && (rawPayload.passing_score ?? rawPayload.passingScore)) ??
        context.passingScore
    ) ?? null;

  const totalPoints =
    toNullableNumber(
      (rawPayload && (rawPayload.total_points ?? rawPayload.totalPoints)) ??
        context.totalPoints
    ) ?? (questions.length ? sumPoints(questions) : null);

  const duration =
    toNullableNumber(rawPayload?.duration ?? rawPayload?.durationMinutes) ??
    context.durationMinutes ??
    null;

  return {
    ...base,
    questions,
    passing_score: passingScore,
    total_points: totalPoints,
    duration,
    title:
      (rawPayload && (rawPayload.title as string | null)) ??
      context.title ??
      null,
    description:
      (rawPayload && (rawPayload.description as string | null)) ??
      context.description ??
      null,
  };
};

export const normalizeQuiz = (rawQuiz: any): Quiz => {
  if (!rawQuiz) {
    return {
      id: "",
      status: GenerationStatus.PENDING,
      payload: {
        questions: [],
        passing_score: null,
        total_points: null,
        duration: null,
        title: null,
        description: null,
      },
      latestAttempt: null,
    };
  }

  const attempts = Array.isArray(rawQuiz.attempts)
    ? rawQuiz.attempts
    : undefined;
  const latestAttempt =
    rawQuiz.latestAttempt ??
    (attempts && attempts.length ? attempts[attempts.length - 1] : null) ??
    null;

  const passingScoreCandidate =
    rawQuiz.passingScore ??
    rawQuiz.passing_score ??
    latestAttempt?.passingScore ??
    null;

  const totalPointsCandidate =
    rawQuiz.totalPoints ?? rawQuiz.total_points ?? latestAttempt?.scoreTotal;

  const payload = normalizeQuizPayload(rawQuiz.payload, {
    passingScore: passingScoreCandidate,
    totalPoints: totalPointsCandidate,
    durationMinutes:
      rawQuiz.durationMinutes ?? rawQuiz.duration_minutes ?? null,
    title: rawQuiz.title ?? null,
    description: rawQuiz.description ?? null,
  });

  const questionCount =
    rawQuiz.questionCount ??
    rawQuiz.question_count ??
    payload.questions.length ??
    null;

  const totalPoints =
    toNullableNumber(rawQuiz.totalPoints ?? rawQuiz.total_points) ??
    payload.total_points;

  const passingScore =
    toNullableNumber(rawQuiz.passingScore ?? rawQuiz.passing_score) ??
    payload.passing_score ??
    null;

  return {
    id: rawQuiz.id ?? "",
    workspaceId: rawQuiz.workspaceId ?? rawQuiz.workspace_id ?? null,
    videoId: rawQuiz.videoId ?? rawQuiz.video_id ?? null,
    userId: rawQuiz.userId ?? rawQuiz.user_id ?? null,
    status: rawQuiz.status ?? GenerationStatus.PENDING,
    title: rawQuiz.title ?? null,
    durationMinutes:
      toNullableNumber(
        rawQuiz.durationMinutes ?? rawQuiz.duration_minutes
      ) ?? payload.duration,
    passingScore,
    description: rawQuiz.description ?? null,
    questionCount,
    totalPoints,
    payload,
    latestAttempt,
    failureReason: rawQuiz.failureReason ?? rawQuiz.failure_reason ?? null,
    createdAt: rawQuiz.createdAt ?? rawQuiz.created_at ?? undefined,
    updatedAt: rawQuiz.updatedAt ?? rawQuiz.updated_at ?? undefined,
  };
};
