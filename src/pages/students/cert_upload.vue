<template>
  <div class="pageContainer">
    <Head :menuList="menuList">
      <el-button class="menu-item" type="primary" @click="logout" round>{{$t('common.logout')}}</el-button>
    </Head>
    <div class="body">
      <div id="middlePage">
        <div id="msgArea">
          <p id="welcomeMsg">{{$t('CertUpload.welcomeMsg')}}</p>
        </div>
        <div id="formArea">
          <p id="instruction">{{$t('CertUpload.instruction')}}</p>
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

                <el-form-item :label="$t('CertUpload.certTitleLabel')" prop="certTitle">
                      <el-input
                        v-model="ruleForm.certTitle"
                        :placeholder="$t('CertUpload.certTitlePlaceholder')"
                      ></el-input>
                    </el-form-item>

                    <el-form-item :label="$t('CertUpload.certDescriptionLabel')" prop="certDescription" >
                      <el-input
                        v-model="ruleForm.certDescription"
                        :placeholder="$t('CertUpload.certDescriptionPlaceholder')"
                      ></el-input>
                    </el-form-item>

                     <el-form-item :label="$t('CertUpload.criteria_NarrativeLabel')" prop="criteria_Narrative">
                      <el-input
                        v-model="ruleForm.criteria_Narrative" type="text"
                        :placeholder="$t('CertUpload.criteria_NarrativePlaceholder')"
                      ></el-input>
                    </el-form-item>


                    <el-form-item :label="$t('CertUpload.issuerLabel')" prop="issuer">
                      <el-input
                        v-model="ruleForm.issuer"
                        type="website"
                        :placeholder="$t('CertUpload.issuerPlaceholder')"
                      ></el-input>
                    </el-form-item>

                    
                     <el-form-item :label="$t('CertUpload.certFileLabel')" prop="certFile">
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
                      type="primary"
                      @click="submitForm('ruleForm')"
                      >{{$t('common.submit')}}</el-button
                    >
                    <el-button
                      class="myBtn"
                      type="danger"
                      @click="resetForm('ruleForm')"
                      >{{$t('common.cancel')}}</el-button
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
            message: this.$t('CertUpload.certTitleFormat1'),
            trigger: "blur"
          },
          {
            min: 2,
            message: this.$t('CertUpload.certTitleFormat2'),
            trigger: ["blur", "change"]
          }
        ],

        criteria_Narrative: [
          {
            required: true,
            message: this.$t('CertUpload.criteria_NarrativeFormat1'),
            trigger: "blur"
          },
          {
            min: 2,
            message: this.$t('CertUpload.criteria_NarrativeFormat2'),
            trigger: ["blur", "change"]
          }
        ],

         certDescription: [
          {
            required: true,
            message: this.$t('CertUpload.certDescriptionFormat1'),
            trigger: "blur"
          },
          {
            min: 2,
            message: this.$t('CertUpload.certDescriptionFormat2'),
            trigger: ["blur", "change"]
          }
        ],


        issuer: [
          {
            required: true,
            message: this.$t('CertUpload.issuerFormat1'),
            trigger: "blur"
          },
          // {
          //   min: 6,
          //   message: this.$t('CertUpload.issuerFormat2'),
          //   trigger: ["blur", "change"]
          // }
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
      menuList: [{ name: this.$t('common.home'), path: "/home" }]
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
                message:this.$t('CertUpload.createCertSuccess'),
                type: "success"
              });
              this.$router.back(); // Redirect user back to previous page (certificate list page.)
            }).catch(function(error) {
              console.log(error);
              this.$message.error({
                title: "error",
                message:this.$t('CertUpload.createCertFail')
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
      this.$confirm(this.$t('common.logOutDialogMessage'), this.$t('common.logout'), {
          confirmButtonText: this.$t('common.confirm'),
          cancelButtonText: this.$t('common.cancel'),
          type: 'info'
        }).then(() => {
          sessionStorage.removeItem("STUDENT-INFO");
          sessionStorage.removeItem("API-HTTP-AUTHORIZATION");
          this.$router.push("/login");
          this.$message({
            type: "info",
            message: this.$t('common.logOutSuccess')
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
       