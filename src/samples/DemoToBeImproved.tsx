'use client';
import { multiplePhotoFaceDection } from "@/lib/methods/faceDetection";
import { OutputCanvas } from "@/components/ui/OutputCanvas";
import { settings } from "@/settings/global";

function DemoToBeImproved() {
    const tbiPhotos = [
      "./sample_images/benchmark/1_input.jpg",
      "./sample_images/benchmark/2_input.jpg",
      "./sample_images/benchmark/3_input.jpg",
      "./sample_images/benchmark/4_input.png",
      "./sample_images/benchmark/5_input.jpg",
      "./sample_images/to_be_improved/6_input.jpg",
      "./sample_images/to_be_improved/7_input.jpg",
      "./sample_images/to_be_improved/8_input.jpeg",
      "./sample_images/to_be_improved/9_input.jpg",
      "./sample_images/to_be_improved/10_input.jpeg",
    ];
    const minConfidence = 0.30;
    //let canvasList:any[] = [];
  
    const detectionList = multiplePhotoFaceDection(tbiPhotos, minConfidence);
  
    const canvasList = detectionList.map(d => {
      const {uri, filename, detections} = d;
      return  <OutputCanvas detections={detections}
      baseImageUri={uri} 
      maskImageLUri={settings.default.mask.uriL} 
      maskImageRUri={settings.default.mask.uriL} 
      showLandmarks={false} 
      showMask = {true}
      flipMask = {true}
      maskType={0}
      enlarge={settings.default.enlarge}
      photoTitle={filename}
    
      className="h-auto max-w-full" key={`${uri}`} maskAdjust = {settings.default.mask.widthAdjust }/>
    })
    
  
    return <div>
      {canvasList}
    </div>
  }
  
  export {DemoToBeImproved}