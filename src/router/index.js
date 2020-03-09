import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

// 懒加载
const Home = () => import("@/pages/home");
const Login = () => import("@/pages/Login.vue");
const StudentSign = () => import("@/pages/students/Sign.vue");
const certificate = () => import("@/pages/students/Certificate.vue");
const SchoolSign = () => import("@/pages/schools/Sign.vue");

const router = new Router({
  routes: [
    {
      path: "/",
      redirect: "/home",
      meta: {
        requireAuth: false
      }
    },
    {
      path: "/home",
      name: "home",
      component: Home,
      meta: {
        requireAuth: false
      }
    },
    {
      path: "/login",
      name: "login",
      component: Login,
      meta: {
        requireAuth: false
      }
    },
    {
      path: "/studentSign",
      name: "studentSign",
      component: StudentSign,
      meta: {
        requireAuth: false
      }
    },
    {
      path: "/schoolSign",
      name: "schoolSign",
      component: SchoolSign,
      meta: {
        requireAuth: false
      }
    },
    {
      path: "/certificates",
      name: "certificates",
      component: certificate,
      meta: {
        requireAuth: true
      }
    }
  ],
  mode: "history"
});

// 配置路由权限
router.beforeEach((to, from, next) => {
  let auth_token = sessionStorage.getItem("API-HTTP-AUTHORIZATION");

  if (to.fullPath === "/login") {
    if (auth_token) {
      next({
        path: from.fullPath
      });
    } else {
      next();
    }
  }
else {
    if (to.meta.requireAuth) {
      // 判断该路由是否需要登录权限
      if (auth_token) {
        // 判断本地是否存在access_token
        next();
      } else {
        // 未登录,跳转到登陆页面，并且带上 将要去的地址，方便登陆后跳转。
        next("/login");
      }
    } else {
      next();
    }
  }
});

export default router;
