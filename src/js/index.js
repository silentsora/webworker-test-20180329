/**
 *
 * @authors Your Name (you@example.org)
 * @date    2018-03-27 18:00:35
 * @version $Id$
 */

// web worker preload test

// let workerList = [];
// let order = 0;

// import '../less/style.less';

// const createWorker = () => {
//     const worker = new Worker(require('./worker-preload.js'));

//     worker.onerror = (error) => {
//         console.log(error.message);
//         throw error;
//     };

//     worker.onmessage = (e) => {
//         console.log(e.data);
//     };
// };

const initCanvas = () => {
    let loadNum = 0;
    const grey1 = [];
    const grey2 = [];
    let sumList = [];

    const c = document.getElementById('canvas1');
    const ctx = c.getContext('2d');
    const img1 = new Image();
    const img2 = new Image();
    img1.src = require('./../img/test1.jpg');
    img2.src = require('./../img/test2.jpg');

    const drawImage = () => {
        ctx.drawImage(img1, 100, 100, img1.width, img1.height);
        ctx.drawImage(img2, 0, 0, img2.width, img2.height);
    };

    const getImageData = () => {
        const imgData1 = ctx.getImageData(100, 100, img1.width, img1.height).data;
        const imgData2 = ctx.getImageData(0, 0, img2.width, img2.height).data;

        for (let i = 0; i < imgData1.length; i += 4) {
            grey1[i / 4] = (imgData1[i] * 299 + imgData1[i + 1] * 587 + imgData1[i + 2] * 114 + 500) / 1000;
        }

        for (let i = 0; i < imgData2.length; i += 4) {
            grey2[i / 4] = (imgData2[i] * 299 + imgData2[i + 1] * 587 + imgData2[i + 2] * 114 + 500) / 1000;
        }
    };

    // const detectImg = () => {
    //     const compareImg = (x0, y0) => {
    //         let sum = 0;

    //         for (let x = x0; x < img2.width + x0; x++) {
    //             for (let y = y0; y < img2.height + y0; y++) {
    //                 sum += Math.abs(grey1[x + y * img1.width] - grey2[(x - x0) + (y - y0) * img2.width]);
    //             }
    //         }

    //         return parseFloat((sum / (img2.width * img2.height)).toFixed(2));
    //     };

    //     let i = 0;
    //     let startTime = new Date();

    //     for (let x0 = 0; x0 <= img1.width - img2.width; x0++) {
    //         for (let y0 = 0; y0 <= img1.height - img2.height; y0++) {
    //             sumList[i] = compareImg(x0, y0);
    //             i++;
    //         }
    //     }

    //     let endTime = new Date();
    //     let passTime = endTime - startTime;
    //     console.log(passTime);
    // };

    // const detectImgInWorker = () => {
    //     let i = 0;
    //     let startTime = new Date();
    //     let completeNum = 0;
    //     let pixelNum = (img1.width - img2.width + 1) * (img1.height - img2.height + 1);
    //     // const workerBlob = new Blob([document.getElementById('workerImg').textContent]);
    //     const workerBlob = new Blob(Array.prototype.map.call(document.querySelectorAll('script[type="text/js-worker"]'), function (oScript) { return oScript.textContent; }), {type: 'text/javascript'});
    //     const workerUrl = window.URL.createObjectURL(workerBlob);
    //     // console.log(workerBlob);

    //     for (let x0 = 0; x0 <= img1.width - img2.width; x0++) {
    //         for (let y0 = 0; y0 <= img1.height - img2.height; y0++) {
    //             let worker = new Worker(workerUrl);
    //             worker.onmessage = (e) => {
    //                 sumList[i] = e.data;
    //                 completeNum++;
    //                 i++;
    //                 if (completeNum === pixelNum) {
    //                     showArea();
    //                     let endTime = new Date();
    //                     let passTime = endTime - startTime;
    //                     console.log(`passTime: ${passTime}ms`);
    //                 }
    //             };
    //             worker.onerror = (e) => {
    //                 throw e.message;
    //             };
    //             worker.postMessage([x0, y0, img2.width, img2.height, img1.width, grey1, grey2]);
    //         }
    //     }
    // };

    const detectImgInWorker = () => {
        let startTime = new Date();
        let completeNum = 0;
        // const workerBlob = new Blob([document.getElementById('workerImg').textContent]);
        const workerBlob = new Blob(Array.prototype.map.call(document.querySelectorAll('script[type="text/js-worker"]'), function (oScript) { return oScript.textContent; }), {type: 'text/javascript'});
        const workerUrl = window.URL.createObjectURL(workerBlob);
        // console.log(workerBlob);

        // 划分成四个区域分别计算

        const worker1 = new Worker(workerUrl);
        worker1.onmessage = (e) => {
            sumList = sumList.concat(e.data);
            completeNum++;

            if (completeNum === 4) {
                showArea();
                let endTime = new Date();
                let passTime = endTime - startTime;
                console.log(`passTime: ${passTime}ms`);
            }
        };
        worker1.postMessage([0, 0, (img1.width - img2.width) / 4, img1.height - img2.height, img1.width, img2.width, img2.height, grey1, grey2]);

        const worker2 = new Worker(workerUrl);
        worker2.onmessage = (e) => {
            sumList = sumList.concat(e.data);
            completeNum++;

            if (completeNum === 4) {
                showArea();
                let endTime = new Date();
                let passTime = endTime - startTime;
                console.log(`passTime: ${passTime}ms`);
            }
        };
        worker2.postMessage([(img1.width - img2.width) / 4, 0, (img1.width - img2.width) * 2 / 4, img1.height - img2.height, img1.width, img2.width, img2.height, grey1, grey2]);

        const worker3 = new Worker(workerUrl);
        worker3.onmessage = (e) => {
            sumList = sumList.concat(e.data);
            completeNum++;

            if (completeNum === 4) {
                showArea();
                let endTime = new Date();
                let passTime = endTime - startTime;
                console.log(`passTime: ${passTime}ms`);
            }
        };
        worker3.postMessage([(img1.width - img2.width) * 2 / 4, 0, (img1.width - img2.width) * 3 / 4, img1.height - img2.height, img1.width, img2.width, img2.height, grey1, grey2]);

        const worker4 = new Worker(workerUrl);
        worker4.onmessage = (e) => {
            sumList = sumList.concat(e.data);
            completeNum++;

            if (completeNum === 4) {
                showArea();
                let endTime = new Date();
                let passTime = endTime - startTime;
                console.log(`passTime: ${passTime}ms`);
            }
        };
        worker4.postMessage([(img1.width - img2.width) * 3 / 4, 0, img1.width - img2.width, img1.height - img2.height, img1.width, img2.width, img2.height, grey1, grey2]);
    };

    const showArea = () => {
        let min = sumList[0];
        let minIndex = 0;
        let minY, minX;

        for (let i = 0; i < sumList.length; i++) {
            if (sumList[i] < min) {
                min = sumList[i];
                minIndex = i;
            }
        }

        if (img1.height > img2.height) {
            minY = minIndex % (img1.height - img2.height) + 100;
            minX = Math.floor(minIndex / (img1.height - img2.height)) + 100;
        } else {
            minY = 100;
            minX = 100;
        }

        const drawLine = () => {
            ctx.lineWidth = 2;
            ctx.strokeStyle = 'red';
            ctx.moveTo(minX, minY);
            ctx.lineTo(minX + img2.width, minY);
            ctx.lineTo(minX + img2.width, minY + img2.height);
            ctx.lineTo(minX, minY + img2.height);
            ctx.lineTo(minX, minY);
            ctx.stroke();
        };

        drawLine();
        console.log(min, minIndex, minX, minY);
    };

    const loadImg = () => {
        img1.onload = () => {
            loadNum++;
            if (loadNum === 2) {
                drawImage();
                getImageData();
                // detectImg();
                detectImgInWorker();
                // showArea();
            }
        };

        img2.onload = () => {
            loadNum++;
            if (loadNum === 2) {
                drawImage();
                getImageData();
                // detectImg();
                detectImgInWorker();
                // showArea();
            }
        };
    };

    loadImg();
};

initCanvas();
// createWorker();
