'use client';

import * as faceapi from 'face-api.js';
import { atom, useAtomValue, useSetAtom } from 'jotai';
import { DownloadIcon, Loader2Icon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { OutputCanvas } from '@/components/ui/OutputCanvas';
//import { CSSProperties } from 'react';
import { singlePhotoFaceDetection, multplePhotoFaceDection } from '@/components/methods/faceDetection';

import { useQuery } from '@tanstack/react-query';
import { ImageAtom } from '@/components/atomValues';
import { Toolbar } from '@/components/ui/Toolbar';
import { masks } from '@/settings/masks';
import { FileInputFormData } from '@/components/types';



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
            <Button type="submit">Nounify</Button>
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
  //const flipMask = false;
  const { uri, maskUri, minConfidence, filename, maskAdjust, flip, showMask, showLM } = useAtomValue(ImageAtom);
  //const [isReady, setIsReady] = useState(false);
  console.log("faceDetection", minConfidence, maskUri);
  const isReady = false;
  const detections = singlePhotoFaceDetection(uri, minConfidence);
  //setIsReady(true);
  return (
    <div className="relative mx-auto grid h-auto max-w-lg items-center justify-center">
      {isReady ? <Loader2Icon className="h-6 w-6 animate-spin" /> : null}
      <OutputCanvas detections={detections}
        baseImageUri={uri} maskImageUri={maskUri} showLandmarks={showLM} showMask={showMask} flipMask={flip} photoTitle={filename}
        className="h-auto max-w-full" key={`${uri}`} maskAdjust={maskAdjust} />
    </div>
  );
}


export { FileInputForm, FaceDetection };
