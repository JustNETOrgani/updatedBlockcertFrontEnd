<template>
  <div class="pageContainer">
    <Head :menuList="menuList">
      <el-button class="menu-item" type="primary" @click="LoginURL" round
        >{{$t('common.login')}}</el-button
      >
    </Head>
    <div class="body">
      <div id="middlePage">
        <div id="msgArea">
          <p id="welcomeMsg">{{$t('studentRegister.welcomeMsg')}}</p>
        </div>
        <div id="formArea">
          <p id="instruction">
            {{$t('studentRegister.instruction')}}
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
                  <el-form-item :label="$t('studentRegister.fnameLabel')" prop="fname">
                    <el-input
                      v-model="ruleForm.fname"
                      :placeholder="$t('studentRegister.fnamePlaceholder')"
                    ></el-input>
                  </el-form-item>
                  <el-form-item :label="$t('studentRegister.lnameLabel')" prop="lname">
                    <el-input
                      v-model="ruleForm.lname"
                      :placeholder="$t('studentRegister.lnamePlaceholder')"
                    ></el-input>
                  </el-form-item>
                  <el-form-item :label="$t('studentRegister.emailLabel')" prop="email">
                    <el-input
                      v-model="ruleForm.email"
                      :placeholder="$t('studentRegister.emailPlaceholder')"
                    ></el-input>
                  </el-form-item>
                  <el-form-item :label="$t('studentRegister.stdIDLabel')" prop="stdID">
                    <el-input
                      v-model="ruleForm.stdID"
                      :placeholder="$t('studentRegister.stdIDPlaceholder')"
                    ></el-input>
                  </el-form-item>
                  <el-form-item :label="$t('studentRegister.passwordLabel')" prop="password">
                    <el-input
                      v-model="ruleForm.password"
                      type="password"
                      :placeholder="$t('studentRegister.passwordPlaceholder')"
                    ></el-input>
                  </el-form-item>
                  <el-form-item :label="$t('studentRegister.bAddressLabel')" prop="bAddress">
                    <el-input
                      v-model="ruleForm.bAddress"
                      :placeholder="$t('studentRegister.bAddressPlaceholder')"
                    ></el-input>
                  </el-form-item>
                  <div id="blockchainType">
                    <p id="blockchainAddressTypeLink">
                      *{{$t('studentRegister.blockchainAddressTypeLinkBitcoin')}}
                      <a href="https://www.bitaddress.org/" target="_blank"
                        >{{$t('studentRegister.link')}}. </a
                      >{{$t('studentRegister.blockchainAddressTypeLinkEthereum')}}<a
                        href="https://www.myetherwallet.com/"
                        target="_blank"
                      >{{$t('studentRegister.link')}}</a>*
                    </p>
                  </div>
                  <el-form-item>
                    <el-button
                      class="myBtn"
                      type="primary"
                      @click="submitForm('ruleForm')"
                      >{{$t('common.register')}}</el-button
                    >
                    <el-button
                      class="myBtn"
                      type="danger"
                      @click="resetForm('ruleForm')"
                      >{{$t('common.reset')}}</el-button
                    >
                  </el-form-item>
                </el-form>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
    <!-- <Footer></Footer> -->
  </div>
</template>

<script>
import Head from "@/components/header";
// import Footer from "@/components/Footer";
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
            message: this.$t('studentRegister.fnameFormat1'),
            trigger: "blur"
          },
          {
            min: 2,
            message: this.$t('studentRegister.fnameFormat2'),
            trigger: ["blur", "change"]
          }
        ],
        lname: [
          {
            required: true,
            message: this.$t('studentRegister.lnameFormat1'),
            trigger: "blur"
          },
          {
            min: 2,
            message: this.$t('studentRegister.lnameFormat2'),
            trigger: ["blur", "change"]
          }
        ],
        email: [
          {
            required: true,
            message: this.$t('studentRegister.emailFormat1'),
            trigger: "blur"
          },
          {
            type: "email",
            message: this.$t('studentRegister.emailFormat2'),
            trigger: ["blur", "change"]
          }
        ],
        stdID: [
          {
            required: true,
            message: this.$t('studentRegister.stdIDFormat1'),
            trigger: "blur"
          },
          {
            min: 2,
            message: this.$t('studentRegister.stdIDFormat2'),
            trigger: ["blur", "change"]
          }
        ],
        password: [
          {
            required: true,
            message: this.$t('studentRegister.passwordFormat1'),
            trigger: "blur"
          },
          {
            min: 6,
            message: this.$t('studentRegister.passwordFormat2'),
            trigger: ["blur", "change"]
          }
        ],
        bAddress: [
          {
            required: true,
            message: this.$t('studentRegister.bAddressFormat1'),
            trigger: "blur"
          },
          {
            min: 20,
            message: this.$t('studentRegister.bAddressFormat2'),
            trigger: ["blur", "change"]
          }
        ]
      },
      show: true,
      menuList: [{ name: this.$t('common.home'), path: "/home" }]
    };
  },
  components: {
    Head,
    // Footer
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
                message: this.$t('studentRegister.registrationSuccess'),
                type: "success"
              });
              this.$router.replace("/login");
            })
            .catch(function(error) {
              console.log(error);
              this.$message.error({
                title: "error",
                message:
                  this.$t('studentRegister.registrationFail')
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
