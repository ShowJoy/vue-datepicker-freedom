# Markdown title

``` js
function a () {
  console.log('test');
}
```
---

<template>
  <div>
    <span class="sparkline">2 5 6 7 7 23 9</span>
    <currency-input v-model="price"></currency-input>
    {{price}}
  </div>
</template>

<script>
import { sparkLine } from 'utils/canvas-helper';

export default {
  data() {
    return {
      price: null
    };
  },
  methods: {
  },
  mounted() {
    // 折线
    sparkLine();
  }
};
</script>
<style lang="scss" scoped>
  .sparkline {
    background-color: '#ddd';
    color: red;
  }
</style>
