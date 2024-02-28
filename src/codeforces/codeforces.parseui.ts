import { CodeforcesContentScript, CodeforcesEvent } from "./codeforces.message";

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

const getSourceCode = (element: HTMLDivElement): string => {
  const lines = element
    .getElementsByTagName("pre")[0]
    .getElementsByTagName("code")[0]
    .getElementsByTagName("ol")[0]
    .getElementsByTagName("li");
  let code: string[] = [];
  for (let line of Array.from(lines)) {
    code.push(line.outerText);
  }
  return code.join("\n");
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

    // const pushBtn = copyBtn.cloneNode(true);
    const pushBtn = document.createElement("button");
    pushBtn.textContent = "Push to Hub";
    copyBtn.parentNode.appendChild(pushBtn);

    pushBtn.addEventListener("click", async () => {
      if (timeTaken.value == "") return;
      // const sourceCode = await navigator.clipboard.readText();
      const sourceCode = getSourceCode(
        copyBtn.parentNode.parentNode as HTMLDivElement
      );
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
            // ).click();
          }
        );
      } catch (e) {
        alert(e.message);
      }
    });
  }, 1000);
};
