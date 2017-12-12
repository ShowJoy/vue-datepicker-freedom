import { makeResponse } from './SearWorker.js';
import imgSrc from 'app/assets/cat.jpeg';

// 微型折线图
function sparkLine() {
  let elts = document.querySelectorAll('.sparkline');
  for (let e = 0; e < elts.length; e++) {
    var elt = elts[e];

    let content = elt.textContent || elt.innerText;
    content = content.replace(/^\s+|\s+$/g, '').replace(/#.*$/gm, '');
    let text = content.replace(/[\n\r\t\v\f]/g, ' ');
    let data = text.split(/\s+|\s*,\s*/);

    for (let i = 0; i < data.length; i++) {
      data[i] = +data[i];
      if (isNaN(data[i])) {
        return;
      }
    }

    let style = getComputedStyle(elt, null);
    let color = style.color;
    let height = parseInt(elt.getAttribute('data-height'), 10) ||
      parseInt(style.fontSize, 10) || 20;
    let width = parseInt(elt.getAttribute('data-width'), 10) ||
      parseInt(elt.getAttribute('data-dx'), 10) * data.length || height * 6;
    let ymin = parseInt(elt.getAttribute('data-ymin'), 10) || Math.min.apply(Math, data);
    let ymax = parseInt(elt.getAttribute('data-ymax'), 10) || Math.max.apply(Math, data);

    if (ymin >= ymax) ymax = ymin + 1;

    let canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    canvas.title = content;
    elt.innerHTML = '';
    elt.appendChild(canvas);

    let ctx = canvas.getContext('2d');
    for (let i = 0; i < data.length; i++) {
      let x = width * i / data.length;
      let y = (ymax - data[i]) * height / (ymax - ymin);
      ctx.lineTo(x, y);
    }

    ctx.strokeStyle = color;
    ctx.stroke();
  }
}

// 涂抹效果
function smear(c, n, x, y, w, h) {
  var pixels = c.getImageData(x, y, w, h);

  console.log(pixels);
  // var output_pixels = c.createImageData(pixels);
  var width = pixels.width;
  var height = pixels.height;

  var data = pixels.data;

  var m = n - 1;
  for (var row = 0; row < height; row++) {
    var i = row * width * 4 + 4;
    for (var col = 1; col < width; col++, i += 4) {
      data[i] = (data[i] + data[i - 4] * m) / n;
      data[i + 1] = (data[i + 1] + data[i - 3] * m) / n;
      data[i + 2] = (data[i + 2] + data[i - 2] * m) / n;
      data[i + 3] = 0; // (data[i + 3] + data[i - 1] * m) / n;
    }
  }
  c.putImageData(pixels, x, y);
}

// 矩形
function drawRect(ctx, x, y, width, height, color) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.fillRect(x, y, width, height);
  ctx.restore();
}

// 线条
function drawLine(ctx, startX, startY, endX, endY, color) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.beginPath();
  ctx.moveTo(startX, startY);
  ctx.lineTo(endX, endY);
  ctx.closePath();
  ctx.stroke();
  ctx.restore();
}

// 圆角矩形
function drawRoundedRect(ctx, x, y, width, height, radius, lineWidth) {
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(x, y + radius);
  ctx.lineTo(x, y + height - radius);
  ctx.quadraticCurveTo(x, y + height, x + radius, y + height);
  ctx.lineTo(x + width - radius, y + height);
  ctx.quadraticCurveTo(x + width, y + height, x + width, y + height - radius);
  ctx.lineTo(x + width, y + radius);
  ctx.quadraticCurveTo(x + width, y, x + width - radius, y);
  ctx.lineTo(x + radius, y);
  ctx.quadraticCurveTo(x, y, x, y + radius);
  ctx.lineWidth = lineWidth || 1;
  ctx.stroke();
  ctx.restore();
}

