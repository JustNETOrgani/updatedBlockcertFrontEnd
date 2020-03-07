<template>
  <div class="login">
    <Head :menuList="menuList" />
    <div class="body">
      <div class="formArea">
        <h1 class="title">Login</h1>
          <!--Form to be filled-->
          <el-row>
            <el-col :span="20" :offset="2">
              <div class="grid-content bg-purple-light">
                <el-form
                  :model="ruleForm"
                  :rules="rules"
                  ref="ruleForm"
                  label-width="90px"
                >
                  <el-form-item class="formSection" id="labelText" label="Username:" prop="username">
                    <el-input
                      v-model="ruleForm.username"
                      placeholder="Please, input your username."
                    ></el-input>
                  </el-form-item>
                  <el-form-item class="formSection" id="labelText" label="Password" prop="password">
                    <el-input
                      v-model="ruleForm.password"
                      type="password"
                      placeholder="Please, input your password."
                    ></el-input>
                  </el-form-item>
                  <div id="loginType">
                    <div class="label">Role:</div>
                    <div>
                      <el-radio v-model="role" label="school">School</el-radio>
                      <el-radio v-model="role" label="student">Student</el-radio>
                    </div>
                  </div>
                  <div class="btn-container">
                    <el-form-item>
                      <el-button type="primary" @click.prevent="login">Login</el-button>
                    </el-form-item>
                  </div>
                </el-form>
              </div>
            </el-col>
          </el-row>
        </div>
    </div>
    <Footer></Footer>
  </div> <!--class Login-->
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
      ruleForm:{
                username: "",
                password: ""
              },
      rules:{
            username: [
          {
            required: true,
            message: "Please input username.",
            trigger: "blur"
          },
          {
            min: 2,
            message: "Length should be at least two",
            trigger: ["blur", "change"]
          }
        ],
        password: [
          {
            required: true,
            message: "Please input your password.",
            trigger: "blur"
          },
          {
            min: 6,
            message: "Length should be at least six.",
            trigger: ["blur", "change"]
          }
        ]
      },
      show: true,
      role: "student",
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
.formArea {
  background-color: #ffffff;
  border-radius: 4px;
  margin: 2.5% auto;
  width: 35%;
  height: 70%;
  padding: 1rem 1.5rem;
  
}
.title {
  color: #477ea3;
  font-size: 1.5rem;
}
.label {
  padding: 0 0.1rem;
  width: 5rem;
  text-align: left;
  color: #1989fa;
}
#labelText{
  color: #1989fa;
}
.formSection{
  margin-bottom: 2.5rem;
}
#loginType {
  color: #15415e;
  font-weight: 90;
}
.btn-container {
  width: 70%;
  display: flex;
  align-items: center;
  padding: 2rem 0.5rem;
  justify-content: center;
}


</style>
