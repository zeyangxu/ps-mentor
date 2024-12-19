import { Button } from "@/components/ui/button"
import { Upload } from "lucide-react"
import { useRef } from "react"
import { extractTextFromFile } from "@/utils/documentProcessing"
import { useToast } from "@/hooks/use-toast"

interface FileUploadProps {
  onUpload: (text: string) => void;
}

export const FileUpload = ({ onUpload }: FileUploadProps) => {
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await extractTextFromFile(file);
      onUpload(text);
      toast({
        title: "File Uploaded",
        description: "Your document has been successfully processed.",
      });
    } catch (error) {
      console.error("File upload error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to process the document. Please try again with a supported file type.",
      });
    }

    // Reset the file input value to allow uploading the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept=".txt,.doc,.docx"
        className="hidden"
        onChange={handleFileUpload}
      />
      <Button 
        variant="outline" 
        className="gap-2"
        onClick={handleButtonClick}
      >
        <Upload className="w-4 h-4" />
        Upload
      </Button>
    </>
  );
};