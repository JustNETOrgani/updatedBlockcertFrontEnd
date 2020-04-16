<template>
  <div class="issue">
    <Head :menuList="menuList">
      <el-button class="menu-item" type="primary" round @click="LoginOut"
        >Logout</el-button
      >
    </Head>
    <div class="body">
      <h1 class="title">School Certificates' List</h1>

      <!--Top panel-->
      <div id="topNav">
        <!--Radio buttons-->
        <div id="topNavLeft">
          <label>Listing options:</label>
          <el-radio-group v-model="radio" @input="onSelectRadio">
            <el-radio label="all">All</el-radio>
            <el-radio label="chkPending">Check Pending</el-radio>
            <el-radio label="Issued">Issued</el-radio>
            <el-radio label="revoked">Revoked</el-radio>
          </el-radio-group>
        </div>
        <div id="topNavMid">
          <!--Search box-->
          <div id="searchInputArea">
          <el-input
            placeholder="Please input certificate title, student name or email."
            v-model="searchInput.schSearchItem"
            clearable>
          </el-input>
          </div>
          <div id="searchBtnDiv">
            <el-button @click="getSchoolSearch" icon="el-icon-search" circle></el-button>
          </div>
        </div>
        <div id="topNavRight">
          <el-button type="primary" @click="toCertCreatePage">Create new Cert.<i class="el-icon-upload el-icon-right"></i></el-button>
        </div>
      </div>
      <!--Certificate display area-->
      <div  id="certDisplayArea" style="overflow-y:auto">
        <!--Building table-->
        <el-table
          :data="schTableData"
          style="width: 100%">
          <!--Building table body-->
          <el-table-column
            prop="certTitle"
            label= "Certificate Title"
            >
          </el-table-column>
          <el-table-column
            prop="critNarrative"
            label= "Criteria Narrative"
            >
          </el-table-column>
          <el-table-column
            prop="stdName"
            label= "Student Name"
            >
          </el-table-column>
          <el-table-column
            prop="stdEmail"
            label= "E-mail"
           >
          </el-table-column>
          <el-table-column
            prop="certStatus"
            label= "Certificate Status"
           >
          </el-table-column>
          <el-table-column
          align="right"
          label="Certificate tasks">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="getSchCertDetails(scope.$index, scope.row)">View Details</el-button>
              <el-button
              size="mini"
              @click="certIssue(scope.$index, scope.row)">Issue Cert.</el-button>
          </template>
        </el-table-column>
        </el-table>

      </div>


    </div>
    <Footer></Footer>
  </div>
</template>

<script>
import Head from "@/components/header";
import Footer from "@/components/Footer";
import { getSchCertificates } from "@/network/schools";
import { viewCertDetails } from "@/network/schools";

