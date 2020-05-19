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
            <!-- <el-radio label="chkPending">{{$t('common.chkPending')}}</el-radio> -->
            <el-radio label="Created">{{$t('common.Created')}}</el-radio>
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
          fit
          max-height="450"
          >
          <!--Building table body--> 
          <template v-for="(item, index) in tableLabel">
              <el-table-column
                :key="index"
                :prop="item.prop"
                :label="item.label" :width="item.width">
              </el-table-column>
            </template>
          <el-table-column
          :label="$t('common.operation')" width="300px">
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
    <el-dialog :title="$t('schoolCertificates.RefuseReasonTitle')" :visible.sync="refuseDialogBoxVisibility" width="40%">
      <el-form 
      :model="refuseForm"
      class="demo-ruleForm" 
      :rules="rules" 
      ref="refuseForm">
        <el-form-item :label="$t('schoolCertificates.RefuseReasonLable')" label-width="170px" prop="refuseReason">
          <el-input v-model="refuseForm.refuseReason" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="refuseDialogBoxVisibility = false">{{$t('common.cancel')}}</el-button>
        <el-button :loading="refuseCertBtnLoadState" type="primary" @click="refuseCert('refuseForm')">{{$t('common.confirm')}}</el-button>
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
// import { viewCertDetails } from "@/network/schools"; 
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
      params: {},
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
      tableLabel: [
        { label: this.$t('common.certWSID'), prop: "cert_id", width: "320px"},
        { label: this.$t('common.certTitle'), prop: "certificate_title"},
        { label: this.$t('common.critNarrative'), prop: "criteria_narrative"},
        { label: this.$t('common.stdName'), prop: "student_name"},
        { label: this.$t('common.stdEmail'), prop: "email"},
        { label: this.$t('common.certStatus'), prop: "statusLab"},
      ]
    };
  },
  components: {
    Head,
    // Footer
  },
  created() {
    this.params = {
        offset: (this.currentPage-1)*this.limit,
        limit: this.limit,
        ordering: "-create_time"
    }
    this.getCerts(this.params);
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
    getCerts(params){
      this.loading = true;
      getSchCertificates(params).then(res=>{
        console.log("Certificates for this School: ", res.data)
        this.total = res.data.count;
        console.log("Total certs: ", this.total);
        this.schTableData = res.data.results;
        for(let i=0; i < this.schTableData.length; i++){
          this.schTableData[i].cert_id = this.schTableData[i].cert_id.replace('cert_wsid_', '')
          // Use 0 for Created, 1 for Issued,  2 for Issuing(Pending) and 3 for Failed Issue
          if(this.schTableData[i].status==0){
            this.schTableData[i].statusLab=this.$t('certstatus.Created')
          }
          if(this.schTableData[i].status==1){
            this.schTableData[i].statusLab=this.$t('certstatus.Issued')
          }
          if(this.schTableData[i].status==2){
            this.schTableData[i].statusLab=this.$t('certstatus.Issuing')
          }
          if(this.schTableData[i].status==3){
            this.schTableData[i].statusLab=this.$t('certstatus.FailedIssue')
          }
          if(this.schTableData[i].status==4){
            this.schTableData[i].statusLab=this.$t('certstatus.Revoked')
          }
          if(this.schTableData[i].status==5){
            this.schTableData[i].statusLab=this.$t('certstatus.Refused')
          }
        }
        this.loading = false
    }).catch(error => {
        console.log(error)
        this.$message.error(this.$t('home.index.getVerifyListFail'));
        this.loading = false
    })},
    handleSizeChange(size) {
      console.log(`${size} items per page`);
      this.params.limit = size
      this.getCerts(this.params);
    },
    handleCurrentChange(current) {
      console.log(`current page: ${current}`);
      this.currentPage = current;
      this.params.offset = (this.currentPage-1)*this.limit;
      console.log("this.params.offset", this.params.offset)
      this.getCerts(this.params);
    },
    onSelectRadio(data){
      this.radio = data
      console.log("User has selected:", this.radio);
      // Perform action based on student's selection.
      if(this.radio=='all'){
      this.params = {
        offset: (this.currentPage-1)*this.limit,
        limit: this.limit,
        ordering: "-create_time"
        }
      }
      else if(this.radio=='Created'){
      this.params = {
        offset: (this.currentPage-1)*this.limit,
        limit: this.limit,
        ordering: "-create_time",
        status: 0
        }
      }
      else if(this.radio=='Issued'){
      this.params = {
        offset: (this.currentPage-1)*this.limit,
        limit: this.limit,
        ordering: "-create_time",
        status: 1
        }
      }
      else if(this.radio=='Refused'){
        this.params = {
          offset: (this.currentPage-1)*this.limit,
          limit: this.limit,
          ordering: "-create_time",
          status: 5
          }
      }
      else{
        // revoked
        this.params = {
          offset: (this.currentPage-1)*this.limit,
          limit: this.limit,
          ordering: "-create_time",
          status: 4
          }
      }
      this.getCerts(this.params);
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
        this.params.certificate_title = decodeURI(itemToSearch)
        this.getCerts(this.params);
        return
      }
    },
    getSchCertDetails(index, row) {
        console.log("Getting details for index: ",index, row);
        // console.log("Cert status is: ", row['certStatus'])
        // console.log("certIDs: ", this.schTableData)
        let certIDtoGetDetails = "cert_wsid_"+row.cert_id;
        console.log("CertID to use: ", certIDtoGetDetails)
        this.$router.push(`/schools/${certIDtoGetDetails}/CertDetails`);
        // let certStatusToDisplay = row['certStatus']
        // viewCertDetails(certIDtoGetDetails).then(res=>{
        // console.log("View details of school cert.: ", res)
        // this.$store.commit("certViewData", res.data);
        // this.$store.commit("set_certDispStatus", certStatusToDisplay);
        // this.$router.push("/schools/certIDtoGetDetails/CertDetails");
        // this.$message(this.$t('schoolCertificates.ShowingDetail')); 
        // })
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
            this.getCerts(this.params);
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
      if(row['status']==='Issued'){
        console.log("Cert revocation for index: ",index, row);
        let certWSID = "cert_wsid_"+this.schTableData[index]['cert_id']
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
            this.getCerts(this.params);
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
      console.log(row)
      if(row['status']==='Created'){
        console.log("Cert refusal initiated.")
        console.log("Cert refusal for index: ",index, row);
        console.log("CertWSID: ", this.schTableData[index]['cert_id'])
        this.requiredCertIDToRefuse = "cert_wsid_"+this.schTableData[index]['cert_id']
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
