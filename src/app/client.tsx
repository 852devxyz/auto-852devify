'use client';
import { atom, useAtomValue, useSetAtom } from 'jotai';
import { DownloadIcon, Loader2Icon, AlertCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { OutputCanvas } from '@/components/ui/OutputCanvas';
import { singlePhotoFaceDetection, multiplePhotoFaceDection, initialFaceApi } from '@/lib/methods/faceDetection';
import { useQuery } from '@tanstack/react-query';
import { ImageAtom } from '@/lib/atomValues';
import { Toolbar } from '@/components/ui/Toolbar';
import { FileInputFormData } from '@/lib/types';
import { settings } from '@/settings/global';
import { LoadingOverlay } from '@/components/ui/LoadingOverlay';
import { useState } from 'react';
import * as faceapi from 'face-api.js';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

const FileInputForm = () => {
  const setImageAtom = useSetAtom(ImageAtom);
  const [showError, setShowError] = useState(false);
  const { handleSubmit, register } = useForm({
    defaultValues: {
      files: []
    } as FileInputFormData,
  });

  const onSubmit = async ({ files }: FileInputFormData) => {
    if (files.length === 0) {
      setShowError(true);
      return;
    }
    setShowError(false);
    setImageAtom((prev) => ({ ...prev, uri: URL.createObjectURL(files[0]), filename: files[0].name }));
  };

  return (
    <Card className="mx-auto max-w-lg">
      <CardHeader>
        <CardTitle>Auto-<a href="https://linktr.ee/852devxyz" target="_blank" style={{color: "blue"}} >852dev</a>ify your pictures!</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          {showError && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                Please select an image before clicking 852Devify.
              </AlertDescription>
            </Alert>
          )}
          <div className="flex flex-row items-center gap-2">
            <Input {...register('files')} type="file" id="files" accept=".jpg,.jpeg,.png" onChange={() => setShowError(false)} />
            <Button type="submit">852Devify</Button>
          </div>
          <div className="flex flex-col mt-2">
            <Toolbar />
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

function FaceDetection() {
  const { uri, maskLUri, maskRUri, minConfidence, filename, maskAdjust, flip, showMask, showLM, maskType, enlarge } = useAtomValue(ImageAtom);
  const [isProcessing, setIsProcessing] = useState(false);
  const net = initialFaceApi();
  const { data: detections, isLoading } = useQuery({
    queryKey: ['face-api', 'detect', uri, minConfidence],
    queryFn: async () => {
      if (!uri) return [];
      setIsProcessing(true);
      try {
        const imageElement = document.createElement('img');
        imageElement.src = uri;
        const detections = await faceapi
          .detectAllFaces(imageElement, new faceapi.SsdMobilenetv1Options({ minConfidence }))
          .withFaceLandmarks();
        return detections ?? [];
      } finally {
        setIsProcessing(false);
      }
    },
    enabled: !!uri && !!net,
  });

  // Only show loading overlay when we're actually processing an image
  const showLoading = uri && (isProcessing || isLoading);

  return (
    <>
      {showLoading && <LoadingOverlay />}
      {uri && (
        <div className="relative mx-auto grid h-auto max-w-lg items-center justify-center">
          <OutputCanvas 
            detections={detections}
            baseImageUri={uri} 
            maskImageLUri={maskLUri} 
            maskImageRUri={maskRUri} 
            showLandmarks={showLM} 
            showMask={showMask} 
            maskType={maskType} 
            flipMask={flip} 
            photoTitle={filename}
            className="h-auto max-w-full" 
            key={`${uri}`} 
            maskAdjust={maskAdjust} 
            enlarge={enlarge} 
          />
        </div>
      )}
    </>
  );
}

export { FileInputForm, FaceDetection };
