import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

// 懒加载
const Home = () => import("@/pages/home");
const Login = () => import("@/pages/Login.vue");
const StudentSign = () => import("@/pages/students/Sign.vue");
const certificate = () => import("@/pages/students/Certificate.vue");

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
      path: "/sign",
      name: "sign",
      component: StudentSign,
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
      },
      beforeRouteUpdate(to, from, next) {
        // 在当前路由改变，但是该组件被复用时调用
        // 举例来说，对于一个带有动态参数的路径 /foo/:id，在 /foo/1 和 /foo/2 之间跳转的时候，
        // 由于会渲染同样的 Foo 组件，因此组件实例会被复用。而这个钩子就会在这个情况下被调用。
        // 可以访问组件实例 `this`
        console.log("to.fullPath", to.fullPath);
        if (to.fullPath === "/loginOut") {
          this.$store.commit("del_token");
          console.log("退出登录了");
          next("/home");
        }
        console.log("没有进去退出登录了");
        next();
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
  else if(to.fullPath === "/loginOut"){
    sessionStorage.removeItem("STUDENT-INFO");
    sessionStorage.removeItem("API-HTTP-AUTHORIZATION");
    next("/home")
  } else {
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
