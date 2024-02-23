import { AuthEvent } from "../types/events";
import { AuthContentScript } from "../types/scripts";

export const extractToken = (): string | null => {
  const accessToken = document.getElementById("access_token");

  if (accessToken) {
    return accessToken.getAttribute("value") !== ""
      ? accessToken.getAttribute("value")
      : null;
  }

  return null;
};

const token = extractToken();

if (token === null) {
  chrome.runtime.sendMessage({
    from: AuthContentScript,
    type: AuthEvent.AUTH_FAILURE,
  });
} else {
  chrome.runtime.sendMessage({
    from: AuthContentScript,
    type: AuthEvent.AUTH_SUCCESS,
    token,
  });
}
