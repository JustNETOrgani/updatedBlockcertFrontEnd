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
            <el-radio label="chkPending">{{$t('common.chkPending')}}</el-radio>
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
      <div id="certDisplayArea" style="overflow-y:auto">
        <!--Building table-->
        <el-table
          v-loading="loading"
          :data="tableData"
          style="width: 100%; height:92%"
        >
          <!--Building table body-->
          <el-table-column prop="certTitle" :label="$t('common.certTitle')">
          </el-table-column>
          <el-table-column prop="certIssuer" :label="$t('common.school')">
          </el-table-column>
          <el-table-column prop="certStatus" :label="$t('common.certStatus')">
          </el-table-column>
          <el-table-column align="right">
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
import { viewCertDetails } from "@/network/students";

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
      certImageWSID: [], // To be used to view details about the certificate.
      loading: false,
      total: 0,
      currentPage: 1,
      limit: 10,
      filteredData: []
    };
  },
  components: {
    Head,
    // Footer
  },
  created() {
    this.loading = true;
    getCertificates().then(res => {
      console.log("Certificates for this student on page load: ", res.data);
      this.total = res.data.count;
      for (let i = 0; i < this.total; i++) {
        let tbObj = {};
        tbObj.certTitle = res.data.results[i]["certificate_title"];
        tbObj.certIssuer = res.data.results[i]["school_name"]; //
        tbObj.certStatus = res.data.results[i]["status"];
        // Use 0 for Created, 1 for Issued,  2 for Issuing(Pending) and 3 for Failed Issue
        if (tbObj["certStatus"] == 0) {
          tbObj["certStatus"] = "Created";
        }
        if (tbObj["certStatus"] == 1) {
          tbObj["certStatus"] = "Issued";
        }
        if (tbObj["certStatus"] == 2) {
          tbObj["certStatus"] = "Issuing";
        }
        if (tbObj["certStatus"] == 3) {
          tbObj["certStatus"] = "Failed Issue";
        }
        if (tbObj["certStatus"] == 4) {
          tbObj["certStatus"] = "Revoked";
        }
        this.filteredData[i] = tbObj;
        }
      this.loading = false;
      this.tableData = this.filteredData
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
          sessionStorage.removeItem("STUDENT-INFO");
          sessionStorage.removeItem("API-HTTP-AUTHORIZATION");
          this.$router.push("/home");
          this.$message({
            type: "info",
            message: this.$t('common.logOutSuccess')
          });
        })
        .catch(() => {});
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
      } else {
        console.log("Certificate search initiated using: ", this.searchInput);
        // Continue to perform certificate search.
        let searchCriteria = this.searchInput
        let filteredCertData = null;
        filteredCertData = this.filteredData.filter(function(el) {
          console.log("Inside filter, using: ", searchCriteria)
          return el.certTitle == searchCriteria|| el.certIssuer == searchCriteria;
        });
        this.tableData = filteredCertData;
      }
    },
    handleSizeChange(size) {
      console.log(`${size} items per page`);
      this.limit = size;
      this.currentCertData();
    },
    handleCurrentChange(current) {
      console.log(`current page: ${current}`);
      this.currentPage = current;
      this.currentCertData();
    },
    currentCertData(){
     this.tableData = this.filteredData
    },

    onSelect(data) {
      this.radio = data;
      console.log("User has selected:", this.radio);
      this.loading = true;
      // Perform action based on student's selection.
      getCertificates().then(res => {
        console.log("Certificates for this student: ", res.data);
        this.total = res.data.count;
        console.log("Total certs: ", this.total);
        for (let i = 0; i < this.total; i++) {
          let tbObj = {};
          tbObj.certTitle = res.data.results[i]["certificate_title"];
          tbObj.certIssuer = res.data.results[i]["school_name"]; //
          tbObj.certStatus = res.data.results[i]["status"];
          this.certImageWSID.push(res.data.results[i]["cert_id"]);
          // Use 0 for Created, 1 for Issued,  2 for Issuing(Pending) and 3 for Failed Issue
          if (tbObj["certStatus"] == 0) {
            tbObj["certStatus"] = "Created";
          }
          if (tbObj["certStatus"] == 1) {
            tbObj["certStatus"] = "Issued";
          }
          if (tbObj["certStatus"] == 2) {
            tbObj["certStatus"] = "Issuing";
          }
          if (tbObj["certStatus"] == 3) {
            tbObj["certStatus"] = "Failed Issue";
          }
          if (tbObj["certStatus"] == 4) {
            tbObj["certStatus"] = "Revoked";
          }
          this.filteredData[i] = tbObj;
        }

        if (this.radio == "all") {
          console.log("Retrieving all certificates.");
          // Get all certificates.
          this.total = this.filteredData.length;
          this.tableData = this.filteredData;
          this.loading = false;
          return;
        }
        if (this.radio == "chkPending") {
          console.log("Retrieving check pending certificates.");
          // Get check pending certificates.
          this.filteredData = this.filteredData.filter(function(el) {
            return (
              el.certStatus != "Failed Issue" &&
              el.certStatus != "Revoked" &&
              el.certStatus != "Issued" &&
              el.certStatus != "Issuing"
            );
          });
          this.total = this.filteredData.length;
          this.tableData = this.filteredData;
          this.loading = false;
          return;
        }
        if (this.radio == "Issued") {
          console.log("Retrieving issued certificates.");
          // Get Issued certificates.
          this.filteredData = this.filteredData.filter(function(el) {
            return (
              el.certStatus != "Failed Issue" &&
              el.certStatus != "Revoked" &&
              el.certStatus != "Created" &&
              el.certStatus != "Issuing"
            );
          });
          this.total = this.filteredData.length;
          this.tableData = this.filteredData;
          this.loading = false;
          return;
        } else {
          console.log("Retrieving revoked certificates.");
          // Get revoked certificates.
          this.filteredData = this.filteredData.filter(function(el) {
            return (
              el.certStatus != "Issued" &&
              el.certStatus != "Created" &&
              el.certStatus != "Issuing" &&
              el.certStatus != "Failed Issue"
            );
          });
          this.total = this.filteredData.length;
          this.tableData = this.filteredData;
        }
      });
    },
    getCertDetails(index, row) {
      console.log("Getting details for index: ", index, row);
      console.log("Cert status is: ", row["certStatus"]);
      let certIDtoGetDetails = this.certImageWSID[index];
      let certStatusToDisplay = row["certStatus"];
      viewCertDetails(certIDtoGetDetails).then(res => {
        console.log("View details of cert.: ", res);
        this.$store.commit("certViewData", res.data);
        this.$store.commit("set_certDispStatus", certStatusToDisplay);
        this.$router.push("/students/certDetails");
        this.$message(this.$t('studentCertificates.certificateDetailInfo'));
      });
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
  height: 85%;
  background-color: #ffffff;
  margin-top: -1.8rem;
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
