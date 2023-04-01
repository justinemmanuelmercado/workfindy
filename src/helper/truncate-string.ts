// Check if string is longer than 4096 characters
export const truncateString = (body: string): string => {
  if (body.length > 4096) {
    // shorten it till the last newline character so that the length is less than or equal to 4096
    const truncatedBody = body.slice(0, body.lastIndexOf('\n', 4096));
    return `${truncatedBody}...`;
  } else {
    return body;
  }
};
