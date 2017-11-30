import './style.css';
import a from './assets/applause.wav';
import cat from './assets/cat.jpeg';

let audio = new Audio(a);

document.querySelector('#btn').addEventListener('click', () => {
  document.querySelector('#img').src = cat;
  audio.play();
});

document.body.appendChild(
  pieChart([12, 23, 44, 98], 640, 400, 200, 200, 150, ['red', 'green', 'yellow', 'blue'], ['North', 'South', 'East', 'West'], 400, 100)
);


// 恢复保存当前canvas状态
CanvasRenderingContext2D.prototype.revert = function() {
  this.restore();
  this.save();
  return this;
};
// 设置或获取canvas属性
CanvasRenderingContext2D.prototype.attrs = function(o) {
  if (o) {
    for (var a in o) {
      this[a] = o[a];
    }
  } else {
    return {
      fillStyle: this.fillStyle,
      font: this.font,
      globalAlpha: this.globalAlpha,
      globalCompositeOperation: this.globalCompositeOperation,
      lineCap: this.lineCap,
      lineJoin: this.lineJoin,
      lineWidth: this.lineWidth,
      miterLimit: this.miterLimit,
      textAlign: this.textAlign,
      textBaseline: this.textBaseline,
      shadowBlur: this.shadowBlur,
      shadowColor: this.shadowColor,
      shadowOffsetX: this.shadowOffsetX,
      shadowOffsetY: this.shadowOffsetY,
      strokeStyle: this.strokeStyle
    };
  }
};

var cvs = document.querySelector('#cvs');
cvs.width = 500;
cvs.height = 500;
var ctx = cvs.getContext('2d');

ctx.moveTo(5, 5);
ctx.lineTo(45, 45);
ctx.lineWidth = 8;
ctx.lineCap = 'round';
ctx.stroke();

ctx.translate(50, 100);
ctx.rotate(-45 * Math.PI / 180);
ctx.scale(10, 10);

// ctx.font = '48px serif';
// ctx.strokeText('hello world', 10, 50);
// let txt = ctx.measureText('hello world');
// console.log(txt);

// let img = new Image();
// img.src = cat;
// // 与 drawImage 有点不同，你需要确认 image 对象已经装载完毕，否则图案可能效果不对的
// img.onload = () => {
//   let pt = ctx.createPattern(img, 'no-repeat');
//   console.log(pt);
//   ctx.fillStyle = pt;
//   ctx.fillRect(0, 0, 150, 150);
// };

// 原生图形绘制：矩形，其他图形绘制至少需要生成一条路径，矩形是即时生效立马绘制
// ctx.fillRect(25, 25, 100, 100);
// ctx.clearRect(45, 45, 60, 60);
// ctx.strokeRect(50, 50, 50, 50);

// ctx.beginPath();
// ctx.arc(75, 75, 50, 0, Math.PI * 2, true);
// ctx.moveTo(110, 75); // 提笔动作，到指定点
// ctx.arc(75, 75, 35, 0, Math.PI, false);
// ctx.moveTo(65, 65);
// ctx.arc(60, 65, 5, 0, Math.PI * 2, true);
// ctx.moveTo(95, 65);
// ctx.arc(90, 65, 5, 0, Math.PI * 2, true);
// ctx.stroke();

// 填充三角形
// ctx.beginPath();
// ctx.moveTo(25, 25);
// ctx.lineTo(105, 25);
// ctx.lineTo(25, 105);
// ctx.fill();

// // 描边三角形
// ctx.beginPath();
// ctx.moveTo(125, 125);
// ctx.lineTo(125, 45);
// ctx.lineTo(45, 125);
// ctx.closePath();
// ctx.stroke();

// 创建渐变
// var radgrad = ctx.createRadialGradient(45, 45, 10, 52, 50, 30);
// radgrad.addColorStop(0, '#A7D30C');
// radgrad.addColorStop(0.9, '#019F62');
// radgrad.addColorStop(1, 'rgba(1,159,98,0)');

// var radgrad2 = ctx.createRadialGradient(105, 105, 20, 112, 120, 50);
// radgrad2.addColorStop(0, '#FF5F98');
// radgrad2.addColorStop(0.75, '#FF0188');
// radgrad2.addColorStop(1, 'rgba(255,1,136,0)');

// ctx.fillStyle = radgrad;
// ctx.arc(52, 50, 30, 0, Math.PI * 2, true);
// ctx.fill();

// ctx.fillStyle = radgrad2;
// ctx.fillRect(0, 0, 150, 150);

// ctx.beginPath();
// ctx.moveTo(50, 50);
// ctx.arcTo(150, 50, 150, 100, 30);
// ctx.arcTo(150, 150, 100, 150, 20);
// ctx.arcTo(50, 150, 50, 50, 20);
// ctx.arcTo(50, 50, 50, 50, 0);
// ctx.closePath();
// ctx.stroke();

