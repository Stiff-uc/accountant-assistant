<template>
  <div id="app">
    <Navigation v-if="route.meta.requiresNav !== false" />
    <router-view />
  </div>
</template>

<script>
import { useRoute } from 'vue-router'
import Navigation from './components/common/Navigation.vue'

export default {
  name: 'App',
  components: {
    Navigation
  },
  setup() {
    const route = useRoute()
    return { route }
  }
}
</script>

<style>
html, body {
  height: 100%;
  margin: 0;
  padding: 0;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin: 0;
  padding: 0;
}

/* Общие стили для всех страниц */
body {
  background-color: #f5f5f5;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

/* Стили для мобильных устройств */
@media (max-width: 768px) {
  body {
    font-size: 14px;
  }
  
  .container {
    padding: 0.5rem;
  }
}
</style>
