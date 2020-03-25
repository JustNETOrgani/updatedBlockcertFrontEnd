<template>
  <div class="issue">
    <Head :menuList="menuList">
      <el-button class="menu-item" type="primary" round @click="LoginOut"
        >Login out</el-button
      >
    </Head>
    <div class="body">
      <h1 class="title">issue List</h1>
    </div>
    <Footer></Footer>
  </div>
</template>

<script>
import Head from "@/components/header";

export default {
  name: "issue",
  data() {
    return {
      menuList: [
        { name: "Home", path: "/home" },
        { name: "issue", path: "/schools/issueList" }
      ]
    };
  },
  components: {
    Head
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
}
.menu-item {
  text-decoration: none;
  color: #ffffff;
  margin: 0.6rem 0.5rem;
}
</style>
