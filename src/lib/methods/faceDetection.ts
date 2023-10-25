'use client';
import { useQuery } from '@tanstack/react-query';
import * as faceapi from 'face-api.js';
import { settings } from '@/settings/global';
/**
 * Initialize the face-api
 * @date 2023/10/26 - 上午12:07:56
 *
 * @returns {*}
 */
function initialFaceApi() {
  const { data: net } = useQuery({
    queryKey: ['face-api'],
    queryFn: async () => {
      await faceapi.nets.ssdMobilenetv1.loadFromUri(settings.modelsFolder);
      await faceapi.nets.faceLandmark68Net.loadFromUri(settings.modelsFolder);
      return true;
    },
    staleTime: Infinity,
  });
  return net;
}

/**
 * Main function for loading the face landmarks from face-api
 * @date 2023/10/26 - 上午12:07:56
 *
 * @param {(boolean | undefined)} net
 * @param {(string | null)} uri
 * @param {number} [minConfidence=0.35]
 * @returns {*}
 */
function loadFaceLandmarks(net: boolean | undefined, uri: string | null, minConfidence: number = 0.35) {
  const enabled = !!uri && !!net;
  //Executing the face-api
  const { data: detections } = useQuery({
    queryKey: ['face-api', 'detect', uri, minConfidence],
    queryFn: async () => {
      const imageElement = document.createElement('img');
      imageElement.src = uri as string;
      const detections = await faceapi
        .detectAllFaces(imageElement, new faceapi.SsdMobilenetv1Options({ minConfidence }))
        .withFaceLandmarks();
      return detections ?? [];
    },
    enabled,
  });

  return detections;
}

/**
 * Wrapped function of face detection from single image source
 * @date 2023/10/26 - 上午12:07:56
 *
 * @param {(string | null)} uri
 * @param {number} [minConfidence=0.35]
 * @returns {*}
 */
function singlePhotoFaceDetection(uri: string | null, minConfidence: number = 0.35) {
  console.log("singlePhotoFaceDetection", minConfidence);
  const net = initialFaceApi();
  const detections = loadFaceLandmarks(net, uri, minConfidence);
  return detections;

}

/**
 * Wrapped function of face detaction for photos batch 
 * @date 2023/10/26 - 上午12:07:56
 *
 * @param {string[]} photoList
 * @param {number} [minConfidence=0.35]
 * @returns {*}
 */
function multiplePhotoFaceDection(photoList: string[], minConfidence: number = 0.35) {
  const net = initialFaceApi();
  const detectionList = photoList.map(uri => {
    const detections = loadFaceLandmarks(net, uri, minConfidence);
    const filename = uri;
    return { uri, filename, detections };
  }
  )

  return detectionList;
}

export { singlePhotoFaceDetection, multiplePhotoFaceDection };