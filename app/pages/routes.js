import Index from './index';
import MD from './markdown/demo.md';

const routes = [
  {
    path: '/index',
    component: Index,
    name: 'index'
  },
  {
    path: '/markdown',
    component: MD,
    name: 'markdown-demo'
  },
  {
    path: '*',
    redirect: 'index'
  }
];

export default routes;
