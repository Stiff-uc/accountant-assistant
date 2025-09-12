<template>
  <div id="app">
    <Navigation />
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
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
  margin: 0;
  padding: 0;
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
