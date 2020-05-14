<template>
  <div class="container">
    <Head :menuList="menuList">
      <div v-if="needLogin">
        <el-button class="menu-item" type="primary" @click="LoginURL" round
          >{{$t('common.login')}}</el-button
        >
        <el-button
          class="menu-item"
          type="primary text"
          round
          @click="dialogVisible = true"
          >{{$t('common.register')}}</el-button
        >
        <el-dialog
          :title="$t('home.index.dialogTitleUserType')"
          :visible.sync="dialogVisible"
          width="30%"
        >
          <el-radio-group v-model="RegisterType">
            <el-radio label="student">{{$t('common.student')}}</el-radio>
            <el-radio label="school">{{$t('common.school')}}</el-radio>
          </el-radio-group>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">{{$t('common.cancel')}}</el-button>
            <el-button type="primary" @click="RegisterTypeChoose"
              >{{$t('common.confirm')}}</el-button
            >
          </span>
        </el-dialog>
        <el-button
          class="menu-item"
          type="primary text"
          round
          @click="aboutDialogVisible = true"
          >About</el-button
        >
        <el-dialog
          title="Blockcerts Signit Project"
          :visible.sync="aboutDialogVisible"
          width="42%"
          center>
          <h3> Welcome to Blockcerts Signit</h3>
          <p>The existing academic certificate creation, issuance and subsequent verification processes by prospective 
            employers of students are centralized and bedeviled with a lot of challenges. Schools have become Trusted Third Parties (TTPs)
            hence must be trusted by employers. Moreover, current certificates can easily be tampered with.
          </p>
          <p>It is to solve these and other challenges that Blockerts Signit comes in by leveraging the power of
            <b>Blockchain technology</b>. Currently, for backward compactibility, we allow students to upload their existing
            certificates and subsequently permit their respective schools to authenticate and upon satisfaction issue it
            on the blockchain making it <b>immutable</b> and at the same time <b>globally verifiable.</b>
          </p>
          <p>It must however be noted that schools reserve the right to <i>revoke</i> an issued certificate at any point in time.</p>
          <p>We hope to continue adding more features to this platform.</p> 
        </el-dialog>
      </div>
      <div v-else>
        <el-button class="menu-item" type="primary" round @click="logUserOut">{{$t('common.logout')}}</el-button>
      </div>
    </Head>
    <div class="body">
      <h1 class="title">{{$t('home.index.page')}}</h1>
      <div class="input-container" style="display:inline-block;">
        <el-input
          :placeholder="$t('home.index.placeholder')"
          v-model="input"
          type="email"
        >
          <el-button slot="append" class="text" @click="seachCert()"
            >{{$t('common.view')}}</el-button
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
                :label="item.label">
              </el-table-column>
            </template>
            <el-table-column :label="$t('common.operation')">
              <template slot-scope="scope">
                <button
                  size="mini"
                  type="button"
                  class="el-button el-button--primary el-button--mini"
                  v-on:click.self="VerifyCert($event, scope.$index, scope.row)">{{$t('home.index.verify')}}</button>
                <el-dialog
                  :title="$t('home.index.dialogTitleVerify')"
                  :visible.sync="dialog2Visible">
                  <span>{{$t('common.chain')}}: {{ VerifyObj.chain }}</span>
                  <br />
                  <span>{{$t('common.txid')}}: {{ VerifyObj.txid }}</span>
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
      inject: ["reload"],
      // 输入的邮箱的值
      input: "",
      RegisterType: "student",
      // 注册对话框是否可见
      dialogVisible: false,
      aboutDialogVisible: false,
      // 验证对话框是否可见
      dialog2Visible: false,
      // 验证对话框验证结果是否加载
      dialogLoading: false,
      step: 1,
      // 总共的数据
      total: 0,
      // 当前页
      currentPage: 1,
      // 一页显示多少条数据
      limit: 10,
      tableData: [],
      tableVisible: false,
      tableLoading: false,
      VerifyResult: [],
      VerifyObj: {},
      tableLabel: [
        { label: this.$t('common.title'), prop: "certificate_title" },
        { label: this.$t('common.student'), prop: "student_name" },
        { label: this.$t('common.email'), prop: "email" },
        { label: this.$t('common.school'), prop: "school_name" },
        { label: this.$t('common.chain'), prop: "chain"},
        { label: this.$t('common.time'), prop: "create_time" },
      ],
      prevRoute: null
    };
  },
  // beforeRouteEnter(to, from, next) {
  // next(vm => {
  //   vm.prevRoute = from.fullPath
  // })
