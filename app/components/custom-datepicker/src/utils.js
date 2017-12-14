import DateLanguages from './languages';

export default {

  /**
   * Validates a date object
   * @param {Date} date - an object instantiated with the new Date constructor
   * @return {Boolean}
   */
  isValidDate (date) {
    if (Object.prototype.toString.call(date) !== '[object Date]') {
      return false;
    }
    return !isNaN(date.getTime());
  },

  isArray (obj) {
    return Object.prototype.toString.call(obj) === '[object Array]';
  },

  isFunction (obj) {
    return Object.prototype.toString.call(obj) === '[object Function]';
  },

  /**
   * Return abbreviated week day name
   * @param {Date}
   * @param {Array}
   * @return {String}
   */
  getDayNameAbbr (date, days) {
    if (typeof date !== 'object') {
      throw TypeError('Invalid Type');
    }
    return days[date.getDay()];
  },

  /**
   * Return name of the month
   * @param {Number|Date}
   * @param {Array}
   * @return {String}
   */
  getMonthName (month, months) {
    if (!months) {
      throw Error('missing 2nd parameter Months array');
    }
    if (typeof month === 'object') {
      return months[month.getMonth()];
    }
    if (typeof month === 'number') {
      return months[month];
    }
    throw TypeError('Invalid type');
  },

  /**
   * Return an abbreviated version of the month
   * @param {Number|Date}
   * @return {String}
   */
  getMonthNameAbbr (month, monthsAbbr) {
    if (!monthsAbbr) {
      throw Error('missing 2nd paramter Months array');
    }
    if (typeof month === 'object') {
      return monthsAbbr[month.getMonth()];
    }
    if (typeof month === 'number') {
      return monthsAbbr[month];
    }
    throw TypeError('Invalid type');
  },

  /**
   * Alternative get total number of days in month
   * @param {Number} year
   * @param {Number} m
   * @return {Number}
   */
  daysInMonth (year, month) {
    return /8|3|5|10/.test(month) ? 30 : month === 1 ? (!(year % 4) && year % 100) || !(year % 400) ? 29 : 28 : 31;
  },

  /**
   * Get nth suffix for date
   * @param {Number} day
   * @return {String}
   */
  getNthSuffix (day) {
    switch (day) {
      case 1:
      case 21:
      case 31:
        return 'st';
      case 2:
      case 22:
        return 'nd';
      case 3:
      case 23:
        return 'rd';
      default:
        return 'th';
    }
  },

  /**
   * Formats date object
   * @param {Date}
   * @param {String}
   * @param {Object}
   * @return {String}
   */
  formatDate (date, format, translation) {
    translation = (!translation) ? DateLanguages.translations.en : translation;
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let str = format
      .replace(/dd/, ('0' + day).slice(-2))
      .replace(/d/, day)
      .replace(/yyyy/, year)
      .replace(/yy/, String(year).slice(2))
      .replace(/MMMM/, this.getMonthName(date.getMonth(), translation.months.original))
      .replace(/MMM/, this.getMonthNameAbbr(date.getMonth(), translation.months.abbr))
      .replace(/MM/, ('0' + month).slice(-2))
      .replace(/M(?!a|ä)/, month)
      .replace(/su/, this.getNthSuffix(date.getDate()))
      .replace(/D(?!e|é|i)/, this.getDayNameAbbr(date, translation.days));
    return str;
  },

  /**
   * Creates an array of dates for each day in between two dates.
   * @param {Date} start
   * @param {Date} end
   * @return {Array}
   */
  createDateArray (start, end) {
    let dates = [];
    while (start <= end) {
      dates.push(new Date(start));
      start = new Date(start).setDate(new Date(start).getDate() + 1);
    }
    return dates;
  },

  /**
   * Extend an array of dates from another array of dates. 
   * @param {Date} one 
   * @param {Date} two 
   */
  extendDateArray(one, two) {
    return one.concat(two).reduce((arr, val) => {
      if (arr.indexOf(val) < 0) {
        arr.push(val);
      }
      return arr;
    }, []);
  },

  /**
   * return an array of dates filter by another array of dates. 
   * @param {Date} one 
   * @param {Date} two 
   */
  filterDateArray(one, two) {
    return one.filter(item => two.indexOf(item) === -1);
  },

  /**
   * tranform date object to number
   * @param {Array} dates 
   * @return {Array}
   */
  dateToNum(dates) {
    return dates.map(date => +date);
  },

  copy(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

}
