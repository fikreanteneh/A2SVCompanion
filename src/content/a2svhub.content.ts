import { A2SVHubContentScript } from "../types/scripts";

export const extractIdentifier = async (): Promise<string | null> => {
  const identifier = window.localStorage.getItem("userIdentifier");
  return identifier;
};

const setIdentifier = async () => {
  const identifier = await extractIdentifier();
  chrome.runtime.sendMessage({
    from: A2SVHubContentScript,
    identifier: identifier,
  });
  if (!identifier) {
    setTimeout(setIdentifier, 5000);
  } else {
    window.localStorage.companionReady = true;
  }
};
setIdentifier();
