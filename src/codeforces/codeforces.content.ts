import {
  getSubmissionDetail,
  getSubmissionAnchors as getSubmissionRows,
  getUserHandle,
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
  const codeforceHandle = getUserHandle();
  const solutionRows = getSubmissionRows();
  for (let row of solutionRows) {
    const cols = [].slice.call(row.children) as HTMLTableColElement[];
    const verdictCell = row.querySelector("span.verdict-accepted");
    const solvers = cols[2].getElementsByTagName("a")
    let solver = "";
    for (let eachSolver of Array.from(solvers)) {
      if (eachSolver.innerText === codeforceHandle) {
        solver = eachSolver.innerText;
        break;
      }
    }

    if (solver !== codeforceHandle || !verdictCell) {
      continue;
    }
    const qUrl = cols[3].getElementsByTagName("a")[0].href;
    const programmingLanguage = cols[4].innerText;
    const anchor = cols[0].getElementsByTagName("a")[0];
    const submissionId = anchor.getAttribute("submissionid");
    anchor.addEventListener("click", async () => {
      await getSubmissionDetail(
        submissionId,
        codeforceHandle,
        qUrl,
        programmingLanguage
      );
    });
  }
};

hookSubmissionAnchors();
