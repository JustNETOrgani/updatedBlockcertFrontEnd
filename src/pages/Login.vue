<template>
  <div class="login">
    <Head :menuList="menuList" />
    <div class="body">
      <div class="form">
        <h1 class="title">Login In</h1>
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
          <el-button type="primary" @click.prevent="login">Login in</el-button>
        </div>
      </div>
    </div>
    <Footer></Footer>
  </div>
</template>

<script>
import Head from "@/components/header";
import Footer from "@/components/Footer.vue";
import { login } from "@/network/students";

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
    Head,
    Footer
  },
  methods: {
    login() {
      if (this.role === "student") {
        let data = {
          email_address: this.username,
          password: this.password
        };
        login(data)
          .then(res => {
            // console.log(res)
            // this.$store.commit('set_token', res.token);
            // console.log(this.$store.state.token)
            // if (this.$store.state.token)
            console.log("res.token", res.data.token);
            // console.log("type", typeof(res))
            // console.log("res.token", res["token"]);
            // console.log("res", res);
            this.$store.commit('set_token', res.data.token);
            this.$store.commit('set_student_info', res.data.student)
            this.$router.push("/certificates");
          })
          .catch(function(error) {
            console.log(error);
          });
      }
    }
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
  color: #477ea3;
  font-size: 1.5rem;
}
.form {
  width: 30rem;
  background-color: #ffffff;
  padding: 2rem;
  border-radius: 4px;
  margin-top: 100px;
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
