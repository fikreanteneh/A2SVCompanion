import { pushToHub } from "../a2sv/a2sv.api";
import { getTries, getLastAcceptedSubmissionId, getSubmissionDetails } from "./leetcode.api";
import { LeetcodeEvent } from "./leetcode.message";
import { LeetcodePushSubmission, LeetcodePushType } from "./leetcode.types";

const push = async (message: LeetcodePushType) => {
  try {
    const { submissionId, timeTaken } = message;
    const { question, lang, code, timestamp } =
      await getSubmissionDetails(submissionId);
    const tries = await getTries(question.titleSlug);
    const result = await pushToHub({
      timeTaken: timeTaken,
      attempts: tries,
      questionUrl: "https://leetcode.com/problems/" + question.titleSlug + "/",
      platform: "LeetCode",
      code: code,
      language: lang.name,
      submissionId: submissionId.toString(),
    });
    message.sendResponse({ status: result });
  } catch (e) {
    message.sendResponse({ status: e.message });
  }
};

const leetcodeHandler = async (
  message: LeetcodePushSubmission,
  sender: chrome.runtime.MessageSender,
  sendResponse: (response?: any) => void
) => {
    if (message.type === LeetcodeEvent.PUSH_LAST_SUBMISSION_TO_SHEETS) {
        const submissionId = await getLastAcceptedSubmissionId(
            message.questionSlug
        );
        message.submissionId = submissionId;
    }
    push({
        timeTaken: message.timeTaken,
        submissionId: message.submissionId,
        sendResponse: sendResponse,
    });
};

export default leetcodeHandler;


