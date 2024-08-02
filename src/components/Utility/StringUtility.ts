const truncateTextBody = (text?: string, size: number = 200): string => {
  if (text === undefined)
    return String();

  return text && text.length > size
    ? text.substring(0, size) + "..."
    : text;
}

const stripAwayHashSymbols = (text: string): string => {
  return text.replace(/#/g, "");
}

const isoDateFormatToString = (date: Date): string => {
  const day = date.getDate();
  const month = date.toLocaleString('default', { month: 'long' });
  const year = date.getFullYear();

  const getOrdinalSuffix = (day: number): string => {
    if (day % 10 === 1 && day !== 11) {
      return day + 'st';
    } else if (day % 10 === 2 && day !== 12) {
      return day + 'nd';
    } else if (day % 10 === 3 && day !== 13) {
      return day + 'rd';
    } else {
      return day + 'th';
    }
  }

  return getOrdinalSuffix(day) + ' ' + month + ' ' + year;
}


const stringToHash = (str: string): number => {
  const a = convertHtmlEntities(removeTextInsideAngleBrackets(removeHashesAndStripWhitespace(str)));
  let hash = 0;

  for (let i = 0; i < a!.length; i++) {
    const char = a!.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }

  return hash;
}

function removeHashesAndStripWhitespace(str: string): string {
  let result = str.replace(/#/g, '');
  return result.replace(/^\s/mg, '').trim();
}

function removeTextInsideAngleBrackets(input: string): string {
  return input.replace(/<[^>]*>/g, '').trim();
}

export function convertHtmlEntities(str: string): string {
  const parser = new DOMParser();
  const doc = parser.parseFromString(str, 'text/html');

  if (!doc.documentElement.textContent) console.warn(`Failed to convert html entities: ${str}`);
  return doc.documentElement.textContent ?? str;
}

export { truncateTextBody, stripAwayHashSymbols, isoDateFormatToString, stringToHash, removeHashesAndStripWhitespace, removeTextInsideAngleBrackets };
