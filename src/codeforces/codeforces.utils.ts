export const getCodeforcesLangExtenson = (lang: string) => {
  if (lang.includes('Py')) {
    return 'py';
  } else if (lang.includes('Java')) {
    return 'java';
  } else if (lang.includes('++')) {
    return 'cpp';
  }
};