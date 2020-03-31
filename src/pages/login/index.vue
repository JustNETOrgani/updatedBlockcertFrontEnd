<template>
  <div class="login">
    <Head :menuList="menuList" />
    <div class="body">
      <h1 class="title">Login In</h1>
      <div class="form">
        <div class="container">
          <div class="label">username:</div>
          <el-input v-model="username" />
        </div>
        <div class="container">
          <div class="label">password:</div>
          <el-input v-model="password" show-password />
        </div>
        <div class="container">
          <div class="label">role:</div>
          <div>
            <el-radio v-model="role" label="school">school</el-radio>
            <el-radio v-model="role" label="student">student</el-radio>
          </div>
        </div>
        <div class="btn-container">
          <el-button type="primary">Login in</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Head from "@/components/header";

export default {
  name: "login",
  data() {
    return {
      menuList: [
        { name: "Home", path: "/home" },
        { name: "Sign up", path: "/sign" }
      ],
      username: "",
      password: "",
      role: "student"
    };
  },
  components: {
    Head
  }
};
</script>

<style scoped>
.login {
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
  font-weight: 100;
}
.form {
  width: 30rem;
  /* height: 15rem; */
  /* background: #fafafa; */
  border: 2px solid #1d98ea;
  padding: 2rem;
  border-radius: 4px;
}

.container {
  display: flex;
  align-items: center;
  padding: 1rem 0.5rem;
}
.btn-container {
  display: flex;
  align-items: center;
  padding: 1rem 0.5rem;
  justify-content: center;
}

.label {
  padding: 0 0.5rem;
  width: 5rem;
  text-align: right;
  color: #1989fa;
}
</style>
