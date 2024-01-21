import config from '../../config';

const pushToSheet = async (
  studentName: string,
  attempts: number,
  timeTaken: number,
  questionUrl: string,
  platform: string,
  gitUrl: string
) => {
  const response = await fetch(config.api.url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      studentName,
      attempts,
      timeTaken,
      gitUrl,
      questionUrl,
      platform,
    }),
  });

  if (response.status == 200) return true;
  return false;
};

export default { pushToSheet };
