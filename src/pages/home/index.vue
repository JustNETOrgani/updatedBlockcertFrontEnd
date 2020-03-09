<template>
  <div class="container">
    <Head :menuList="menuList">
      <div v-if="needLogin">
        <el-button class="menu-item" type="primary" @click="LoginURL" round
          >Login</el-button
        >
        <el-button class="menu-item" type="primary text" round @click="dialogVisible = true">Register</el-button>
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
      <h1 class="title">Blockerts Universal View</h1>
      <div class="input-container">
        <el-input placeholder="Input Student ID..." v-model="input">
          <template slot="append">
            <div class="text">View</div>
          </template>
        </el-input>
      </div>
    </div>
    <Footer></Footer>
  </div>
</template>

<script>
import Head from "@/components/header";
import Footer from "@/components/Footer.vue";

export default {
  name: "home",
  data() {
    return {
      input: "",
      RegisterType: "student",
      dialogVisible: false
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
    RegisterTypeChoose(){
      this.dialogVisible = false;
      if(this.RegisterType === "student"){
        this.$router.push("/studentRegister");
      }
      if(this.RegisterType === "school"){
        this.$router.push("/schoolRegister");
      }
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
