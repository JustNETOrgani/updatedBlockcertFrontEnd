<template>
  <div class="certificate">
    <Head :menuList="menuList">
      <el-button class="menu-item" type="primary" round @click="LoginOut"
        >{{$t('common.logout')}}</el-button
      >
    </Head>
    <div class="body">
      <h1 class="title">{{$t('studentCertificates.title')}}</h1>
      <!--Top panel-->
      <div id="topNav">
        <!--Radio buttons-->
        <div id="topNavLeft">
          <label>{{$t('studentCertificates.listOption')}}:</label>
          <el-radio-group v-model="radio" @input="onSelect">
            <el-radio label="all">{{$t('common.all')}}</el-radio>
            <!-- <el-radio label="chkPending">{{$t('common.chkPending')}}</el-radio> -->
            <el-radio label="Created">{{$t('common.Created')}}</el-radio>
            <el-radio label="Issued">{{$t('common.Issued')}}</el-radio>
            <el-radio label="revoked">{{$t('common.revoked')}}</el-radio>
          </el-radio-group>
        </div>
        <div id="topNavMid">
          <!--Search box-->
          <div id="searchInputArea">
            <el-input
              :placeholder="$t('studentCertificates.stdSearchItemPlaceholder')"
              v-model="searchInput"
              clearable
            >
            </el-input>
          </div>
          <div id="searchBtnDiv">
            <el-button
              @click="getStudentSearch"
              icon="el-icon-search"
              circle
            ></el-button>
          </div>
        </div>
        <div id="topNavRight">
          <el-button type="primary" @click="toCertUploadPage"
            >{{$t('studentCertificates.UploadCert')}}<i class="el-icon-upload el-icon-right"></i
          ></el-button>
        </div>
      </div>
      <!--Certificate display area-->
      <div id="certDisplayArea">
        <!--Building table-->
        <el-table
          v-loading="loading"
          :data="tableData"
          style="width: 100%"
          height="450px">
          <!--Building table body-->
          <template v-for="(item, index) in tableLabel">
            <el-table-column
              :key="index"
              :prop="item.prop"
              :label="item.label">
            </el-table-column>
          </template>
          <el-table-column :label="$t('common.operation')">
            <template slot-scope="scope">
              <el-button
                size="mini"
                @click="getCertDetails(scope.$index, scope.row)"
                >{{$t('common.certDetail')}}</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
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
    <!-- <Footer></Footer> -->
  </div>
</template>

<script>
import Head from "@/components/header";
// import Footer from "@/components/Footer";
import { getCertificates } from "@/network/students";

