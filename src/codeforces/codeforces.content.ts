import { getSubmissionById, getTries } from "./codeforces.api";
import { CodeforcesContentScript, CodeforcesEvent } from "./codeforces.message";
import {
  getCSFRToken,
  getSubmissionAnchors as getSubmissionRows,
  getUserHandle,
  headerInjector,
} from "./codeforces.parseui";

// const header = document.getElementById("header");
// const pushBtn = document.createElement("button");

// header.insertBefore(pushBtn, header.querySelector(".lang-chooser"));

// pushBtn.style.position = "absolute";
// pushBtn.style.top = "50%";
// pushBtn.style.right = "50%";
// pushBtn.style.transform = "translateX(60%)";

// pushBtn.innerText = "Push Last Submission";

// pushBtn.addEventListener("click", async () => {
//   chrome.runtime.sendMessage(
//     {
//       from: CodeforcesContentScript,
//       type: CodeforcesEvent.GET_LAST_SUBMISSION,
//       codeforcesHandle: getUserHandle(),
//     },
//     async (response: CodeforcesSubmission) => {
//       const solutionAnchors = getSubmissionAnchors();
//       const submissionAnchor = solutionAnchors.filter(
//         (anchor) =>
//           anchor.getAttribute("submissionid") === response.id.toString()
//       )[0];
//       submissionAnchor.click();
//     }
//   );
// });

const hookSubmissionAnchors = () => {
  const solutionRows = getSubmissionRows();
  if (!solutionRows.length) return;
  headerInjector(
    solutionRows[0].parentNode.firstElementChild as HTMLTableRowElement
  );
  const codeforceHandle = getUserHandle();
  const csrf = getCSFRToken();

  for (let row of solutionRows) {
    const cols = [].slice.call(row.children) as HTMLTableColElement[];

    const verdictCell = row.querySelector("span.verdict-accepted");
    const solvers = cols[2].getElementsByTagName("a");
    let solver = "";
    for (let eachSolver of Array.from(solvers)) {
      if (eachSolver.innerText === codeforceHandle) {
        solver = eachSolver.innerText;
        break;
      }
    }
    cols[7].className = "memory-consumed-cell";

    const pushCol = cols[4].cloneNode(true) as HTMLTableColElement;
    pushCol.innerText = "";
    pushCol.className = "right";
    if (solver !== codeforceHandle || !verdictCell) {
      row.appendChild(pushCol);
      continue;
    }

    const qUrl = cols[3].getElementsByTagName("a")[0].href;
    const programmingLanguage = cols[4].innerText;
    const anchor = cols[0].getElementsByTagName("a")[0];
    const submissionId = anchor.getAttribute("submissionid");

    // const container = document.createElement("span");
    // container.style.display = "flex";
    // container.style.alignItems = "center";
    // container.style.justifyContent = "center";
    // container.style.height = "100%";
    // container.className = "dark";

    const timeTaken = document.createElement("input");
    timeTaken.id = "time-taken";
    timeTaken.type = "number";
    timeTaken.placeholder = "Min";
    timeTaken.style.marginRight = "5px";
    timeTaken.style.maxWidth = "5em";

    const pushBtn = document.createElement("button");
    pushBtn.style.width = "6.2em"
    pushBtn.textContent = "Push";

    // pushCol.style.height = "100%";
    // pushCol.style.display = "flex";
    // pushCol.style.alignItems = "center";
    // pushCol.style.justifyContent = "center";

    pushCol.appendChild(timeTaken);
    pushCol.appendChild(pushBtn);

    row.appendChild(pushCol);

    pushBtn.addEventListener("click", async () => {
      if (timeTaken.value == "") return;
      pushBtn.disabled = true;
      pushBtn.textContent = "Pushing";
      try {
        const sourceCode = await getSubmissionById(submissionId, csrf);
        const tries = await getTries(codeforceHandle, +submissionId);
        chrome.runtime.sendMessage(
          {
            from: CodeforcesContentScript,
            type: CodeforcesEvent.PUSH_SUBMISSION_TO_SHEETS,
            code: sourceCode.source,
            timeTaken: timeTaken.value,
            questionUrl: qUrl,
            submissionId: parseInt(submissionId),
            language: programmingLanguage,
            inContest: sourceCode.contestName.includes("A2SV"),
            tries: tries,
          },
          (result) => {
            alert(result.status);
            pushBtn.disabled = false;
            pushBtn.textContent = "Push";
          }
        );
      } catch (e) {
        alert(e.message);
        pushBtn.disabled = false;
        pushBtn.textContent = "Push";
      }
      
    });

    // anchor.addEventListener("click", async () => {
    //   let retry = 1;
    //   const injectingContent = async () => {
    //     await getSubmissionDetail(
    //       submissionId,
    //       codeforceHandle,
    //       qUrl,
    //       programmingLanguage
    //     );
    //   };
    //   try {
    //     injectingContent();
    //   } catch (e) {
    //     if (retry > 3) return;
    //     retry++;
    //     setTimeout(injectingContent, 1000);
    //   }
    // });
  }
};

hookSubmissionAnchors();
