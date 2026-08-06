// utils -> findDate.ts

function convertDateFormat(dateString: string): string {
  const parts = dateString.split("/");
  if (parts.length !== 3) return dateString;

  let year: string, month: string, day: string;

  if (parts[0].length === 4 || parseInt(parts[0]) > 31) {
    [year, month, day] = parts;
  } else if (parseInt(parts[0]) > 12) {
    [day, month, year] = parts;
  } else {
    [month, day, year] = parts;
  }

  year = year.length === 2 ? "20" + year : year;
  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}T00:00:00`;
}

export default function findDate(doc: Document): string {
  const datePatterns = [
    /\d{4}-\d{2}-\d{2}/,
    /\d{1,2}\/\d{1,2}\/\d{2,4}/,
  ];

  const findDateInElement = (element: Element): string => {
    for (const pattern of datePatterns) {
      const match = element.textContent?.match(pattern);
      if (match) return convertDateFormat(match[0]);
    }
    return "";
  };

  const priorityElements = doc.querySelectorAll("time, [datetime], [itemprop~=datePublished], [itemprop~=dateCreated]");
  for (const el of Array.from(priorityElements)) {
    const date = el.getAttribute("datetime") || el.getAttribute("content") || findDateInElement(el);
    if (date) return date;
  }

  const secondaryElements = doc.querySelectorAll("p, span, div");
  for (const el of Array.from(secondaryElements)) {
    const date = findDateInElement(el);
    if (date) return date;
  }

  return "";
}
