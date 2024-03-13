import { questionExist } from "../../a2sv/a2sv.api";
import { LeetcodeContentScript, LeetcodeEvent } from "../leetcode.message";
import { parseSubmission } from "./common";

const getSubmitBtn = () => {
  const btns = [].slice.call(
    document.querySelectorAll("button")
  ) as HTMLButtonElement[];
  const btn = btns.filter(
    (btn) => btn.getAttribute("data-e2e-locator") === "console-submit-button"
  )[0];
  return btn ?? null;
};

const injectContent = async () =>
  // observer: MutationObserver,
  // observe: () => void
  {
    if (document.getElementById("push-to-sheets-btn")) return;
    const exist = await questionExist(
      "https://leetcode.com/problems/" +
        window.location.pathname.split("/")[2] +
        "/"
    );
    if (!exist) return;

    const submitBtn = getSubmitBtn();

    const pushBtn = submitBtn.cloneNode(true) as HTMLButtonElement;
    const timeField = document.createElement("input") as HTMLInputElement;

    const inputFieldClasses = [
      "rounded-md",
      "border-none",
      "outline-none",
      "px-2",
      "w-[100px]",
      "h-full",
      "ml-2",
    ];

    const btnClasses = [
      // "whitespace-nowrap",
      // "focus:outline-none",
      // "bg-blue-s",
      // "dark:bg-dark-blue-s",
      // "flex",
      // "items-center",
      // "justify-center",
      // "gap-1",
      // "font-medium",
      // "text-label-r",
      // "dark:text-dark-label-r",
      // "h-6",
      // "rounded",
      // "px-2",
      // "py-1",
      // "text-xs",
    ];

    timeField.id = "time-taken-field";
    timeField.type = "number";
    timeField.placeholder = "Time Taken";
    timeField.classList.add(...inputFieldClasses);

    pushBtn.id = "push-to-sheets-btn";
    pushBtn.textContent = "";

    // pushBtn.classList.add(...btnClasses);

    const span = document.createElement("span");
    span.textContent = "Push Last Submission";

    pushBtn.appendChild(span);

    pushBtn.addEventListener("click", async () => {
      if (timeField.value == "") {
        alert("Please insert the time taken in minutes");
        return;
      }

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
            alert(result.status);
            span.textContent = "Push Last Submission";
            pushBtn.disabled = false;
          }
        );
      } catch (e) {
        alert(e.message);
        span.textContent = "Push Last Submission";
        pushBtn.disabled = false;
      }
    });

    // observer.disconnect();
    // const parent = submitBtn.parentNode;
    if (
      window.localStorage.getItem("QD_LAYOUT_RUN_SUBMIT_POSITION") ==
      "codeEditor"
    ) {
      const parent =
        submitBtn.parentNode.parentNode.parentNode.parentNode.parentNode;
      parent.insertBefore(timeField, parent.firstChild);
      parent.insertBefore(pushBtn, timeField.nextSibling);
    } else {
      const parent = submitBtn.parentNode.parentNode.parentNode;
      parent.insertBefore(timeField, submitBtn.nextSibling);
      parent.insertBefore(pushBtn, timeField.nextSibling);
    }
    // observe();
  };

export default { injectContent };
