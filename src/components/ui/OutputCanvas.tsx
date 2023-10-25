
'use client';
import { HTMLAttributes, useEffect, useRef, useState } from 'react';
import { calcuateMaskPosition, getMaskDimension } from '@/components/methods/calculateMaskPosition'
import jsFileDownload from 'js-file-download';
import { DownloadIcon, Loader2Icon } from 'lucide-react';
import * as faceapi from 'face-api.js';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { maskTypes } from '@/settings/global';

function drawRotatedImage(
    context: CanvasRenderingContext2D,
    maskL: CanvasImageSource,
    maskR: CanvasImageSource,
    maskAdjust: number,
    x: number,
    y: number,
    width: number,
    height: number,
    enlarge: number,
    angle: number,
    hscale: number
) {
    // save the current co-ordinate system
    // before we screw with it
    context.save();
    // move to the middle of where we want to draw our image
    context.translate(x, y);
    // rotate around that point
    context.rotate(angle);

    // draw it up and to the left by half the width
    // and height of the image
    let w = width * (maskAdjust -1 ) * hscale * enlarge;    
    let mask = hscale > 0 ? maskL : maskR;
    console.log("RotateImage", hscale, mask);
    width = width * enlarge;
    height = height * enlarge;
    context.drawImage(mask, -((width + w) / 2), -(height / 2), width, height);
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
    maskImageLUri,
    maskImageRUri,
    enlarge = 1,
    detections,
    showLandmarks,
    showMask,
	flipMask,
    photoTitle,
    maskAdjust = 1,
    maskType = 0,
    ...props
}: HTMLAttributes<HTMLCanvasElement> & {
    baseImageUri: string | null;
    maskImageLUri: string | null;
    maskImageRUri: string | null;
    enlarge: number;
    detections?: faceapi.WithFaceLandmarks<{
        detection: faceapi.FaceDetection;
    }>[],
    showLandmarks: boolean;
	flipMask: boolean;
	showMask?: boolean;
    photoTitle?: string | null | undefined;
    maskAdjust: number
    maskType: number
}) {
    const ref = useRef<HTMLCanvasElement>(null);
    const [ready, setReady] = useState(false);
    useEffect(() => {
        if (!window || !detections || !detections.length || !baseImageUri || !maskImageLUri || !maskImageRUri) {
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
            const bgImage = await createImageElement(baseImageUri);
            const maskL = await createImageElement(maskImageLUri);
            const maskR = await createImageElement(maskImageRUri);
            ref.current.height = bgImage.height;
            ref.current.width = bgImage.width;
            context.drawImage(bgImage, 0, 0);
            if (showLandmarks) {
                faceapi.draw.drawFaceLandmarks(ref.current, detections);
            }

            // Reference: https://github.com/akirawuc/auto-nounify-server/blob/main/services/nounify/main.py#L35
            if (showMask) {
                const maskDimension = getMaskDimension(maskL, maskAdjust);
                for (const face of detections) {
                    let [midX, midY, width, height, angle, hscale] = calcuateMaskPosition(maskType, face.landmarks, maskDimension, flipMask);
                    drawRotatedImage(context, maskL, maskR, maskAdjust, midX, midY, width, height, enlarge, angle, flipMask ? hscale : 1);
                }
            }

            setReady(true);
        }, 50);
        return () => clearTimeout(t);
    }, [ref, detections, baseImageUri, showLandmarks, showMask, flipMask, maskImageLUri, maskImageRUri, maskAdjust, maskType]);

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