import { AuthEvent } from '../events';
import { getUser } from '../lib/github';

const authHandler = (
  message: any,
  sender: chrome.runtime.MessageSender,
  sendResponse: (response?: any) => void
) => {
  if (message.type === AuthEvent.AUTH_SUCCESS) {
    chrome.action.setBadgeText({ text: 'Success', tabId: sender.tab.id });
    chrome.action.setBadgeBackgroundColor({
      color: '#00ff00',
      tabId: sender.tab.id,
    });

    chrome.storage.local
      .set({
        token: message.token,
      })
      .then(() => {
        getUser().then((user) => {
          chrome.storage.local.set({
            user: user,
            folderPath: '',
            studentName: '',
          });
        });
      });
  } else if (message.type === AuthEvent.AUTH_FAILURE) {
    chrome.action.setBadgeText({ text: 'Failed', tabId: sender.tab.id });
    chrome.action.setBadgeBackgroundColor({
      color: '#ff0200',
      tabId: sender.tab.id,
    });
  }
};

export default authHandler;
