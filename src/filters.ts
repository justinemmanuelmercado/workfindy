export function getSimilarStrings(strings: string[], arg1: string): { string: string; snippet: string }[] {
  const matchingStrings: { string: string; snippet: string }[] = [];

  // Split the second and third arguments into individual words
  const words1 = arg1.split(' ');

  // Check each string in the first argument
  for (const str of strings) {
    // Calculate the distance between the string and each word in the second and third arguments
    for (const word of words1) {
      const distance = levenshteinDistance(str, word);

      // Check if the distance is 1 or less
      if (distance <= 1) {
        // Snippet is equal to 5 characters before where we found the match in word + the word itself
        matchingStrings.push({ string: str, snippet: word });
      }
    }
  }

  return matchingStrings;
}
function levenshteinDistance(a: string, b: string): number {
  // Create a matrix to store the distances between the substrings of the two strings
  const distances = new Array(b.length + 1);
  for (let i = 0; i <= b.length; i++) {
    distances[i] = new Array(a.length + 1);
  }

  // Initialize the distance matrix
  for (let i = 0; i <= a.length; i++) {
    distances[0][i] = i;
  }
  for (let i = 0; i <= b.length; i++) {
    distances[i][0] = i;
  }

  // Calculate the distances
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        distances[i][j] = distances[i - 1][j - 1];
      } else {
        distances[i][j] = Math.min(
          distances[i - 1][j - 1] + 1, // Substitution
          distances[i][j - 1] + 1, // Insertion
          distances[i - 1][j] + 1 // Deletion
        );
      }
    }
  }

  // Return the final distance
  return distances[b.length][a.length];
}

/**
 *
 * @param words An array of words to match the string str. KEEP THIS ARRAY LOWERCASE OR IT WILL NOT WORK
 * @param str String to match to the array of words
 * @returns Returns matched words
 */
export function matchingWords(words: string[], str: string): string[] {
  const matchedWords = [];
  // Split the string into an array of individual words
  const strWords = str.toLowerCase().split(' ');

  // Loop through each word in the string
  for (const strWord of strWords) {
    // Check if the word is in the array of words
    if (words.includes(strWord)) {
      // If it is, add it to the array of matched words
      matchedWords.push(strWord);
    }
  }
  return matchedWords;
}
