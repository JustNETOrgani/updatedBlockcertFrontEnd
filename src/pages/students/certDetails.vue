<template>
  <div class="certificate">
    <Head :menuList="menuList">
      <el-button class="menu-item" type="primary" round @click="LoginOut"
        >Logout</el-button
      >
    </Head>
    <div class="body">
      <h1 class="title">Certificate Details</h1>
      <!--Certificate display area-->
      <div  id="certDisplayArea" style="overflow-y:auto">
        <el-row>
            <el-col :span="18" :offset="2">
                <h2>{{issuerName}}</h2>
                <h3>Blockchain-based certificate</h3>
                <img :src="schLogo" id="logoForSchool" alt="School Logo"/>
                <br>
                <br>
                <i><b>{{certDescription}}</b></i>
                <u><p>Awarded to</p></u>
                <i>{{stdName}}</i>
                <br>
                <br>
                <p><b>Issued on:</b> {{issuedDate}}</p>
                <br>
                <p><b>Signed by: {{jobTible}}</b></p>
            </el-col>
        </el-row>
      </div>
    </div>
    <Footer></Footer>
  </div>
</template>

<script>
import Head from "@/components/header";
import Footer from "@/components/Footer";

export default {
  name: "certificate",
  data() {
    return {
      menuList: [
        { name: "Home", path: "/home" },
      ],
      // Data to appear on certificate.
      issuerName: '',
      schLogo: null,
      certDescription:'',
      stdName:'',
      issuedDate: '',
      jobTible: '',
      certViewInfo: JSON.parse(sessionStorage.getItem('Cert_Details'))
    };
  },
    created() {
            //console.log("All cert Info: ", this.certViewInfo)
            this.issuerName = this.certViewInfo.unsign_cert.badge.issuer['name']
            this.schLogo = this.certViewInfo.unsign_cert.badge.issuer['image']
            this.certDescription = this.certViewInfo.unsign_cert.badge.criteria['narrative']
            this.stdName = this.certViewInfo.unsign_cert.recipientProfile['name']
            this.issuedDate = new Date(this.certViewInfo.unsign_cert['issuedOn'])
            this.jobTible = this.certViewInfo.unsign_cert.badge.signatureLines[0]['jobTitle']
    },
    
  components: {
    Head,
    Footer
  },
  methods: {
    LoginOut() {
      this.$confirm("Are you sure you want to quit?", "Log Out", {
          confirmButtonText: 'confirm',
          cancelButtonText: 'cancel',
          type: 'info'
        }).then(() => {
          sessionStorage.removeItem("STUDENT-INFO");
          sessionStorage.removeItem("API-HTTP-AUTHORIZATION");
          this.$router.push("/home");
          this.$message({
            type: "info",
            message: "Sign out successfully"
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
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
}

.title {
  color: #477ea3;
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}
.menu-item {
  text-decoration: none;
  color: #ffffff;
  margin: 0.6rem 0.5rem;
}

#certDisplayArea{
width: 54%;
background-color: #ffffff;
align-items: left;
}

#logoForSchool{
  width: 144px;
  height: 148px;
}

</style>
