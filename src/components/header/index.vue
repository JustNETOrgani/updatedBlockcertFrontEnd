<template>
  <div class="header">
    <img class="logo" src="../../assets/img/logo.png" />
    <div class="menu">
      <li v-for="v in menuList" :key="v.name">
        <router-link class="menu-item" :to="v.path">{{ v.name }}</router-link>
      </li>
      <slot></slot>
      <el-dropdown class="menu-item" trigger="click" style="top: 20px">
          <span class="el-dropdown-link">
            {{$i18n.locale == 'zh' ? '中文': 'English'}}<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item @click.native="toggleLang('zh')" :disabled="$i18n.locale == 'zh'">中文</el-dropdown-item>
        <el-dropdown-item @click.native="toggleLang('en')" :disabled="$i18n.locale == 'en'">English</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    </div>
  </div>
</template>

<script>
export default {
  name: "Head",
  props: ["menuList"],
  methods: {
    toggleLang(lang) {
      if(lang == 'zh'){
        localStorage.setItem('locale', 'zh')
        this.$i18n.locale = localStorage.getItem('locale')
        this.$message({
          message: '切换为中文！',
          type: 'success'
        })
      } else if (lang == 'en') {
        localStorage.setItem('locale', 'en')
        this.$i18n.locale = localStorage.getItem('locale')
        this.$message({
          message: 'Switch to English!',
          type: 'success'
      })
}
  }
}}
</script>

<style scoped>
.header {
  height: 4rem;
  padding: 0.5rem 1rem;
  display: flex;
  background-color: #ffffff;
}
.logo {
  height: 3rem;
}

.menu {
  flex: 1;
  display: flex;
  /* align-items: center; */
  justify-content: flex-end;
}

.menu-item {
  text-decoration: none;
  color: #60bdfa;
  margin: 0 0.5rem;
}

li {
  list-style: none;
  font-size: 20px;
  padding-top: 1.3rem;
}
.router-link-active{
  color: #477ea3;
  text-decoration:underline
}
</style>
