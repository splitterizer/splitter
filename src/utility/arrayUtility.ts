/**
 * Confronta se nell array in input esiste la proprieta
 * passata in input con il valore in input
 * @param array
 * @param propertyName
 * @param value
 * @returns
 */
export function hasPropertyEqualAs(
  array: Array<any>,
  propertyName: string,
  value: string | number
): boolean {
  for (let obj of array) {
    if (!obj) return false;
    if (obj[propertyName] == value) return true;
  }
  return false;
}

export function sumArrayProp(array: Array<any>, property: string): number {
  if (array.length === 0) return 0;
  let somma = 0;
  for (let i of array) {
    somma += (i && i[property]) || 0;
  }
  return somma;
}
