import { pushToHub } from "../a2sv/a2sv.api";
import {
  getLastAcceptedSubmissionId,
  getSubmissionDetails,
  getSubmissions,
  getTries,
} from "./leetcode.api";
import { LeetcodePushSubmission, LeetcodePushType } from "./leetcode.types";

const push = async (message: LeetcodePushType) => {
  try {
    let { submissionId, timeTaken, questionSlug } = message;
    let allSubmissions = await getSubmissions(questionSlug);
    if (allSubmissions.length === 0) {
      message.sendResponse({ status: "No submissions found" });
      return;
    }
    if (!submissionId) {
      submissionId = getLastAcceptedSubmissionId(allSubmissions);
    }
    const { question, lang, code, timestamp } = await getSubmissionDetails(
      submissionId
    );
    const tries = getTries(allSubmissions);
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
  push({
    timeTaken: message.timeTaken,
    submissionId: message.submissionId,
    questionSlug: message.questionSlug,
    sendResponse: sendResponse,
  });
};

export default leetcodeHandler;
