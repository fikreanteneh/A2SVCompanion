export const getCodeforcesLangExtenson = (lang: string) => {
  if (lang.includes('Py')) {
    return 'py';
  } else if (lang.includes('Java')) {
    return 'java';
  } else if (lang.includes('++')) {
    return 'cpp';
  }
};

export const getLeetcodeLangExtension = (lang: string) => {
  switch (lang) {
    case 'cpp':
      return 'cpp';
    case 'java':
      return 'java';
    case 'python':
      return 'py';
    case 'python3':
      return 'py';
    case 'c':
      return 'c';
    case 'csharp':
      return 'cs';
    case 'javascript':
      return 'js';
    case 'ruby':
      return 'rb';
    case 'swift':
      return 'swift';
    case 'golang':
      return 'go';
    case 'scala':
      return 'scala';
    case 'kotlin':
      return 'kt';
    case 'rust':
      return 'rs';
    case 'php':
      return 'php';
    case 'typescript':
      return 'ts';
    default:
      return 'txt';
  }
};
