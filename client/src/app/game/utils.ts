/**
 * Shuffle an array in-place, randomly place each element on a different position.
 * @param array array to shuffle
 * @returns the same array
 * @see https://bost.ocks.org/mike/shuffle/
 */
export function shuffle(array: any[]) {
  var m = array.length, t, i;

  // While there remain elements to shuffle…
  while (m) {

    // Pick a remaining element…
    i = Math.floor(Math.random() * m--);

    // And swap it with the current element.
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }

  return array;
}