<template>
  <div class="header">
    <img class="logo" src="../../assets/img/logo.png" />
    <div class="menu">
      <li v-for="v in menuList" :key="v.name">
        <router-link class="menu-item" :to="v.path">{{ v.name }}</router-link>
      </li>
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "Head",
  props: ["menuList"]
};
</script>

<style scoped>
.header {
  height: 4rem;
  padding: 0.5rem 1rem;
  display: flex;
  background-color: #ffffff;
}
.logo {
  height: 3rem;
}

.menu {
  flex: 1;
  display: flex;
  /* align-items: center; */
  justify-content: flex-end;
}

.menu-item {
  text-decoration: none;
  color: #60bdfa;
  margin: 0 0.5rem;
}

li {
  list-style: none;
  font-size: 20px;
  padding-top: 1.3rem;
}
.router-link-active{
  color: #477ea3;
  text-decoration:underline
}
</style>
