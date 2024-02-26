const a2svHubHandler = (
  message: any,
  sender: chrome.runtime.MessageSender,
  sendResponse: (response?: any) => void
) => {
  if (message.identifier) {
    chrome.storage.local.set({
      identifier: message.identifier,
    });
  } else {
    chrome.storage.local.remove("identifier");
  }
  sendResponse();
};

export default a2svHubHandler;
