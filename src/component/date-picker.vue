<template>
  <div class="custom-datepicker" :class="[wrapperClass, isRtl ? 'rtl' : '']">
    <symbol id="icon-delete" viewBox="3 3 18 18">
      <title>delete</title>
      <path d="M12 4c-4.419 0-8 3.582-8 8s3.581 8 8 8 8-3.582 8-8-3.581-8-8-8zM15.707 14.293c0.391 0.391 0.391 1.023 0 1.414-0.195 0.195-0.451 0.293-0.707 0.293s-0.512-0.098-0.707-0.293l-2.293-2.293-2.293 2.293c-0.195 0.195-0.451 0.293-0.707 0.293s-0.512-0.098-0.707-0.293c-0.391-0.391-0.391-1.023 0-1.414l2.293-2.293-2.293-2.293c-0.391-0.391-0.391-1.023 0-1.414s1.023-0.391 1.414 0l2.293 2.293 2.293-2.293c0.391-0.391 1.023-0.391 1.414 0s0.391 1.023 0 1.414l-2.293 2.293 2.293 2.293z"></path>
    </symbol>
    <div class="custom-datepicker__select" v-if="!inline">
      <!-- Calendar icon -->
      <span class="custom-datepicker__select-prefix">
        <svg class="icon" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
          <title>calendar</title>
          <path fill="#c0c4cc" d="M10 12h4v4h-4zM16 12h4v4h-4zM22 12h4v4h-4zM4 24h4v4h-4zM10 24h4v4h-4zM16 24h4v4h-4zM10 18h4v4h-4zM16 18h4v4h-4zM22 18h4v4h-4zM4 18h4v4h-4zM26 0v2h-4v-2h-14v2h-4v-2h-4v32h30v-32h-4zM28 30h-26v-22h26v22z"></path>
        </svg>
      </span>
      <div :class="['custom-datepicker__select-fakeinput', , {'is-check': isCheck}]">
        <div class="custom-datepicker__select-display">
          <span :class="['custom-datepicker__select-item', {'is-check': isCheck}]" v-for="(val, index) in formattedValue" :key="index">{{ val }}<svg @click="clearDate(index)" class="icon icon-delete" transform="translate(3 3)" v-if="isCheck"><use xlink:href="#icon-delete"></use></svg></span>
        </div>
        <!-- Input -->
        <input
          :type="inline ? 'hidden' : 'text'"
          :class="inputClass"
          :name="name"
          :ref="refName"
          :id="id"
          @click="showCalendar"
          :value="inputValue"
          :open-date="openDate"
          :placeholder="placeholder"
          :disabled="disabledPicker"
          :required="required"
          :style="`height: ${ selectHeight }px`"
          readonly>
      </div>
      <!-- Clear icon -->
      <span class="custom-datepicker__select-suffix" v-show="clearable && selectedDate && !isCalendarShow && !isCheck" @click="clearDate">
        <svg class="icon"><use xlink:href="#icon-delete"></use></svg>
      </span>
    </div>
    <div :class="['custom-datepicker__body', sidebarPosition]">
      <section class="custom-datepicker__body-sidebar" v-if="bars">
        <span
          :style="bar.style"
          :class="['custom-datepicker__body-bar', bar.class]"
          v-for="(bar, index) in bars"
          :key="index"
          @click="barClick(bar)">{{ bar.text }}
        </span>
      </section>
      <section :class="['custom-datepicker__calendar', {'inline': inline}]" :style="calendarStyle" v-show="isCalendarShow">
        <!-- Day View -->
        <template v-if="allowedToShowView('day')">
          <div :class="[calendarClass, 'custom-datepicker__calendar-day']" v-show="showDayView">
            <header>
              <span
                @click="isRtl ? nextMonth() : previousMonth()"
                class="prev"
                v-bind:class="{ 'disabled' : isRtl ? nextMonthDisabled(pageTimestamp) : previousMonthDisabled(pageTimestamp) }">&lt;</span>
              <span @click="showMonthCalendar" :class="allowedToShowView('month') ? 'up' : ''"> {{ currentYearAndMonthText }}
              </span>
              <span
                @click="isRtl ? previousMonth() : nextMonth()"
                class="next"
                v-bind:class="{ 'disabled' : isRtl ? previousMonthDisabled(pageTimestamp) : nextMonthDisabled(pageTimestamp) }">&gt;</span>
            </header>
            <div :class="isRtl ? 'flex-rtl' : ''">
              <span class="cell day-header" v-for="d in daysOfWeek" :key="d.timestamp">{{ d }}</span>
              <template v-if="blankDays > 0">
                <span class="cell day blank" v-for="d in blankDays" :key="d.timestamp"></span>
              </template><span class="cell day"
                  v-for="day in days"
                  :key="day.timestamp"
                  track-by="timestamp"
                  v-bind:class="dayClasses(day)"
                  @click="selectDate(day)"><label>{{ day.date }}</label></span>
            </div>
          </div>
        </template>

        <!-- Month View -->
        <template v-if="allowedToShowView('month')">
          <div :class="[calendarClass, 'custom-datepicker__calendar-month']" v-show="showMonthView">
            <header>
              <span
                @click="previousYear"
                class="prev"
                v-bind:class="{ 'disabled' : previousYearDisabled(pageTimestamp) }">&lt;</span>
              <span @click="showYearCalendar" :class="allowedToShowView('year') ? 'up' : ''">{{ getPageYear() }}</span>
              <span
                @click="nextYear"
                class="next"
                v-bind:class="{ 'disabled' : nextYearDisabled(pageTimestamp) }">&gt;</span>
            </header>
            <span class="cell month"
              v-for="month in months"
              :key="month.timestamp"
              track-by="timestamp"
              v-bind:class="{ 'selected': month.isSelected, 'disabled': month.isDisabled }"
              @click.stop="selectMonth(month)"><label>{{ month.month }}</label></span>
          </div>
        </template>

        <!-- Year View -->
        <template v-if="allowedToShowView('year')">
          <div :class="[calendarClass, 'custom-datepicker__calendar-year']" v-show="showYearView">
            <header>
              <span @click="previousDecade" class="prev"
                v-bind:class="{ 'disabled' : previousDecadeDisabled(pageTimestamp) }">&lt;</span>
              <span>{{ getPageDecade() }}</span>
              <span @click="nextDecade" class="next"
                v-bind:class="{ 'disabled' : nextMonthDisabled(pageTimestamp) }">&gt;</span>
            </header>
            <span
              class="cell year"
              v-for="year in years"
              :key="year.timestamp"
              track-by="timestamp"
              v-bind:class="{ 'selected': year.isSelected, 'disabled': year.isDisabled }"
              @click.stop="selectYear(year)"><label>{{ year.year }}</label></span>
          </div>
        </template>

        <div class="custom-datepicker__calendar-footer" v-show="isCheck && showDayView && showTool">
          <div>
            <button type="button" @click="resetDayGroups">{{ translation.buttons.reset }}</button>
            <button @click="clearCheckedDate">{{ translation.buttons.clear }}</button>
          </div>
          <div v-if="!inline">
            <button type="button" @click="cancel">{{ translation.buttons.cancel }}</button>
            <button type="button" @click="confirm">{{ translation.buttons.confirm }}</button>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import Utils from './utils.js';
