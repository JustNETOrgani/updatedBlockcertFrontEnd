<template>
  <div class="issue">
    <Head :menuList="menuList">
      <el-button class="menu-item" type="primary" round @click="LoginOut"
        >{{$t('common.logout')}}</el-button
      >
    </Head>
    <div class="body">
      <h1 class="title">{{$t('schoolCertificates.title')}}</h1>

      <!--Top panel-->
      <div id="topNav">
        <!--Radio buttons-->
        <div id="topNavLeft">
          <label>{{$t('schoolCertificates.listOption')}}:</label>
          <el-radio-group v-model="radio" @input="onSelectRadio">
            <el-radio label="all">{{$t('common.all')}}</el-radio>
            <el-radio label="chkPending">{{$t('common.chkPending')}}</el-radio>
            <el-radio label="Issued">{{$t('common.Issued')}}</el-radio>
            <el-radio label="revoked">{{$t('common.revoked')}}</el-radio>
            <el-radio label="Refused">{{$t('common.Refused')}}</el-radio>
          </el-radio-group>
        </div>
        <div id="topNavMid">
          <!--Search box-->
          <div id="searchInputArea">
          <el-input
            :placeholder="$t('schoolCertificates.stdSearchItemPlaceholder')"
            v-model="searchInput.schSearchItem"
            clearable>
          </el-input>
          </div>
          <div id="searchBtnDiv">
            <el-button @click="getSchoolSearch" icon="el-icon-search" circle></el-button>
          </div>
        </div>
        <div id="topNavRight">
          <el-button type="primary" disabled @click="toCertCreatePage">{{$t('schoolCertificates.createNewCert')}}<i class="el-icon-upload el-icon-right"></i></el-button>
        </div>
      </div>
      <!--Certificate display area-->
      <div  id="certDisplayArea" style="overflow-y:auto">
        <!--Building table-->
                  <!-- element-loading-text="Loading Certificates..." -->
        <el-table
          v-loading="loading"
          :data="schTableData"
          style="width: 100%"
          max-height="450">
          <!--Building table body--> 
          <el-table-column
            prop="certWSID"
            :label="$t('common.certWSID')"
            width="310"
            >
          </el-table-column>
          <el-table-column
            prop="certTitle"
            :label="$t('common.certTitle')"
            width="115"
            >
          </el-table-column>
          <el-table-column
            prop="critNarrative"
            :label="$t('common.critNarrative')"
            width="145"
            >
          </el-table-column>
          <el-table-column
            prop="stdName"
            :label="$t('common.stdName')"
            width="170"
            >
          </el-table-column>
          <el-table-column
            prop="stdEmail"
            :label="$t('common.stdEmail')"
            width="170"
           >
          </el-table-column>
          <el-table-column
            prop="certStatus"
            :label="$t('common.certStatus')"
            width="75"
           >
          </el-table-column>
          <el-table-column
          width="350"
          align="right"
          :label="$t('common.operation')">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="info"
              @click="getSchCertDetails(scope.$index, scope.row)">{{$t('common.certDetail')}}</el-button>
              <el-button
              size="mini"
              type="primary"
              @click="certRefuse(scope.$index, scope.row)">{{$t('common.Refuse')}}</el-button>
              <el-button
              size="mini"
              type="danger"
              @click="revokeCert(scope.$index, scope.row)">{{$t('common.Revoke')}}</el-button>
          </template>
        </el-table-column>
        </el-table>
        <!--Create pagination-->
      </div>
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

    <!--Dialog for certificate revocation-->
    <el-dialog title="Refusal reason" :visible.sync="refuseDialogBoxVisibility" width="40%">
      <el-form 
      :model="refuseForm"
      class="demo-ruleForm" 
      :rules="rules" 
      ref="refuseForm">
        <el-form-item label="Reason for refusal" label-width="170px" prop="refuseReason">
          <el-input v-model="refuseForm.refuseReason" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="refuseDialogBoxVisibility = false">Cancel</el-button>
        <el-button :loading="refuseCertBtnLoadState" type="primary" @click="refuseCert('refuseForm')">Confirm</el-button>
      </span>
    </el-dialog>

    <!--Dialog for certificate revocation-->
    <el-dialog title="Revocation reason" :visible.sync="revokeDialogBoxVisibility" width="40%">
      <el-form 
      :model="revokeForm"
      class="demo-ruleForm" 
      :rules="rules" 
      ref="revokeForm">
        <el-form-item label="Reason for revocation" label-width="170px" prop="revokeReason">
          <el-input v-model="revokeForm.revokeReason" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="revokeDialogBoxVisibility = false">Cancel</el-button>
        <el-button :loading="revokeCertBtnLoadState" type="primary" @click="certRevoke('revokeForm')">Confirm</el-button>
      </span>
    </el-dialog>

    </div>
    <!-- <Footer></Footer> -->
  </div>
