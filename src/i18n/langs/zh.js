import zhLocale from "element-ui/lib/locale/lang/zh-CN";
const zh = {
  common: {
    login: "登录",
    register: "注册",
    student: "学生",
    school: "学校",
    confirm: "确定",
    cancel: "取消",
    logout: "退出",
    logOutDialogMessage: "您确定要退出吗？",
    logOutSuccess: "退出成功",
    view: "查看",
    title: "标题",
    email: "邮箱",
    chain: "区块链",
    time: "时间",
    operation: "操作",
    txid: "交易哈希",
    home: "首页",
    certificates: "我的证书"
  },
  home: {
    index: {
      page: "证书查看",
      placeholder: "请输入学生邮箱...",
      dialogTitleUserType: "请选择注册用户类型",
      dialogTitleVerify: "验证结果",
      emailFormat: "请输入正确的邮箱格式",
      getVerifyListFail: "获取证书列表失败, 请稍后重试",
      step: "步骤 {num}",
      step1: "检查证书未被篡改",
      step2: "检查证书未过期",
      step3: "检查证书未被发行人撤销",
      step4: "检查证书真伪",
      step5: "验证是否通过",
      verifyFail: "失败",
      verifyPass: "通过",
      verify: "验证",
      requestVerifyFail: {
        step: "步骤 1",
        name: "验证是否通过"
      }
    }
  },
  login: {
    usernamePlaceHolder: "请填写您的用户名",
    passwordPlaceHolder: "请填写您的密码",
    username: "用户名",
    password: "密码",
    role: "角色: ",
    usernameMessage: "请输入用户名",
    usernameFormat: "长度不能小于2",
    passwordMessage: "请输入密码",
    passwordFormat: "长度不能小于6",
    loginSuccess: "恭喜您, 登录成功",
    loginFail: "账号或密码错误, 请输入正确的账号和密码"
  },
  ...zhLocale
};

export default zh;
