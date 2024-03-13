import { getLeetcodeVersion } from "./parseui/common";
import newUi from "./parseui/new";
import oldUi from "./parseui/old";

// const onMutation = async (observer: MutationObserver) => {
//   let hide = true;

//   if (window.location.href.includes("https://leetcode.com/problems/")) {
//     hide = false;
//   }
//   try {
//     if (getLeetcodeVersion() === "NEW") {
//       if (hide) {
//         removeContent(observer, observe);
//       } else {
//         newUi.injectContent(observer, observe);
//       }
//     } else {
//       if (hide) {
//         removeContent(observer, observe);
//       } else {
//         oldUi.injectContent(observer, observe);
//       }
//     }
//   } catch (e) {
//     onMutation(observer);
//   }
// };

// const mutationObserver: MutationObserver = new MutationObserver(async () => {
//   console.log("====================");
//   await onMutation(mutationObserver);
// });

// const observe = () => {
//   mutationObserver.observe(document.body, {
//     childList: true,
//     // subtree: true,
//     attributes: true,
//     attributeFilter: ["class"],
//   });
// };

// observe();

const hookSubmissionAnchor = async () =>
  // observer: MutationObserver,
  // observe: () => void
  {
    try {
      if (getLeetcodeVersion() === "NEW") {
        await newUi.injectContent();
      } else {
        await oldUi.injectContent();
      }
    } catch (e) {
      hookSubmissionAnchor();
    }
  };

hookSubmissionAnchor();
