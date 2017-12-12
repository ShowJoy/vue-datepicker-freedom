import Vue from 'vue';
import App from './app';
import VueRouter from 'vue-router';
import routes from './pages/routes';
import CurrencyInput from 'app/components/currency-input';
import DatePicker from 'app/components/custom-datepicker';
import ElementUI from 'element-ui';
import LPDComponent from '@ele/lpd-component';
import '@ele/lpd-component/lib/theme.min.css';
import 'element-ui/lib/theme-default/index.css';

Vue.use(ElementUI);
Vue.use(VueRouter);
Vue.use(CurrencyInput);
Vue.use(LPDComponent);
Vue.use(DatePicker);

console.log(App);
const router = new VueRouter({
  routes,
  mode: 'hash'
});

new Vue({
  router,
  render: h => h(App)
}).$mount('#app');
