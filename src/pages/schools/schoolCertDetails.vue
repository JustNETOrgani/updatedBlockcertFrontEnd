<template>
  <div class="certificate">
    <!-- <Head :menuList="menuList">
      <el-button class="menu-item" type="primary" round @click="logUserOut"
        >{{$t('common.logout')}}</el-button
      >
    </Head> -->
    <el-link icon="el-icon-arrow-left" style="width: 250px;margin:10px;font-size:20px" @click.native="toIssueList()">{{$t('CertDetail.back')}}</el-link>
    <!-- <el-button type="primary" icon="el-icon-arrow-left" style="width: 100px; margin:10px">返回</el-button> -->
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
        <p id="stdCertImageInfo">{{$t('CertDetail.stdCertImageInfo')}}</p>
        <img :src="uploadedCertFileURL" id="uploadedCertImage" alt="Uploaded Student Certificate"/>
      </div>
    </div>
    <!-- <Footer></Footer> -->
  </div>
</template>

<script>
// import Head from "@/components/header";
// import Footer from "@/components/Footer";
import { viewCertDetails } from "@/network/schools"; 

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
      // certViewInfo: JSON.parse(sessionStorage.getItem('Cert_Details')), 
      // certState: sessionStorage.getItem('Cert_Status')
      certViewInfo: ''
    };
  },
    created() {
        // console.log("All cert Info: ", this.certViewInfo)
        this.loadingCertData = true
        const certId = this.$route.params.certId;
        viewCertDetails(certId).then(res=>{
          console.log("View details of school cert.: ", res)
          // this.$store.commit("certViewData", res.data);
          // this.$store.commit("set_certDispStatus", certStatusToDisplay);
          // this.$router.push("/schools/certIDtoGetDetails/CertDetails");
          this.$message(this.$t('schoolCertificates.ShowingDetail')); 
          this.certViewInfo = res.data
        this.uploadedCertFileURL = this.certViewInfo.unsign_cert.badge['image']
        this.issuerName = this.certViewInfo.unsign_cert.badge.issuer['name']
        this.schLogo = this.certViewInfo.unsign_cert.badge.issuer['image']
        this.certDescription = this.certViewInfo.unsign_cert.badge['description']
        this.certCriteria = this.certViewInfo.unsign_cert.badge.criteria['narrative']
        this.stdName = this.certViewInfo.unsign_cert.recipientProfile['name']
        this.issuedDate = new Date(this.certViewInfo.unsign_cert['issuedOn']) 
        // this.certStatus = this.certState
        this.jobTible = this.certViewInfo.unsign_cert.badge.signatureLines[0]['jobTitle']  
        this.stdCertID = (this.certViewInfo['wsid']).substring(10) // cert_wsid_ --- First ten characters.
        this.schPubKey = (this.certViewInfo.unsign_cert.verification['publicKey']).substring(21) // Remove first 21 characters.
        this.loadingCertData = false
    }).catch(error => {
      console.log(error);
      this.$message.error(this.$t('CertDetail.certDetailFail'));
      this.loadingCertData = false
    })
    },
    
  components: {
    // Head,
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
    toIssueList(){
      this.$router.push("/schools/issueList");
    }
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
  max-width: 100%;
  max-height: 555px;
}

#statusOfCert{
  color: #477ea3;
}

.smallFontSz{
     font-size: 0.7rem;
}

</style>
