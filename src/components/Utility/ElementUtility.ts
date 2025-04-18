export const getEl = <T extends HTMLElement>(elName: string): T | null => {
  const element = document.getElementById(elName);
  return element as T | null;
};
