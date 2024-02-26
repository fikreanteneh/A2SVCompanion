import pushToHub from "../lib/a2sv/pushToHub";
import Codeforces from "../lib/codeforce/api";
import { CodeforcesEvent } from "../types/events";
import {
  CodeforcesPushLastSubmission,
  CodeforcesPushSubmission,
  PushToCodeforcesType,
} from "../types/submissions";

const push = async (message: PushToCodeforcesType) => {
  try {
    const tries = await Codeforces.getTries(
      message.codeforcesHandle,
      message.submissionId
    );
    const result = await pushToHub({
      attempts: tries,
      questionUrl: message.questionUrl,
      code: message.code,
      platform: "Codeforces",
      timeTaken: message.timeTaken,
      language: message.programmingLanguage,
    });
    message.sendResponse({ status: result });
  } catch (e) {
    message.sendResponse({ status: e.message });
  }
};

const codeforcesHandler = (
  message: CodeforcesPushLastSubmission | CodeforcesPushSubmission,
  sender: chrome.runtime.MessageSender,
  sendResponse: (response?: any) => void
) => {
  if (message.type === CodeforcesEvent.GET_LAST_SUBMISSION) {
    Codeforces.getLastSubmission(message.codeforcesHandle).then(
      (submission) => {
        sendResponse(submission);
      }
    );
  } else if (message.type === CodeforcesEvent.PUSH_SUBMISSION_TO_SHEETS) {
    const data = message as CodeforcesPushSubmission;
    push({
      codeforcesHandle: data.codeforcesHandle,
      timeTaken: data.timeTaken,
      code: data.code,
      questionUrl: data.questionUrl,
      submissionId: data.submissioId,
      programmingLanguage: data.programmingLanguage,
      sendResponse,
    });
  }
};

export default codeforcesHandler;
