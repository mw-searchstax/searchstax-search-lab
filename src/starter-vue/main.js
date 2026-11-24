import { createApp } from 'vue';
import SearchApp from './SearchApp.vue';
import '../search.css';

const app = createApp(SearchApp);
// Show the warning without the component trace, which can include connection props.
app.config.warnHandler = (message) => { console.warn('[Vue]', message); };
app.mount('#app');