function Banner(kw) {
  let cvs = null;
  let ctx = null;
  let bgCvs = null;
  let bgCtx = null;
  let denseness = 10;
  let parts = [];
  let mouse = {x: -100, y: -100};
  let mouseOnScreen = false;

  let itercount = 0;
  let itertot = 40;

  this.initialize = cvs_id => {
    cvs = document.querySelector(cvs_id);
    ctx = cvs.getContext('2d');

    cvs.width = window.innerWidth;
    cvs.height = window.innerHeight;

    bgCvs = document.createElement('canvas');
    bgCtx = cvs.getContext('2d');

    bgCvs.width = window.innerWidth;
    bgCvs.height = window.innerHeight;

    cvs.addEventListener('mousemove', move, false);
    cvs.addEventListener('mouseout', out, false);

    start();
  };

  var start = function() {
    bgCtx.fillStyle = '#000000';
    bgCtx.font = '200px impact';
    bgCtx.textBaseline = 'hanging';
    bgCtx.fillText(kw, 0, 0);

    let imageData = bgCtx.getImageData(0, 0, cvs.width, cvs.height);
    clear();
    getCoords(imageData);
  };

  let getCoords = function(imageData) {
    for (let height = 0; height < bgCvs.height; height += denseness) {
      for (let width = 0; width < bgCvs.width; width += denseness) {
        let pixel = imageData.data[(width + height * bgCvs.width) * 4 - 1];
        if (pixel === 255) {
          drawCircle(width, height);
        }
      }
    }
    setInterval(update, 40);
  };

  let drawCircle = function(x, y) {
    let startx = Math.random() * cvs.width;
    let starty = Math.random() * cvs.height;

    let velx = (x - startx) / itertot;
    let vely = (y - starty) / itertot;

    parts.push({
      c: '#' + (Math.random() * 0x949494 + 0xaaaaaa | 0).toString(16),
      x,
      y,
      x2: startx,
      y2: starty,
      r: true,
      v: {x: velx, y: vely}
    });
  };

  let update = function() {
    itercount++;
    clear();
    for (let i = 0; i < parts.length; i++) {
      let part = parts[i];
      if (part.r === true) {
        part.x2 += part.v.x;
        part.y2 += part.v.y;
      }
      if (itercount === itertot) {
        part.v = {x: Math.random() * 6 * 2 - 6, y: Math.random() * 6 * 2 - 6};
        part.r = false;
      }

      let dx = part.x - mouse.x;
      let dy = part.y - mouse.y;
      let sqrDist = Math.sqrt(dx * dx + dy * dy);
      if (sqrDist < 20) {
        part.r = true;
      }

      ctx.fillStyle = part.c;
      ctx.beginPath();
      ctx.arc(part.x2, part.y2, 4, 0, Math.PI * 2, true);
      ctx.closePath();
      ctx.fill();
    }
  };
  let move = function(e) {
    if (e.layerX || e.layerX === 0) {
      mouseOnScreen = true;
      mouse.x = e.layerX - cvs.offsetLeft;
      mouse.y = e.layerY - cvs.offsetTop;
    }
  };

  let out = function(e) {
    mouseOnScreen = false;
    mouse.x = -100;
    mouse.y = -100;
  };

  let clear = function() {
    ctx.fillStyle = '#333';
    ctx.beginPath();
    ctx.rect(0, 0, cvs.width, cvs.height);
    ctx.closePath();
    ctx.fill();
  };
}

// 球滚动控制demo
function ballDemo(cvs) {
  let ctx = cvs.getContext('2d');
  let crect = cvs.getBoundingClientRect();
  let running = false;

  let ball = {
    x: 100,
    y: 100,
    radius: 25,
    vx: 5,
    vy: 2,
    color: 'blue',
    raf: null,
    draw: function() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
      ctx.closePath();
      ctx.fillStyle = this.color;
      ctx.fill();
    }
  };

  function clear() {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.fillRect(0, 0, cvs.width, cvs.height);
  }

  function draw() {
    clear();
    ball.draw();
    ball.x += ball.vx;
    ball.y += ball.vy;

    ball.vy *= 0.99;
    ball.vy += 0.25;
    if (ball.x + ball.vx + ball.radius > cvs.width || ball.x + ball.vx - ball.radius < 0) {
      ball.vx = -ball.vx;
    }
    if (ball.y + ball.vy + ball.radius > cvs.height || ball.y + ball.vy - ball.radius < 0) {
      ball.vy = -ball.vy;
    }
    ball.raf = window.requestAnimationFrame(draw);
  }

  cvs.addEventListener('mousemove', (e) => {
    if (!running) {
      clear();
      ball.x = e.layerX;
      ball.y = e.layerY;
      ball.draw();
    }
  });
  cvs.addEventListener('click', () => {
    if (!running) {
      ball.raf = window.requestAnimationFrame(draw);
      running = true;
    }
  });
  cvs.addEventListener('mouseout', () => {
    window.cancelAnimationFrame(ball.raf);
    running = false;
  });

  ball.draw();
}

