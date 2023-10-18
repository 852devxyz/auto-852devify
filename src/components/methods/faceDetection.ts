
'use client';
import { useQuery } from '@tanstack/react-query';
import * as faceapi from 'face-api.js';
function singlePhotoFaceDetection(uri: string | null, minConfidence:number = 0.35){
    console.log("singlePhotoFaceDetection", minConfidence);
    const { data: net} = useQuery({
      queryKey: ['face-api'],
      queryFn: async () => {
        await faceapi.nets.ssdMobilenetv1.loadFromUri('/models');
        await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
        return true;
      },
      staleTime: Infinity,
    });
    const enabled = !!uri && !!net;
    const { data: detections } = useQuery({
      queryKey: ['face-api', 'detect', uri, minConfidence],
      queryFn: async () => {
        const imageElement = document.createElement('img');
        imageElement.src = uri as string;
        const detections = await faceapi
          .detectAllFaces(imageElement, new faceapi.SsdMobilenetv1Options({ minConfidence }))
          .withFaceLandmarks();
        // console.log({ detections });
        return detections ?? [];
      },
      enabled,
    });

    return detections;

}

function multplePhotoFaceDection(photoList: string[], minConfidence:number = 0.35){
      const { data: net } = useQuery({
        queryKey: ['face-api'],
        queryFn: async () => {
          await faceapi.nets.ssdMobilenetv1.loadFromUri('/models');
          await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
          return true;
        },
        staleTime: Infinity,
      });
      const detectionList = photoList.map(uri => {
        const enabled = !!uri && !!net;
        const filename = uri;
        const { data: detections } = useQuery({
          queryKey: ['face-api', 'detect', uri, minConfidence],
          queryFn: async () => {
            const imageElement = document.createElement('img');
            imageElement.src = uri as string;
            const detections = await faceapi
              .detectAllFaces(imageElement, new faceapi.SsdMobilenetv1Options({ minConfidence }))
              .withFaceLandmarks();
            // console.log({ detections });
            return detections ?? [];
          },
          enabled,
        });
        return {uri, filename, detections};}
      )

      return detectionList;
}

export { singlePhotoFaceDetection, multplePhotoFaceDection };