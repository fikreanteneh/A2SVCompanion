import {
  AuthContentScript,
  CodeforcesContentScript,
  LeetcodeContentScript,
  SidePanelScript,
} from './scripts';
import authHandler from './services/auth.service';
import codeforcesHandler from './services/codeforces.service';
import leetcodeHandler from './services/leetcode.service';
import sidePanelHandler from './services/sidepanel.service';

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.from === AuthContentScript) {
    authHandler(message, sender, sendResponse);
    return true;
  } else if (message.from === LeetcodeContentScript) {
    leetcodeHandler(message, sender, sendResponse);
    return true;
  } else if (message.from === CodeforcesContentScript) {
    codeforcesHandler(message, sender, sendResponse);
    return true;
  } else if (message.from === SidePanelScript){
    sidePanelHandler(message, sender, sendResponse);
  }
});
