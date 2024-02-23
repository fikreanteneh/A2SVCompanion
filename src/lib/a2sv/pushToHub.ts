import config from "../../config";
import { PushToHubType } from "../../types/submissions";
import { getLocalStorage } from "../../utils/readStorage";

const pushToHub = async (args: PushToHubType): Promise<string> => {
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
      in_contest: false,
    }),
  });
  if (res.status == 200) return "Successfully Pushed Your Code";
  const response = await res.text();
  return response;
};

export default pushToHub;
