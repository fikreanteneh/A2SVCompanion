import { CodeforcesEvent } from "../../types/events";
import { CodeforcesContentScript } from "../../types/scripts";

export const getSubmissionAnchors = () => {
  return [].slice.call(
    document.getElementsByClassName("highlighted-row")
  ) as HTMLTableRowElement[];
};

export const getUserHandle = (): string => {
  return [].slice
    .call(
      document
        .getElementsByClassName("lang-chooser")[0]
        .getElementsByTagName("a")
    )
    .filter((x: HTMLAnchorElement) => x.href.includes("profile"))[0].innerText;
};

export const getSubmissionDetail = async (
  submissionId: string,
  userHandle: string,
  questionUrl: string,
  programmingLanguage: string
) => {
  setTimeout(async () => {
    const copyBtn = document.getElementById("program-source-text-copy");
    const timeTaken = document.createElement("input");
    copyBtn.parentNode.appendChild(timeTaken);

    timeTaken.id = "time-taken";
    timeTaken.type = "number";
    timeTaken.placeholder = "Time taken (min)";
    timeTaken.style.marginBottom = "5px";
    timeTaken.style.marginRight = "10px";

    const pushBtn = copyBtn.cloneNode(true);
    pushBtn.textContent = "Push to sheet";
    copyBtn.parentNode.appendChild(pushBtn);

    pushBtn.addEventListener("click", async () => {
      if (timeTaken.value == "") return;
      const sourceCode = await navigator.clipboard.readText();
      try {
        chrome.runtime.sendMessage(
          {
            from: CodeforcesContentScript,
            type: CodeforcesEvent.PUSH_SUBMISSION_TO_SHEETS,
            codeforcesHandle: userHandle,
            code: sourceCode,
            timeTaken: timeTaken.value,
            questionUrl,
            submissioId: parseInt(submissionId),
            programmingLanguage,
          },
          (result) => {
            alert(result.status);
            // (
            //   document.getElementsByClassName("close")[0] as HTMLAnchorElement
            //   ).click();
          }
        );
      } catch (e) {
        alert(e.message);
      }
    });
  }, 1000);
};