export default {
  name: "issue",
  data() {
    return {
      menuList: [
        { name: "Home", path: "/home" },
        //{ name: "issue", path: "/schools/issueList" }
      ],
      radio: null,
      searchInput:{schSearchItem:''},
      schTableData: [],
      certImageWSID: [], // To be used to view details about the certificate.
      certData: [], // To hold the entire certificates.
    };
  },
  components: {
    Head,
    Footer
  },
  methods: {
    LoginOut() {
      this.$confirm("Are you sure you want to quit?", "Login Out", {
          confirmButtonText: 'confirm',
          cancelButtonText: 'cancel',
          type: 'info'
        }).then(() => {
          sessionStorage.removeItem("SCHOOL-INFO");
          sessionStorage.removeItem("API-HTTP-AUTHORIZATION");
          this.$router.push("/home");
          this.$message({
            type: "info",
            message: "Sign out successfully"
          });
        }).catch(() => {       
        });
    },
    onSelectRadio(data){
      this.radio = data
      console.log("User has selected:", this.radio);
      // Perform action based on student's selection.
      getSchCertificates().then(res=>{
        console.log("Certificates for this School: ", res.data)
        //this.certs = res.data
        var allCerts = res.data
        var totalCert = allCerts.length
        console.log("Total certs: ", totalCert)
        
        for(let i=0; i < totalCert; i++){
          let tbObj = {}
          tbObj.certTitle = allCerts[i]["certificate_title"]
          tbObj.critNarrative = allCerts[i]["criteria_narrative"]    
          tbObj.stdName = allCerts[i]["student_name"]
          tbObj.stdEmail = allCerts[i]["email"]
          tbObj.certStatus = allCerts[i]["status"]
          this.certImageWSID.push(allCerts[i]["cert_id"])
          // Use 0 for Created, 1 for Issued,  2 for Issuing(Pending) and 3 for Failed Issue
          if(tbObj['certStatus']==0){
            tbObj['certStatus']='Created'
          }
          if(tbObj['certStatus']==1){
            tbObj['certStatus']='Issued'
          }
          if(tbObj['certStatus']==2){
            tbObj['certStatus']='Issuing'
          }
          if(tbObj['certStatus']==3){
            tbObj['certStatus']='Failed Issue'
          }
          this.certData[i] = tbObj
        }

        if(this.radio=='all'){
        console.log("Retrieving all certificates.")
        // Get all certificates.
        this.schTableData = this.certData
        return
        }
        if(this.radio=='chkPending'){
          let chkCertData = null
          console.log("Retrieving check pending certificates.")
          // Get check pending certificates.
          chkCertData = this.certData.filter(function(el) { 
            return (el.certStatus != "Failed Issue" && el.certStatus != "Issued" && el.certStatus != "Issuing") }); 
          this.schTableData = chkCertData
          return
        }
        if(this.radio=='Issued'){
          console.log("Retrieving issued certificates.")
          let issuedCertData = null
          // Get Issued certificates.
          issuedCertData = this.certData.filter(function(el) { 
            return (el.certStatus != "Failed Issue" && el.certStatus != "Created" && el.certStatus != "Issuing") }); 
          this.schTableData = issuedCertData
          return
        }
        else{
          console.log("Retrieving revoked certificates.")
          // Get revoked certificates.
           let rvkCertData = null
          rvkCertData = this.certData.filter(function(el) { 
            return (el.certStatus != "Issued" && el.certStatus != "Created" && el.certStatus != "Issuing") }); 
          this.schTableData = rvkCertData
      }
      })
    },
    getSchoolSearch(){
      let itemToSearch =  this.searchInput.schSearchItem
      if(itemToSearch==null || itemToSearch==''){
        this.$message({
            showClose: true,
            type: "warning",
            message: "Search criteria cannot be empty."
          });
      }
      else{
        console.log("School Certificate search initiated using: ", itemToSearch)
        // Continue to perform certificate search.
        let filteredData = null
        filteredData = this.certData.filter(function(el) { 
            return (el.certTitle == itemToSearch || el.stdName == itemToSearch || el.stdEmail == itemToSearch) });
        this.schTableData = filteredData
      }
    },
    getSchCertDetails(index, row) {
        console.log("Getting details for index: ",index, row);
        console.log("Cert status is: ", row['certStatus'])
        let certIDtoGetDetails = this.certImageWSID[index]
        let certStatusToDisplay = row['certStatus']
        viewCertDetails(certIDtoGetDetails).then(res=>{
        console.log("View details of school cert.: ", res)
        this.$store.commit("certViewData", res.data);
        this.$store.commit("set_certDispStatus", certStatusToDisplay);
        this.$router.push("/schools/schoolCertDetails");
        this.$message('Showing details of a certificate.'); 
        })
    },
    toCertCreatePage(){
      this.$router.push("/schools/certCreate"); // TODO 
    },
    certIssue(){
      console.log("Cert issuance initiated.")
      // TODO.
    }
  }
};
</script>

<style scoped>
.issue {
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

.title {
  color: #477ea3;
  font-size: 1.5rem;
  margin-top: -0.5rem;
}
.menu-item {
  text-decoration: none;
  color: #ffffff;
  margin: 0.6rem 0.5rem;
}
#topNav{
  width: 100%;
  height: 15%;
  margin: 0.5rem auto;
}
#topNavLeft{
  width: 50%;
  float: left;
  margin-right: 1rem;
}
#topNavMid{
  width: 34%;
  float: left;
  margin-top: -0.5rem;
}
#searchInputArea{
  float: left;
  width: 78%;
}
#searchBtnDiv{
  float: left;
  margin-left: 0.5rem;
}
#topNavRight{
  width: 5%;
  float: left;
  margin-top: -0.5rem;
}
label{
  padding-right: 0.5rem;
}
#certDisplayArea{
  width: 97%;
  height: 85%;
  background-color: #ffffff;
  margin-top: -1.8rem;
  align-items: left;
}
#certTitleDiv{
  width: 50%;
  float: left;
  align-items: left;
  margin: 0% -10rem;
}
#schNameDiv{
  width: 30%;
  float: left;
  align-items: left;
}
#certStatusDiv{
  width: 18%;
  float: left;
  align-items: left;
}

</style>
