<template>
  <div class="pageContainer">
    <Head :menuList="menuList">
      <el-button class="menu-item" type="primary" @click="LoginURL" round
        >Login</el-button
      >
    </Head>
    <div class="body">
      <div id="middlePage">
        <div id="msgArea">
          <p id="welcomeMsg">Welcome to Student Registration</p>
        </div>
        <div id="formArea">
          <p id="instruction">
            Please, fill the form below.
          </p>
          <!--Form to be filled-->
          <el-row>
            <el-col :span="20" :offset="2">
              <div class="grid-content bg-purple-light">
                <el-form
                  :model="ruleForm"
                  :rules="rules"
                  ref="ruleForm"
                  label-width="160px"
                  class="demo-ruleForm"
                >
                  <el-form-item label="First name" prop="fname">
                    <el-input
                      v-model="ruleForm.fname"
                      placeholder="Please, enter your first name here."
                    ></el-input>
                  </el-form-item>
                  <el-form-item label="Last name" prop="lname">
                    <el-input
                      v-model="ruleForm.lname"
                      placeholder="Please, enter your last name here."
                    ></el-input>
                  </el-form-item>
                  <el-form-item label="Email address" prop="email">
                    <el-input
                      v-model="ruleForm.email"
                      placeholder="Please, enter your email here."
                    ></el-input>
                  </el-form-item>
                  <el-form-item label="Student ID" prop="stdID">
                    <el-input
                      v-model="ruleForm.stdID"
                      placeholder="Please, enter your student ID."
                    ></el-input>
                  </el-form-item>
                  <el-form-item label="Password" prop="password">
                    <el-input
                      v-model="ruleForm.password"
                      type="password"
                      placeholder="Please, enter your password."
                    ></el-input>
                  </el-form-item>
                  <el-form-item label="Blockchain address" prop="bAddress">
                    <el-input
                      v-model="ruleForm.bAddress"
                      placeholder="Please, enter your blockchain address."
                    ></el-input>
                  </el-form-item>
                  <div id="blockchainType">
                    <p id="blockchainAddressTypeLink">
                      *You can create Bitcoin address
                      <a href="https://www.bitaddress.org/" target="_blank"
                        >here. </a
                      >Ethereum address<a
                        href="https://www.myetherwallet.com/"
                        target="_blank"
                      >
                        here</a
                      >*
                    </p>
                  </div>
                  <el-form-item>
                    <el-button
                      class="myBtn"
                      type="success"
                      @click="submitForm('ruleForm')"
                      >Register</el-button
                    >
                    <el-button
                      class="myBtn"
                      type="danger"
                      @click="resetForm('ruleForm')"
                      >Reset</el-button
                    >
                  </el-form-item>
                </el-form>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
    <Footer></Footer>
  </div>
</template>

<script>
import Head from "@/components/header";
import Footer from "@/components/Footer";
import { register } from "@/network/students";

export default {
  name: "signup",
  data() {
    return {
      ruleForm: {
        fname: "",
        lname: "",
        email: "",
        stdID: "",
        password: "",
        bAddress: ""
      },
      rules: {
        fname: [
          {
            required: true,
            message: "Please input your first name.",
            trigger: "blur"
          },
          {
            min: 2,
            message: "Length should be at least two",
            trigger: ["blur", "change"]
          }
        ],
        lname: [
          {
            required: true,
            message: "Please input your last name.",
            trigger: "blur"
          },
          {
            min: 2,
            message: "Length should be at least two",
            trigger: ["blur", "change"]
          }
        ],
        email: [
          {
            required: true,
            message: "Please input email address.",
            trigger: "blur"
          },
          {
            type: "email",
            message: "Please input correct email address",
            trigger: ["blur", "change"]
          }
        ],
        stdID: [
          {
            required: true,
            message: "Please input your student ID.",
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
        ],
        bAddress: [
          {
            required: true,
            message: "Please input your blockchain address.",
            trigger: "blur"
          },
          {
            min: 20,
            message: "Length should be at least twenty",
            trigger: ["blur", "change"]
          }
        ]
      },
      show: true,
      menuList: [{ name: "Home", path: "/home" }]
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
          var data = {
            first_name: this.ruleForm.fname,
            last_name: this.ruleForm.lname,
            email_address: this.ruleForm.email,
            student_num: this.ruleForm.stdID,
            chain_address: this.ruleForm.bAddress,
            password: this.ruleForm.password
          };
          register(data)
            .then(res => {
              console.log(res);
              this.$message({
                message: "Congratulations. Registration successful, Please Login",
                type: "success"
              });
              this.$router.replace("/login");
            })
            .catch(function(error) {
              console.log(error);
              this.$message.error({
                title: "error",
                message:
                  "Registration failed, please try again later, or contact the administrator! !!"
              });
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    LoginURL() {
      this.$router.push("/login");
    }
  }
};
</script>

<style scoped>
#pageContainer {
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
#msgArea {
  width: 100%;
  margin-bottom: 1rem;
}
#welcomeMsg {
  color: #477ea3;
  font-size: 1.5rem;
  padding-top: 1rem;
}

#instruction {
  color: #477ea3;
  font-style: italic;
  padding-top: 0.5rem;
  padding-bottom: 1rem;
}

#middlePage {
  width: 50%;
  background-color: #ffffff;
}

#blockchainType {
  color: #15415e;
  font-style: italic;
  font-weight: 90;
}
.myBtn {
  margin-top: 1rem;
}

.menu-item {
  text-decoration: none;
  color: #ffffff;
  margin: 0.6rem 0.5rem;
}
</style>