import DateLanguages from './languages.js';

export default {
  name: 'DatePicker',
  props: {
    value: {
      validator: function (val) {
        return val === null || val instanceof Date || typeof val === 'string' || Utils.isArray(val);
      }
    },
    name: String,
    refName: String,
    id: String,
    format: {
      type: [String, Function],
      default: 'dd MMM yyyy'
    },
    language: {
      type: String,
      default: 'en'
    },
    openDate: {
      validator: function (val) {
        return val === null || val instanceof Date || typeof val === 'string';
      }
    },
    fullMonthName: Boolean,
    disabled: Object,
    highlighted: Object,
    placeholder: String,
    inline: Boolean,
    calendarClass: [String, Object],
    inputClass: [String, Object],
    wrapperClass: [String, Object],
    mondayFirst: Boolean,
    bootstrapStyling: Boolean,
    initialView: String,
    disabledPicker: Boolean,
    required: Boolean,
    showTool: Boolean,
    clearable: Boolean,
    minimumView: {
      type: String,
      default: 'day'
    },
    maximumView: {
      type: String,
      default: 'year'
    },
    sidebarOptions: {
      type: Object,
      default: () => {}
    },
    defaultDayGroups: {
      type: Array,
      default: () => []
    },
    // picker initial height
    height: {
      type: Number,
      default: 35
    }
  },
  data () {
    const startDate = this.openDate ? new Date(this.openDate) : new Date();
    return {
      /*
       * Vue cannot observe changes to a Date Object so date must be stored as a timestamp
       * This represents the first day of the current viewing month
       * {Number}
       */
      pageTimestamp: startDate.setDate(1),
      /*
       * Selected Date
       * {Date}
       */
      selectedDate: null,
      /*
       * Flags to show calendar views
       * {Boolean}
       */
      showDayView: false,
      showMonthView: false,
      showYearView: false,
      /*
       * Positioning
       */
      calendarHeight: 0,
      /**
       * dayGroups in picker
       */
      dayGroups: [],
      /**
       * save default checked dates
       */
      defaultValue: [],
      selectHeight: 0
    }
  },
  watch: {
    value: {
      handler (value) {
        this.computeSelectHeight();
        this.setValue(value);
      },
      immediate: true
    },
    openDate () {
      this.setPageDate();
    },
    initialView () {
      this.setInitialView();
    },
    defaultDayGroups: {
      handler (value) {
        this.dayGroups = Utils.copy(this.defaultDayGroups, true);
      },
      deep: true
    }
  },
  computed: {
    isCalendarShow() {
      return this.showDayView || this.showMonthView || this.showYearView;
    },
    // sidebar position: left/top/bottom/right
    sidebarPosition() {
      return this.sidebarOptions && this.sidebarOptions.position;
    },
    // bars in sidebar container
    bars() {
      return this.sidebarOptions && this.sidebarOptions.bars;
    },
    computedInitialView () {
      if (!this.initialView) {
        return this.minimumView;
      }

      return this.initialView;
    },
    pageDate () {
      return new Date(this.pageTimestamp);
    },
    inputValue() {
      return this.formattedValue.length ? ' ' : '';
    },
    formattedValue () {
      const isFunction = Utils.isFunction(this.format);
      if (this.isCheck && this.value) {
        let dateArr = this.value.map(date => {
          return isFunction ? this.format(new Date(date)) : Utils.formatDate(new Date(date), this.format, this.translation);
        });
        return dateArr;
      } else {
        if (!this.selectedDate) {
          return [];
        }
        return [isFunction ? this.format(this.selectedDate) : Utils.formatDate(new Date(this.selectedDate), this.format, this.translation)];
      }
    },
    translation () {
      return DateLanguages.translations[this.language];
    },
    currMonthName () {
      const monthName = this.fullMonthName ? this.translation.months.original : this.translation.months.abbr;
      return Utils.getMonthNameAbbr(this.pageDate.getMonth(), monthName);
    },
    currYear () {
      return this.pageDate.getFullYear();
    },
    currentYearAndMonthText(){
      return this.language === 'zh' ? `${this.currYear} ${this.currMonthName}` : `${this.currMonthName} ${this.currYear}`;
    },
    /**
     * Returns the day number of the week less one for the first of the current month
     * Used to show amount of empty cells before the first in the day calendar layout
     * @return {Number}
     */
    blankDays () {
      const d = this.pageDate;
      let dObj = new Date(d.getFullYear(), d.getMonth(), 1, d.getHours(), d.getMinutes());
      if (this.mondayFirst) {
        return dObj.getDay() > 0 ? dObj.getDay() - 1 : 6;
      }
      return dObj.getDay();
    },
    daysOfWeek () {
      if (this.mondayFirst) {
        const tempDays = this.translation.days.slice();
        tempDays.push(tempDays.shift());
        return tempDays;
      }
      return this.translation.days;
    },
    days () {
      const d = this.pageDate;
      let days = [];
      // set up a new date object to the beginning of the current 'page'
      let dObj = new Date(d.getFullYear(), d.getMonth(), 1, d.getHours(), d.getMinutes());
      let daysInMonth = Utils.daysInMonth(dObj.getFullYear(), dObj.getMonth());
      for (let i = 0; i < daysInMonth; i++) {
        days.push({
          date: dObj.getDate(),
          timestamp: dObj.getTime(),
          customClass: this.setCustomClass(dObj),
          isChecked: this.isCheck ? this.isCheckedDate(dObj) : false,
          isSelected: this.isCheck ? false : this.isSelectedDate(dObj),
          isDisabled: this.isDisabledDate(dObj),
          isHighlighted: this.isHighlightedDate(dObj),
          isHighlightStart: this.isHighlightStart(dObj),
          isHighlightEnd: this.isHighlightEnd(dObj),
          isToday: dObj.toDateString() === (new Date()).toDateString(),
          isWeekend: dObj.getDay() === 0 || dObj.getDay() === 6,
          isSaturday: dObj.getDay() === 6,
          isSunday: dObj.getDay() === 0
        });
        dObj.setDate(dObj.getDate() + 1);
      }
      return days;
    },
    months () {
      const d = this.pageDate;
      let months = [];
      // set up a new date object to the beginning of the current 'page'
      let dObj = new Date(d.getFullYear(), 0, d.getDate(), d.getHours(), d.getMinutes());
      for (let i = 0; i < 12; i++) {
        months.push({
          month: Utils.getMonthName(i, this.translation.months.original),
          timestamp: dObj.getTime(),
          isSelected: this.isSelectedMonth(dObj),
          isDisabled: this.isDisabledMonth(dObj)
        });
        dObj.setMonth(dObj.getMonth() + 1);
      }
      return months;
    },
    years () {
      const d = this.pageDate;
      let years = [];
      // set up a new date object to the beginning of the current 'page'
      let dObj = new Date(Math.floor(d.getFullYear() / 10) * 10, d.getMonth(), d.getDate(), d.getHours(), d.getMinutes());
      for (let i = 0; i < 10; i++) {
        years.push({
          year: dObj.getFullYear(),
          timestamp: dObj.getTime(),
          isSelected: this.isSelectedYear(dObj),
          isDisabled: this.isDisabledYear(dObj)
        });
        dObj.setFullYear(dObj.getFullYear() + 1);
      }
      return years;
    },
    calendarStyle () {
      return {
        position: this.isInline ? 'static' : undefined
      };
    },
    isOpen () {
      return this.showDayView || this.showMonthView || this.showYearView;
    },
    isInline () {
      return !!this.inline;
    },
    isRtl () {
      return this.translation.rtl === true;
    },
    // whether or not mutiple model
    isCheck() {
      return Utils.isArray(this.value);
    }
  },
  methods: {
    computeSelectHeight() {
      this.$nextTick(() => {
        const display = this.$el.querySelector('.custom-datepicker__select-display');
        display && (this.selectHeight = Math.max(display.offsetHeight, this.height));
      });
    },
    /**
     * Close all calendar layers
     * @param { Boolean } isConfirm click from confirm button 
     */
    close (isConfirm) {
      this.showDayView = this.showMonthView = this.showYearView = false;
      if (!this.isInline) {
        this.$emit('closed');
        this.isCheck && !isConfirm && this.$emit('input', this.defaultValue);
        document.removeEventListener('click', this.clickOutside, false);
      }
    },
    resetDayGroups() {
      if (this.isCheck) {
        this.dayGroups = Utils.copy(this.defaultDayGroups, true);
        this.$emit('input', this.defaultValue);
        this.$emit('changedGroup', this.dayGroups);
      }
    },
    clearCheckedDate() {
      if (this.isCheck) {
        this.$emit('input', []);
      }
    },
    resetDefaultDate () {
      if (this.selectedDate === null) {
        this.setPageDate();
        return;
      }
      this.setPageDate(this.selectedDate);
    },
    /**
     * Effectively a toggle to show/hide the calendar
     * @return {mixed} [description]
     */
    showCalendar () {
      if (this.disabledPicker || this.isInline) {
        return false;
      }
      if (this.isOpen) {
        return this.close();
      }
      this.setInitialView();
      if (!this.isInline) {
        this.$emit('opened');
      }
    },
    setInitialView () {
      const initialView = this.computedInitialView;

      if (!this.allowedToShowView(initialView)) {
        throw new Error(`initialView '${this.initialView}' cannot be rendered based on minimum '${this.minimumView}' and maximum '${this.maximumView}'`);
      }

      switch (initialView) {
        case 'year':
          this.showYearCalendar();
          break;
        case 'month':
          this.showMonthCalendar();
          break;
        default:
          this.showDayCalendar();
          break;
      }
    },
    allowedToShowView (view) {
      const views = ['day', 'month', 'year'];
      const minimumViewIndex = views.indexOf(this.minimumView);
      const maximumViewIndex = views.indexOf(this.maximumView);
      const viewIndex = views.indexOf(view);

      return viewIndex >= minimumViewIndex && viewIndex <= maximumViewIndex;
    },
    showDayCalendar () {
      if (!this.allowedToShowView('day')) return false;

      this.close();
      this.showDayView = true;
      if (!this.isInline) {
        document.addEventListener('click', this.clickOutside, false);
      }
    },
    showMonthCalendar () {
      if (!this.allowedToShowView('month')) return false;

      this.close();
      this.showMonthView = true;
      if (!this.isInline) {
        document.addEventListener('click', this.clickOutside, false);
      }
    },
    showYearCalendar () {
      if (!this.allowedToShowView('year')) return false;

      this.close();
      this.showYearView = true;
      if (!this.isInline) {
        document.addEventListener('click', this.clickOutside, false);
      }
    },
    setDate (timestamp) {
      const date = new Date(timestamp);
      let tempValue = [];
      this.selectedDate = new Date(date);
      this.setPageDate(date);
      
      // save checked date
      if (this.isCheck) {
        let ymd = new Date(timestamp).setHours(0, 0, 0, 0);
        let index = Utils.indexOfDate(this.value, ymd);
        tempValue = Utils.copy(this.value);
        if (index === -1) {
          tempValue.push(new Date(ymd));
        } else {
          tempValue.splice(index, 1);
        }
      }

      this.$emit('selected', this.isCheck ? tempValue : new Date(date));
      this.$emit('input', this.isCheck ? tempValue : new Date(date));
    },
    clearDate (index) {
      if (typeof index === 'number') {
        let tempValue = Utils.copy(this.value);
        tempValue.splice(index, 1);
        this.$emit('selected',this.isCheck ? tempValue : null);
        this.$emit('input',this.isCheck ? tempValue : null);
      } else {
        this.selectedDate = null;
        this.$emit('selected',this.isCheck ? [] : null);
        this.$emit('input', this.isCheck ? [] : null);
        this.$emit('cleared');
      }
      
      this.$nextTick(() => {
        this.setDefaultValue();
      });
    },
    /**
     * @param {Object} day
     */
    selectDate (day) {
      if (day.isDisabled) {
        this.$emit('selectedDisabled', day);
        return false;
      }
      this.setDate(day.timestamp);
      if (this.isInline) {
        this.showDayCalendar();
      } else {
        // only radio, direct close
        !Utils.isArray(this.value) && this.close();
      }
    },
    /**
     * @param {Object} month
     */
    selectMonth (month) {
      if (month.isDisabled) {
        return false;
      }

      const date = new Date(month.timestamp);
      if (this.allowedToShowView('day')) {
        this.setPageDate(date);
        this.$emit('changedMonth', month);
        this.showDayCalendar();
      } else {
        this.setDate(date);
        this.close();
      }
    },
    /**
     * @param {Object} year
     */
    selectYear (year) {
      if (year.isDisabled) {
        return false;
      }

      const date = new Date(year.timestamp);
      if (this.allowedToShowView('month')) {
        this.setPageDate(date);
        this.$emit('changedYear', year);
        this.showMonthCalendar();
      } else {
        this.setDate(date);
        this.close();
      }
    },
    /**
     * @return {Number}
     */
    getPageDate () {
      return this.pageDate.getDate();
    },
    /**
     * @return {Number}
     */
    getPageMonth () {
      return this.pageDate.getMonth();
    },
    /**
     * @return {Number}
     */
    getPageYear () {
      return this.pageDate.getFullYear();
    },
    /**
     * @return {String}
     */
    getPageDecade () {
      let sD = Math.floor(this.pageDate.getFullYear() / 10) * 10;
      return sD + '\'s';
    },
    changeMonth (incrementBy) {
      let date = this.pageDate;
      date.setMonth(date.getMonth() + incrementBy);
      this.setPageDate(date);
      this.$emit('changedMonth', date);
    },
    previousMonth () {
      if (!this.previousMonthDisabled()) {
        this.changeMonth(-1);
      }
    },
    previousMonthDisabled () {
      if (!this.disabled || !this.disabled.to) {
        return false;
      }
      let d = this.pageDate;
      return this.disabled.to.getMonth() >= d.getMonth() &&
        this.disabled.to.getFullYear() >= d.getFullYear();
    },
    nextMonth () {
      if (!this.nextMonthDisabled()) {
        this.changeMonth(+1);
      }
    },
    nextMonthDisabled () {
      if (!this.disabled || !this.disabled.from) {
        return false;
      }
      let d = this.pageDate;
      return this.disabled.from.getMonth() <= d.getMonth() &&
        this.disabled.from.getFullYear() <= d.getFullYear();
    },
    changeYear (incrementBy, emit = 'changedYear') {
      let date = this.pageDate;
      date.setYear(date.getFullYear() + incrementBy);
      this.setPageDate(date);
      this.$emit(emit);
    },
    previousYear () {
      if (!this.previousYearDisabled()) {
        this.changeYear(-1);
      }
    },
    previousYearDisabled () {
      if (!this.disabled || !this.disabled.to) {
        return false;
      }
      return this.disabled.to.getFullYear() >= this.pageDate.getFullYear();
    },
    nextYear () {
      if (!this.nextYearDisabled()) {
        this.changeYear(1);
      }
    },
    nextYearDisabled () {
      if (!this.disabled || !this.disabled.from) {
        return false;
      }
      return this.disabled.from.getFullYear() <= this.pageDate.getFullYear();
    },
    previousDecade () {
      if (!this.previousDecadeDisabled()) {
        this.changeYear(-10, 'changeDecade');
      }
    },
    previousDecadeDisabled () {
      if (!this.disabled || !this.disabled.to) {
        return false;
      }
      return Math.floor(this.disabled.to.getFullYear() / 10) * 10 >= Math.floor(this.pageDate.getFullYear() / 10) * 10;
    },
    nextDecade () {
      if (!this.nextDecadeDisabled()) {
        this.changeYear(10, 'changeDecade')
      }
    },
    nextDecadeDisabled () {
      if (!this.disabled || !this.disabled.from) {
        return false;
      }
      return Math.ceil(this.disabled.from.getFullYear() / 10) * 10 <= Math.ceil(this.pageDate.getFullYear() / 10) * 10;
    },
    // set custom class name for date
    setCustomClass(dObj) {
      let ymd = dObj.setHours(0, 0, 0, 0);
      for (let i in this.dayGroups) {
        let item = this.dayGroups[i];
        if (Utils.indexOfDate(item.dates, ymd) !== -1) {
          return item.class;
        }
      }
      return '';
    },
    /**
     * Whether a day is checked
     * @param {Date}
     * @return {Boolean}
     */
    isCheckedDate(dObj) {
      return this.value.length && Utils.indexOfDate(this.value, dObj) > -1;
    },
    /**
     * Whether a day is selected
     * @param {Date}
     * @return {Boolean}
     */
    isSelectedDate (dObj) {
      return this.selectedDate && this.selectedDate.toDateString() === dObj.toDateString();
    },
    /**
     * Whether a day is disabled
     * @param {Date}
     * @return {Boolean}
     */
    isDisabledDate (date) {
      let disabled = false;

      if (typeof this.disabled === 'undefined') {
        return false;
      }

      if (typeof this.disabled.dates !== 'undefined') {
        this.disabled.dates.forEach((d) => {
          if (date.toDateString() === d.toDateString()) {
            disabled = true;
            return true;
          }
        })
      }
      if (typeof this.disabled.to !== 'undefined' && this.disabled.to && date < this.disabled.to) {
        disabled = true;
      }
      if (typeof this.disabled.from !== 'undefined' && this.disabled.from && date > this.disabled.from) {
        disabled = true;
      }
      if (typeof this.disabled.ranges !== 'undefined') {
        this.disabled.ranges.forEach((range) => {
          if (typeof range.from !== 'undefined' && range.from && typeof range.to !== 'undefined' && range.to) {
            if (date < range.to && date > range.from) {
              disabled = true;
              return true;
            }
          }
        })
      }
      if (typeof this.disabled.days !== 'undefined' && this.disabled.days.indexOf(date.getDay()) !== -1) {
        disabled = true;
      }
      if (typeof this.disabled.daysOfMonth !== 'undefined' && this.disabled.daysOfMonth.indexOf(date.getDate()) !== -1) {
        disabled = true;
      }
      if (typeof this.disabled.customPredictor === 'function' && this.disabled.customPredictor(date)) {
        disabled = true;
      }
      return disabled;
    },
    /**
     * Whether a day is highlighted (only if it is not disabled already)
     * @param {Date}
     * @return {Boolean}
     */
    isHighlightedDate (date) {
      if (this.isDisabledDate(date)) {
        return false;
      }

      let highlighted = false;

      if (typeof this.highlighted === 'undefined') {
        return false;
      }

      if (typeof this.highlighted.dates !== 'undefined') {
        this.highlighted.dates.forEach((d) => {
          if (date.toDateString() === d.toDateString()) {
            highlighted = true;
            return true;
          }
        })
      }

      if (this.isDefined(this.highlighted.from) && this.isDefined(this.highlighted.to)) {
        highlighted = date >= this.highlighted.from && date <= this.highlighted.to;
      }

      if (typeof this.highlighted.days !== 'undefined' && this.highlighted.days.indexOf(date.getDay()) !== -1) {
        highlighted = true;
      }

      if (typeof this.highlighted.daysOfMonth !== 'undefined' && this.highlighted.daysOfMonth.indexOf(date.getDate()) !== -1) {
        highlighted = true;
      }

      if (typeof this.highlighted.customPredictor === 'function' && this.highlighted.customPredictor(date)) {
        highlighted = true;
      }

      return highlighted;
    },
    /**
     * Whether a day is highlighted and it is the first date
     * in the highlighted range of dates
     * @param {Date}
     * @return {Boolean}
     */
    isHighlightStart (date) {
      return this.isHighlightedDate(date) &&
        (this.highlighted.from instanceof Date) &&
        (this.highlighted.from.getFullYear() === date.getFullYear()) &&
        (this.highlighted.from.getMonth() === date.getMonth()) &&
        (this.highlighted.from.getDate() === date.getDate());
    },
    /**
     * Whether a day is highlighted and it is the first date
     * in the highlighted range of dates
     * @param {Date}
     * @return {Boolean}
     */
    isHighlightEnd (date) {
      return this.isHighlightedDate(date) &&
        (this.highlighted.to instanceof Date) &&
        (this.highlighted.to.getFullYear() === date.getFullYear()) &&
        (this.highlighted.to.getMonth() === date.getMonth()) &&
        (this.highlighted.to.getDate() === date.getDate());
    },
    /**
     * Helper
     * @param  {mixed}  prop
     * @return {Boolean}
     */
    isDefined (prop) {
      return typeof prop !== 'undefined' && prop;
    },
    /**
     * Whether the selected date is in this month
     * @param {Date}
     * @return {Boolean}
     */
    isSelectedMonth (date) {
      return (this.selectedDate &&
        this.selectedDate.getFullYear() === date.getFullYear() &&
        this.selectedDate.getMonth() === date.getMonth());
    },
    /**
     * Whether a month is disabled
     * @param {Date}
     * @return {Boolean}
     */
    isDisabledMonth (date) {
      let disabled = false;

      if (typeof this.disabled === 'undefined') {
        return false;
      }

      if (typeof this.disabled.to !== 'undefined' && this.disabled.to) {
        if (
          (date.getMonth() < this.disabled.to.getMonth() && date.getFullYear() <= this.disabled.to.getFullYear()) ||
          date.getFullYear() < this.disabled.to.getFullYear()
        ) {
          disabled = true;
        }
      }
      if (typeof this.disabled.from !== 'undefined' && this.disabled.from) {
        if (
          this.disabled.from &&
          (date.getMonth() > this.disabled.from.getMonth() && date.getFullYear() >= this.disabled.from.getFullYear()) ||
          date.getFullYear() > this.disabled.from.getFullYear()
        ) {
          disabled = true;
        }
      }
      return disabled;
    },
    /**
     * Whether the selected date is in this year
     * @param {Date}
     * @return {Boolean}
     */
    isSelectedYear (date) {
      return this.selectedDate && this.selectedDate.getFullYear() === date.getFullYear();
    },
    /**
     * Whether a year is disabled
     * @param {Date}
     * @return {Boolean}
     */
    isDisabledYear (date) {
      let disabled = false;
      if (typeof this.disabled === 'undefined' || !this.disabled) {
        return false;
      }

      if (typeof this.disabled.to !== 'undefined' && this.disabled.to) {
        if (date.getFullYear() < this.disabled.to.getFullYear()) {
          disabled = true;
        }
      }
      if (typeof this.disabled.from !== 'undefined' && this.disabled.from) {
        if (date.getFullYear() > this.disabled.from.getFullYear()) {
          disabled = true;
        }
      }

      return disabled;
    },
    /**
     * Set the datepicker value
     * @param {Date|String|null} date
     */
    setValue (date) {
      if (typeof date === 'string') {
        let parsed = new Date(date);
        date = isNaN(parsed.valueOf()) ? null : parsed;
      }
      if (!date) {
        this.setPageDate();
        this.selectedDate = null;
        return;
      }
      if (Utils.isValidDate(date)) {
        this.selectedDate = date;
        this.setPageDate(date);
      } else if (Utils.isArray(date) && date.length > 0) {
        this.selectedDate = new Date(date[date.length - 1]);
        this.setPageDate(date[date.length - 1]);
      }
    },
    setPageDate (date) {
      if (!date) {
        if (this.openDate) {
          date = new Date(this.openDate);
        } else {
          date = new Date();
        }
      }
      this.pageTimestamp = (new Date(date)).setDate(1);
    },
    /**
     * Close the calendar if clicked outside the datepicker
     * @param  {Event} event
     */
    clickOutside (event) {
      if (this.$el && !this.$el.contains(event.target)) {
        if (this.isInline) {
          return this.showDayCalendar();
        }
        this.resetDefaultDate();
        this.close();
        document.removeEventListener('click', this.clickOutside, false);
      }
    },
    dayClasses (day) {
      return [day.customClass, {
        'selected': day.isSelected,
        'disabled': day.isDisabled,
        'highlighted': day.isHighlighted,
        'today': day.isToday,
        'weekend': day.isWeekend,
        'sat': day.isSaturday,
        'sun': day.isSunday,
        'highlight-start': day.isHighlightStart,
        'highlight-end': day.isHighlightEnd,
        'checked': day.isChecked,
      }];
    },
    /**
     * insert date into gropu use current checked date by group type, remove date in other groups
     * @param {Number|String} type
     * @param {Boolean} unclearCheckedDates
     */
    setGroupOfCheckedDate(type, unclearCheckedDates) {
      let dayGroup = this.dayGroups.find(item => item.type === type);
      this.dayGroups.reduce((arr, item) => {
        if (item.type !== type) {
          item.dates = Utils.filterDateArray(item.dates, this.value);
          arr.push(item);
        }
        return arr;
      }, []);
      dayGroup.dates = Utils.extendDateArray(dayGroup.dates, this.value);
      !unclearCheckedDates && this.$emit('input', []);
      this.$emit('changedGroup', this.dayGroups);
    },
    barClick(bar) {
      bar.onClick(this);
    },
    // cancel checked dates
    cancel() {
      this.close();
      this.$emit('input', this.defaultValue);
    },
    // confirm checked dates
    confirm() {
      this.close(true);
      this.setDefaultValue();
      this.$emit('confirm');
    },
    // set default checked dates
    setDefaultValue() {
      this.defaultValue =  Utils.copy(this.value);
    },
    init () {
      this.isInline && this.setInitialView();
      this.dayGroups = Utils.copy(this.defaultDayGroups, true);
      this.setDefaultValue();
    }
  },
  mounted () {
    this.init();
  }
}
</script>

