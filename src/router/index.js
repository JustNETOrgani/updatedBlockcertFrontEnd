import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

// 懒加载
const Home = () => import("@/pages/home");
const Login = () => import("@/pages/login");
const Sign = () => import("@/pages/sign");

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
      component: Sign
    }
  ],
  mode: "history"
}

export default new Router(router);
