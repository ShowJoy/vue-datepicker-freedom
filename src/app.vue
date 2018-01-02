<template>
  <div>
    <h2>1. Group select</h2>
    <date-picker inline v-model="date"
      :format="format"
      showTool
      :defaultDayGroups="dayGroups"
      language="zh"
      :sidebarOptions="sidebarOptions"
      @changedGroup="changedGroup"
      :disabled="disabled"
      @selected="changeDate">
    </date-picker>
    <button @click="aaa">fdsfdsa</button>
    <h2>2. Multiple select</h2>
    <date-picker clearable calendarButton showTool :height="35" @selected="changeDate" placeholder="Select Date" :format="format" v-model="date1"></date-picker>
    <h2>3. Single Select</h2>
    <date-picker placeholder="Select Date" :highlighted="highlighted" clearable @selected="changeDate" v-model="date2"></date-picker>
  </div>
</template>

<script>
import DatePicker from 'src/component/date-picker';

export default {
  components: {
    DatePicker
  },
  data() {
    return {
      date2: '',
      date1: [new Date(2017, 11, 8)],
      date: [new Date(2017, 11, 8)],
      format: 'yyyy-MM-dd',
      dayGroups: [{
        type: 1,
        class: 'picker-group1',
        dates: [new Date(2017, 11, 12), new Date(2017, 11, 13)]
      }, {
        type: 2,
        class: 'picker-group2',
        dates: [new Date(2017, 11, 1), new Date(2017, 11, 2)]
      }, {
        type: 3,
        class: 'picker-group3',
        dates: []
      }],
      sidebarOptions: {
        position: 'top',
        bars: [{
          text: '分组一',
          style: 'color: red',
          class: 'group-one',
          onClick(picker) {
            picker.setGroupOfCheckedDate(1);
          }
        }, {
          text: '分组二',
          class: 'group-two',
          onClick(picker) {
            picker.setGroupOfCheckedDate(2);
          }
        }, {
          text: '分组三',
          class: 'group-three',
          onClick(picker) {
            picker.setGroupOfCheckedDate(3);
          }
        }]
      },
      disabled: {
        to: new Date(2016, 0, 2), // Disable all dates up to specific date
        from: new Date(2018, 0, 1), // Disable all dates after specific date
        days: [6, 0], // Disable Saturday's and Sunday's
        daysOfMonth: [29, 30, 31], // Disable 29th, 30th and 31st of each month
        dates: [ // Disable an array of dates
          new Date(2016, 9, 16),
          new Date(2016, 9, 17),
          new Date(2016, 9, 18)
        ],
        ranges: [{ // Disable dates in given ranges (exclusive).
          from: new Date(2016, 11, 25),
          to: new Date(2016, 11, 30)
        }, {
          from: new Date(2017, 1, 12),
          to: new Date(2017, 2, 25)
        }],
        // a custom function that returns true if the date is disabled
        customPredictor: function(date) {
          if (date.getDate() % 5 === 0) {
            return true;
          }
        }
      },
      highlighted: {
        days: [1, 4]
      }
    };
  },
  methods: {
    aaa() {
      this.dayGroups[0].dates = [new Date(2017, 11, 14)];
    },
    changedGroup(val) {
      console.log(val);
    },
    changeDate(selected) {
      console.log('current date:', selected);
    }
  }
};
</script>
<style lang="scss" scoped>
  /deep/ .picker-group2:after {
    background: #95e1ed;
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 20px;
    height: 10px;
    background: #95e1ed;
  }
  /deep/ .picker-group1:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 20px;
    height: 10px;
    background: #9ae39d;
  }
  /deep/ .picker-group3:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 20px;
    height: 10px;
    background: #f0e09c;
  }
</style>
