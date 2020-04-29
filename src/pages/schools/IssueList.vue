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
            prop="certTitle"
            :label="$t('common.certTitle')"
            >
          </el-table-column>
          <el-table-column
            prop="critNarrative"
            :label="$t('common.critNarrative')"
            >
          </el-table-column>
          <el-table-column
            prop="stdName"
            :label="$t('common.stdName')"
            >
          </el-table-column>
          <el-table-column
            prop="stdEmail"
            :label="$t('common.stdEmail')"
           >
          </el-table-column>
          <el-table-column
            prop="certStatus"
            :label="$t('common.certStatus')"
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
              @click="certIssue(scope.$index, scope.row)">{{$t('common.Issue')}}</el-button>
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

      <el-dialog :title="$t('schoolCertificates.issuerDialog')" :visible.sync="dialogFormVisible" width="35%">
        <el-form 
          :model="ruleForm" 
          class="demo-ruleForm" 
          :rules="rules" 
          ref="ruleForm"
        >
          <el-form-item class="dialogLabels" :label="$t('schoolCertificates.blockTypeLabel')" :label-width="formLabelWidth" prop="blockType">
            <el-select v-model="ruleForm.blockType" :placeholder="$t('schoolCertificates.blockTypePlaceholder')">
              <el-option :label="$t('schoolCertificates.blockType.bitcoin_testnet')" value="bitcoin_testnet"></el-option>
              <el-option :label="$t('schoolCertificates.blockType.ethereum_ropsten')" value="ethereum_ropsten"></el-option>
              <el-option :label="$t('schoolCertificates.blockType.bitcoin_mainnet')" value="bitcoin_mainnet"></el-option>
              <el-option :label="$t('schoolCertificates.blockType.ethereum_mainnet')" value="ethereum_mainnet"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('schoolCertificates.issuing_addressLabel')" :label-width="formLabelWidth" prop="issuing_address">
            <el-input v-model="ruleForm.issuing_address" :placeholder="$t('schoolCertificates.issuing_addressPlaceholder')"></el-input>
          </el-form-item>
          <el-form-item :label="$t('schoolCertificates.secret_keyLabel')" prop="secret_key">
            <el-input v-model="ruleForm.secret_key" type="password" :placeholder="$t('schoolCertificates.secret_keyPlaceholder')"></el-input>
          </el-form-item>
        </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button  @click="dialogFormVisible = false">{{$t('common.cancel')}}</el-button>
        <el-button :loading="issueCertBtnLoadState" type="primary" @click="submitForm('ruleForm')">{{$t('common.confirm')}}</el-button>
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
import { createCertInterface } from "@/network/schools"; 
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
      dialogFormVisible: false,
      formLabelWidth: '160px',
      loading: false,
      issueCertBtnLoadState: false,
      revokeDialogBoxVisibility: false,
      revokeCertBtnLoadState: false,
      total: 0,
      currentPage: 1,
      limit: 10,
      certImageWSID: [], // To be used to view details about the certificate.
      filteredData: [],
      certDataResponse: [],
      schInfo: sessionStorage.getItem('USER-TYPE'==="school"),
       ruleForm: {
        blockType: "",
        issuing_address: "",
        secret_key: "",
      },
      revokeForm:{
        revokeReason:"",
      },
      requiredCertDataForIssue: null,
      requiredDataForCertRevoke: [],
       rules: {
        blockType: [
            { required: true, message: this.$t('schoolCertificates.blockTypeFormat1'), trigger: 'change' }
          ],
        issuing_address: [
          {
            required: true,
            message: this.$t('schoolCertificates.issuing_addressFormat1'),
            trigger: "blur"
          },
          {
            min: 20,
            message: this.$t('schoolCertificates.issuing_addressFormat2'),
            trigger: ["blur", "change"]
          }
        ],
        secret_key: [
          {
            required: true,
            message: this.$t('schoolCertificates.secret_keyFormat1'),
            trigger: "blur"
          },
          {
            min: 20,
            message: this.$t('schoolCertificates.secret_keyFormat2'),
            trigger: ["blur", "change"]
          }
        ],
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
        tbObj.certWSID = res.data.results[i]["cert_id"];
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
          tbObj.certWSID = res.data.results[i]["cert_id"]; 
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
              el.certStatus != "Issuing"
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
              el.certStatus != "Issuing"
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
              el.certStatus != "Failed Issue"
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
        let certIDtoGetDetails = this.schTableData[index]['certWSID'];
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
        let certWSID = this.schTableData[index]['certWSID']
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
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // Clear the page overlay and continue with processing. 
          this.issueCertBtnLoadState = true
          // Create issuer config.
          //Include blockchain details as config before sending to cert issue interface begin.  
          let api_token = null
          let batch_size = 10
          let bitcoind = false
          let blockcypher_api_token = null
          let chain = this.ruleForm.blockType
          let dust_threshold = 0.0000275
          let gas_limit = 2500
          let gas_price = 20000000
          let issuing_address = this.ruleForm.issuing_address
          let secret_key = this.ruleForm.secret_key
          let max_retry = 10
          let my_config = null
          let safe_mode = false
          let satoshi_per_byte = 250
          let tx_fee = 0.0006
          //Include blockchain details as config before sending to cert issue interface ends.
          
          // Include config in certData Object to be sent to cert issue interface begins. 
          this.requiredCertDataForIssue['api_token'] = api_token
          this.requiredCertDataForIssue['batch_size'] = batch_size
          this.requiredCertDataForIssue['bitcoind'] = bitcoind
          this.requiredCertDataForIssue['blockcypher_api_token'] = blockcypher_api_token
          this.requiredCertDataForIssue['chain'] = chain
          this.requiredCertDataForIssue['dust_threshold'] = dust_threshold
          this.requiredCertDataForIssue['gas_limit'] = gas_limit
          this.requiredCertDataForIssue['gas_price'] = gas_price
          this.requiredCertDataForIssue['issuing_address'] = issuing_address
          this.requiredCertDataForIssue['secret_key'] = secret_key
          this.requiredCertDataForIssue['max_retry'] = max_retry
          this.requiredCertDataForIssue['my_config'] = my_config
          this.requiredCertDataForIssue['safe_mode'] = safe_mode
          this.requiredCertDataForIssue['satoshi_per_byte'] = satoshi_per_byte
          this.requiredCertDataForIssue['tx_fee'] = tx_fee
          
          // Include config in certData Object to be sent to cert issue interface ends. 
          let certDatObj = Object.assign({},this.requiredCertDataForIssue) // Convert to object.
          console.log("Cert data Obj to be used: ", certDatObj)
          let CertWSID = this.requiredCertDataForIssue['certWSID']
          console.log("Retrieved CertWSID: ", CertWSID)
          createCertInterface(certDatObj,CertWSID).then(res=>{
            console.log("Response from Cert create interface: ", res)
            this.issueCertBtnLoadState = false
            this.dialogFormVisible = false
            this.$message({
              message: this.$t('schoolCertificates.CertificateCreationSuccess'),
              type: "success",
              center: true
            }); 
          }) // ends here
          .catch(function(error) {
              console.log(error);
              this.issueCertBtnLoadState = false
              this.dialogFormVisible = false
              this.$message.error({
                title: this.$t('schoolCertificates.CertificateCreationErrorTitle'),
                message:
                  this.$t('schoolCertificates.CertificateCreationError')
              });
            });
        }
        else {
          console.log("Error submiting required cert issue form!!");
          return false;
        }
      })
    },
    certIssue(index, row){
      if(row['certStatus']!='Issued'){
        // Open the dialog box to get user inputs. 
        this.dialogFormVisible = true
        console.log("Cert issuance initiated.")
        console.log("Cert issuance for index: ",index, row);
        console.log("CertWSID: ", this.schTableData[index]['certWSID'])
        this.requiredCertDataForIssue = this.schTableData[index]
      }
      else{
            this.$message.error(this.$t('schoolCertificates.CertificateAlreadyIssue'));
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
