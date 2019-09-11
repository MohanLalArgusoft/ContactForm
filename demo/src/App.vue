<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import Register from './components/register';
import Login from './components/login';
import Home from './components/home';

export default {
  components:{
    'login':Login,
    'register':Register,
    'home':Home,
  }
}
</script>

<style>

</style>
