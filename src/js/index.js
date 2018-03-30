/**
 *
 * @authors Your Name (you@example.org)
 * @date    2018-03-27 18:00:35
 * @version $Id$
 */

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

    const detectImg = () => {
        const compareImg = (x0, y0) => {
            let sum = 0;

            for (let x = x0; x < img2.width + x0; x++) {
                for (let y = y0; y < img2.height + y0; y++) {
                    sum += Math.abs(grey1[x + y * img1.width] - grey2[(x - x0) + (y - y0) * img2.width]);
                }
            }

            return parseFloat((sum / (img2.width * img2.height)).toFixed(2));
        };

        let i = 0;
        let startTime = new Date();

        for (let x0 = 0; x0 < img1.width - img2.width; x0++) {
            for (let y0 = 0; y0 < img1.height - img2.height; y0++) {
                sumList[i] = compareImg(x0, y0);
                i++;
            }
        }

        showArea();

        let endTime = new Date();
        let passTime = endTime - startTime;
        console.log(`passTime: ${passTime}ms`);

        document.querySelector('.single-time').innerHTML = 'single: ' + passTime + 'ms';
    };

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

    function workerText () {
        const compareImg = (x0, y0, img1Width, img2Width, img2Height, grey1, grey2) => {
            let sum = 0;

            for (let x = x0; x < img2Width + x0; x++) {
                for (let y = y0; y < img2Height + y0; y++) {
                    sum += Math.abs(grey1[x + y * img1Width] - grey2[(x - x0) + (y - y0) * img2Width]);
                }
            }

            return parseFloat((sum / (img2Width * img2Height)).toFixed(2));
        };

        onmessage = (e) => {
            let sumList = [];
            let i = 0;

            let data = JSON.parse(e.data);

            let xStart = Math.floor(data.xStart);
            let yStart = Math.floor(data.yStart);
            let xEnd = Math.floor(data.xEnd);
            let yEnd = Math.floor(data.yEnd);

            for (let x0 = xStart; x0 < xEnd; x0++) {
                for (let y0 = yStart; y0 < yEnd; y0++) {
                    sumList[i] = compareImg(x0, y0, data.img1Width, data.img2Width, data.img2Height, data.grey1, data.grey2);
                    i++;
                }
            }

            postMessage(sumList);
            close();
        };
    }

    const detectImgInWorker = () => {
        let startTime = new Date();
        let completeNum = 0;
        const workerBlob = new Blob([workerText.toString().replace(/^function .+\{?|\}$|\};$/g, '')], {type: 'text/javascript'});
        const workerUrl = window.URL.createObjectURL(workerBlob);

        const completeHandler = () => {
            showArea();
            let endTime = new Date();
            let passTime = endTime - startTime;
            console.log(`passTime: ${passTime}ms`);
            document.querySelector('.multiple-time').innerHTML = 'multiple: ' + passTime + 'ms';
        };

        const createWorker = (index) => {
            const worker = new Worker(workerUrl);

            worker.onerror = (e) => {
                throw e.message;
            };

            if (index === 0) {
                worker.onmessage = (e) => {
                    sumList = sumList.concat(e.data);
                    completeNum++;
                };

                let postData = {
                    xStart: 0,
                    yStart: 0,
                    xEnd: (img1.width - img2.width) / 4,
                    yEnd: img1.height - img2.height,
                    img1Width: img1.width,
                    img2Width: img2.width,
                    img2Height: img2.height,
                    grey1: grey1,
                    grey2: grey2
                };

                worker.postMessage(JSON.stringify(postData));
            } else {
                worker.onmessage = (e) => {
                    let inv = setInterval(() => {
                        if (completeNum === index) {
                            clearInterval(inv);
                            sumList = sumList.concat(e.data);
                            completeNum++;

                            if (completeNum === 4) {
                                completeHandler();
                            }
                        }
                    }, 30);
                };

                let postData = {
                    xStart: (img1.width - img2.width) * index / 4,
                    yStart: 0,
                    xEnd: (img1.width - img2.width) * (index + 1) / 4,
                    yEnd: img1.height - img2.height,
                    img1Width: img1.width,
                    img2Width: img2.width,
                    img2Height: img2.height,
                    grey1: grey1,
                    grey2: grey2
                };

                worker.postMessage(JSON.stringify(postData));
            }
        };

        // 划分成四个区域分别计算
        createWorker(0);
        createWorker(1);
        createWorker(2);
        createWorker(3);
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
                document.querySelector('.btn-single').style.display = 'inline-block';
                document.querySelector('.btn-multiple').style.display = 'inline-block';
            }
        };

        img2.onload = () => {
            loadNum++;
            if (loadNum === 2) {
                drawImage();
                getImageData();
                document.querySelector('.btn-single').style.display = 'inline-block';
                document.querySelector('.btn-multiple').style.display = 'inline-block';
            }
        };

        document.querySelector('.btn-single').addEventListener('click', detectImg);
        document.querySelector('.btn-multiple').addEventListener('click', detectImgInWorker);
    };

    loadImg();
};

initCanvas();
