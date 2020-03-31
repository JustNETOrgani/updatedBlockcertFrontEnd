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
                <el-form id="myForm"
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

                    <el-form-item label="Email Address" prop="schoolemail">
                      <el-input
                        v-model="ruleForm.schoolemail"
                        placeholder="Please, enter your email here."
                      ></el-input>
                    </el-form-item>

                     <el-form-item label="Password" prop="password">
                      <el-input
                        v-model="ruleForm.password" type="password"
                        placeholder="Please, enter valid password."
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
                    <fieldset>
                      <legend>Signature Lines</legend>

                      <el-form-item label="Job Title" prop="jobTitle">
                      <el-input
                        v-model="ruleForm.jobTitle"
                        type="text"
                        placeholder="Please, enter job title"
                      ></el-input>
                    </el-form-item>

                    <el-form-item label="Signature Name" prop="signatureName">
                      <el-input
                        v-model="ruleForm.signatureName"
                        type="text"
                        placeholder="Please, enter signature name"
                      ></el-input>
                    </el-form-item>

                     <el-form-item label="Signature Image" prop="signatureImage">
                       <input 
                        type="file" 
                        v-on:change="onSigImgFileSelect()" class="uploadBtns" ref="sigImg" id="sigImg" name="sigImg" 
                        accept=".jpeg,.png,.jpg">
                  </el-form-item>
                  <el-form-item label="School Logo" prop="school_logo">
                    <input 
                        type="file" 
                        v-on:change="onSchLogoFileSelect()" class="uploadBtns" ref="schLogo" id="schLogo" name="schLogo" 
                        accept=".jpeg,.png,.jpg">
                  </el-form-item>
                </fieldset>
                  </div>
                  <el-form-item>
                    <el-button
                      class="myBtn"
                      type="success"
                      @click="submitForm('ruleForm')"
                      >Register</el-button
                    >
                    <el-button
                      class="myBtn" id="myBtnRight"
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
        schoolID:"",
        revocationList:"",
        bAddress: "",
        jobTitle:"",
        signatureName:"",
        signatureImage:"",
        school_logo: ""
      },
      sigImg:'',
      schLogo:null,
      sigformData:null,
      logoformData:null,
      rules: {
        sname: [
          {
            required: true,
            trigger: "blur"
          },
          {
            min: 2,
            message: "Please enter school name",
            trigger: ["blur", "change"]
          }
        ],

        jobTitle: [
          {
            required: true,
            trigger: "blur"
          },
          {
            min: 2,
            message: "Please enter job title",
            trigger: ["blur", "change"]
          }
        ],
        signatureName: [
          {
            required: true,
            trigger: "blur"
          },
          {
            min: 2,
            message: "Please enter signature name",
            trigger: ["blur", "change"]
          }
        ],

        schoolemail: [
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
            min: 2,
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
            min: 5,
            message: "Length should be at least five(5)",
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
            name: this.ruleForm.sname,
            email: this.ruleForm.schoolemail,
            official_website: this.ruleForm.school_URL,
            // To be system generated begins.
            // id_url:"",   
            //revocation_list:"",
            //introduction_url:"", 
            // To be system generated ends.
            public_key: this.ruleForm.bAddress,
            job_title:this.ruleForm.jobTitle,
            signature_name:this.ruleForm.signatureName,
            signature_file_wsid:"", // To be derived from file upload interface.
            logo_file_wsid:"",      // To be derived from file upload interface.
            password: this.ruleForm.password
          };
          getSigImageDetails(this.sigformData).then(res =>{
            console.log("Response for Signature File from File Upload Interface: ", res)
            var sigData = res['data']
            data.signature_file_wsid =  sigData['wsid']
            console.log("Sig. File wsid is: ", data.signature_file_wsid)
          });
          getSchLogoDetails(this.logoformData).then(res =>{
            console.log("Response for School Logo file from File Upload Interface: ", res)
            var logoData = res['data']
            data.logo_file_wsid = logoData['wsid'] 
            console.log("School logo File wsid is: ", data.logo_file_wsid)
          })
          register(data)
            .then(res => {
              console.log("Registration response from register interface",res);
              this.$message({
                message:
                  "Congratulations. Registration successful, Please Login",
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
    onSigImgFileSelect(){ 
      this.sigImg = this.$refs.sigImg.files[0];
      console.log("School signature file: ", this.sigImg)
      this.sigformData = new FormData();
      this.sigformData.append('file', this.sigImg);
    },
    onSchLogoFileSelect(){ 
      this.schLogo = this.$refs.schLogo.files[0];
      console.log("School logo file: ", this.schLogo)
      this.logoformData = new FormData();
      this.logoformData.append('file', this.schLogo);
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
  margin-top: -2%;
  margin-bottom: 0.5rem;
}
#welcomeMsg {
  color: #477ea3;
  font-size: 1.5rem;
  margin-top: -2.5%;
  padding-top: 1rem;
}

#instruction {
  color: #477ea3;
  font-style: italic;
  margin-top: -2.4%;
  padding-bottom: 1rem;
}

#middlePage {
  width: 50%;
  margin-top: -2%;
  background-color: #ffffff;
}

#myForm{
  margin-top: -2.5%;
   align-items: center;
}

#blockchainType {
  color: #15415e;
  font-style: italic;
  font-weight: 90;
}
#myBtnRight {
  margin-right: 50%; 
}

.myBtn{
  margin-top: 1rem;
}

.menu-item {
  text-decoration: none;
  color: #ffffff;
  margin: 0.6rem 0.5rem;
}
</style>
