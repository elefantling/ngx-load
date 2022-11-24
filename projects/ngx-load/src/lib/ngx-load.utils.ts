export function isEmpty(value: unknown) {
  return (
    value == null ||
    value == false ||
    value === 0 ||
    value === '' ||
    (Array.isArray(value) && value.length === 0) ||
    (typeof value === 'object' && Object.keys(value).length === 0)
  );
}