// var bgfade = ctx.createLinearGradient(0, 0, 500, 500);
// bgfade.addColorStop(0.0, '#88f');
// bgfade.addColorStop(1.0, '#fff');
// ctx.fillStyle = bgfade;
// ctx.fillRect(0, 0, 500, 500);

// var img = new Image();
// img.src = cat;
// ctx.strokeStyle = ctx.createPattern(img, 'repeat');
// ctx.lineWidth = 50;
// ctx.strokeRect(100, 100, 300, 300);

// var peekhole = ctx.createRadialGradient(200, 200, 100, 200, 200, 200);
// peekhole.addColorStop(0, 'transparent');
// peekhole.addColorStop(0.7, 'rgba(100, 100, 100, .9)');
// peekhole.addColorStop(1, 'rgba(0,0,0,0)');
// ctx.fillStyle = peekhole;
// ctx.fillRect(0, 0, 400, 400);

// var lingrad = ctx.createLinearGradient(0, 0, 0, 130);
// lingrad.addColorStop(0, '#00ABEB');
// lingrad.addColorStop(0.5, '#fff');
// lingrad.addColorStop(0.5, '#26C000');
// lingrad.addColorStop(1, '#fff');

// var lingrad2 = ctx.createLinearGradient(0, 50, 0, 100);
// lingrad2.addColorStop(0, 'red');
// lingrad2.addColorStop(1, 'green');

// // assign gradients to fill and stroke styles
// ctx.fillStyle = lingrad;
// ctx.strokeStyle = lingrad2;

// // draw shapes
// ctx.fillRect(10, 10, 130, 130);
// ctx.strokeRect(10, 10, 130, 130);
// ctx.strokeRect(50, 50, 50, 50);


var deg = Math.PI / 180;
function snowflake(c, n, x, y, len) {
  c.save();
  c.translate(x, y);
  c.moveTo(0, 0);
  leg(n);
  c.rotate(-120 * deg);
  leg(n);
  c.rotate(-120 * deg);
  leg(n);
  c.closePath();
  c.restore();

  function leg(n) {
    c.save();
    if (n === 0) {
      c.lineTo(len, 0);
    } else {
      c.scale(1 / 3, 1 / 3);
      leg(n - 1);
      c.rotate(60 * deg);
      leg(n - 1);
      c.rotate(-120 * deg);
      leg(n - 1);
      c.rotate(60 * deg);
      leg(n - 1);
    }
    c.restore();
    c.translate(len, 0);
  }
}

// snowflake(ctx, 2, 5, 115, 125);
// ctx.stroke();

function pieChart(data, width, height, cx, cy, r, colors, labels, lx, ly) {

  var svgns = 'http://www.3c.org/2000/svg';

  var chart = document.createElementNS(svgns, 'svg');
  chart.setAttribute('width', width);
  chart.setAttribute('height', height);
  chart.setAttribute('viewBox', '0 0 ' + width + ' ' + height);

  var total = 0;

  total = data.reduce((a, b) => a + b);

  var angles = [];
  angles = data.map(item => {
    return item / total * Math.PI * 2;
  });

  var startangle = 0;
  data.forEach((item, index) => {
    var endangle = startangle + angles[index];

    var x1 = cx + r * Math.sin(startangle);
    var y1 = cy - r * Math.cos(startangle);
    var x2 = cx + r * Math.sin(endangle);
    var y2 = cy - r * Math.cos(endangle);

    var big = 0;

    if (endangle - startangle > Math.PI) big = 1;

    var path = document.createElementNS(svgns, 'path');

    var d = `M ${cx},${cy} L ${x1},${y1} A ${r},${r} 0 ${big} 1 ${x2},${y2} Z`;

    path.setAttribute('d', d);
    path.setAttribute('style', `fill:${colors[index]};stroke:black;stroke-width:2`);
    chart.appendChild(path);

    startangle = endangle;

    var icon = document.createElementNS(svgns, 'rect');
    icon.setAttribute('x', lx);
    icon.setAttribute('y', ly + 30 * index);
    icon.setAttribute('width', 20);
    icon.setAttribute('height', 20);
    icon.setAttribute('style', `fill:${colors[index]};stroke:black;stroke-width:2`);
    chart.appendChild(icon);

    var label = document.createElementNS(svgns, 'text');
    label.setAttribute('x', lx + 30);
    label.setAttribute('y', ly + 30 * index + 18);
    label.setAttribute('style', 'font-family: sans-serif;font-szie:16');
    label.appendChild(document.createTextNode(labels[index]));
    chart.appendChild(label);

  });

  return chart;
}


// // 一个命名函数
// function MyPlugin() {

// }

// // 在函数的原型上定义一个apply方法
// MyPlugin.prototype.apply = function(compiler) { // 编译器
//   // 指定挂载的webpack事件钩子
//   compiler.plugin('webpacksEventHook', function(compilation) {
//     // 处理webpack内部实例的特定数据
//     console.log('This is an example plugin !!!');

//     // 功能完成后调用webpack提供的回调
//     callback(); // eslint-disabled
//   });
// };
