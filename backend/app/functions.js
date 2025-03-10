export function checkInput(input) {
  if (input === undefined || input.length === 0) {
    return false;
  }
  const invalidCharaters = ['`', ';', ',', '(', ')', "'", '"', '=', '$'];
  for (let i = 0; i < invalidCharaters.length; i++) {
    if (input.includes(invalidCharaters[i])) {
      return false;
    }
  }
  return true;
}
export default checkInput