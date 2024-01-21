import { CodeforcesEvent } from '../events';
import Codeforces from '../lib/codeforce/api';
import A2SV from '../lib/a2sv/';
import { CodeforcesSubmission } from '../lib/codeforce/types';
import { upload } from '../lib/github';
import { getCodeforcesLangExtenson } from '../utils/lang';

const push = async (
  codeforcesHandle: string,
  submission: CodeforcesSubmission,
  timeTaken: number,
  code: string,
  questionUrl: string,
  onSuccess: () => void,
  onFailure: () => void
) => {
  chrome.storage.local
    .get(['selectedRepo', 'folderPath', 'studentName'])
    .then((result) => {
      const { selectedRepo, folderPath, studentName } = result;

      const commitMsg = `Add solution for ${submission.problem.name}`;

      let path = '';
      if (folderPath) {
        if (folderPath[folderPath.length - 1] != '/') {
          path = folderPath + '/';
        }
      }

      let filename = `${submission.problem.contestId}${
        submission.problem.index
      } ${submission.problem.name.replace(
        ' ',
        '-'
      )}.${getCodeforcesLangExtenson(submission.programmingLanguage)}`;
      path += 'codeforces/' + filename;

      upload(selectedRepo, path, code, commitMsg).then((gitUrl) => {
        Codeforces.getTries(codeforcesHandle, submission.id)
          .then((tries) => {
            A2SV.pushToSheet(
              studentName,
              tries,
              timeTaken,
              questionUrl,
              'Codeforces',
              gitUrl
            );
          })
          .then(onSuccess)
          .catch((e) => onFailure());
      });
    });
};

const codeforcesHandler = (
  message: any,
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
    push(
      message.codeforcesHandle,
      message.submission,
      message.timeTaken,
      message.code,
      message.questionUrl,
      () => sendResponse(true),
      () => sendResponse(false)
    );
  }
};

export default codeforcesHandler;
