export type Verdict =
  | 'FAILED'
  | 'OK'
  | 'PARTIAL'
  | 'COMPILATION_ERROR'
  | 'RUNTIME_ERROR'
  | 'WRONG_ANSWER'
  | 'PRESENTATION_ERROR'
  | 'TIME_LIMIT_EXCEEDED'
  | 'MEMORY_LIMIT_EXCEEDED'
  | 'IDLENESS_LIMIT_EXCEEDED'
  | 'SECURITY_VIOLATED'
  | 'CRASHED'
  | 'INPUT_PREPARATION_CRASHED'
  | 'CHALLENGED'
  | 'SKIPPED'
  | 'TESTING'
  | 'REJECTED';

export interface Problem {
  contestId: number;
  problemsetName?: string;
  index: string;
  name: string;
  type: 'PROGRAMMING' | 'QUESTION';
  points?: number;
  rating?: number;
  tags: string[];
}

export interface Member {
  handle: string;
  name: string;
}

export interface Party {
  contestId: number;
  members: Member;
  participantType:
    | 'CONTESTANT'
    | 'PRACTICE'
    | 'VIRTUAL'
    | 'MANAGER'
    | 'OUT_OF_COMPETITION';
  teamId: number;
  teamName: string;
  ghost: boolean;
  room: number;
  startTimeSeconds: number;
}

export interface CodeforcesSubmission {
  id: number;
  contestId?: number;
  creationTimeSeconds: number;
  relativeTimeSeconds: number;
  problem: Problem;
  author: Party;
  programmingLanguage: string;
  verdict: Verdict;
  testset: string;
  passedTestCount: number;
  timeConsumedMillis: number;
  memoryConsumedBytes: number;
  points?: number;
}
