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
          <p id="welcomeMsg">Welcome to School Registration</p>
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
                  <el-form-item label="School Name" prop="sname">
                    <el-input
                      v-model="ruleForm.sname"
                      placeholder="Please, enter your school name here."
                    ></el-input>
                  </el-form-item>
                  <el-form-item label="School Address" prop="sAddress">
                    <el-input
                      v-model="ruleForm.sAddress"
                      placeholder="Please, enter school address here."
                    ></el-input>
                  </el-form-item>
                  <el-form-item label="Official Website" prop="school_URL">
                    <el-input
                      v-model="ruleForm.school_URL"
                      type="website"
                      placeholder="Please, enter your school website ."
                    ></el-input>
                  </el-form-item>
                  <el-form-item label="Blockchain Address" prop="bAddress">
                    <el-input
                      v-model="ruleForm.bAddress"
                      placeholder="Please, enter your blockchain address."
                    ></el-input>
                  </el-form-item>
                  <el-form-item label="Email Address" prop="email">
                    <el-input
                      v-model="ruleForm.email"
                      placeholder="Please, enter your email here."
                    ></el-input>
                  </el-form-item>
                  <el-form-item label="Password" prop="password">
                    <el-input
                      v-model="ruleForm.password"
                      type="password"
                      placeholder="Please, enter your password."
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
import { register } from "@/network/schools";

export default {
  name: "signup",
  data() {
    return {
      ruleForm: {
        fname: "",
        email: "",
        password: "",
        bAddress: "",
        school_URL: "",
        sAddress: "",
      },
      rules: {
        sname: [
          {
            required: true,
            message: "Please input your school name.",
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
            message: "Please input a valid email address.",
            trigger: "blur"
          },
          {
            type: "email",
            message: "Please input a valid email address",
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
        ],
        sAddress: [
        { 
          required: true,
          message: "Please Enter your school address",
          trigger: "blur"
        },
        {
          min:2,
          message: "Length should be at least five(5)",
          trigger: ["blur", "change"]
        }
        ],
      school_URL: [
        { 
          required: true,
          message: "Please Enter your school Website",
          trigger: "blur"
        },
        {
          min:5,
          message: "Length should be at least five(5)",
          trigger: ["blur", "change"]
        }

      ]
  },
      show: true,
      menuList: [
        { name: "Home", path: "/home" }
      ]
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
            school_name: this.ruleForm.sname,
            address: this.ruleForm.sAddress,
            email_address: this.ruleForm.email,
            public_key: this.ruleForm.bAddress,
            password: this.ruleForm.password,
            official_website: this.ruleForm.school_URL
          };
          register(data)
            .then(res => {
              console.log(res);
              this.$router.replace("/login");
            })
            .catch(function(error) {
              console.log(error);
              this.$message.error({
                title: "error",
                message: "Registration failed, please try again later, or contact the administrator! !!"
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
    },
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
