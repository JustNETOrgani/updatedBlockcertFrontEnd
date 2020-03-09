<template>
  <div class="certificate">
    <Head :menuList="menuList">
      <el-button class="menu-item" type="primary" round @click="LoginOut"
        >Login out</el-button
      >
    </Head>
    <div class="body">
      <h1 class="title">Certificates List</h1>
    </div>
    <Footer></Footer>
  </div>
</template>

<script>
import Head from "@/components/header";

export default {
  name: "certificate",
  data() {
    return {
      menuList: [
        { name: "Home", path: "/home" },
        { name: "Certificates", path: "/certificates" }
      ]
    };
  },
  components: {
    Head
  },
  methods: {
    LoginOut() {
      this.$alert("Are you sure you want to quit?", "Login Out", {
        confirmButtonText: "confirm",
        callback: () => {
          sessionStorage.removeItem("STUDENT-INFO");
          sessionStorage.removeItem("API-HTTP-AUTHORIZATION");
          this.$router.push("/home");
          this.$message({
            type: "info",
            message: "Sign out successfully"
          });
        }
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
