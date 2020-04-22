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
          <p id="welcomeMsg">{{$t('schoolRegister.welcomeMsg')}}</p>
        </div>
        <div id="formArea">
          <p id="instruction">
            {{$t('schoolRegister.instruction')}}
          </p>
          <!--Form to be filled-->
          <el-row>
            <el-col :span="20" :offset="2">
              <div class="grid-content bg-purple-light">
                <el-form
                  id="myForm"
                  :model="ruleForm"
                  :rules="rules"
                  ref="ruleForm"
                  label-width="160px"
                  class="demo-ruleForm"
                >
                  <el-form-item :label="$t('schoolRegister.snameLabel')" prop="sname">
                    <el-input
                      v-model="ruleForm.sname"
                      :placeholder="$t('schoolRegister.snamePlaceholder')"
                    ></el-input>
                  </el-form-item>

                  <el-form-item :label="$t('schoolRegister.schoolemailLabel')" prop="schoolemail">
                    <el-input
                      v-model="ruleForm.schoolemail"
                      :placeholder="$t('schoolRegister.schoolemailPlaceholder')"
                    ></el-input>
                  </el-form-item>

                  <el-form-item :label="$t('schoolRegister.passwordLabel')" prop="password">
                    <el-input
                      v-model="ruleForm.password"
                      type="password"
                      :placeholder="$t('schoolRegister.passwordPlaceholder')"
                    ></el-input>
                  </el-form-item>

                  <el-form-item :label="$t('schoolRegister.school_URLLabel')" prop="school_URL">
                    <el-input
                      v-model="ruleForm.school_URL"
                      type="website"
                      :placeholder="$t('schoolRegister.school_URLPlaceholder')"
                    ></el-input>
                  </el-form-item>

                  <el-form-item :label="$t('schoolRegister.bAddressLabel')" prop="bAddress">
                    <el-input
                      v-model="ruleForm.bAddress"
                      :placeholder="$t('schoolRegister.bAddressPlaceholder')"
                    ></el-input>
                  </el-form-item>
                  <div id="blockchainType">
                    <p id="blockchainAddressTypeLink">
                      *{{$t('schoolRegister.blockchainTypeBitcoin')}}
                      <a href="https://www.bitaddress.org/" target="_blank"
                        >{{$t('schoolRegister.here')}}. </a
                      >{{$t('schoolRegister.blockchainTypeEthereum')}}<a
                        href="https://www.myetherwallet.com/"
                        target="_blank"
                      >
                        {{$t('schoolRegister.here')}}</a
                      >*
                    </p>
                    <fieldset>
                      <legend>{{$t('schoolRegister.SignatureLines')}}</legend>

                      <el-form-item :label="$t('schoolRegister.jobTitleLabel')" prop="jobTitle">
                        <el-input
                          v-model="ruleForm.jobTitle"
                          type="text"
                          :placeholder="$t('schoolRegister.jobTitlePlaceholder')"
                        ></el-input>
                      </el-form-item>

                      <el-form-item :label="$t('schoolRegister.signatureNameLabel')" prop="signatureName">
                        <el-input
                          v-model="ruleForm.signatureName"
                          type="text"
                          :placeholder="$t('schoolRegister.signatureNamePlaceholder')"
                        ></el-input>
                      </el-form-item>

                      <el-form-item
                        :label="$t('schoolRegister.signatureImageLabel')"
                        prop="signatureImage"
                      >
                        <input
                          type="file"
                          v-on:change="onSigImgFileSelect()"
                          class="uploadBtns"
                          ref="sigImg"
                          id="sigImg"
                          name="sigImg"
                          accept=".jpeg,.png,.jpg"
                        />
                      </el-form-item>
                      <el-form-item :label="$t('schoolRegister.school_logoLabel')" prop="school_logo">
                        <input
                          type="file"
                          v-on:change="onSchLogoFileSelect()"
                          class="uploadBtns"
                          ref="schLogo"
                          id="schLogo"
                          name="schLogo"
                          accept=".jpeg,.png,.jpg"
                        />
                      </el-form-item>
                    </fieldset>
                  </div>
                  <el-form-item>
                    <el-button
                      class="myBtn"
                      type="primary"
                      @click="submitForm('ruleForm')"
                      >{{$t('common.register')}}</el-button
                    >
                    <!-- id="myBtnRight" 之前有的按钮-->
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
import { register } from "@/network/schools";
import { getSigImageDetails } from "@/network/schools";
import { getSchLogoDetails } from "@/network/schools";

