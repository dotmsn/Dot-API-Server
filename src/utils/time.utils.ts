export function calculateDifference (firstDate: number, secondDate: number): number {
  const first = firstDate > secondDate ? firstDate : secondDate;
  const second = firstDate < secondDate ? firstDate : secondDate;

  return first - second;
}

export function getSeconds (first: number, second: number): number {
  const diff = calculateDifference(first, second);
  return diff / 1000;
}

export function getMinutes (first: number, second: number): number {
  const diff = getSeconds(first, second);
  return diff / 60;
}
