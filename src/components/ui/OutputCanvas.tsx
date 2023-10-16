
'use client';
import { HTMLAttributes, useEffect, useRef, useState } from 'react';
import { calcuateMaskPosition, getMaskDimension } from '@/components/methods/calculateMaskPosition'
import jsFileDownload from 'js-file-download';
import { DownloadIcon, Loader2Icon } from 'lucide-react';
import * as faceapi from 'face-api.js';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';


function drawRotatedImage(
    context: CanvasRenderingContext2D,
    image: CanvasImageSource,
    x: number,
    y: number,
    width: number,
    height: number,
    angle: number,
    hscale: number
) {
    // save the current co-ordinate system
    // before we screw with it
    context.save();

    // move to the middle of where we want to draw our image
    //context.translate(x - (width * 0.1  * hscale) , y); //Jonathan
    context.translate(x, y);
    context.scale(hscale, 1);
    // rotate around that point
    context.rotate(angle);

    // draw it up and to the left by half the width
    // and height of the image
    //context.drawImage(image, -(width / 2), -(height / 2), width, height);

    let w = width * 0.06 * hscale; //0.06 = 10(middle)/160
    if (hscale > 0) {
        w -= width * 0.18; // 0.18 = 30(ear)/160
    }
    console.log(width, w, hscale);
    //w = width * 0.1;
    // w = width;
    context.drawImage(image, -(width / 2) + w, -(height / 2), width, height);
    // and restore the coords to how they were when we began
    context.restore();
}

function createImageElement(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const img = document.createElement('img');
        img.src = src;
        img.onload = () => resolve(img);
        img.onerror = reject;
    });
}


export function OutputCanvas({
    baseImageUri,
    maskImageUri,
    detections,
    showLandmarks = false,
    showMask = true,
	flipMask = true,
    photoTitle,
    maskAdjust = 1,
    ...props
}: HTMLAttributes<HTMLCanvasElement> & {
    baseImageUri: string | null;
    maskImageUri: string | null;
    detections?: faceapi.WithFaceLandmarks<{
        detection: faceapi.FaceDetection;
    }>[],
    showLandmarks: boolean;
	flipMask: boolean;
	showMask?: boolean;
    photoTitle?: string | null | undefined;
    maskAdjust: number
}) {
    const ref = useRef<HTMLCanvasElement>(null);
    const [ready, setReady] = useState(false);
    useEffect(() => {
        if (!window || !detections || !detections.length || !baseImageUri || !maskImageUri) {
            return;
        }
        setReady(false);
        const t = setTimeout(async () => {
            if (!ref.current) {
                return;
            }
            const context = ref.current.getContext('2d', { willReadFrequently: true });
            if (!context) {
                return;
            }
            // console.log('inTimeout');
            const bgImage = await createImageElement(baseImageUri);
            const glasses = await createImageElement(maskImageUri);
            ref.current.height = bgImage.height;
            ref.current.width = bgImage.width;
            context.drawImage(bgImage, 0, 0);
            if (showLandmarks) {
                faceapi.draw.drawFaceLandmarks(ref.current, detections);
            }

            //return ;


            // Reference: https://github.com/akirawuc/auto-nounify-server/blob/main/services/nounify/main.py#L35
            if (showMask) {
                const maskDimension = getMaskDimension(glasses, maskAdjust);
                for (const face of detections) {
                    let [midX, midY, width, height, angle, hscale] = calcuateMaskPosition(face.landmarks, maskDimension);
                    drawRotatedImage(context, glasses, midX, midY, width, height, angle, flipMask ? hscale : 1);
                }
            }

            setReady(true);
        }, 50);
        return () => clearTimeout(t);
    }, [ref, detections, baseImageUri]);

    return (
        <Card>
            <CardHeader>
                <div className="flex">
                    <div className="w-3/4">{photoTitle}</div>
                    <div className="w-1/4">
                        {baseImageUri && detections && (
                            <Button
                                onClick={async () => {
                                    if (ref.current) {
                                        const response = await fetch(ref.current.toDataURL('image/png'));
                                        jsFileDownload(await response.blob(), 'nounified.png');
                                    }
                                }}
                                disabled={!ready}
                            >
                                <DownloadIcon className="mr-2 h-6 w-6" />
                                Save
                            </Button>
                        )}
                    </div></div>
            </CardHeader>
            <CardContent>
                <canvas ref={ref} {...props} />
            </CardContent>


            {baseImageUri && detections && !ready ? <div className="absolute inset-0 z-10 bg-black/50" /> : null}
        </Card>
    );
}