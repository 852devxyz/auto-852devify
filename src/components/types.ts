interface InputData {
    uri: string | null,
    maskUri: string | null,
    minConfidence: number,
    filename: string | null,
    maskAdjust: number,
    flip: boolean,
    showMask: boolean,
    showLM: boolean
}

interface FileInputFormData {
    files: File[];
  }


export type { InputData,FileInputFormData }