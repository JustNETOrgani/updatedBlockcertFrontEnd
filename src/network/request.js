import axios from "axios";
// axios 使用文档 https://github.com/axios/axios
// import store from "@/store/index"


export function request(config) {
  const instance = new axios.create({
    baseURL: "http://127.0.0.1:8000",
    timeout: 5000
  });

  // 请求拦截器
  instance.interceptors.request.use(
    config => {
      // TODO 设置请求头
      // config.headers["API-HTTP-AUTHORIZATION"] = sessionStorage.getItem('API-HTTP-AUTHORIZATION');
      return config;
    },
    err => {
      console.log(err);
    }
  );

  // 响应拦截器
  instance.interceptors.response.use(
    res => {
      // console.log("拦截后需要将拦截下来处理成的结果返回res", res);
      // 拦截后需要将拦截下来处理成的结果返回
      return res.data;
    },
    err => {
      // console.log("拦截后需要将拦截下来处理成的结果返回", err);
      console.log(err);
    }
  );

  return instance(config);
}
