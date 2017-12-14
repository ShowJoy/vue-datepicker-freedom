<template>
  <div>
    <date-picker inline v-model="date"
      :format="format"
      :defaultDayGroups="dayGroups"
      language="zh"
      :sidebarOptions="sidebarOptions"
      @changedGroup="changedGroup"
      @selected="changeDate">
    </date-picker>
    <br/>
    <date-picker calendarButton showTool placeholder="Select Date" :format="format" v-model="date1"></date-picker>
    <br/>
    <date-picker placeholder="Select Date" v-model="date2"></date-picker>
    <br/>
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
    let self = this;
    return {
      date2: '',
      date1: [new Date(2017, 11, 8).setHours(0, 0, 0, 0)],
      date: [new Date(2017, 11, 8).setHours(0, 0, 0, 0)],
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
      selectedIds: [],
      format: 'yyyy-MM-dd',
      dayGroups: [{
        type: 1,
        class: 'picker-workday',
        days: [new Date(2017, 11, 12).setHours(0, 0, 0, 0), new Date(2017, 11, 13).setHours(0, 0, 0, 0)]
      }, {
        type: 2,
        class: 'picker-weekend',
        days: [new Date(2017, 11, 1).setHours(0, 0, 0, 0), new Date(2017, 11, 2).setHours(0, 0, 0, 0)]
      }, {
        type: 3,
        class: 'picker-holiday',
        days: []
      }],
      sidebarOptions: {
        position: '',
        bars: [{
          text: '设为工作日',
          style: 'color: red',
          class: 'button-workday',
          onClick(picker) {
            picker.setGroupOfCheckedDate(1);
          }
        }, {
          text: '设为周末',
          class: 'button-weekend',
          onClick(picker) {
            picker.setGroupOfCheckedDate(2);
          }
        }, {
          text: '设为长假',
          class: 'button-holiday',
          onClick(picker) {
            picker.setGroupOfCheckedDate(3);
          }
        }]
      }
    };
  },
  methods: {
    changedGroup(val) {
      console.log(val);
    },
    changeDate(selected, checked) {
      console.log('current date:', selected, checked);
    },
    fileinfo(files) {
      readFile(files[0]);
    },
    onClick() {
      // wokerDemo();
      console.log(this.date);
      this.dayGroups[0].days.push(new Date(2017, 11, 30).setHours(0, 0, 0, 0));
    },
    extendArr(one, two) {
      return one.concat(two).reduce((arr, val) => {
        if (arr.indexOf(val) < 0) {
          arr.push(val);
        }
        return arr;
      }, []);
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
  /deep/ .picker-weekend:after {
    background: #95e1ed;
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 20px;
    height: 10px;
    background: #95e1ed;
  }
  /deep/ .picker-workday:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 20px;
    height: 10px;
    background: #9ae39d;
  }
  /deep/ .picker-holiday:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 20px;
    height: 10px;
    background: #f0e09c;
  }
</style>
