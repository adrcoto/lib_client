import { createApp } from 'vue'
import App from './App.vue';
import store from './store/store';

import PrimeVue from 'primevue/config';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Toast from 'primevue/toast';
import ToastService from 'primevue/toastservice';

import 'primevue/resources/themes/luna-amber/theme.css';
import 'primevue/resources/primevue.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';

import { library } from "@fortawesome/fontawesome-svg-core";
import { faThumbsUp, faThumbsDown } from "@fortawesome/free-solid-svg-icons";

library.add(faThumbsUp, faThumbsDown);

import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
const app = createApp(App);

app.use(store);
app.use(PrimeVue);
app.use(ToastService);




app.component("font-awesome-icon", FontAwesomeIcon);

app.component('InputText', InputText);
app.component('Button', Button);
app.component('Toast', Toast);

app.mount('#app');




