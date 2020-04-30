<template>
  <div class="certificate">
    <Head :menuList="menuList">
      <el-button class="menu-item" type="primary" round @click="logUserOut"
        >{{$t('common.logout')}}</el-button
      >
    </Head>
    <div class="body" v-loading="loadingCertData">
      <div id="titleArea">
        <h1 class="title">{{$t('CertDetail.title')}}</h1>
      </div>
      <!--Certificate display area-->
      <div  id="certDisplayArea" style="overflow-y:auto">
        <el-row>
            <el-col :span="18" :offset="2">
                <h2>{{issuerName}}</h2>
                <h3>{{$t('CertDetail.h3')}}</h3>
                <img :src="schLogo" id="logoForSchool" alt="School Logo"/>
                <br>
                <p><b>{{certDescription}}</b></p>
                <i><b>{{certCriteria}}</b></i>
                <u><p>{{$t('CertDetail.awardedto')}}</p></u>
                <i>{{stdName}}</i>
                <br>
                <p><b>{{$t('CertDetail.Issuedon')}}:</b> {{issuedDate}}</p>
                <p id="statusOfCert"><b>{{$t('CertDetail.StatusofCertificate')}}: {{certStatus}}</b></p>
                <p><b>{{$t('CertDetail.Signedby')}}: {{jobTible}}</b></p>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="8" :offset="1">
                <p><b>{{$t('CertDetail.CertificateID')}}: </b></p> 
                <p  class="smallFontSz">{{stdCertID}}</p>
            </el-col>
            <el-col :span="8" :offset="5">
                <p><b>{{$t('CertDetail.SchoolPublicKey')}}:</b></p> 
                <p class="smallFontSz">{{schPubKey}}</p>
            </el-col>
        </el-row>
      </div>
      <div id="divForCertFileUploaded">
        <p id="stdCertImageInfo">Certificate file uploaded by student</p>
        <img :src="uploadedCertFileURL" id="uploadedCertImage" alt="Uploaded Student Certificate"/>
      </div>
    </div>
    <!-- <Footer></Footer> -->
  </div>
</template>

<script>
import Head from "@/components/header";
// import Footer from "@/components/Footer";

export default {
  name: "certificate",
  data() {
    return {
      menuList: [
        { name: this.$t('common.home'), path: "/home" },
      ],
      loadingCertData: false,
      // Data to appear on certificate.
      issuerName: '',
      schLogo: null,
      uploadedCertFileURL: '',
      certDescription:'',
      certCriteria:'',
      stdName:'',
      issuedDate: '',
      certStatus:'',
      jobTible: '',
      stdCertID: '',
      schPubKey: '',
      certViewInfo: JSON.parse(sessionStorage.getItem('Cert_Details')), 
      certState: sessionStorage.getItem('Cert_Status')
    };
  },
    created() {
            console.log("All cert Info: ", this.certViewInfo)
            this.loadingCertData = true
            this.uploadedCertFileURL = this.certViewInfo.unsign_cert.badge['image']
            this.issuerName = this.certViewInfo.unsign_cert.badge.issuer['name']
            this.schLogo = this.certViewInfo.unsign_cert.badge.issuer['image']
            this.certDescription = this.certViewInfo.unsign_cert.badge['description']
            this.certCriteria = this.certViewInfo.unsign_cert.badge.criteria['narrative']
            this.stdName = this.certViewInfo.unsign_cert.recipientProfile['name']
            this.issuedDate = new Date(this.certViewInfo.unsign_cert['issuedOn']) 
            this.certStatus = this.certState
            this.jobTible = this.certViewInfo.unsign_cert.badge.signatureLines[0]['jobTitle']  
            this.stdCertID = (this.certViewInfo['wsid']).substring(10) // cert_wsid_ --- First ten characters.
            this.schPubKey = (this.certViewInfo.unsign_cert.verification['publicKey']).substring(21) // Remove first 21 characters.
            this.loadingCertData = false
    },
    
  components: {
    Head,
    // Footer
  },
  methods: {
    logUserOut() {
      this.$confirm(this.$t('common.logOutDialogMessage'), this.$t('common.logout'), {
          confirmButtonText: this.$t('common.confirm'),
          cancelButtonText: this.$t('common.cancel'),
          type: 'info'
        }).then(() => {
          // sessionStorage.removeItem("STUDENT-INFO");
          sessionStorage.removeItem("API-HTTP-AUTHORIZATION");
          sessionStorage.removeItem("Cert_Details");
          sessionStorage.removeItem("Cert_Status");
          sessionStorage.removeItem('USER-TYPE');
          sessionStorage.clear()
          this.$router.push("/home");
          this.$message({
            type: "info",
            message: this.$t('common.logOutSuccess')
          });
        }).catch(() => {       
        });
    }, 
  }
};
</script>

<style scoped>
.certificate {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.body {
  flex: 1;
  /*display: flex;*/
  /*flex-direction: column;*/
  /*align-items: center;*/
  padding: 2rem;
}

#titleArea{
  width: 100%;
}

.title {
  color: #477ea3;
  font-size: 1.3rem;
  text-align: center;
  margin-bottom: 0.3rem;
  margin-top: -1rem;
}
.menu-item {
  text-decoration: none;
  color: #ffffff;
  margin: 0.6rem 0.5rem;
}

#certDisplayArea{
float: left;  
width: 54%;
margin-top: 0.3rem;
background-color: #ffffff;
align-items: left;
}

#stdCertImageInfo{
  color: #477ea3;
  font-size: 1.3rem;
  text-align: center;
  margin-bottom: 0.7rem;
  margin-top: 1.3rem;
}

#divForCertFileUploaded{
  float: right;
  width: 45%;
  margin-top: 0.3rem;
  background-color: #ffffff;
}

#logoForSchool{
  width: 144px;
  height: 148px;
}

#uploadedCertImage{
  width: 98%;
  height: 98%;
}

#statusOfCert{
  color: #477ea3;
}

.smallFontSz{
     font-size: 0.7rem;
}

</style>
