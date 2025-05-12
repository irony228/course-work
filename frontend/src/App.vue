<script setup>
import Navbar from './components/Navbar.vue'

</script>

<template>
  <div id="app">
    <Navbar />
    <router-view />
  </div>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'App',
  setup() {
    return {};
  }
});
</script>

<style>
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    margin-top: 20px;
    
  }
</style>