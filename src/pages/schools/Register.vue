<template>
  <div class="pageContainer">
    <Head :menuList="menuList">
      <el-button class="menu-item" type="primary" @click="LoginURL" round>Login</el-button>
    </Head>
    <div class="body">
      <div id="middlePage">
        <div id="msgArea">
          <p id="welcomeMsg">Welcome to School Registration</p>
        </div>
        <div id="formArea">
          <p id="instruction">Please, fill the form below.</p>
          <!--Form to be filled-->
          <el-row>
            <el-col :span="18" :offset="1">
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
                    <el-upload class="upload-demo" ref="upload" action :auto-upload="false">
                      <el-button slot="trigger" size="small" type="primary">select file</el-button>
                    </el-upload>
                  </el-form-item>
                  <hr>

                  <el-form-item label="School Logo" prop="school_logo">
                    <el-upload class="upload-demo" ref="upload" action :auto-upload="false">
                      <el-button slot="trigger" size="small" type="primary">select file</el-button>
                    </el-upload>
                  </el-form-item>

                </fieldset>
                  
                </el-form>
              </div>
            </el-col>
           
           </el-row>
           <el-row>
              <el-col :span="18" :offset="1" >
      
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
        ], 
        signatureName: [
          {
            required: true,
            message: "Please Enter your signature name",
            trigger: "blur"
          },
          {
            min: 2,
            message: "Length should be at least two(2)",
            trigger: ["blur", "change"]
          }
        ], 
        
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
          
        // school_name: this.ruleForm.sname,
        //     address: this.ruleForm.sAddress,
        //     email_address: this.ruleForm.email,
        //     public_key: this.ruleForm.bAddress,
        //     password: this.ruleForm.password,
        //     official_website: this.ruleForm.school_URL,
        //     signature: this.ruleForm.signature,
        //     school_logo: this.ruleForm.school_logo
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
    submitUpload() {
      this.$refs.upload.submit();
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
  width: 98%;
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
  margin: 0% auto;
}
.myBtn {
  margin-top: 1rem;
  margin-right: 2rem;
  
}

.menu-item {
  text-decoration: none;
  color: #ffffff;
  margin: 0.6rem 0.5rem;
}

.el-upload__tip {
  font-family: "Times New Roman", Times, serif;
  font-size: 100%;
}
</style>
