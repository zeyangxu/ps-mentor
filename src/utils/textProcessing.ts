export const cleanTextForAnalysis = (text: string): string => {
  // Split by newlines, filter out empty lines, and join with \n
  return text
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .join('\\n');
};