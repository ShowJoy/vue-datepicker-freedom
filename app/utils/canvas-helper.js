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

// 圆角矩形
function roundedRect(ctx, x, y, width, height, radius, lineWidth) {
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
}

export {
  sparkLine,
  smear,
  roundedRect
};