<style lang="stylus" scoped>
$width = 300px
$barWidth = 110px
$iconWidth = 16px
$hoverColor = #409eff
$selectedColor = #409eff
$disabledColor = #ddd
$border = 1px solid #dfe4ed

.rtl
  direction:rtl
.custom-datepicker
  display inline-block
  position relative
  text-align left
  *
    box-sizing border-box

  &__body
    user-select none
    display flex
    max-width $width + $barWidth
    &-sidebar
      padding: 10px
      width $barWidth
      border $border
      border-right 0
      background-color #fff
      overflow auto
    &-bar
      display block
      width 100%
      background-color transparent
      font-size 14px
      color #5a5e66
      padding-right 12px
      cursor pointer
  
  &__body.top
    width $width
    flex-direction column
    .custom-datepicker__body-sidebar
      width 100%
      border $border
      border-bottom 0
    .custom-datepicker__body-bar
      display inline

  &__body.bottom
    width $width
    flex-direction column-reverse
    .custom-datepicker__body-sidebar
      width 100%
      border $border
      border-top 0

  &__body.right
    flex-direction row-reverse
    .custom-datepicker__body-sidebar
      width $barWidth
      border $border
      border-left 0
  
  &__select
    position relative
    display inline-block
    border-radius 2px
    border $border
    min-height 35px
    padding 0 25px
    .icon
      display inline-block
      width $iconWidth
      height $iconWidth
      fill #c0c4cc
    .icon-delete
      pointer-events auto
      cursor pointer
    
    &-fakeinput.is-check
      width 222px
    &-fakeinput
      font-size 14px
      position relative
      width 160px
      display inline-block
    &-display
      position absolute
      z-index 1
      pointer-events none
      width 100%
      top 50%
      transform translateY(-50%)
    &-item.is-check
      border none
      padding 3px 6px
      background-color #f0f2f5
      color #909399
      margin 2px
      display inline-block
    input
      -webkit-appearance none
      outline none
      border none
      width 100%
    &-prefix
      position absolute
      left 5px
      height 100%
    &-suffix
      position absolute
      height 100%
      right 5px
      top 0
      cursor pointer
      display none
    &-suffix
    &-prefix
      svg.icon
        height 100%
    &:hover
      .custom-datepicker__select-suffix
        display block

