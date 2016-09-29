export function ufo(a, b) {
  if (a < b) { return -1; }
  else if (a > b) { return 1; }
  else { return 0; }
}

export const EVENTS = {
  FETCH_MY_ISSUES: 'FETCH_MY_ISSUES',
  UPDATE_USERDATA: 'UPDATE_USERDATA',
  SAVE_USERDATA: 'SAVE_USERDATA',
  RELOAD_GITHUB: 'RELOAD_GITHUB'
};
