import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

// 懒加载
const Home = () => import("@/pages/home");
const Login = () => import("@/pages/Login.vue");
const StudentRegister = () => import("@/pages/students/Register.vue");
const certificate = () => import("@/pages/students/Certificate.vue");
const SchoolRegister = () => import("@/pages/schools/Register.vue");
const IssueList = () => import("@/pages/schools/IssueList.vue");
const cert_upload = () => import("@/pages/students/cert_upload.vue");
const certDetails = () => import("@/pages/students/certDetails.vue")
const schoolCertDetails = () => import("@/pages/schools/schoolCertDetails.vue")

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
      path: "/students/Register",
      name: "studentRegister",
      component: StudentRegister,
      meta: {
        requireAuth: false
      }
    },
    {
      path: "/schools/Register",
      name: "schoolRegister",
      component: SchoolRegister,
      meta: {
        requireAuth: false
      }
    },
    {
      path: "/students/certificates",
      name: "certificates",
      component: certificate,
      meta: {
        requireAuth: true
      }
    },
    {
      path: "/schools/IssueList",
      name: "IssueList",
      component: IssueList,
      meta: {
        requireAuth: true
      }
    },
    {
      path: "/students/cert_upload",
      name: "cert_upload",
      component: cert_upload,
      meta: {
        requireAuth: true
      }
    },
    {
      path: "/students/certDetails",
      name: "certDetails",
      component: certDetails,
      meta: {
        requireAuth: true
      }
    },
    {
      path: "/schools/schoolCertDetails",
      name: "schoolCertDetails",
      component: schoolCertDetails,
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
