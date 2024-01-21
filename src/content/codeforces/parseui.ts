export const getSubmissionAnchors = () => {
  return [].slice.call(
    document.getElementsByClassName('view-source')
  ) as HTMLAnchorElement[];
};

const showOnlyMySolutions = (show: boolean) => {
  const mySubmissionsToggle = document.getElementsByName(
    'my'
  )[0] as HTMLInputElement;

  if (mySubmissionsToggle.hasAttribute('checked')) {
    if (!show) {
      mySubmissionsToggle.click();
    }
  } else {
    if (show) {
      mySubmissionsToggle.click();
    }
  }
};

export const getSubmissionDetail = async (submissionid: string) => {
  const originalState = document
    .getElementsByName('my')[0]
    .hasAttribute('checked');

  showOnlyMySolutions(true);

  // get question url from the table row
  const rows = [].slice.call(
    document.getElementsByClassName('highlighted-row')
  ) as HTMLTableRowElement[];

  const submissionRow = rows.filter(
    (row) => row.getAttribute('data-submission-id') === submissionid
  )[0];

  const cols = [].slice.call(submissionRow.children) as HTMLTableColElement[];

  const problemCell = cols.filter((col) =>
    col.hasAttribute('data-problemid')
  )[0];

  const questionUrl = problemCell.getElementsByTagName('a')[0].href;

  const verdictCell = submissionRow.querySelector('span.verdict-accepted');

  return new Promise<{
    code: string;
    timeTaken: string;
    questionUrl: string;
  }>((resolve, reject) => {
    if (!verdictCell) {
      reject();
      return;
    }
    setTimeout(() => {
      const copyBtn = document.getElementById('program-source-text-copy');

      const timeTaken = document.createElement('input');
      copyBtn.parentNode.appendChild(timeTaken);

      timeTaken.id = 'time-taken';
      timeTaken.type = 'number';
      timeTaken.placeholder = 'Time taken (min)';
      timeTaken.style.marginBottom = '5px';
      timeTaken.style.marginRight = '10px';

      const pushBtn = copyBtn.cloneNode(true);
      pushBtn.textContent = 'Push to sheet';
      copyBtn.parentNode.appendChild(pushBtn);

      pushBtn.addEventListener('click', async () => {
        if (timeTaken.value == '') return;

        const sourceCode = await navigator.clipboard.readText();
        showOnlyMySolutions(originalState);
        resolve({
          code: sourceCode,
          timeTaken: timeTaken.value,
          questionUrl,
        });
      });
    }, 1000);
  });
};

export const getUserHandle = (): string => {
  return [].slice
    .call(
      document
        .getElementsByClassName('lang-chooser')[0]
        .getElementsByTagName('a')
    )
    .filter((x: HTMLAnchorElement) => x.href.includes('profile'))[0].innerText;
};
