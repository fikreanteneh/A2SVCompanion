import { CodeforcesEvent } from '../events';
import { CodeforcesSubmission } from '../lib/codeforce/types';
import CodeforccesAPI from '../lib/codeforce/api';
import { CodeforcesContentScript } from '../scripts';
import {
  getSubmissionAnchors,
  getSubmissionDetail,
  getUserHandle,
} from './codeforces/parseui';

const header = document.getElementById('header');
const pushBtn = document.createElement('button');

header.insertBefore(pushBtn, header.querySelector('.lang-chooser'));

pushBtn.style.position = 'absolute';
pushBtn.style.top = '50%';
pushBtn.style.right = '50%';
pushBtn.style.transform = 'translateX(60%)';

pushBtn.innerText = 'Push Last Submission';

pushBtn.addEventListener('click', async () => {
  chrome.runtime.sendMessage(
    {
      from: CodeforcesContentScript,
      type: CodeforcesEvent.GET_LAST_SUBMISSION,
      codeforcesHandle: getUserHandle(),
    },
    async (response: CodeforcesSubmission) => {
      const solutionAnchors = getSubmissionAnchors();
      const submissionAnchor = solutionAnchors.filter(
        (anchor) =>
          anchor.getAttribute('submissionid') === response.id.toString()
      )[0];
      submissionAnchor.click();
    }
  );
});

const hookSubmissionAnchors = () => {
  // get submission anchors to click on the one with the given submissionid
  const solutionAnchors = getSubmissionAnchors();

  for (let anchor of solutionAnchors) {
    anchor.addEventListener('click', async () => {
      const submissionId = anchor.getAttribute('submissionid');
      try {
        const { timeTaken, code, questionUrl } = await getSubmissionDetail(
          submissionId
        );

        const codeforceHandle = getUserHandle();

        const submission = await CodeforccesAPI.getSubmission(
          codeforceHandle,
          parseInt(submissionId)
        );

        chrome.runtime.sendMessage(
          {
            from: CodeforcesContentScript,
            type: CodeforcesEvent.PUSH_SUBMISSION_TO_SHEETS,
            codeforcesHandle: getUserHandle(),
            code,
            timeTaken,
            questionUrl,
            submission,
          },
          (success) => {
            if (success) {
              alert('Pushed to sheet!');
            } else {
              alert('Failed to push to sheet!');
            }

            (
              document.getElementsByClassName('close')[0] as HTMLAnchorElement
            ).click();
          }
        );
      } catch (e) {
        return;
      }
    });
  }
};

hookSubmissionAnchors();
