import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { createMemoryHistory, createRouter } from 'vue-router'

import ProgressView from './pages/ProgressView.vue'
import ChartView from './pages/ChartView.vue'

const routes = [
    { path: '/', redirect: '/chart' },
    { path: '/progress', component: ProgressView },
    { path: '/chart', component: ChartView },
]

const router = createRouter({
    history: createMemoryHistory(),
    routes,
})
createApp(App).use(router).mount('#app')
