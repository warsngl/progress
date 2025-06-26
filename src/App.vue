<template>
  <nav>
    <router-link to="/progress">Progress</router-link>
    <router-link to="/chart">Chart</router-link>
  </nav>
  <router-view></router-view>
</template>

<style>
#app{
  width: 100vw;
  height: 100vh;
}
nav{
  justify-content: center;
  margin-bottom: 40px;
  display:flex;
  gap:10px;
}
.router-link-exact-active{
  text-decoration: underline;
}
</style>