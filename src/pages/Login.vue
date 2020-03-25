<template>
  <div class="login">
    <Head :menuList="menuList">
      <div>
        <el-button
          class="menu-item"
          type="primary text"
          round
          @click="dialogVisible = true"
          >Register</el-button
        >
        <el-dialog
          title="Select registered user type"
          :visible.sync="dialogVisible"
          width="30%"
        >
          <el-radio-group v-model="RegisterType">
            <el-radio label="student">Student</el-radio>
            <el-radio label="school">School</el-radio>
          </el-radio-group>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">Cancel</el-button>
            <el-button type="primary" @click="RegisterTypeChoose"
              >Confirm</el-button
            >
          </span>
        </el-dialog>
      </div>
    </Head>
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
                <el-form-item
                  class="formSection"
                  id="labelText"
                  label="Username:"
                  prop="username"
                >
                  <el-input
                    v-model="ruleForm.username"
                    placeholder="Please, input your username."
                  ></el-input>
                </el-form-item>
                <el-form-item
                  class="formSection"
                  id="labelText"
                  label="Password:"
                  prop="password"
                >
                  <el-input
                    v-model="ruleForm.password"
                    type="password"
                    placeholder="Please, input your password."
                  ></el-input>
                </el-form-item>
                <el-form-item label="Role:">
                  <el-radio-group v-model="role">
                    <el-radio label="school">School</el-radio>
                    <el-radio label="student">Student</el-radio>
                  </el-radio-group>
                </el-form-item>
                <!-- <div class="btn-container"> -->
                <el-form-item>
                  <el-button
                    type="primary"
                    @click.prevent="submitForm('ruleForm')"
                    >Login</el-button
                  >
                </el-form-item>
                <!-- </div> -->
              </el-form>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
    <Footer></Footer>
  </div>
  <!--class Login-->
</template>

<script>
import Head from "@/components/header";
import Footer from "@/components/Footer.vue";
import { login } from "@/network/students";
import { Schlogin } from "@/network/schools";

export default {
  name: "login",
  data() {
    return {
      menuList: [{ name: "Home", path: "/home" }],
      ruleForm: {
        username: "",
        password: ""
      },
      rules: {
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
      RegisterType: "student",
      dialogVisible: false
    };
  },
  components: {
    Head,
    Footer
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.role === "student") {
            let data = {
              email_address: this.ruleForm.username,
              password: this.ruleForm.password
            };
            login(data)
              .then(res => {
                this.$store.commit("set_token", res.data.token);
                this.$store.commit("set_student_info", res.data.student);
                this.$router.push("/students/certificates");
                this.$message({
                  message: "Congratulations. Login successful",
                  type: "success",
                  center: true
                });
              })
              .catch(error => {
                console.log(error);
                // this.$message.error("账户或密码错误，请输入正确的账户和密码");
                this.$message.error({
                  title: "error",
                  message: "Account or password is wrong, please enter the correct account and password"
                });
              });
          }
          // eslint-disable-next-line no-empty
          else if (this.role === "school") {
            let data = {
              email_address: this.ruleForm.username,
              password: this.ruleForm.password
            };
            Schlogin(data)
              .then(res => {
                this.$store.commit("set_token", res.data.token);
                this.$store.commit("set_school_info", res.data.school);
                this.$router.push("/schools/IssueList");
                this.$message({
                  message: "Congratulations. Login successful",
                  type: "success",
                  center: true
                });
              })
              .catch(error => {
                console.log(error);
                this.$message.error({
                  title: "error",
                  message: "Account or password is wrong, please enter the correct account and password"
                });
              });
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    RegisterTypeChoose() {
      this.dialogVisible = false;
      if (this.RegisterType === "student") {
        this.$router.push("/students/Register");
      }
      if (this.RegisterType === "school") {
        this.$router.push("/schools/Register");
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
  /* height: 70%; */
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
  /* color: #1989fa; */
}
#labelText {
  color: #1989fa;
}
.formSection {
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

.menu-item {
  text-decoration: none;
  color: #ffffff;
  margin: 0.6rem 0.5rem;
}
</style>
