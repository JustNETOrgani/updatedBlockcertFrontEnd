<template>
  <div class="certificate">
    <Head :menuList="menuList">
      <el-button class="menu-item" type="primary" round @click="LoginOut"
        >Logout</el-button
      >
    </Head>
    <div class="body">
      <h1 class="title">Certificates' List</h1>
      <!--Top panel-->
      <div id="topNav">
        <!--Radio buttons-->
        <div id="topNavLeft">
          <label>Listing options:</label>
          <el-radio-group v-model="radio" @input="onSelect">
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
            placeholder="Please input certificate name or issuer"
            v-model="searchInput.stdSearchItem"
            clearable>
          </el-input>
          </div>
          <div id="searchBtnDiv">
            <el-button @click="getStudentSearch" icon="el-icon-search" circle></el-button>
          </div>
        </div>
        <div id="topNavRight">
          <el-button type="primary" @click="toCertUploadPage">Upload Cert.<i class="el-icon-upload el-icon-right"></i></el-button>
        </div>
      </div>
      <!--Certificate display area-->
      <div  id="certDisplayArea" style="overflow-y:auto">
        <!--Building table-->
        <el-table
          v-loading="loading"
          :data="tableData"
          style="width: 100%; height:92%">
          <!--Building table body-->
          <el-table-column
            prop="certTitle"
            label= "Certificate Title"
            >
          </el-table-column>
          <el-table-column
            prop="certIssuer"
            label= "Certificate Issuer"
            >
          </el-table-column>
          <el-table-column
            prop="certStatus"
            label= "Certificate Status"
           >
          </el-table-column>
          <el-table-column
          align="right">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="getCertDetails(scope.$index, scope.row)">View Details</el-button>
          </template>
        </el-table-column>
        </el-table>
        <!--Create pagination-->
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10, 20, 30, 40, 50, 100]"
          :page-size="limit"
          layout=" sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </div>
    </div>
    <Footer></Footer>
  </div>
</template>

<script>
import Head from "@/components/header";
import Footer from "@/components/Footer";
import { getCertificates } from "@/network/students";
import { viewCertDetails } from "@/network/students";

export default {
  name: "certificate",
  data() {
    return {
      menuList: [
        { name: "Home", path: "/home" },
      ],
      radio: null,
      searchInput:{stdSearchItem:''},
      tableData: [],
      certImageWSID: [], // To be used to view details about the certificate.
      certData: [], // To hold the entire certificates.
      loading: false,
      total: 0,
      currentPage: 1,
      limit: 10,
      filteredData: [],
    };
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
            message: "Signed out successfully"
          });
        }).catch(() => {       
        });
    }, 
    toCertUploadPage(){
      this.$router.push("/students/cert_upload");
    },
    getStudentSearch(){
      let itemToSearch =  this.searchInput.stdSearchItem
      if(itemToSearch==null || itemToSearch==''){
        this.$message({
            showClose: true,
            type: "warning",
            message: "Search criteria cannot be empty."
          });
      }
      else{
        console.log("Certificate search initiated using: ", itemToSearch)
        // Continue to perform certificate search.
        let filteredData = null
        filteredData = this.certData.filter(function(el) { 
            return (el.certTitle == itemToSearch || el.certIssuer == itemToSearch) });
        this.tableData = filteredData
      }
    },
    handleSizeChange(size) {
      console.log(`${size} items per page`);
      this.limit = size;
      this.currentCertData()
    },
    handleCurrentChange(current) {
      console.log(`current page: ${current}`);
      this.currentPage = current;
      this.currentCertData()
    },
    onSelect(data){
      this.radio = data
      console.log("User has selected:", this.radio);
      this.loading = true
      // Perform action based on student's selection.
      getCertificates().then(res=>{
        console.log("Certificates for this student: ", res.data)
        //this.certs = res.data
        var allCerts = res.data.results
        this.total = res.data.count;
        var totalCert = allCerts.length
        console.log("Total certs: ", totalCert)
        
        for(let i=0; i < totalCert; i++){
          let tbObj = {}
          tbObj.certTitle = allCerts[i]["certificate_title"]
          tbObj.certIssuer = allCerts[i]["school_name"] //  
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
          if(tbObj['certStatus']==4){
            tbObj['certStatus']='Revoked'
          }
          this.certData[i] = tbObj
        }

        if(this.radio=='all'){
        console.log("Retrieving all certificates.")
        // Get all certificates.
        this.filteredData = this.certData
        this.total = this.filteredData.length 
        this.tableData = this.filteredData
        this.loading = false
        return
        }
        if(this.radio=='chkPending'){
          let chkCertData = null
          console.log("Retrieving check pending certificates.")
          // Get check pending certificates.
          chkCertData = this.certData.filter(function(el) { 
            return (el.certStatus != "Failed Issue" && el.certStatus != "Revoked" && el.certStatus != "Issued" && el.certStatus != "Issuing") }); 
          this.filteredData = chkCertData
          this.total = this.filteredData.length 
          this.tableData = this.filteredData
          this.loading = false
          return
        }
        if(this.radio=='Issued'){
          console.log("Retrieving issued certificates.")
          let issuedCertData = null
          // Get Issued certificates.
          issuedCertData = this.certData.filter(function(el) { 
            return (el.certStatus != "Failed Issue" && el.certStatus != "Revoked" && el.certStatus != "Created" && el.certStatus != "Issuing") }); 
          this.filteredData = issuedCertData
          this.total = this.filteredData.length 
          this.tableData = this.filteredData
          this.loading = false
          return
        }
        else{
          console.log("Retrieving revoked certificates.")
          // Get revoked certificates.
           let rvkCertData = null
          rvkCertData = this.certData.filter(function(el) { 
            return (el.certStatus != "Issued" && el.certStatus != "Created" && el.certStatus != "Issuing" && el.certStatus != "Failed Issue") }); 
          this.filteredData = rvkCertData
          this.total = this.filteredData.length 
          this.tableData = this.filteredData
      }
      })
    },
     getCertDetails(index, row) {
        console.log("Getting details for index: ",index, row);
        console.log("Cert status is: ", row['certStatus'])
        let certIDtoGetDetails = this.certImageWSID[index]
        let certStatusToDisplay = row['certStatus']
        viewCertDetails(certIDtoGetDetails).then(res=>{
        console.log("View details of cert.: ", res)
        this.$store.commit("certViewData", res.data);
        this.$store.commit("set_certDispStatus", certStatusToDisplay);
        this.$router.push("/students/certDetails");
        this.$message('Now viewing a certificate detail.'); 
        })
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
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
}

.title {
  color: #477ea3;
  font-size: 1.5rem;
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
  width: 27%;
  float: left;
  margin-top: -0.5rem;
}
#searchInputArea{
  float: left;
  width: 77%;
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
