import config from "../../config";
import { getLocalStorage } from "../../utils/readStorage";

const pushToSheet = async (
  studentName: string,
  attempts: number,
  timeTaken: number,
  questionUrl: string,
  platform: string,
  gitUrl: string,
  code: string,
  language: string
): Promise<string> => {
  const identifier = await getLocalStorage("identifier");
  if (!identifier) return "Please login to A2SV Hub to Use this Feature";
  const res = await fetch(config.a2svhub.url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      identifier: identifier,
      tries: attempts,
      time_spent: timeTaken,
      code: code,
      language: language,
      link: questionUrl,
      in_contest: false,
    }),
  });
  if (res.status == 200) return "Successfully Pushed Your Code";
  const response = await res.text();
  return response;
};

export default { pushToSheet };
