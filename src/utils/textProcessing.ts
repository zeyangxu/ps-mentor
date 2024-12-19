export const cleanTextForAnalysis = (text: string): string => {
  // Split by newlines, filter out empty lines, and join with single \n
  // Note: Changed from double backslash \\n to single \n for proper JSON encoding
  return text
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .join('\n');
};