export interface LeetcodeSubmissionStatus {
  id: string;
  status: string;
  timestamp: string;
  statusDisplay: string;
}

export interface LeecodeSubmissionDetail {
  question: { titleSlug: string; title: string };
  lang: { name: string };
  code: string;
  timestamp: string;
}

export interface LeetcodePushSubmission {
  from: string;
  type: string;
  timeTaken: number;
  submissionId: number | null;
  questionSlug: string;
  inContest: boolean;
  language: string;
  tries: number;
  code: string;
}

// export type LeetcodePushType = {
//   timeTaken: number;
//   submissionId: number | null;
//   questionSlug: string;
//   inContest: boolean;
//   language: string;
//   tries: number;
//   code: string;
//   sendResponse: (response?: any) => void;
// };
