import { CodeforcesSubmission } from "./codeforces.types";

export const getSubmissions = async (codeforcesHandle: string) => {
  const response = await fetch(
    `https://codeforces.com/api/user.status?handle=${codeforcesHandle}&from=1&count=50`
  );
  if (response.status == 200) {
    const submissions = (await response.json())
      .result as CodeforcesSubmission[];
    return submissions;
  }
  return [];
};

export const getLastSubmission = async (
  codeforcesHandle: string
): Promise<CodeforcesSubmission | null> => {
  
  const submissions = await getSubmissions(codeforcesHandle);

  for (const submission of submissions) {
    if (submission.verdict === "OK") {
      return submission;
    }
  }
  return null;
};

export const getSubmission = async (
  codeforcesHandle: string,
  submissionId: number
) => {
  const submissions = await getSubmissions(codeforcesHandle);
  for (let submission of submissions) {
    if (submission.id === submissionId) {
      return submission;
    }
  }
  return null;
};

export const getTries = async (codeforcesHandle: string, submissionId: number) => {
  const submissions = await getSubmissions(codeforcesHandle);

  let contestId, problemIndex, creationTimeSeconds;

  for (let submission of submissions) {
    if (submission.id === submissionId) {
      contestId = submission.problem.contestId;
      problemIndex = submission.problem.index;
      creationTimeSeconds = submission.creationTimeSeconds;
      break;
    }
  }
  let tries = 1;
  for (let submission of submissions) {
    if (
      submission.problem.contestId === contestId &&
      submission.problem.index === problemIndex &&
      submission.verdict !== "OK" &&
      submission.creationTimeSeconds < creationTimeSeconds
    ) {
      tries++;
    }
  }

  return tries;
};

