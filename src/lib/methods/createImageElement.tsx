/**
 * Create image from source uri
 * @date 2023/10/26 - 上午12:25:20
 *
 * @param {string} src
 * @returns {Promise<HTMLImageElement>}
 */
function createImageElement(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const img = document.createElement('img');
        img.src = src;
        img.onload = () => resolve(img);
        img.onerror = reject;
    });
}

export { createImageElement }