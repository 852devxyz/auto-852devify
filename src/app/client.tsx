'use client';
import { atom, useAtomValue, useSetAtom } from 'jotai';
import { DownloadIcon, Loader2Icon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { OutputCanvas } from '@/components/ui/OutputCanvas';
import { singlePhotoFaceDetection, multiplePhotoFaceDection } from '@/lib/methods/faceDetection';

import { useQuery } from '@tanstack/react-query';
import { ImageAtom } from '@/lib/atomValues';
import { Toolbar } from '@/components/ui/Toolbar';
import { FileInputFormData } from '@/lib/types';
import { settings } from '@/settings/global';



const FileInputForm = () => {
  const setImageAtom = useSetAtom(ImageAtom);
  const { handleSubmit, register } = useForm({
    defaultValues: {
      files: []
    } as FileInputFormData,
  });

  const onSubmit = ({ files }: FileInputFormData) => {
    if (files.length === 0) {
      return;
    }
    setImageAtom((prev) => ({ ...prev, uri: URL.createObjectURL(files[0]), filename: files[0].name }));
  };

  return (
    <Card className="mx-auto max-w-lg">
      <CardHeader>
        <CardTitle>Auto-Nounify your pictures!</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-row items-center gap-2">
            <Input {...register('files')} type="file" id="files" accept=".jpg,.jpeg,.png" />
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
  const { uri, maskLUri, maskRUri, minConfidence, filename, maskAdjust, flip, showMask, showLM, maskType,enlarge } = useAtomValue(ImageAtom);
  const isReady = false;
  const detections = singlePhotoFaceDetection(uri, minConfidence);
  return (
    <div className="relative mx-auto grid h-auto max-w-lg items-center justify-center">
      {isReady ? <Loader2Icon className="h-6 w-6 animate-spin" /> : null}
      <OutputCanvas detections={detections}
        baseImageUri={uri} maskImageLUri={maskLUri} maskImageRUri={maskRUri} showLandmarks={showLM} showMask={showMask} maskType={maskType} flipMask={flip} photoTitle={filename}
        className="h-auto max-w-full" key={`${uri}`} maskAdjust={maskAdjust} enlarge = {enlarge} />
    </div>
  );
}


export { FileInputForm, FaceDetection };