</template>

<script>
import Head from "@/components/header";
// import Footer from "@/components/Footer";
import { getSchCertificates } from "@/network/schools";
import { viewCertDetails } from "@/network/schools"; 
import { certRefusalInterface } from "@/network/schools"; 
import { revokeCertificate } from "@/network/schools";

export default {
  name: "issue",
  data() {
    return {
      menuList: [
        { name: this.$t('common.home'), path: "/home" },
        { name: this.$t('common.issueList'), path: "/schools/issueList" }
      ],
      radio: 'all',
      searchInput:{schSearchItem:''},
      schTableData: [],
      formLabelWidth: '160px',
      loading: false,
      revokeDialogBoxVisibility: false,
      refuseDialogBoxVisibility: false,
      revokeCertBtnLoadState: false,
      refuseCertBtnLoadState: false,
      total: 0,
      currentPage: 1,
      limit: 10,
      certImageWSID: [], // To be used to view details about the certificate.
      filteredData: [],
      certDataResponse: [],
      schInfo: sessionStorage.getItem('USER-TYPE'==="school"),
      refuseForm: {
        refuseReason: "",
      },
      revokeForm:{
        revokeReason:"",
      },
      requiredCertIDToRefuse: '',
      requiredDataForCertRevoke: [],
       rules: {
        revokeReason: [
          {
            required: true,
            message: 'Please, enter revocation reason',
            trigger: "blur"
          },
          {
            min: 1,
            message: 'Field cannot be empty!',
            trigger: ["blur", "change"]
          }
        ],
        refuseReason: [
          {
            required: true,
            message: 'Please, enter reason for refusing.',
            trigger: "blur"
          },
          {
            min: 1,
            message: 'Field cannot be empty!',
            trigger: ["blur", "change"]
          }
        ]
       },
    };
  },
  components: {
    Head,
    // Footer
  },
  created() {
    this.loading = true;
    getSchCertificates().then(res=>{
      console.log("Certificates for this School: ", res.data)
      this.total = res.data.count;
      console.log("Total certs: ", this.total)
      for(let i=0; i < this.total; i++){
        let tbObj = {}
        // Build needed fields for table display. Only five(5) for now. More can be added anytime.
        // From here, these can be deleted and the props for language tranlation changed for the Table.. 
        tbObj.certTitle = res.data.results[i]["certificate_title"] 
        tbObj.critNarrative = res.data.results[i]["criteria_narrative"]    
        tbObj.stdName = res.data.results[i]["student_name"]
        tbObj.stdEmail = res.data.results[i]["email"]
        tbObj.certStatus = res.data.results[i]["status"]
        // Deletion ends here. 
        tbObj.id = res.data.results[i]["id"];
        tbObj.certWSID = (res.data.results[i]["cert_id"]).substring(10); // Remove first ten characters (cert_wsid_)
        tbObj.cert_image_wsid = res.data.results[i]["cert_image_wsid"];
        tbObj.certificate_description = res.data.results[i]["certificate_description"];
        tbObj.certificate_title = res.data.results[i]["certificate_title"];
        tbObj.criteria_narrative = res.data.results[i]["criteria_narrative"];
        tbObj.student_name = res.data.results[i]["student_name"];
        tbObj.student_pubkey = res.data.results[i]["student_pubkey"];
        tbObj.email = res.data.results[i]["email"];
        tbObj.school_pubkey = res.data.results[i]["school_pubkey"];
        tbObj.school_name = res.data.results[i]["school_name"];
        tbObj.status = res.data.results[i]["status"];
        tbObj.txid = res.data.results[i]["txid"];
        tbObj.create_time = res.data.results[i]["create_time"];
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
        if(tbObj['certStatus']==5){
          tbObj['certStatus']='Refused'
        }
        this.filteredData[i] = tbObj
      }
      this.loading = false
      this.schTableData = this.filteredData
    })
  },
  methods: {
    LoginOut() {
      this.$confirm(this.$t('common.logOutDialogMessage'), this.$t('common.logout'), {
        confirmButtonText: this.$t('common.confirm'),
        cancelButtonText: this.$t('common.cancel'),
        type: "info"
      })
        .then(() => {
          // sessionStorage.removeItem("STUDENT-INFO");
          sessionStorage.removeItem("API-HTTP-AUTHORIZATION");
          sessionStorage.removeItem('USER-TYPE');
          sessionStorage.clear()
          this.$router.push("/home");
          this.$message({
            type: "info",
            message: this.$t('common.logOutSuccess')
          });
        })
        .catch(() => {});
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
    currentCertData(){
     this.schTableData = this.filteredData
    },
    onSelectRadio(data){
      this.radio = data
      console.log("User has selected:", this.radio);
      // Perform action based on student's selection.
      this.loading = true
      getSchCertificates().then(res=>{
        console.log("Certificates for this School: ", res.data)
        this.certDataResponse = res.data.results
        this.total = res.data.count;
        console.log("Total certs: ", this.total)
        // Empty filteredData and TableData Array.
        this.filteredData = []
        this.schTableData = []
        for(let i=0; i < this.total; i++){
          let tbObj = {}
          // Build needed fields for table display. Only five(5) for now. More can be added anytime.
          // From here, these can be deleted and the props for language tranlation changed for the Table.
          tbObj.certTitle = res.data.results[i]["certificate_title"]
          tbObj.critNarrative = res.data.results[i]["criteria_narrative"]    
          tbObj.stdName = res.data.results[i]["student_name"]
          tbObj.stdEmail = res.data.results[i]["email"]
          tbObj.certStatus = res.data.results[i]["status"]
          // Deletion ends here. 
          tbObj.id = res.data.results[i]["id"];
          tbObj.certWSID = (res.data.results[i]["cert_id"]).substring(10); // Remove first ten characters (cert_wsid_)
          tbObj.cert_image_wsid = res.data.results[i]["cert_image_wsid"];
          tbObj.certificate_description = res.data.results[i]["certificate_description"];
          tbObj.certificate_title = res.data.results[i]["certificate_title"];
          tbObj.criteria_narrative = res.data.results[i]["criteria_narrative"];
          tbObj.student_name = res.data.results[i]["student_name"];
          tbObj.student_pubkey = res.data.results[i]["student_pubkey"];
          tbObj.email = res.data.results[i]["email"];
          tbObj.school_pubkey = res.data.results[i]["school_pubkey"];
          tbObj.school_name = res.data.results[i]["school_name"];
          tbObj.status = res.data.results[i]["status"];
          tbObj.txid = res.data.results[i]["txid"];
          tbObj.create_time = res.data.results[i]["create_time"];
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
          if(tbObj['certStatus']==5){
            tbObj['certStatus']='Refused'
        }
          this.filteredData[i] = tbObj
        }

        if(this.radio=='all'){
        console.log("Retrieving all certificates.")
        // Get all certificates.
        this.schTableData = this.filteredData
        this.loading = false
        return
        }
        if(this.radio=='chkPending'){
          console.log("Retrieving check pending certificates.")
          // Get check pending certificates.
          this.schTableData = this.filteredData.filter(function(el) { 
            return (
              el.certStatus != "Failed Issue" && 
              el.certStatus != "Revoked" && 
              el.certStatus != "Issued" && 
              el.certStatus != "Issuing" &&
              el.certStatus != "Refused"
            ) 
          });
          this.total = this.schTableData.length
          this.loading = false
          return
        }
        if(this.radio=='Issued'){
          console.log("Retrieving issued certificates.")
          // Get Issued certificates.
          this.schTableData = this.filteredData.filter(function(el) { 
            return (
              el.certStatus != "Failed Issue" && 
              el.certStatus != "Revoked" && 
              el.certStatus != "Created" && 
              el.certStatus != "Issuing" &&
              el.certStatus != "Refused"
            ) 
          }); 
          this.total = this.schTableData.length
          this.loading = false
          return
        }
        if(this.radio=='Refused'){
          console.log("Retrieving refused certificates.")
          // Get Issued certificates.
          this.schTableData = this.filteredData.filter(function(el) { 
            return (
              el.certStatus != "Failed Issue" && 
              el.certStatus != "Revoked" && 
              el.certStatus != "Created" && 
              el.certStatus != "Issuing" &&
              el.certStatus != "Issued"
            ) 
          }); 
          this.total = this.schTableData.length
          this.loading = false
          return
        }
        else{
          console.log("Retrieving revoked certificates.")
          // Get revoked certificates.
          this.schTableData = this.filteredData.filter(function(el) { 
            return (
              el.certStatus != "Issued" && 
              el.certStatus != "Created" && 
              el.certStatus != "Issuing" && 
              el.certStatus != "Failed Issue" &&
              el.certStatus != "Refused"
            ) 
          }); 
          this.total = this.schTableData.length
          this.loading = false
          return
      }
      })
    },
    getSchoolSearch(){
      let itemToSearch =  this.searchInput.schSearchItem
      if(itemToSearch==null || itemToSearch==''){
        this.$message({
            showClose: true,
            type: "warning",
            message: this.$t('schoolCertificates.itemToSearch')
          });
        return
      }
      else{
        console.log("School Certificate search initiated using: ", itemToSearch)
        // Continue to perform certificate search.
        let filteredCertData = null
        filteredCertData = this.filteredData.filter(function(el) { 
            return (el.certTitle == itemToSearch || el.stdName == itemToSearch || el.stdEmail == itemToSearch) });
        this.schTableData = filteredCertData
        return
      }
    },
    getSchCertDetails(index, row) {
        console.log("Getting details for index: ",index, row);
        console.log("Cert status is: ", row['certStatus'])
        console.log("certIDs: ", this.schTableData)
        let certIDtoGetDetails = "cert_wsid_"+this.schTableData[index]['certWSID'];
        console.log("CertID to use: ", certIDtoGetDetails)
        let certStatusToDisplay = row['certStatus']
        viewCertDetails(certIDtoGetDetails).then(res=>{
        console.log("View details of school cert.: ", res)
        this.$store.commit("certViewData", res.data);
        this.$store.commit("set_certDispStatus", certStatusToDisplay);
        this.$router.push("/schools/schoolCertDetails");
        this.$message(this.$t('schoolCertificates.ShowingDetail')); 
        })
    },

    certRevoke(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.revokeCertBtnLoadState = true
          console.log("Initiating certificate revocation.")
          let reasonForRevocation = this.revokeForm.revokeReason
          let certRevokeData = {} 
          certRevokeData['cert_id'] = this.requiredDataForCertRevoke[0]
          certRevokeData['revocationReason'] = reasonForRevocation
          revokeCertificate(certRevokeData,this.requiredDataForCertRevoke[1]).then(res=>{
            console.log("Response data from cert revocation interface: ", res)
            this.revokeCertBtnLoadState = false
            this.revokeDialogBoxVisibility = false 
            this.$message({
              message: this.$t('schoolCertificates.revocationSuccess'),
                type: "success"
              });
          }).catch(function(error) {
              this.revokeCertBtnLoadState = false
              this.revokeDialogBoxVisibility = false 
              console.log(error);
              this.$message.error({
                title: this.$t('schoolCertificates.revocationErrorTitle'),
                message:this.$t('schoolCertificates.revocationError')
              });
            });
        }
      })
     },
    revokeCert(index, row){
      if(row['certStatus']=='Issued'){
        console.log("Cert revocation for index: ",index, row);
        let certWSID = "cert_wsid_"+this.schTableData[index]['certWSID']
        console.log("CertWSID: ", certWSID)
        let schoolPubKey = (this.schTableData[index]['school_pubkey']).substring(21)
        console.log("School's Public key: ", schoolPubKey)
        this.requiredDataForCertRevoke.push(certWSID,schoolPubKey)
        this.revokeDialogBoxVisibility = true 
      }
      else{
            this.$message.error(this.$t('schoolCertificates.CanBeRevoked'));
            return
      }

    },
    toCertCreatePage(){
      console.log("School name: ", this.schInfo)
      this.$router.push("/schools/certCreate"); // TODO
    },
    refuseCert(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // Change refusal button to loading state. 
          this.refuseCertBtnLoadState = true
          let certRefuseData = {}
          certRefuseData['reason'] = this.refuseForm.refuseReason
          console.log("Cert WSID to refuse is: ", this.requiredCertIDToRefuse)
          console.log("Refusal reason is: ", this.refuseForm.refuseReason)
          certRefusalInterface(this.requiredCertIDToRefuse,certRefuseData).then(res=>{
            console.log("Response from Cert refuse interface: ", res)
            this.refuseCertBtnLoadState = false
            this.refuseDialogBoxVisibility = false
            this.$message({
              message: this.$t('schoolCertificates.CertificateRefusalSuccess'),
              type: "success",
              center: true
            }); 
          }) // ends here
          .catch(function(error) {
              console.log(error);
              this.refuseCertBtnLoadState = false
              this.refuseDialogBoxVisibility = false
              this.$message.error({
                title: this.$t('schoolCertificates.CertificateRefusalErrorTitle'),
                message:
                  this.$t('schoolCertificates.CertificateRefusalError')
              });
            });
        }
        else {
          console.log("Error submiting required cert refusal form!!");
          return false;
        }
      })
    },
    certRefuse(index, row){
      if(row['certStatus']=='Created'){
        console.log("Cert refusal initiated.")
        console.log("Cert refusal for index: ",index, row);
        console.log("CertWSID: ", this.schTableData[index]['certWSID'])
        this.requiredCertIDToRefuse = "cert_wsid_"+this.schTableData[index]['certWSID']
        this.refuseDialogBoxVisibility = true
      }
      else{
            this.$message.error(this.$t('schoolCertificates.CertificateCannotBeRefused'));
            return
      }
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

.myBtn{
  margin-top: 1rem;
}

</style>
