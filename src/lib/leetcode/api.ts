import { getLeetcodeLangExtension } from '../../utils/lang';
import { upload } from '../github';
import { LeetcodeSubmissionStatus, LeecodeSubmissionDetail } from './types';

const leetcodeRequest = async (body: any) => {
  const response = await fetch('https://leetcode.com/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body,
  });

  if (response.status == 200) {
    return (await response.json()).data;
  }

  return null;
};

const getSubmissions = async (
  questionSlug: string
): Promise<LeetcodeSubmissionStatus[]> => {
  const graphQL = JSON.stringify({
    variables: { questionSlug: questionSlug, offset: 0, limit: 40 },
    query:
      'query submissionList($offset: Int!, $limit: Int!, $lastKey: String, $questionSlug: String!, $lang: Int, $status: Int) { questionSubmissionList( offset: $offset limit: $limit lastKey: $lastKey questionSlug: $questionSlug lang: $lang status: $status ) { lastKey hasNext submissions {id status timestamp statusDisplay} } }',
  });

  const data = await leetcodeRequest(graphQL);

  if (data) {
    const submissions = data.questionSubmissionList
      .submissions as LeetcodeSubmissionStatus[];
    submissions.sort((a, b) => {
      return parseInt(b.timestamp) - parseInt(a.timestamp);
    });

    return submissions;
  }

  return [];
};

const getLastAcceptedSubmissionId = async (
  questionSlug: string
): Promise<number | null> => {
  const submissions = await getSubmissions(questionSlug);

  for (let submission of submissions) {
    if (submission.statusDisplay === 'Accepted') {
      return parseInt(submission.id);
    }
  }

  return null;
};

const getSubmissionDetails = async (
  submissionId: number
): Promise<LeecodeSubmissionDetail> => {
  const graphQL = JSON.stringify({
    variables: { submissionId: submissionId },
    query:
      'query submissionDetails($submissionId: Int!) { submissionDetails(submissionId: $submissionId) { timestamp code lang { name } question { titleSlug title }} }',
  });

  const data = (await leetcodeRequest(graphQL))
    .submissionDetails as LeecodeSubmissionDetail;

  return data;
};

const getTries = async (questionSlug: string) => {
  const submissions = await getSubmissions(questionSlug);
  let minAccepted = Infinity;

  for (let submission of submissions) {
    if (submission.statusDisplay === 'Accepted')
      minAccepted = Math.min(minAccepted, parseInt(submission.timestamp));
  }

  let tries = 1;

  for (let submission of submissions) {
    if (parseInt(submission.timestamp) < minAccepted) tries++;
  }

  return minAccepted !== Infinity ? tries : 0;
};

export default {
  getSubmissions,
  getSubmissionDetails,
  getLastAcceptedSubmissionId,
  getTries,
};
