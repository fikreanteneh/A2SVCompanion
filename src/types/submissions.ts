export interface Messaging {
  from: string;
  type: string;
}

export interface LeetcodePushSubmission extends Messaging {
  timeTaken: number;
  questionSlug: string;
  submissionId: number | null;
}

export interface CodeforcesPushLastSubmission extends Messaging {
  codeforcesHandle: string;
}

export interface CodeforcesPushSubmission extends CodeforcesPushLastSubmission {
  code: string;
  timeTaken: number;
  questionUrl: string;
  // submission: CodeforcesSubmission;
  submissioId: number;
  programmingLanguage: string;
}

export type LeetcodePushType = {
  submissionId: number;
  timeTaken: number;
  // repo: string;
  // folderPath: string;
  // studentName: string;
  sendResponse: (response?: any) => void;
};

export type PushToHubType = {
  // studentName: string,
  attempts: number;
  timeTaken: number;
  questionUrl: string;
platform: string;
  // gitUrl: string,
  code: string;
  language: string;
  submissionId: string;
};

export type PushToCodeforcesType = {
  codeforcesHandle: string;
  // submission: CodeforcesSubmission;
  timeTaken: number;
  code: string;
  questionUrl: string;
  submissionId: number;
  programmingLanguage: string;
  sendResponse: (response?: any) => void;
};
