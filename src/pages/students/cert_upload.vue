<template>
  <div class="pageContainer">
    <Head :menuList="menuList">
      <el-button class="menu-item" type="primary" @click="LoginURL" round>Logout</el-button>
    </Head>
    <div class="body">
      <div id="middlePage">
        <div id="msgArea">
          <p id="welcomeMsg">Welcome to Certificate upload </p>
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
                  label-width="180px"
                  class="demo-ruleForm"
                >

                <el-form-item label="Certificate Title" prop="certTitle">
                      <el-input
                        v-model="ruleForm.certTitle"
                        placeholder="Please, enter your certificate title ."
                      ></el-input>
                    </el-form-item>

                    <el-form-item label="Certificate Description" prop="certDescription" >
                      <el-input
                        v-model="ruleForm.certDescription"
                        placeholder="Please, enter your certificate description." 
                      ></el-input>
                    </el-form-item>

                     <el-form-item label="Criteria Narrative" prop="criteria_Narrative">
                      <el-input
                        v-model="ruleForm.criteria_Narrative" type="text"
                        placeholder="Please, enter criteria narrative here."
                      ></el-input>
                    </el-form-item>


                    <el-form-item label="Issuer Name" prop="issuer">
                      <el-input
                        v-model="ruleForm.issuer"
                        type="website"
                        placeholder="Please, enter your school name here ."
                      ></el-input>
                    </el-form-item>

                    
                     <el-form-item label="Certificate File" prop="certFile">
                    <el-upload class="upload-demo" ref="upload" action :auto-upload="false">
                      <el-button slot="trigger" size="small" type="primary">select file</el-button>
                    </el-upload>
                  </el-form-item>
                  
                </el-form>
              </div>
            </el-col>
           
           </el-row>
           <div id="btnrow">
           <el-row>
              <el-col :span="18" :offset="1" >
      
                    <el-button
                      class="myBtn"
                      type="success"
                      @click="submitForm('ruleForm')"
                      >Submit</el-button
                    >
                    <el-button
                      class="myBtn"
                      type="danger"
                      @click="resetForm('ruleForm')"
                      >Cancel</el-button
                    >

                   </el-col>
            </el-row>
           </div>
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
        certTitle: "",
        certDescription: "",
        criteria_Narrative: "",
        issuer:"",
        certFile:"",
       
      },
      rules: {
        certTitle: [
          {
            required: true,
            trigger: "blur"
          },
          {
            min: 2,
            message: "Please enter certificate title",
            trigger: ["blur", "change"]
          }
        ],

        criteria_Narrative: [
          {
            required: true,
            message: "Please enter criteria narrative here.",
            trigger: "blur"
          },
          {
            min: 2,
            message: "Please input criteria narrative here",
            trigger: ["blur", "change"]
          }
        ],

         certDescription: [
          {
            required: true,
            message: "Please enter certficate description",
            trigger: "blur"
          },
          {
            min: 2,
            message: "Please enter certficate description",
            trigger: ["blur", "change"]
          }
        ],


        issuer: [
          {
            required: true,
            message: "Please enter name of school.",
            trigger: "blur"
          },
          {
            min: 6,
            message: "Length should be at least six.",
            trigger: ["blur", "change"]
          }
        ],
        certFile: [
          {
            required: true,
            message: "Please upload your cerficate here.",
            trigger: "blur"
          },
          {
            
            message: "File must be a PDF, PNG, JPG or JPEG",
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
  margin-top: -5%;
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
  margin-top: -3%;
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
  margin-top: 0.5rem;
  margin-right: -10%;
  margin-left: 18%;
  
  
}

.menu-item {
  text-decoration: none;
  color: #ffffff;
  margin: 0.6rem 0.5rem;
}

#btnrow {
  margin-bottom: 3%;
  
  
}

.el-upload__tip {
  font-family: "Times New Roman", Times, serif;
  font-size: 100%;
}
</style>
       