export default {
  name: "signup",
  data() {
    return {
      ruleForm: {
        sname: "",
        schoolemail: "",
        school_URL: "",
        schoolID: "",
        revocationList: "",
        bAddress: "",
        jobTitle: "",
        signatureName: "",
        signatureImage: "",
        school_logo: ""
      },
      sigImg: "",
      schLogo: null,
      sigformData: null,
      logoformData: null,
      rules: {
        sname: [
          {
            required: true,
            message: this.$t('schoolRegister.snameFormat1'),
            trigger: "blur"
          },
          {
            min: 2,
            message: this.$t('schoolRegister.snameFormat2'),
            trigger: ["blur", "change"]
          }
        ],

        jobTitle: [
          {
            required: true,
            message: this.$t('schoolRegister.jobTitleFormat1'),
            trigger: "blur"
          },
          {
            min: 2,
            message: this.$t('schoolRegister.jobTitleFormat2'),
            trigger: ["blur", "change"]
          }
        ],
        signatureName: [
          {
            required: true,
            message: this.$t('schoolRegister.signatureNameFormat1'),
            trigger: "blur"
          },
          {
            min: 2,
            message: this.$t('schoolRegister.signatureNameFormat2'),
            trigger: ["blur", "change"]
          }
        ],

        schoolemail: [
          {
            required: true,
            message: this.$t('schoolRegister.schoolemailFormat1'),
            trigger: "blur"
          },
          {
            type: "email",
            message: this.$t('schoolRegister.schoolemailFormat2'),
            trigger: ["blur", "change"]
          }
        ],
        password: [
          {
            required: true,
            message: this.$t('schoolRegister.schoolemailFormat1'),
            trigger: "blur"
          },
          {
            min: 6,
            message: this.$t('schoolRegister.schoolemailFormat2'),
            trigger: ["blur", "change"]
          }
        ],
        bAddress: [
          {
            required: true,
            message: this.$t('schoolRegister.bAddressFormat1'),
            trigger: "blur"
          },
          {
            min: 20,
            message: this.$t('schoolRegister.bAddressFormat2'),
            trigger: ["blur", "change"]
          }
        ],
        // sAddress: [
        //   {
        //     required: true,
        //     message: "Please Enter your school address",
        //     trigger: "blur"
        //   },
        //   {
        //     min: 2,
        //     message: "Length should be at least five(5)",
        //     trigger: ["blur", "change"]
        //   }
        // ],
        school_URL: [
          {
            required: true,
            message: this.$t('schoolRegister.school_URLFormat1'),
            trigger: "blur"
          },
          {
            min: 5,
            message: this.$t('schoolRegister.school_URLFormat2'),
            trigger: ["blur", "change"]
          }
        ]
      },
      show: true,
      menuList: [{ name: "Home", path: "/home" }]
    };
  },
  components: {
    Head
    // Footer
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          var data = {
            name: this.ruleForm.sname,
            email: this.ruleForm.schoolemail,
            official_website: this.ruleForm.school_URL,
            // To be system generated begins.
            // id_url:"",
            //revocation_list:"",
            //introduction_url:"",
            // To be system generated ends.
            public_key: this.ruleForm.bAddress,
            job_title: this.ruleForm.jobTitle,
            signature_name: this.ruleForm.signatureName,
            signature_file_wsid: "", // To be derived from file upload interface.
            logo_file_wsid: "", // To be derived from file upload interface.
            password: this.ruleForm.password
          };
          // Get signature wsid from file upload interface.
          getSigImageDetails(this.sigformData).then(res1 => {
            Promise.resolve(res1);
            var firstResponseValue = res1;
            console.log(
              "Response for Signature File from File Upload Interface: ",
              firstResponseValue
            );
            var sigData = firstResponseValue["data"];
            data.signature_file_wsid = sigData["wsid"];
            console.log("Sig. File wsid is: ", data.signature_file_wsid);
            // Get school logo wsid from file upload interface.
            getSchLogoDetails(this.logoformData).then(res2 => {
              Promise.resolve(res2);
              var secondResponseValue = res2;
              console.log(
                "Response for School Logo file from File Upload Interface: ",
                secondResponseValue
              );
              var logoData = secondResponseValue["data"];
              data.logo_file_wsid = logoData["wsid"];
              console.log("School logo File wsid is: ", data.logo_file_wsid);
              // Send data to School registration interface.
              register(data)
                .then(res => {
                  console.log(
                    "Registration response from school register interface",
                    res
                  );
                  this.$message({
                    message:
                      this.$t('schoolRegister.registrationSuccess'),
                    type: "success"
                  });
                  this.$router.replace("/login");
                })
                .catch(function(error) {
                  console.log(error);
                  this.$message.error({
                    title: "error",
                    message:
                      this.$t('schoolRegister.registrationFail'),
                  });
                });
            });
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    onSigImgFileSelect() {
      this.sigImg = this.$refs.sigImg.files[0];
      console.log("School signature file: ", this.sigImg);
      this.sigformData = new FormData();
      this.sigformData.append("file", this.sigImg);
    },
    onSchLogoFileSelect() {
      this.schLogo = this.$refs.schLogo.files[0];
      console.log("School logo file: ", this.schLogo);
      this.logoformData = new FormData();
      this.logoformData.append("file", this.schLogo);
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
/* #msgArea {
  width: 100%;
  margin-top: 1.5%;
  margin-bottom: 0.5rem;
} */
/* #welcomeMsg {
  color: #477ea3;
  font-size: 1.5rem;
  margin-top: -2.5%;
  padding-top: 1rem;
} */

#welcomeMsg {
  color: #477ea3;
  font-size: 1.5rem;
  padding-top: 1rem;
}

/* #instruction {
  color: #477ea3;
  font-style: italic;
  margin-top: -2.4%;
  padding-bottom: 1rem;
} */

#instruction {
  color: #477ea3;
  font-style: italic;
  padding-top: 0.5rem;
  padding-bottom: 1rem;
}

#middlePage {
  width: 50%;
  /* margin-top: 0.5%; */
  background-color: #ffffff;
}

/* #myForm{
  margin-top: -2.5%;
   align-items: center;
} */

#blockchainType {
  color: #15415e;
  font-style: italic;
  font-weight: 90;
}
#myBtnRight {
  margin-right: 50%;
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
