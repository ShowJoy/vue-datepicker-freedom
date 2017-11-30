const makeResponse = () => `
  // importScripts('a.js', 'b.js'); // 加载需要的工具类或库
  self.onmessage = (e) => {
    let pixels = e.data;
    console.log('in worker', pixels);
    // let output_pixels = c.createImageData(pixels);
    let width = pixels.width;
    let height = pixels.height;

    let data = pixels.data;

    let n = 10;
    let m = n - 1;
    for (let row = 0; row < height; row++) {
      let i = row * width * 4 + 4;
      for (let col = 1; col < width; col++, i += 4) {
        data[i] = (data[i] + data[i - 4] * m) / n;
        data[i + 1] = (data[i + 1] + data[i - 3] * m) / n;
        data[i + 2] = (data[i + 2] + data[i - 2] * m) / n;
        data[i + 3] = (data[i + 3] + data[i - 1] * m) / n;
      }
    }
    // WorderGlobalScope 下是没有第二个参数的
    self.postMessage(pixels);
    return close();
  };
`;

export {
  makeResponse
};
