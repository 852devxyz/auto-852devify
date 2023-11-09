interface InputData {
    uri: string | null,
    maskLUri: string | null,
    maskRUri: string | null,
    minConfidence: number,
    filename: string | null,
    maskAdjust: number,
    flip: boolean,
    showMask: boolean,
    showLM: boolean,
    maskType: number,
    enlarge: number
}

interface FileInputFormData {
    files: File[];
}


  interface MaskButtonProps {
    title: String | null,
    buttonKey: string
    uri: string | null,
    changeHandler: Function
  }

  interface MaskDimension{
    width: number,
    height: number,
    widthAdjust: number
  }

export type { InputData, FileInputFormData, MaskButtonProps, MaskDimension }