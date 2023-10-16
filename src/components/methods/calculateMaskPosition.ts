import * as faceapi from 'face-api.js';
//const GLASSES_SCALE_FACTOR = 2.2;

function middlePoint(points: faceapi.Point[]) {
    const x = points.reduce((acc, curr) => acc + curr.x, 0) / points.length;
    const y = points.reduce((acc, curr) => acc + curr.y, 0) / points.length;
    return { x, y };
}

export function getMaskDimension(mask: HTMLImageElement, widthAdjust: number = 1){
    const width = mask.width;
    const height = mask.height;
    return {width, height, widthAdjust}
}


export function calcuateMaskPosition(landmarks: faceapi.FaceLandmarks68, maskDimension: any) {
    const leftEyeMid = middlePoint(landmarks.getLeftEye());
    const rightEyeMid = middlePoint(landmarks.getRightEye());
    const leftEye = landmarks.positions[36];
    const rightEye = landmarks.positions[45];
    const leftFace = landmarks.positions[0];
    const rightFace = landmarks.positions[16];
    const leftFaceMid = {x: (leftFace.x + leftEye.x) / 2, y: (leftFace.y + leftEye.y) / 2};
    const rightFaceMid = {x: (rightFace.x + rightEye.x) / 2, y: (rightFace.y + rightEye.y) / 2};
    const nose = landmarks.positions[27] //27 or 28
    //const [leftA,leftB ]= [(leftEye.x - leftFace.x),(leftEye.y - leftFace.y)];
    //const [rightA,rightB ]= [(rightEye.x - rightFace.x),(rightEye.y - rightFace.y)];
    const [leftA,leftB ]= [(nose.x - leftFace.x),(nose.y - leftFace.y)];
    const [rightA,rightB ]= [(nose.x - rightFace.x),(nose.y - rightFace.y)];
    
    const leftFaceDistance = Math.sqrt(leftA * leftA + leftB * leftB); //a2 + b2 = c2 ,Pythagorean theorem
    const rightFaceDistance = Math.sqrt(rightA * rightA + rightB * rightB);
    console.log("face:", leftEye, leftFace, rightEye, rightFace, leftFaceDistance, rightFaceDistance,leftFaceMid,rightFaceMid);
    const hscale = rightFaceDistance > leftFaceDistance ? -1 : 1;
    const dx = rightFace.x - leftFace.x;
    const dy = rightFace.y - leftFace.y;
    const angle = Math.atan2(dy, dx) * hscale;
    //const width = Math.abs(leftEyeMid.x - rightEyeMid.x) * GLASSES_SCALE_FACTOR;
    const width = Math.abs(leftFaceMid.x - rightFaceMid.x) * maskDimension.widthAdjust;
    const height = Math.abs(width * maskDimension.height / maskDimension.width);
    //const mxAbject = width * 0.2 * hscale;
    //let [midX, midY, width, height, angle, hscale] = cacluateMaskPosition(face.landmarks)
    //return [(leftFaceMid.x + rightFaceMid.x) / 2 , nose.y, width, height, angle, hscale]
    const leftFaceNoseDistance = Math.abs(leftFace.x - nose.x);
    //const midX = leftFaceNoseDistance > width / 2 ? nose.x : nose.x - (leftFaceNoseDistance - (width / 2));
    const midX = nose.x;
	console.log("xyz", rightEye, rightFace, rightFaceMid);
    return [midX , nose.y, width, height, angle, hscale]

}