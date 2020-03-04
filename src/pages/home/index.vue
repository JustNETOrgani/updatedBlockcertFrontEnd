<template>
  <div class="container">
    <Head :menuList="menuList" />
    <div class="body">
      <h1 class="title">Blockerts Universal View</h1>
      <div class="input-container">
        <el-input placeholder="Input Student ID..." v-model="input">
          <template slot="append">
            <div class="text">View</div>
          </template>
        </el-input>
      </div>
    </div>
  </div>
</template>

<script>
import Head from "@/components/header";

export default {
  name: "home",
  data() {
    return {
      input: "",
      menuList: [
        {
          name: "Login in",
          path: "/login"
        },
        {
          name: "Sign up",
          path: "/sign"
        }
      ]
    };
  },
  components: {
    Head
  }
};
</script>

<style scoped>
.container {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.logo {
  height: 5rem;
}

.menu {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.menu-item {
  margin: 0 0.5rem;
}

.container .body {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 5rem 0;
}

.title {
  font-weight: 100;
}

.input-container {
  width: 50%;
}

.text {
  cursor: pointer;
}
</style>