.custom-datepicker__calendar:not(.inline)
  margin-top 10px
  &:before
    content ""
    position absolute
    left 10%
    top -7px
    width 10px
    height 10px
    border $border
    border-bottom 0
    border-right 0
    background white
    transform rotate(45deg)

.custom-datepicker__calendar.inline
  box-shadow none

.custom-datepicker__calendar
  box-shadow 0 2px 12px 0 rgba(0, 0, 0, .1)
  border-radius 2px
  position absolute
  z-index 100
  background white
  width $width
  border $border
  header
    display block
    line-height 40px
    span
      display inline-block
      text-align center
      width (100 - (100/7)*2)%
      float left

    .prev
    .next
      width (100/7)%
      float left
      position relative
      font-size 20px

    .prev.disabled
      color $disabledColor
    .next.disabled
      color $disabledColor

    .prev:not(.disabled)
    .next:not(.disabled)
    .up:not(.disabled)
      cursor pointer
      &:hover
        color $hoverColor

  .disabled
    color $disabledColor
    cursor default
  .flex-rtl
    display flex
    width inherit
    flex-wrap wrap

  .cell:not(.day)
     border-radius 0
  .cell
    user-select none    
    position relative
    display inline-block
    padding 0 5px
    width (100/7)%
    height 40px
    line-height 40px
    text-align center
    vertical-align middle
    border 1px solid transparent
    &:not(.blank):not(.disabled).day
    &:not(.blank):not(.disabled).month
    &:not(.blank):not(.disabled).year
      cursor pointer
      &:hover:not(.selected)
        color $hoverColor
    &.selected
      background $selectedColor
      &:hover
        background $selectedColor
      &.highlighted
        background $selectedColor
    &.checked
      &:before
        content ''
        position absolute
        left 16px
        bottom 0px
        width 8px
        height 8px
        background-color $selectedColor
        border-radius 50%
    &.highlighted
      background #cae5ed
    &.grey
      color #888

      &:hover
        background inherit

    &.day-header
      font-size 75%
      white-space no-wrap
      cursor inherit
      &:hover
        background inherit

  .month,
  .year
    width 33.333%
  &-footer    
    display flex
    justify-content space-between
    border-top $border
    button
      display inline-block
      white-space nowrap
      cursor pointer
      background #fff
      border none
      color #5a5e66
      -webkit-appearance none
      text-align center
      outline none
      margin 0
      font-weight 500
      font-size 14px


.custom-datepicker__clear-button
.custom-datepicker__calendar-button
  cursor pointer
  font-style normal
  &.disabled
    color #999
    cursor default
</style>
