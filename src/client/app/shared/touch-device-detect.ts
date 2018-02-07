
export function checkIsTouchDevice(): boolean {
  var el = document.createElement('div');
  el.setAttribute('ontouchstart', 'return;');
  var check = typeof el.ontouchstart === "function";
  return check;
}
