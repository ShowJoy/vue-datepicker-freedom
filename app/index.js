import Vue from 'vue';
import App from './app';
import VueRouter from 'vue-router';
import routes from './pages/routes';
import CurrencyInput from 'app/components/currency-input';

Vue.use(VueRouter);
Vue.use(CurrencyInput);

console.log(App);
const router = new VueRouter({
  routes,
  mode: 'hash'
});

new Vue({
  router,
  render: h => h(App)
}).$mount('#app');
