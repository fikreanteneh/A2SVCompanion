import { pushToHub } from "../a2sv/a2sv.api";
import { CodeforcesPushSubmission } from "./codeforces.types";

// const push = async (message: CodeforcesPushType) => {
//   try {
//     const tries = await getTries(
//       message.codeforcesHandle,
//       message.submissionId
//     );
//     const result = await pushToHub({
//       attempts: tries,
//       questionUrl: message.questionUrl,
//       code: message.code,
//       platform: "Codeforces",
//       timeTaken: message.timeTaken,
//       language: message.programmingLanguage,
//       submissionId: message.submissionId.toString(),
//     });
//     message.sendResponse({ status: result });
//   } catch (e) {
//     message.sendResponse({ status: e.message });
//   }
// };

const codeforcesHandler = async (
  message: CodeforcesPushSubmission,
  sender: chrome.runtime.MessageSender,
  sendResponse: (response?: any) => void
) => {
  try {
    const result = await pushToHub({
      attempts: message.tries,
      questionUrl: message.questionUrl,
      code: message.code,
      platform: "Codeforces",
      timeTaken: message.timeTaken,
      language: message.language,
      submissionId: message.submissionId.toString(),
      inContest: message.inContest,
    });
    sendResponse({ status: result });
  } catch (e) {
    sendResponse({ status: e.message });
  }

  // if (message.type === CodeforcesEvent.GET_LAST_SUBMISSION) {
  //   getLastSubmission(message.codeforcesHandle).then(
  //     (submission) => {
  //       sendResponse(submission);
  //     }
  //   );
  // } else if (message.type === CodeforcesEvent.PUSH_SUBMISSION_TO_SHEETS) {
  //   const data = message as CodeforcesPushSubmission;
  //   push({
  //     codeforcesHandle: data.codeforcesHandle,
  //     timeTaken: data.timeTaken,
  //     code: data.code,
  //     questionUrl: data.questionUrl,
  //     submissionId: data.submissioId,
  //     programmingLanguage: data.programmingLanguage,
  //     sendResponse,
  //   });
  // }
};

export default codeforcesHandler;
