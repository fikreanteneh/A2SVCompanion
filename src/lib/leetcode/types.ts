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
