import {
  getLastAcceptedSubmissionId,
  getSubmissionDetails,
  getSubmissions,
  getTries,
} from "../leetcode.api";

export const getLeetcodeVersion = () => {
  if (document.getElementById("__next")) return "NEW";
  return "OLD";
};

export const removeContent = (
  observer: MutationObserver,
  observe: () => void
) => {
  observer.disconnect();
  document.getElementById("push-to-sheets-btn")?.remove();
  document.getElementById("time-taken-field")?.remove();
  observe();
};

export const parseSubmission = async (
  questionSlug: string,
  submissionId: number | null = null
): Promise<null | { tries: number; code: string; language: string, submissionId: string }> => {
  let allSubmissions = await getSubmissions(questionSlug);
  if (allSubmissions.length === 0) {
    return null;
  }
  if (!submissionId) {
    submissionId = getLastAcceptedSubmissionId(allSubmissions);
  }
  const { question, lang, code, timestamp } = await getSubmissionDetails(
    submissionId
  );
  const tries = getTries(allSubmissions);
  return { tries, code, language: lang.name, submissionId: `${submissionId}` };
};
