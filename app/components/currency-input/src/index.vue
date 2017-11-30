<template>
  <section>
    <input ref="input" :value="customprop" @input="deal($event.target.value)"></span>
  </section>
</template>
<script>

export default {
  name: 'CurrencyInput',
  props: {
    customprop: [String, Number]
  },
  // 自定义v-model的语法糖属性和事件名
  model: {
    prop: 'customprop',
    event: 'customevent'
  },
  methods: {
    deal(value) {
      this.$emit('customevent', value);
    }
  }
};
</script>
<style lang="scss" scoped>
</style>
