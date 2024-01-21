import { LeetcodeEvent } from '../events';
import a2sv from '../lib/a2sv';
import { upload } from '../lib/github';
import Leetcode from '../lib/leetcode/api';
import { getLeetcodeLangExtension } from '../utils/lang';

const push = async (message: any, sendResponse: (response?: any) => void) => {
  try {
    const { submissionId, timeTaken, repo, studentName } = message;
    const { question, lang, code, timestamp } =
      await Leetcode.getSubmissionDetails(submissionId);

    const tries = await Leetcode.getTries(question.titleSlug);

    const ext = getLeetcodeLangExtension(lang.name);

    const folderPath =
      message.folderPath[message.folderPath.length - 1] == '/'
        ? message.folderPath
        : `${message.folderPath}/`;
    const fileRelativePath = `${folderPath}leetcode/${question.titleSlug}.${ext}`;

    upload(
      repo,
      fileRelativePath,
      code,
      `Add solution for ${question.title}`
    ).then((gitUrl) => {
      a2sv.pushToSheet(
        studentName,
        tries,
        timeTaken,
        'https://leetcode.com/problems/' + question.titleSlug + '/',
        'LeetCode',
        gitUrl
      );
    });

    sendResponse({ status: 'success' });
  } catch (e) {
    sendResponse({ error: e.message });
    return;
  }
};

const leetcodeHandler = (
  message: any,
  sender: chrome.runtime.MessageSender,
  sendResponse: (response?: any) => void
) => {
  if (message.type === LeetcodeEvent.PUSH_TO_SHEETS) {
    push(message, sendResponse);
  } else if (message.type === LeetcodeEvent.PUSH_LAST_SUBMISSION_TO_SHEETS) {
    const { questionSlug, timeTaken } = message;
    chrome.storage.local
      .get(['selectedRepo', 'folderPath', 'studentName'])
      .then((storage) => {
        Leetcode.getLastAcceptedSubmissionId(questionSlug).then(
          (submissionId): void => {
            push(
              {
                submissionId,
                timeTaken,
                repo: storage.selectedRepo,
                folderPath: storage.folderPath,
                studentName: storage.studentName,
              },
              sendResponse
            );
          }
        );
      });
  }
};

export default leetcodeHandler;
