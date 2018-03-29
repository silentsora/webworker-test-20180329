/**
 *
 * @authors Your Name (you@example.org)
 * @date    2018-03-27 18:04:08
 * @version $Id$
 */

// const compareImg = (x0, y0, img2Width, img2Height, img1Width, grey1, grey2) => {
//     let sum = 0;

//     for (let x = x0; x < img2Width + x0; x++) {
//         for (let y = y0; y < img2Height + y0; y++) {
//             sum += Math.abs(grey1[x + y * img1Width] - grey2[(x - x0) + (y - y0) * img2Width]);
//         }
//     }

//     return parseFloat((sum / (img2Width * img2Height)).toFixed(2));
// };

// onmessage = (e) => {
//     let avg = compareImg(e.data[0], e.data[1], e.data[2], e.data[3], e.data[4], e.data[5], e.data[6]);
//     postMessage(avg);
//     close();
// };

// const compareImg = (x0, y0, img1Width, img2Width, img2Height, grey1, grey2) => {
//     let sum = 0;

//     for (let x = x0; x < img2Width + x0; x++) {
//         for (let y = y0; y < img2Height + y0; y++) {
//             sum += Math.abs(grey1[x + y * img1Width] - grey2[(x - x0) + (y - y0) * img2Width]);
//         }
//     }

//     return parseFloat((sum / (img2Width * img2Height)).toFixed(2));
// };

// onmessage = (e) => {
//     let sumList = [];
//     let i = 0;

//     let xStart = e.data[0];
//     let yStart = e.data[1];
//     let xEnd = e.data[2];
//     let yEnd = e.data[3];

//     let img1Width = e.data[4];
//     let img2Width = e.data[5];
//     let img2Height = e.data[6];

//     let grey1 = e.data[7];
//     let grey2 = e.data[8];

//     for (let x0 = xStart; x0 <= xEnd; x0++) {
//         for (let y0 = yStart; y0 <= yEnd; y0++) {
//             sumList[i] = compareImg(x0, y0, img1Width, img2Width, img2Height, grey1, grey2);
//             i++;
//         }
//     }

//     postMessage(sumList);
// };
