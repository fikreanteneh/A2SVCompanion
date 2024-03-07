import { LeetcodeContentScript, LeetcodeEvent } from "../leetcode.message";
import { parseSubmission } from "./common";

const injectContent = (observer: MutationObserver, observe: () => void) => {
  if (document.getElementById("push-to-sheets-btn")) return;

  const buttons = [].slice.call(
    document.getElementsByTagName("button")
  ) as HTMLButtonElement[];

  const submitBtn = buttons.filter(
    (btn) => btn.getAttribute("data-cy") === "submit-code-btn"
  )[0];

  const pushBtn = submitBtn.cloneNode(true) as HTMLButtonElement;
  const timeField = document.createElement("input") as HTMLInputElement;

  timeField.id = "time-taken-field";
  timeField.type = "number";
  timeField.placeholder = "Time taken (in minutes)";
  timeField.classList.add("input__2o8B");
  timeField.style.padding = "0.3rem";
  timeField.style.marginLeft = "10px";
  timeField.style.marginRight = "10px";
  timeField.style.width = "200px";

  pushBtn.id = "push-to-sheets-btn";
  pushBtn.textContent = "";

  pushBtn.classList.add("submit__2ISl");
  pushBtn.classList.add("css-ieo3pr");

  const span = document.createElement("span");
  span.classList.add("css-1km43m6-BtnContent");
  span.classList.add("e5i1odf0");
  span.textContent = "Push Last Submission";

  pushBtn.appendChild(span);

  pushBtn.addEventListener("click", async () => {
    if (timeField.value == "") return;

    span.textContent = "Pushing...";
    pushBtn.disabled = true;

    try {
      const submission = await parseSubmission(
      window.location.pathname.split("/")[2]
      );
      if (!submission) {
        alert("No Submission Found");
        return;
      }

      chrome.runtime.sendMessage(
        {
          from: LeetcodeContentScript,
          type: LeetcodeEvent.PUSH_LAST_SUBMISSION_TO_SHEETS,
          timeTaken: +timeField.value,
          questionSlug: window.location.pathname.split("/")[2],
          inContest: false,
          submissionId: submission.submissionId.toString(),
          language: submission.language,
          tries: submission.tries,
          code: submission.code,
        },
        (result) => {
          alert(result.status); span.textContent = "Push Last Submission"; pushBtn.disabled = false;
        }
      );
    } catch (e) {
      alert(e.message); span.textContent = "Push Last Submission"; pushBtn.disabled = false;
    }
  });

  observer.disconnect();
  submitBtn.parentNode.insertBefore(timeField, submitBtn.nextSibling);
  submitBtn.parentNode.insertBefore(pushBtn, timeField.nextSibling);
  observe();
};

export default { injectContent };
