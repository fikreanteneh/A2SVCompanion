import config from "../config";
import { getLocalStorage } from "../utils/readStorage";
import { PushToHubType } from "./a2sv.types";

export const pushToHub = async (args: PushToHubType): Promise<string> => {
  const identifier = await getLocalStorage("identifier");
  if (!identifier) return "Please login to A2SV Hub to Use this App";
  const res = await fetch(config.a2svhub.url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      identifier: identifier,
      tries: args.attempts,
      time_spent: args.timeTaken,
      code: args.code,
      language: args.language,
      link: args.questionUrl,
      in_contest: args.inContest,
      platform_submission_id: args.submissionId,
    }),
  });
  if (res.status == 200) return "Successfully Pushed Your Code";
  const response = await res.text();
  return response;
};

export const questionExist = async (url: string): Promise<boolean> => {
  try{
    const response = await fetch(config.a2svhub.exist, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url,
      }),
    });
    const exist = await response.json();
    return exist.exists;
  } catch {
    return false
  }
};