// },
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
        if(sessionStorage.getItem('USER-TYPE')==="school"){
          return [
            { name: this.$t('common.home'), path: "/home" },
            { name: this.$t('common.issueList'), path: "/schools/issueList"}
          ]
        }else if(sessionStorage.getItem('USER-TYPE')==="student"){
          return [
            { name: this.$t('common.home'), path: "/home" },
            { name: this.$t('common.certificates'), path: "/students/certificates"}
          ]
        }
        else{
          return []
        }
      } else {
        console.log("未登录");
        return [];
      }
    }},
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
    // 获取证书列表
    seachCert() {
      // 邮箱的正则表达式
      let regEmail= /^\w+((.\w+)|(-\w+))@[A-Za-z0-9]+((.|-)[A-Za-z0-9]+).[A-Za-z0-9]+$/
      // 验证邮箱是否为正确的格式
      if (!regEmail.test(this.input)) {
        this.$message.error(this.$t('home.index.emailFormat'));
        return false;
        }
      console.log("get verify certs list");
      let params = {
        offset: this.currentPage - 1,
        limit: this.limit,
        email: this.input,
        status: 1
      };
      // 数据在请求前, 表格可见, 并且处于加载状态
      this.tableVisible = true;
      this.tableLoading = true;
      verifyCertList(params)
        .then(res => {
          this.tableData = res.data.results;
          this.total = res.data.count;
          // 数据请求成功后, 表格不处于加载状态
          this.tableLoading = false;
        })
        .catch(error => {
          console.log(error);
          this.tableLoading = false;
          this.tableVisible = false;
          this.$message.error(this.$t('home.index.getVerifyListFail'));
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
      // 点击按钮后，按钮禁用
      event.srcElement.parentNode.disabled = true
      this.VerifyObj = row;
      this.dialog2Visible = true;
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
            this.VerifyResult[i].step = this.$t('home.index.step', {num: i + 1});
            this.VerifyResult[i].name = this.$t('home.index.step'+(i+1))
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
            // 验证通过, 更改按钮样式
            // event.srcElement.parentNode.style.backgroundColor = "#67c23a"
            // event.srcElement.style.backgroundColor = "#67c23a"
            event.srcElement.className = "el-button el-button--success el-button--mini"
            event.srcElement.innerText = this.$t('home.index.verifyPass')
          }
          else{
            event.srcElement.parentNode.style.backgroundColor = "#f56c6c"
            event.srcElement.innerText = this.$t('home.index.verifyFail')
          }
        })
        .catch(error => {
          console.log(error);
          this.dialogLoading = false;
          this.VerifyResult = [{step:this.$t('home.index.requestVerifyFail.step'), status: "error", name:this.$i18n.t('home.index.requestVerifyFail.name')}]
          this.step = 0;
          // event.srcElement.parentNode.style.backgroundColor = "#f56c6c"
          // event.srcElement.style.backgroundColor = "#f56c6c"
          event.srcElement.className = "el-button el-button--danger el-button--mini"
          event.srcElement.innerText = this.$t('home.index.verifyFail')
        });
    },
    logUserOut(){
      this.$confirm(this.$t('common.logOutDialogMessage'), this.$t('common.logout'), {
          confirmButtonText: this.$t('common.confirm'),
          cancelButtonText: this.$t('common.cancel'),
          type: 'info'
        }).then(() => {
          sessionStorage.removeItem("API-HTTP-AUTHORIZATION");
          // sessionStorage.removeItem("SCHOOL-INFO");
          // sessionStorage.removeItem("STUDENT-INFO");
          sessionStorage.removeItem('USER-TYPE');
          sessionStorage.clear()
          location.reload();
          this.$message({
            type: "info",
            message: this.$t('common.logOutSuccess')
          });
        })
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
