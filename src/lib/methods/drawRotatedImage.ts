/**
 * Draw masks to the background image canvas
 * @date 2023/10/26 - 上午12:25:20
 *
 * @param {CanvasRenderingContext2D} context
 * @param {CanvasImageSource} maskL
 * @param {CanvasImageSource} maskR
 * @param {number} maskAdjust
 * @param {number} x
 * @param {number} y
 * @param {number} width
 * @param {number} height
 * @param {number} enlarge
 * @param {number} angle
 * @param {number} hscale
 */
export function drawRotatedImage(
    context: CanvasRenderingContext2D,
    maskL: CanvasImageSource,
    maskR: CanvasImageSource,
    maskAdjust: number,
    x: number,
    y: number,
    width: number,
    height: number,
    angle: number,
    hscale: number,
    enlarge: number,
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
    width = width * enlarge;
    height = height * enlarge;
    context.drawImage(mask, -((width + w) / 2), -(height / 2), width, height);
    
    // and restore the coords to how they were when we began
    context.restore();

    return context;
}