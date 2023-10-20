interface InputData {
    uri: string | null,
    maskLUri: string | null,
    maskRUri: string | null,
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

  interface Mask{
    uriL: String,
    uriR: String,
    widthAdjust: number
  }

export type { InputData,FileInputFormData, Mask }