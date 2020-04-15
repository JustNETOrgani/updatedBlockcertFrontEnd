<template>
  <div class="pageContainer">
    <Head :menuList="menuList">
      <el-button class="menu-item" type="primary" @click="logout" round>Logout</el-button>
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
                       <input 
                        type="file" 
                        v-on:change="certFileSelect()" class="uploadBtns" ref="certFile" id="certFile" name="certFile" 
                        accept=".jpeg,.png,.jpg,.pdf">
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
import { getCertFileDetails } from "@/network/students"; 
import { studentCertCreateRequest } from "@/network/students";

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
      certFileformData:null,
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
              certificate_title: this.ruleForm.certTitle,
              certificate_description: this.ruleForm.certDescription,
              criteria_narrative: this.ruleForm.criteria_Narrative,
              issuer_name: this.ruleForm.issuer,
              // To be gotten from file upload interface. 
              cert_image_wsid: '',
              // Global required fields.
              hash_emails: false,
              display_html: {
                  "@id": "schema:description"
              },
              additional_global_fields: [
                  {
                      "path": "$.displayHtml",
                      "value": "<h1>Some html code</h1>"
                  },
                  {
                      "path": "$.@context",
                      "value": [
                          "https://w3id.org/openbadges/v2",
                          "https://w3id.org/blockcerts/v2",
                          {
                              "displayHtml": {
                                  "@id": "schema:description"
                              }
                          }
                      ]
                  }
              ],
              additional_per_recipient_fields: false,
              filename_format: "uuid"
          };
          getCertFileDetails(this.certFileformData).then(res1 =>{
            Promise.resolve(res1)
            var certFileResponse = res1
            console.log("Response for Student certificate File from File Upload Interface: ", certFileResponse)
            var certFileData = certFileResponse['data']
            data.cert_image_wsid =  certFileData['wsid']
            console.log("Cert. File wsid is: ", data.cert_image_wsid)
          studentCertCreateRequest(data).then(res => {
              console.log("Response from student certificate upload interface",res);
              this.$message({
                message:"Congratulations. Certificate uploaded and creation successful.",
                type: "success"
              });
            }).catch(function(error) {
              console.log(error);
              this.$message.error({
                title: "error",
                message:"Upload and certificate creation failed, please try again later, or contact the administrator! !!"
              });
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
    certFileSelect(){ 
      this.certFile = this.$refs.certFile.files[0];
      console.log("Student certificate file: ", this.certFile)
      this.certFileformData = new FormData();
      this.certFileformData.append('file', this.certFile);
    },
    logout() {
      this.$confirm("Are you sure you want to quit?", "Log Out", {
          confirmButtonText: 'confirm',
          cancelButtonText: 'cancel',
          type: 'info'
        }).then(() => {
          sessionStorage.removeItem("STUDENT-INFO");
          sessionStorage.removeItem("API-HTTP-AUTHORIZATION");
          this.$router.push("/login");
          this.$message({
            type: "info",
            message: "You have Signed out successfully."
          });
        }).catch(() => {       
        });
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
       