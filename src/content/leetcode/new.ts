import { LeetcodeEvent } from '../../events';
import { LeetcodeContentScript } from '../../scripts';

const getSubmitBtn = () => {
  const btns = [].slice.call(
    document.querySelectorAll('button')
  ) as HTMLButtonElement[];
  const btn = btns.filter((btn) => btn.lastChild.textContent === 'Solution')[0];
  return btn ?? null;
};

const injectContent = (observer: MutationObserver, observe: () => void) => {
  if (document.getElementById('push-to-sheets-btn')) return;

  const submitBtn = getSubmitBtn();

  const pushBtn = submitBtn.cloneNode(true) as HTMLButtonElement;
  const timeField = document.createElement('input') as HTMLInputElement;

  const inputFieldClasses = [
    'block',
    'rounded-md',
    'leading-5',
    'border-none',
    'text-label-2',
    'dark:text-dark-label-2',
    'bg-transparent',
    'dark:bg-dark-transparent',
    'focus:bg-transparent',
    'dark:focus:bg-dark-transparent',
    'placeholder:text-label-4',
    'dark:placeholder:text-dark-label-4',
    'h-6',
    'w-full',
    'outline-none',
    'min-h-[10px]',
    'py-1',
    'px-2',
  ];

  const btnClasses = [
    'whitespace-nowrap',
    'focus:outline-none',
    'bg-blue-s',
    'dark:bg-dark-blue-s',
    'hover:bg-blue-3',
    'dark:hover:bg-dark-blue-3',
    'flex',
    'items-center',
    'justify-center',
    'gap-1',
    'font-medium',
    'text-label-r',
    'dark:text-dark-label-r',
    'h-6',
    'rounded',
    'px-2',
    'py-1',
    'text-xs',
  ];

  timeField.id = 'time-taken-field';
  timeField.type = 'number';
  timeField.placeholder = 'Time taken (in minutes)';
  timeField.classList.add(...inputFieldClasses);

  pushBtn.id = 'push-to-sheets-btn';
  pushBtn.textContent = '';

  pushBtn.classList.add(...btnClasses);

  const span = document.createElement('span');
  span.textContent = 'Push Last Submission';

  pushBtn.appendChild(span);

  pushBtn.addEventListener('click', async () => {
    if (timeField.value == '') return;

    span.textContent = 'Pushing...';
    pushBtn.disabled = true;

    chrome.runtime.sendMessage(
      {
        from: LeetcodeContentScript,
        type: LeetcodeEvent.PUSH_LAST_SUBMISSION_TO_SHEETS,
        timeTaken: timeField.value,
        questionSlug: window.location.pathname.split('/')[2],
      },
      (result) => {
        if (result.status === 'success') {
          alert('Pushed to sheet!');
        } else {
          alert('Failed to push to sheet!');
        }
        span.textContent = 'Push Last Submission';
        pushBtn.disabled = false;
      }
    );
  });

  observer.disconnect();
  submitBtn.parentNode.insertBefore(timeField, submitBtn.nextSibling);
  submitBtn.parentNode.insertBefore(pushBtn, timeField.nextSibling);
  observe();
};

export default { injectContent };
