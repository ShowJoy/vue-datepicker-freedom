<template>
  <div>
    <date-picker :inline="true" v-model="date" language="zh" @selected="changeDate"></date-picker>
    <date-picker placeholder="Select Date"></date-picker>
    <div style="height: 200px">
      <el-group-select v-model="selectedIds" :data="groups"></el-group-select>
    </div>
    <span class="sparkline" @click="onClick()">2 5 6 7 7 23 9</span>
    <currency-input v-model="price"></currency-input>
    {{price}}
    <div id="output"></div>
    <input type="file" accept="image/*" @change="fileinfo($event.target.files)"/>
    <canvas id="cvs" width="600" height="300"></canvas>
    <!-- <div id="droptarget"></div> -->
  </div>
</template>

<script>
import { sparkLine, drawRect, drawLine, Barchart } from 'utils/canvas-helper';
import { readFile } from 'utils/base';
import imgSrc from 'app/assets/cat.jpeg';

export default {
  data() {
    return {
      date: '',
      price: null,
      groups: Array.apply(null, { length: 2 }).map((g, groupIndex) => {
        return {
          id: `group_${groupIndex + 1}`,
          label: `分组${groupIndex + 1}`,
          children: Array.apply(null, { length: 8 }).map((c, i) => {
            return {
              id: `option_${groupIndex + 1}_${i + 1}`,
              label: `选项_${groupIndex + 1}_${i + 1}`
            };
          })
        };
      }),
      selectedIds: []
    };
  },
  methods: {
    changeDate(selected, checked) {
      console.log('current date:', selected, checked);
      console.log('previous date: ', this.date);
    },
    fileinfo(files) {
      console.log(files);
      readFile(files[0]);
    },
    onClick() {
      // wokerDemo();
      console.log(this.date);
    }
  },
  mounted() {
    // 折线
    sparkLine();

    let cvs = document.querySelector('#cvs');
    let ctx = cvs.getContext('2d');
    // let droptarget = document.querySelector('#droptarget');

    // let barChart = new Barchart({
    //   canvas: cvs,
    //   data: [112, 62, 42],
    //   lengend: {
    //     names: ['a', 'b', 'c']
    //   }
    // });

    // barChart.draw();
  }
};
</script>
<style lang="scss" scoped>
  .sparkline {
    background-color: '#ddd';
    color: red;
  }
  #droptarget {
    border: 1px solid black;
    width: 200px;
    height: 200px;

    &.active {
      border: 2px dashed red;
    }
  }
</style>
