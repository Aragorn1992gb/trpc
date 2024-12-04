import { createRouter, createWebHistory } from 'vue-router';
import Example from '../components/Example.vue';
import Notifications from '../components/Notifications.vue';

const routes = [
  {
    path: '/example',
    name: 'Example',
    component: Example,
  },
  {
    path: '/notifications',
    name: 'Notifications',
    component: Notifications,
  },
];

const router = createRouter({
  history: createWebHistory(), // Leave it empty or provide a base path, e.g., `/app` if needed
  routes,
});

export default router;
