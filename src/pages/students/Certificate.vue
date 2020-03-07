<template>
  <div class="certificate">
    <Head :menuList="menuList" />
    <div class="body">
      <h1 class="title">Certificates List</h1>
    </div>
    <Footer></Footer>
  </div>
</template>

<script>
import Head from "@/components/header";

export default {
  name: "certificate",
  data() {
    return {
      menuList: [
        { name: "Home", path: "/home" },
        { name: "Certificates", path: "/certificates"},
        { name: "Login out", path: "/loginOut" }
      ]
    };
  },
  components: {
    Head
  }
};
</script>

<style scoped>
.certificate {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.body {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  /* justify-content: center; */
  padding: 2rem;
}

.title {
  color: #477ea3;
  font-size: 1.5rem;
}
</style>
