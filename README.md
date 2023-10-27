# auto-852devify
Inspired by `auto-nounify`, an open source tool by 852dev.xyz to anonymize event participants by adding a specific graphic to cover their faces

## Installation
- npm i 
## Build 
- npm run build
## Run development mode
- npm run dev
## JEST unit test
- npx jest
## JEST update snapshot
- npx jest -u

## Settings
- Image files should be placed in "public" folder
- Updating the settings file settings/global.ts
- Setting structure
### global.ts Example
```
{
 "modelsFolder": "/models", 
    "default": {
        "mask": {widthAdjust: 1.18, uriL: './red160px.png', uriR: './redr160px.png', comment: "Width Adjust: noggles width(160), noggles holder(30),due expand 1/5 for better output"},
        "confidence": 0.3,
        "flip": true,
        "showMask":true,
        "showLM":false,
        "hideDemoButton": true,
    }
}
```
-- modelsFolder: Folder path of faceApi Models. Should be place inside /public
-- default: All default attributes here
-- default.mask: Default mask for initialize 
-- default.mask.widthAdjust: Default value is 1. The value for adjusting the size of the mask for example the noggles' handle width is are 0.18 ratio of the whole noggles and which should not count as the width of the mask. Thus the adjust value should be 1.18
-- default.mask.uriL: Uri of the mask if the target face direction is facing Left side.
-- default.mask.uriR: Uri of the mask if the target face direction is facing Right side.
-- default.mask.comment: Comment text for the mask attribute.    

# Usage
## Face Detecction API
```
import { singlePhotoFaceDetection, multplePhotoFaceDection } from '@/components/methods/faceDetection';
```

### singlePhotoFaceDetection(uri, minConfidence)
- uri: target photo uri
- minConfidence: minimum confidence from face detection. Suggest the better min. confidence should be between 3 - 3.5
- return:
```
faceapi.WithFaceLandmarks<{detection: faceapi.FaceDetection;}>[]
```


### multplePhotoFaceDection(photoList: string[], minConfidence:number = 0.35)
- uri: Array of target photo uri
- minConfidence: minimum confidence from face detection. Suggest the better min. confidence should be between 3 - 3.5
- return 
```
{
    uri: string; 
    filename: string;
    detections: faceapi.WithFaceLandmarks<{
    detection: faceapi.FaceDetection;
    }>[] | undefined;
}[]
```
## Position calculation API
```
import { calcuateMaskPosition, getMaskDimension } from '@/components/methods/calculateMaskPosition'
```
### getMaskDimension(mask: HTMLImageElement, widthAdjust: number = 1)
- Getting mask dimension for calculation use.
- mask: HTMLImageElement object from mask uri
- widthAdjust: Width adjust ratio for the mask
- return
```
{width, height, widthAdjust}
```

### calcuateMaskPosition(landmarks: faceapi.FaceLandmarks68, maskDimension: MaskDimension)
- Landmarks from detections
- maskDimension from getMaskDimension {width, height, widthAdjust}
- return
```
[midX , midY, width, height, angle, hscale]
```

## OutputCanvas
```
import { OutputCanvas } from '@/components/ui/OutputCanvas';
```
- baseImageUri: Target Photo uri
- maskImageUri: Mask Image uri
- detections: Detections from singlePhotoFaceDetection / multplePhotoFaceDection
- showLandmarks: Show landmarks points in the result canvas if set to true, default false
- showMask: Show mask in the result canvas if set to true, default true
- photoTitle: Card Head title for the result canvas container
- maskSize: ratio of resizing the mask width e.g. adjust the mask size to cover the face,
- maskAdjust: additional ratio of reszing mask e.g. additional adjust for the ratio of noggles holder
- Return HTMLCanvasElement


