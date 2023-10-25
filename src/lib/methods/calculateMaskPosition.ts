import * as faceapi from 'face-api.js';
import { MaskDimension } from '../types';
import { maskTypes } from '@/settings/global';


/**
 * Description placeholder
 * @date 2023/10/26 - 上午12:02:40
 *
 * @param {faceapi.Point[]} points
 * @returns {{ x: number; y: number; }}
 */
function middlePoint(points: faceapi.Point[]) {
    const x = points.reduce((acc, curr) => acc + curr.x, 0) / points.length;
    const y = points.reduce((acc, curr) => acc + curr.y, 0) / points.length;
    return { x, y };
}

/**
 * Get the mask image dimension from the HTMLImageElement
 * @date 2023/10/26 - 上午12:03:12
 *
 * @export
 * @param {HTMLImageElement} mask
 * @param {number} [widthAdjust=1]
 * @returns {MaskDimension}
 */
export function getMaskDimension(mask: HTMLImageElement, widthAdjust: number = 1): MaskDimension {
    const width = mask.width;
    const height = mask.height;
    return { width, height, widthAdjust }
}


/**
 * Calculate the positions of mask in the background image
 * @date 2023/10/26 - 上午12:03:12
 *
 * @export
 * @param {number} maskType
 * @param {faceapi.FaceLandmarks68} landmarks
 * @param {MaskDimension} maskDimension
 * @param {boolean} flipMask
 * @returns {Array<number>}
 * @example [midX, midY, width, height, angle, hscale]
 * @description midX,midY: Middle point of mask image in the background image
 * @description width,height: width/height of mask image
 * @description angle, hscale: rotated angle and flipping flag of the mask image
 */

export function calcuateMaskPosition(maskType: number, landmarks: faceapi.FaceLandmarks68, maskDimension: MaskDimension, flipMask: boolean): Array<number> {
    //Eyes Middle point
    const leftEyeMid = middlePoint(landmarks.getLeftEye()); 
    const rightEyeMid = middlePoint(landmarks.getRightEye());

    //Most left/right points of eyes/face
    const leftEye = landmarks.positions[36];
    const rightEye = landmarks.positions[45];
    const leftFace = landmarks.positions[0];
    const rightFace = landmarks.positions[16];

    //face width
    const faceWidth = leftFace.x - rightFace.x;

    //Mid points between face and eyes boundary
    const leftFaceMid = { x: (leftFace.x + leftEye.x) / 2, y: (leftFace.y + leftEye.y) / 2 };
    const rightFaceMid = { x: (rightFace.x + rightEye.x) / 2, y: (rightFace.y + rightEye.y) / 2 };

    //Face height
    const faceLeftTop = landmarks.positions[19];
    const faceRightTop = landmarks.positions[24];
    const faceBottom = landmarks.positions[8];
    const [heightLeftA, heightLeftB] = [(faceLeftTop.x - faceBottom.x), (faceLeftTop.y - faceBottom.y)];
    const [heightRightA, heightRightB] = [(faceRightTop.x - faceBottom.x), (faceRightTop.y - faceBottom.y)];
    const leftFaceHeight = Math.sqrt(heightLeftA * heightLeftA + heightLeftB * heightLeftB);
    const rightFaceHeight = Math.sqrt(heightRightA * heightRightA + heightRightB * heightRightB);

    //Take the longer one as the face height
    const faceHeight = Math.max(leftFaceHeight, rightFaceHeight);

    //Nose position
    const nose = landmarks.positions[27] //27 or 28

    //Length of left/right between left/right face and nose. To detect the direction of the face
    const [leftA, leftB] = [(nose.x - leftFace.x), (nose.y - leftFace.y)];
    const [rightA, rightB] = [(nose.x - rightFace.x), (nose.y - rightFace.y)];
    const leftFaceDistance = Math.sqrt(leftA * leftA + leftB * leftB); //a2 + b2 = c2 ,Pythagorean theorem
    const rightFaceDistance = Math.sqrt(rightA * rightA + rightB * rightB);

    //for flipping according to the face direction
    const hscale = rightFaceDistance > leftFaceDistance && flipMask ? -1 : 1;
    console.log("face:", leftEye, leftFace, rightEye, rightFace, leftFaceDistance, rightFaceDistance, leftFaceMid, rightFaceMid);

    //Calculation the attributes accoring to maskType
    switch (maskType) {
        //Base on the middle point of the eyes
        case maskTypes.byEyesMiddle:
            return (() => {
                const dx = rightEyeMid.x - leftEyeMid.x;
                const dy = rightEyeMid.y - leftEyeMid.y;
                const angle = Math.atan2(dy, dx);
                const width = Math.abs(rightEyeMid.x - leftEyeMid.x) * maskDimension.widthAdjust;
                const height = Math.abs(width * maskDimension.height / maskDimension.width);
                const midX = (rightEyeMid.x + leftEyeMid.x) / 2;
                const midY = (rightEyeMid.y + leftEyeMid.y) / 2;
                return [midX, midY, width, height, angle, hscale]
            })();

        //Base on the face width 
        case maskTypes.byFaceWidth:
            return (() => {
                const dx = rightFace.x - leftFace.x;
                const dy = rightFace.y - leftFace.y;
                const angle = Math.atan2(dy, dx);
                const width = Math.abs(faceWidth) * maskDimension.widthAdjust;
                const height = Math.abs(width * maskDimension.height / maskDimension.width);
                const midX = nose.x;
                const midY = nose.y;
                return [midX, midY, width, height, angle, hscale]
            })();

        //Mask the whole face without concern the ratio
        case maskTypes.fullFace: //Not by ratio
            return (() => {
                const dx = rightFace.x - leftFace.x;
                const dy = rightFace.y - leftFace.y;
                const angle = Math.atan2(dy, dx);
                const width = Math.abs(faceWidth) * maskDimension.widthAdjust;

                const height = faceHeight;
                const midX = nose.x;
                const midY = nose.y;
                return [midX, midY, width, height, angle, hscale]
            })();

        //Type 0: Base on middle of the face boundary and the eye boundary
        default:
            return (() => {
                const dx = rightFaceMid.x - leftFaceMid.x;
                const dy = rightFaceMid.y - leftFaceMid.y;
                const angle = Math.atan2(dy, dx);
                const width = Math.abs(leftFaceMid.x - rightFaceMid.x) * maskDimension.widthAdjust;
                const height = Math.abs(width * maskDimension.height / maskDimension.width);
                const midX = nose.x;
                const midY = nose.y;
                return [midX, midY, width, height, angle, hscale]
            })();

    }


}