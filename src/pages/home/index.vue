<template>
  <div class="container">
    <Head :menuList="menuList">
      <div v-if="needLogin">
        <el-button class="menu-item" type="primary" @click="LoginURL" round
          >Login</el-button
        >
        <el-button
          class="menu-item"
          type="primary text"
          round
          @click="dialogVisible = true"
          >Register</el-button
        >
        <el-dialog
          title="Select registered user type"
          :visible.sync="dialogVisible"
          width="30%"
        >
          <el-radio-group v-model="RegisterType">
            <el-radio label="student">Student</el-radio>
            <el-radio label="school">School</el-radio>
          </el-radio-group>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">Cancel</el-button>
            <el-button type="primary" @click="RegisterTypeChoose"
              >Confirm</el-button
            >
          </span>
        </el-dialog>
      </div>
      <div v-else>
        <el-button class="menu-item" type="primary" round>Login out</el-button>
      </div>
    </Head>
    <div class="body">
      <h1 class="title">Blockcerts Universal View</h1>
      <div class="input-container" style="display:inline-block;">
        <el-input
          placeholder="Input student email..."
          v-model="input"
          type="email"
        >
          <el-button slot="append" class="text" @click="seachCert()"
            >View</el-button
          >
        </el-input>
      </div>
      <div v-if="tableVisible" style="width: 100%;">
        <el-main>
          <el-table
            :data="tableData"
            style="width: 100%"
            height="380"
            v-loading="tableLoading"
          >
            <template v-for="(item, index) in tableLabel">
              <el-table-column
                :key="index"
                :prop="item.prop"
                :label="item.label"
              >
              </el-table-column>
            </template>
            <el-table-column label="operation">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  @click="VerifyCert($event, scope.$index, scope.row)">Verify</el-button>
                <el-dialog
                  title="Verify result"
                  :visible.sync="dialogVisible">
                  <span>chain: {{ VerifyObj.chain }}</span>
                  <br />
                  <span>txid: {{ VerifyObj.txid }}</span>
                  <el-steps v-loading="dialogLoading" direction="vertical" :active="step">
                    <template v-for="(item, index) in VerifyResult">
                      <el-step
                        :key="index"
                        :title="item.step"
                        :description="item.name"
                        :status="item.status"
                      ></el-step>
                    </template>
                  </el-steps>
                </el-dialog>
              </template>
            </el-table-column>
          </el-table>
        </el-main>
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10, 20, 30, 50]"
          :page-size="limit"
          layout=" sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </div>
    </div>
    <Footer v-if="!tableVisible"></Footer>
  </div>
</template>

<script>
import Head from "@/components/header";
import Footer from "@/components/Footer.vue";
import { verifyCertList, verifyCert } from "@/network/home";

export default {
  name: "home",
  data() {
    return {
      input: "",
      RegisterType: "student",
      dialogVisible: false,
      dialogLoading: false,
      step: 1,
      total: 0,
      currentPage: 1,
      limit: 10,
      tableData: [],
      tableVisible: false,
      tableLoading: false,
      tableLabel: [
        { label: "title", prop: "certificate_title" },
        { label: "student", prop: "student_name" },
        { label: "email", prop: "email" },
        { label: "school", prop: "school_name" },
        { label: "chain", prop: "chain"},
        { label: "time", prop: "create_time" },
      ],
      VerifyResult: [],
      VerifyObj: {}
    };
  },
  components: {
    Head,
    Footer
  },
  computed: {
    needLogin: function() {
      console.log(
        "this.$store.token",
        sessionStorage.getItem("API-HTTP-AUTHORIZATION")
      );
      if (sessionStorage.getItem("API-HTTP-AUTHORIZATION")) {
        return false;
      } else {
        return true;
      }
    },
    menuList: function() {
      if (!this.needLogin) {
        return [
          { name: "Home", path: "/home" },
          { name: "Certificates", path: "/certificates" }
        ];
      } else {
        console.log("未登录");
        return [];
      }
    }
  },
  methods: {
    LoginURL() {
      this.$router.push("/login");
    },
    RegisterTypeChoose() {
      this.dialogVisible = false;
      if (this.RegisterType === "student") {
        this.$router.push("/students/Register");
      }
      if (this.RegisterType === "school") {
        this.$router.push("/schools/Register");
      }
    },
    seachCert() {
      let regEmail= /^\w+((.\w+)|(-\w+))@[A-Za-z0-9]+((.|-)[A-Za-z0-9]+).[A-Za-z0-9]+$/
      if (!regEmail.test(this.input)) {
        this.$message.error('Please fill in the correct email format');
        return false;
        }
      console.log("get verify certs list");
      let params = {
        offset: this.currentPage - 1,
        limit: this.limit,
        email: this.input,
        status: 1
      };
      this.tableVisible = true;
      this.tableLoading = true;
      verifyCertList(params)
        .then(res => {
          this.tableData = res.data.results;
          this.total = res.data.count;
          this.tableLoading = false;
        })
        .catch(error => {
          console.log(error);
          this.tableLoading = false;
          this.tableVisible = false;
          this.$message.error("Get verify certs list fail. Please try it later");
        });
    },
    handleSizeChange(size) {
      this.limit = size;
      this.seachCert();
    },
    handleCurrentChange(current) {
      this.currentPage = current;
      this.seachCert();
    },
    VerifyCert(event, index, row) {
      event.srcElement.parentNode.disabled = true
      this.VerifyObj = row;
      this.dialogVisible = true;
      this.dialogLoading = true;
      let data = {
        cert_id: this.VerifyObj.cert_id
      };
      verifyCert(data)
        .then(res => {
          let isPassed = true;
          this.dialogLoading = false;
          this.VerifyResult = res.data.data;
          for (let i = 0; i < this.VerifyResult.length; i++) {
            this.VerifyResult[i].step = "step " + (i + 1);
            if (this.VerifyResult[i].status === "passed") {
              this.VerifyResult[i].status = "success";
            }
            if (this.VerifyResult[i].status === "failed") {
              this.VerifyResult[i].status = "error";
              isPassed = false;
            }
            this.step = i;
          }
          if(isPassed){
            event.srcElement.parentNode.style.backgroundColor = "#67c23a"
            event.srcElement.innerText = "Passed"
          }
          else{
            event.srcElement.parentNode.style.backgroundColor = "#f56c6c"
            event.srcElement.innerText = "Failed"
          }
        })
        .catch(error => {
          console.log(error);
          this.dialogLoading = false;
          this.VerifyResult = [{step: "step 1", status: "error", name:"Verify cert fail. Please try it later"}]
          this.step = 0;
          event.srcElement.parentNode.style.backgroundColor = "#f56c6c"
          event.srcElement.innerText = "Failed"
        });
    }
  }
};
</script>

<style scoped>
.container {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.logo {
  height: 5rem;
}

.menu {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.menu-item {
  margin: 0 0.5rem;
}

.container .body {
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

.input-container {
  width: 50%;
  margin-bottom: 1em;
}

.text {
  cursor: pointer;
}

.menu-item {
  text-decoration: none;
  color: #ffffff;
  margin: 0.6rem 0.5rem;
}
</style>
