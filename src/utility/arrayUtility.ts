/**
 *
 * @param array
 * @param propertyName
 * @param value
 * @returns
 */
export function hasPropertyEqualAs(
  array: Array<object>,
  propertyName: string,
  value: string
): boolean {
  for (let obj of array) {
    if (obj[propertyName] === value) return true;
  }
  return false;
}

export function sumArrayProp(array: Array<object>, property: string): number {
  if (array.length === 0) return 0;
  return array.map((e) => e[property]).reduce((p, c) => p + c);
}
