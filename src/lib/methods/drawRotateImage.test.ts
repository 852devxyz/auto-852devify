/**
 * @jest-environment jsdom
 */
import { renderIntoDocument } from "react-dom/test-utils";
import { createImageElement } from "./createImageElement";
import { drawRotatedImage } from "./drawRotatedImage";


it('draw Mask into photo', async () => {

    let photo = await createImageElement('http://852dev.bdragon.xyz/sample_images/to_be_improved/6_input.jpg');
    let maskl = await createImageElement('http://852dev.bdragon.xyz/red160px.png');
    let maskr = await createImageElement('http://852dev.bdragon.xyz/redr160px.png');

    let canvas = document.createElement('canvas');
    let ctx = canvas.getContext('2d',{ willReadFrequently: true });
    canvas.width = photo.width;
    canvas.height = photo.height;
    ctx?.drawImage(photo, 0,0, photo.width, photo.height);
    if (!ctx) {
        return;
    }
    //return [midX, midY, width, height, angle, hscale]
    //{  "height": 571,  "width": 1240,  "widthAdjust": 1,}
   
    drawRotatedImage(ctx, maskl, maskr, 1.18,
        675.6616582870483,
        184.46915025630238,
        38.9515699390322,
        14.606838727137074,
        0.1785819852982527,
        -1,1)
    //ctx.drawImage(maskl, 0,0,160,60);
    //ctx.save();
    expect(canvas.toDataURL()).toMatchSnapshot()
})