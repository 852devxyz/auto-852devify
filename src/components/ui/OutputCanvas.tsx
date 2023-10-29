
'use client';
import { HTMLAttributes, useEffect, useRef, useState } from 'react';
import { calcuateMaskPosition, getMaskDimension } from '@/lib/methods/calculateMaskPosition'
import jsFileDownload from 'js-file-download';
import { DownloadIcon, Loader2Icon } from 'lucide-react';
import * as faceapi from 'face-api.js';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { maskTypes } from '@/settings/global';
import { drawRotatedImage } from '@/lib/methods/drawRotatedImage';
import { createImageElement } from '@/lib/methods/createImageElement';



/**
 * Generate canvas and container html
 * @date 2023/10/26 - 上午12:25:20
 *
 * @export
 * @param {HTMLAttributes<HTMLCanvasElement> & {
 *     baseImageUri: string | null;
 *     maskImageLUri: string | null;
 *     maskImageRUri: string | null;
 *     enlarge: number;
 *     detections?: faceapi.WithFaceLandmarks<{
 *         detection: faceapi.FaceDetection;
 *     }>[],
 *     showLandmarks: boolean;
 * 	flipMask: boolean;
 * 	showMask?: boolean;
 *     photoTitle?: string | null | undefined;
 *     maskAdjust: number
 *     maskType: number
 * }} param0
 * @param {*} param0.baseImageUri
 * @param {*} param0.maskImageLUri
 * @param {*} param0.maskImageRUri
 * @param {*} [param0.enlarge=1]
 * @param {*} param0.detections
 * @param {*} param0.showLandmarks
 * @param {*} param0.showMask
 * @param {*} param0.flipMask
 * @param {*} param0.photoTitle
 * @param {*} [param0.maskAdjust=1]
 * @param {*} [param0.maskType=0]
 * @param {*} param0....props
 * @returns {*}
 */
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
                    drawRotatedImage(context, maskL, maskR, maskAdjust, midX, midY, width, height, angle, flipMask ? hscale : 1, enlarge);
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
                                        jsFileDownload(await response.blob(), '852devify.png');
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