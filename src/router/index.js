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
const schoolCertCreate = () => import("@/pages/schools/certCreate.vue")

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
        requireAuth: false,
        userType: "student"
      }
    },
    {
      path: "/schools/Register",
      name: "schoolRegister",
      component: SchoolRegister,
      meta: {
        requireAuth: false,
        userType: "school"
      }
    },
    {
      path: "/students/certificates",
      name: "certificates",
      component: certificate,
      meta: {
        requireAuth: true,
        userType: "student"
      }
    },
    {
      path: "/schools/IssueList",
      name: "IssueList",
      component: IssueList,
      meta: {
        requireAuth: true,
        userType: "school"
      }
    },
    {
      path: "/students/cert_upload",
      name: "cert_upload",
      component: cert_upload,
      meta: {
        requireAuth: true,
        userType: "student"
      }
    },
    {
      path: "/students/certDetails",
      name: "certDetails",
      component: certDetails,
      meta: {
        requireAuth: true,
        userType: "student"
      }
    },
    {
      path: "/schools/:certId/CertDetails",
      name: "schoolCertDetails",
      component: schoolCertDetails,
      meta: {
        requireAuth: true,
        userType: "school"
      }
    },
    {
      path: "/schools/certCreate",
      name: "schoolCertCreate",
      component: schoolCertCreate,
      meta: {
        requireAuth: true,
        userType: "school"
      }
    }
  ],

  mode: "history"
});

// 配置路由权限
router.beforeEach((to, from, next) => {
  let auth_token = sessionStorage.getItem("API-HTTP-AUTHORIZATION");
  let user_type = sessionStorage.getItem("USER-TYPE");

  if (to.fullPath === "/login" || to.fullPath === "/students/Register" || to.fullPath === "/schools/Register") {
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
        if (to.meta.userType===user_type){
          next();
        }
        else {
          next("/login");
        }
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
