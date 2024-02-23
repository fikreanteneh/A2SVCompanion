import pushToHub from "../lib/a2sv/pushToHub";
import Leetcode from "../lib/leetcode/api";
import { LeetcodeEvent } from "../types/events";
import { LeetcodePushSubmission, LeetcodePushType } from "../types/submissions";
// import { getLeetcodeLangExtension } from "../utils/lang";

const push = async (message: LeetcodePushType) => {
  try {
    const { submissionId, timeTaken } = message;
    const { question, lang, code, timestamp } =
      await Leetcode.getSubmissionDetails(submissionId);
    const tries = await Leetcode.getTries(question.titleSlug);
    // const ext = getLeetcodeLangExtension(lang.name);
    const result = await pushToHub({
      timeTaken: timeTaken,
      attempts: tries,
      questionUrl: "https://leetcode.com/problems/" + question.titleSlug + "/",
      platform: "LeetCode",
      code: code,
      language: lang.name,
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
    const submissionId = await Leetcode.getLastAcceptedSubmissionId(
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
