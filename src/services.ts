import { A2SVHubContentScript } from "./a2sv/a2sv.message";
import a2svHubHandler from "./a2sv/a2sv.service";
import { CodeforcesContentScript } from "./codeforces/codeforces.message";
import codeforcesHandler from "./codeforces/codeforces.service";
import { LeetcodeContentScript } from "./leetcode/leetcode.message";
import leetcodeHandler from "./leetcode/leetcode.service";


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.from === LeetcodeContentScript) {
    leetcodeHandler(message, sender, sendResponse);
    return true;
  } else if (message.from === CodeforcesContentScript) {
    codeforcesHandler(message, sender, sendResponse);
    return true;
  } else if (message.from === A2SVHubContentScript) {
    a2svHubHandler(message, sender, sendResponse);
  }
});
