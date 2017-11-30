<template>
  <div>
    <span class="sparkline" @click="onClick()">2 5 6 7 7 23 9</span>
    <currency-input v-model="price"></currency-input>
    {{price}}
    <input type="file" accept="image/*" multiple @change="fileinfo($event.target.files)"/>
    <canvas id="cvs" width="600" height="300"></canvas>
  </div>
</template>

<script>
import { sparkLine } from 'utils/canvas-helper';
import imgSrc from 'app/assets/cat.jpeg';
import { makeResponse } from 'utils/SearWorker.js';

export default {
  data() {
    return {
      price: null
    };
  },
  methods: {
    fileinfo(files) {
      console.log(files);
    },
    onClick() {
      console.log('click');
      let cvs = document.createElement('canvas');
      let ctx = cvs.getContext('2d');

      let img = new Image();
      img.src = imgSrc;
      img.onload = function() {
        console.log('loaded');
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
  },
  mounted() {
    // 折线
    sparkLine();

    let cvs = document.querySelector('#cvs');
    let ctx = cvs.getContext('2d');

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

    function draw() {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.fillRect(0, 0, cvs.width, cvs.height);
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

    cvs.addEventListener('mouseover', () => {
      ball.raf = window.requestAnimationFrame(draw);
    });
    cvs.addEventListener('mouseout', () => {
      window.cancelAnimationFrame(ball.raf);
    });

    ball.draw();
  }
};
</script>
<style lang="scss" scoped>
  .sparkline {
    background-color: '#ddd';
    color: red;
  }
</style>
