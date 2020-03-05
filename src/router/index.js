import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

// 懒加载
const Home = () => import("@/pages/home");
const Login = () => import("@/pages/Login.vue")
const StudentSign = () => import("@/pages/students/Sign.vue");

const router = {
  routes: [
    {
      path: "/",
      redirect: "/home"
    },
    {
      path: "/home",
      name: "home",
      component: Home
    },
    {
      path: "/login",
      name: "login",
      component: Login
    },
    {
      path: "/sign",
      name: "sign",
      component: StudentSign
    }
  ],
  mode: "history"
}

export default new Router(router);
