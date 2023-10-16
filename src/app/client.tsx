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


interface FileInputFormData {
  files: File[];
  minConfidence: number;
}
const FileInputForm = () => {
  const setImageAtom = useSetAtom(ImageAtom);
  const defaultMask = masks.noggles1;
  const { handleSubmit, register } = useForm({
    defaultValues: {
      files: [],
      minConfidence: 0.3,
    } as FileInputFormData,
  });

  const onSubmit = ({ files, minConfidence }: FileInputFormData) => {
    if (files.length === 0) {
      return;
    }
    setImageAtom((prev) => ({ ...prev, uri: URL.createObjectURL(files[0]), minConfidence: minConfidence, filename: files[0].name, maskUri: defaultMask.uri, maskAdjust: defaultMask.widthAdjust }));
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
          <div className="flex flex-row mt-2">
            <div className="flex flex-row mr-2">
              <span className="relative top-1/4 mr-2">Min. Conf.</span>
              <input className="shadow rounded w-10" {...register('minConfidence', { "valueAsNumber": true })} />
            </div>
            <Toolbar />

          </div>

        </form>
      </CardContent>
    </Card>
  );
};



function FaceDetection() {
  const showLM = true;
  const showMask = true;
  const flipMask = false;
  const { uri, maskUri, minConfidence, filename, maskAdjust } = useAtomValue(ImageAtom);
  //const [isReady, setIsReady] = useState(false);
  console.log("faceDetection", maskUri);
  const isReady = false;
  const detections = singlePhotoFaceDetection(uri, minConfidence);
  //setIsReady(true);
  return (
    <div className="relative mx-auto grid h-auto max-w-lg items-center justify-center">
      {isReady ? <Loader2Icon className="h-6 w-6 animate-spin" /> : null}
      <OutputCanvas detections={detections}
        baseImageUri={uri} maskImageUri={maskUri} showLandmarks={showLM} showMask={showMask} flipMask={flipMask} photoTitle={filename}
        className="h-auto max-w-full" key={`${uri}`} maskAdjust={maskAdjust} />
    </div>
  );
}


export { FileInputForm, FaceDetection };