// woker demo
function wokerDemo() {
  let cvs = document.createElement('canvas');
  let ctx = cvs.getContext('2d');

  let img = new Image();
  img.src = imgSrc;
  img.onload = function() {
    cvs.width = img.width;
    cvs.height = img.height;

    ctx.drawImage(img, 0, 0);
    let pixels = ctx.getImageData(0, 0, img.width, img.height);

    let response = makeResponse();
    let worker = new Worker(URL.createObjectURL(new Blob([response], { type: 'application/javascript' })));

    worker.postMessage(pixels);
    worker.onmessage = function(e) {
      console.log('worker', e);
      let smeared_pixels = e.data;
      ctx.putImageData(smeared_pixels, 0, 0);
      let img2 = document.createElement('img');
      img2.src = cvs.toDataURL();
      document.body.appendChild(img2);
      worker.terminate();
      cvs.width = cvs.height = 0;
    };
  };
}

let Barchart = function(options) {
  let defaultSetting = {
    colors: ['#a55ca5', '#67b6c7', '#bccd7a', '#eb9743'],
    gridColor: 'lightgray',
    gridScale: 50,
    padding: 10
  };
  options = Object.assign(defaultSetting, options);
  this.options = options;
  this.cvs = options.canvas;
  this.ctx = this.cvs.getContext('2d');
  this.colors = options.colors;

  this.draw = function() {
    let maxValue = 0;
    for (let index in this.options.data) {
      maxValue = Math.max(maxValue, this.options.data[index]);
    }

    let cvsActualHeight = this.cvs.height - this.options.padding * 2;
    let cvsActualWidth = this.cvs.width - this.options.padding * 2;

    let gridValue = 0;
    while (gridValue <= maxValue + this.options.gridScale) {
      let gridY = cvsActualHeight * (1 - gridValue / maxValue) + this.options.padding;
      drawLine(this.ctx, 0, gridY, this.cvs.width, gridY, this.options.gridColor);

      this.ctx.save();
      this.ctx.fillStyle = this.options.gridColor;
      this.ctx.font = 'bold 10px Arial';
      this.ctx.fillText(gridValue, 10, gridY - 2); // 纵轴 刻度值
      this.ctx.restore();

      gridValue += this.options.gridScale;
      console.log(gridValue, maxValue + this.options.gridScale);
    }

    let barsNo = Object.keys(this.options.data).length;
    let barSize = cvsActualWidth / barsNo;

    for (let index in this.options.data) {
      let value = this.options.data[index];
      let barHeight = Math.round(this.cvs.height * value / maxValue);
      drawRect(
        this.ctx,
        this.options.padding + index * barSize,
        this.cvs.height - barHeight - this.options.padding,
        barSize,
        barHeight,
        this.colors[index % this.colors.length]
      );
    }

    this.ctx.save();
    this.ctx.textBaseline = 'bottom';
    this.ctx.textAlign = 'center';
    this.ctx.fillStyle = '#000000';
    this.ctx.font = 'bold 14px Arial';
    this.ctx.fillText(this.options.seriesName, this.cvs.width / 2, this.cvs.height);
    this.ctx.restore();
  };
};

export {
  sparkLine,
  smear,
  drawRoundedRect,
  drawLine,
  drawRect,
  ballDemo,
  wokerDemo,
  Banner,
  Barchart
};
