import { pushToHub } from "../a2sv/a2sv.api";
import { LeetcodePushSubmission } from "./leetcode.types";

// const push = async (message: LeetcodePushType) => {
//   try {
//     let { submissionId, timeTaken, questionSlug, tries, code, language } =
//       message;
//     // let allSubmissions = await getSubmissions(questionSlug);
//     // if (allSubmissions.length === 0) {
//     //   message.sendResponse({ status: "No submissions found" });
//     //   return;
//     // }
//     // if (!submissionId) {
//     //   submissionId = getLastAcceptedSubmissionId(allSubmissions);
//     // }
//     // const { question, lang, code, timestamp } = await getSubmissionDetails(
//     //   submissionId
//     // );
//     // const tries = getTries(allSubmissions);
//     const result = await pushToHub({
//       timeTaken: timeTaken,
//       attempts: tries,
//       questionUrl: "https://leetcode.com/problems/" + questionSlug + "/",
//       platform: "LeetCode",
//       code: code,
//       language: language,
//       inContest: message.inContest,
//       submissionId: submissionId.toString(),
//     });
//     message.sendResponse({ status: result });
//   } catch (e) {
//     message.sendResponse({ status: e.message });
//   }
// };

const leetcodeHandler = async (
  message: LeetcodePushSubmission,
  sender: chrome.runtime.MessageSender,
  sendResponse: (response?: any) => void
) => {
  try {
    const result = await pushToHub({
      timeTaken: message.timeTaken,
      attempts: message.tries,
      questionUrl:
        "https://leetcode.com/problems/" + message.questionSlug + "/",
      platform: "LeetCode",
      code: message.code,
      language: message.language,
      inContest: message.inContest,
      submissionId: message.submissionId.toString(),
    });
    sendResponse({ status: result });
  } catch (e) {
    sendResponse({ status: e.message });
  }

  // push({
  //   timeTaken: message.timeTaken,
  //   tries: message.tries,
  //   code: message.code,
  //   language: message.language,
  //   submissionId: message.submissionId,
  //   questionSlug: message.questionSlug,
  //   inContest: message.inContest,
  //   sendResponse: sendResponse
  // });
};

export default leetcodeHandler;