export default {
  name: "certificate",
  data() {
    return {
      menuList: [
        { name: this.$t('common.home'), path: "/home" },
        { name: this.$t("common.certificates"), path: "/students/certificates" }
      ],
      radio: 'all',
      searchInput: '',
      tableData: [],
      loading: true,
      total: 0,
      currentPage: 1,
      limit: 10,
      filteredData: [],
      tableLabel: [
        { label: this.$t('common.certTitle'), prop: "certificate_title"},
        { label: this.$t('common.school'), prop: "school_name"},
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
      getCertificates(params).then(res => {
        this.total = res.data.count;
        console.log("Total certs: ", this.total);
        this.tableData = res.data.results;
        for(let i=0; i < this.tableData.length; i++){
          // Use 0 for Created, 1 for Issued,  2 for Issuing(Pending) and 3 for Failed Issue
          if(this.tableData[i].status==0){
            this.tableData[i].statusLab=this.$t('certstatus.Created')
          }
          if(this.tableData[i].status==1){
            this.tableData[i].statusLab=this.$t('certstatus.Issued')
          }
          if(this.tableData[i].status==2){
            this.tableData[i].statusLab=this.$t('certstatus.Issuing')
          }
          if(this.tableData[i].status==3){
            this.tableData[i].statusLab=this.$t('certstatus.FailedIssue')
          }
          if(this.tableData[i].status==4){
            this.tableData[i].statusLab=this.$t('certstatus.Revoked')
          }
          if(this.tableData[i].status==5){
            this.tableData[i].statusLab=this.$t('certstatus.Refused')
          }
        }
        this.loading = false
        }
        ).catch(error => {
        console.log(error)
        this.$message.error(this.$t('home.index.getVerifyListFail'));
        this.loading = false
    })
    },
    toCertUploadPage() {
      this.$router.push("/students/cert_upload");
    },
    getStudentSearch() {
      if (this.searchInput == null || this.searchInput == "") {
        this.$message({
          showClose: true,
          type: "warning",
          message: this.$t('common.stdSearchItemFormat')
        });
      }else{
        this.params.certificate_title = decodeURI(this.searchInput)
        this.getCerts(this.params);
        return
      }
    },
    handleSizeChange(size) {
      console.log(`${size} items per page`);
      this.params.limit = size
      this.getCerts(this.params);
    },
    handleCurrentChange(current) {
      console.log(`current page: ${current}`);
      this.currentPage = current;
      this.params.offset = (this.currentPage-1)*this.limit;
      this.getCerts(this.params);
    },
    // currentCertData(){
    //  this.tableData = this.filteredData
    // },

    onSelect(data) {
      this.radio = data;
      console.log("User has selected:", this.radio);
      if(this.radio=='all'){
      this.params = {
        offset: 0,
        limit: this.limit,
        ordering: "-create_time"
        }
      }
      else if(this.radio=='Created'){
      this.params = {
        offset: 0,
        limit: this.limit,
        ordering: "-create_time",
        status: 0
        }
      }
      else if(this.radio=='Issued'){
      this.params = {
        offset: 0,
        limit: this.limit,
        ordering: "-create_time",
        status: 1
        }
      }
      else if(this.radio=='Refused'){
        this.params = {
          offset: 0,
          limit: this.limit,
          ordering: "-create_time",
          status: 5
          }
      }
      else{
        // revoked
        this.params = {
          offset: 0,
          limit: this.limit,
          ordering: "-create_time",
          status: 4
          }
      }
      this.getCerts(this.params);
    },
    getCertDetails(index, row) {
      console.log("Getting details for index: ", index, row);
      let certStatusToDisplay = row.statusLab;
      this.$store.commit("set_certDispStatus", certStatusToDisplay);
      let certIDtoGetDetails = row.cert_id;
      console.log("CertID to use: ", certIDtoGetDetails)
      this.$router.push(`/students/${certIDtoGetDetails}/CertDetails`);
      // console.log("Cert status is: ", row["certStatus"]);
      // console.log("certIDs: ", this.tableData)
      // let certIDtoGetDetails = this.tableData[index]['certWSID'];
      // console.log("CertID to use: ", certIDtoGetDetails)
      // let certStatusToDisplay = row["certStatus"];
      // viewCertDetails(certIDtoGetDetails).then(res => {
      //   console.log("View details of cert.: ", res);
      //   this.$store.commit("certViewData", res.data);
      //   this.$store.commit("set_certDispStatus", certStatusToDisplay);
      //   this.$router.push("/students/certDetails");
      //   this.$message(this.$t('studentCertificates.certificateDetailInfo'));
      // });
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
#topNav {
  width: 100%;
  height: 15%;
  margin: 0.5rem auto;
}
#topNavLeft {
  width: 50%;
  float: left;
  margin-right: 1rem;
}
#topNavMid {
  width: 27%;
  float: left;
  margin-top: -0.5rem;
}
#searchInputArea {
  float: left;
  width: 77%;
}
#searchBtnDiv {
  float: left;
  margin-left: 0.5rem;
}
#topNavRight {
  width: 5%;
  float: left;
  margin-top: -0.5rem;
}
label {
  padding-right: 0.5rem;
}
#certDisplayArea {
  width: 97%;
  height: 450px;
  background-color: #ffffff;
  margin-top: 0.5rem;
  align-items: left;
}
#certTitleDiv {
  width: 50%;
  float: left;
  align-items: left;
  margin: 0% -10rem;
}
#schNameDiv {
  width: 30%;
  float: left;
  align-items: left;
}
#certStatusDiv {
  width: 18%;
  float: left;
  align-items: left;
}
</style>
