import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { VueFire, VueFireAuth } from 'vuefire'
import { createHead } from '@unhead/vue/client'

import App from './App.vue'
import router from './router'
import { firebaseApp } from './lib/firebase'
const head = createHead()

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(VueFire, {
  firebaseApp,
  modules: [VueFireAuth()],
})
app.use(head)

app.mount('#app')
