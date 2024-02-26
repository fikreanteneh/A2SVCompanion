import { pushToHub } from "../a2sv/a2sv.api";
import { getLastSubmission, getTries } from "./codeforces.api";
import { CodeforcesEvent } from "./codeforces.message";
import {
  CodeforcesPushLastSubmission,
  CodeforcesPushSubmission,
  CodeforcesPushType,
} from "./codeforces.types";

const push = async (message: CodeforcesPushType) => {
  try {
    const tries = await getTries(
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
      submissionId: message.submissionId.toString(),
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
    getLastSubmission(message.codeforcesHandle).then(
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
