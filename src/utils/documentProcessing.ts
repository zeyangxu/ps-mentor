import mammoth from 'mammoth';
import { cleanTextForAnalysis } from './textProcessing';

export const extractTextFromFile = async (file: File): Promise<string> => {
  if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
      file.type === 'application/msword') {
    // Handle Word documents
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return cleanTextForAnalysis(result.value);
  } else if (file.type === 'text/plain') {
    // Handle text files
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result;
        resolve(cleanTextForAnalysis(text as string));
      };
      reader.onerror = (e) => reject(e);
      reader.readAsText(file);
    });
  } else {
    throw new Error('Unsupported file type');
  }
};