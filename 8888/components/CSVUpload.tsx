import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { UploadCloud, FileText, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { CSVPreview } from "./CSVPreview"
import type { Match } from "@/types/league.types"
import { useToast } from "@/hooks/use-toast"

const MAX_FILE_SIZE_MB = 5

interface CSVUploadProps {
  onMatchesImported: (matches: Match[]) => void
}

export function CSVUpload({ onMatchesImported }: CSVUploadProps) {
  const { toast } = useToast()
  const [file, setFile] = useState<File | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)

  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: any[]) => {
      if (fileRejections.length > 0) {
        fileRejections.forEach(({ file, errors }) => {
          errors.forEach((err: any) => {
            if (err.code === "file-too-large") {
              toast({
                title: "File Too Large",
                description: `File "${file.name}" is larger than ${MAX_FILE_SIZE_MB}MB.`,
                variant: "destructive",
              })
            } else if (err.code === "file-invalid-type") {
              toast({
                title: "Invalid File Type",
                description: `File "${file.name}" is not a valid CSV.`,
                variant: "destructive",
              })
            } else {
              toast({
                title: "File Error",
                description: `File "${file.name}": ${err.message}`,
                variant: "destructive",
              })
            }
          })
        })
        setFile(null)
        return
      }

      if (acceptedFiles.length > 0) {
        setFile(acceptedFiles[0])
        setUploadProgress(0)
        setIsUploading(false)
      }
    },
    [toast],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "text/csv": [".csv"],
      "application/vnd.ms-excel": [".csv"],
    },
    maxSize: MAX_FILE_SIZE_MB * 1024 * 1024,
    multiple: false,
  })

  const handleRemoveFile = () => {
    setFile(null)
    setUploadProgress(0)
    setIsUploading(false)
  }

  const handleConfirmImport = async (matches: Match[]) => {
    setIsUploading(true)
    setUploadProgress(0)

    try {
      for (let i = 0; i <= 100; i += 10) {
        setUploadProgress(i)
        await new Promise((resolve) => setTimeout(resolve, 50))
      }

      onMatchesImported(matches)
      setFile(null)
      toast({
        title: "Import Successful",
        description: `${matches.length} matches have been imported.`,
      })
    } catch (error) {
      console.error("Error during import confirmation:", error)
      toast({
        title: "Import Failed",
        description: "There was an error importing the matches.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
    }
  }

  return (
    <div className="space-y-6">
      {!file ? (
        <Card
          {...getRootProps()}
          className={`
            border-2 border-dashed p-8 text-center cursor-pointer transition-colors
            ${isDragActive ? "border-primary bg-primary/10" : "border-border hover:border-primary"}
            bg-card
          `}
        >
          <input {...getInputProps()} />
          <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
          <p className="mt-4 text-sm text-foreground">
            <span className="font-semibold">Click to upload</span> or drag and drop
          </p>
          <p className="text-xs text-muted-foreground mt-2">CSV files only</p>
          <p className="text-sm text-muted-foreground mt-1">Max file size: {MAX_FILE_SIZE_MB}MB. Only .csv files are supported.</p>
        </Card>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-card rounded-md border border-border">
            <div className="flex items-center gap-3">
              <FileText className="h-6 w-6 text-primary" />
              <span className="font-medium text-foreground">{file.name}</span>
            </div>
            <Button variant="ghost" size="icon" onClick={handleRemoveFile} className="text-muted-foreground hover:text-foreground">
              <X className="h-5 w-5" />
              <span className="sr-only">Remove file</span>
            </Button>
          </div>

          {isUploading && (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Uploading...</p>
              <Progress value={uploadProgress} className="w-full" />
            </div>
          )}

          {!isUploading && (
            <CSVPreview
              file={file}
              onConfirm={handleConfirmImport}
              onCancel={handleRemoveFile}
            />
          )}
        </div>
      )}
    </div>
  )
}
