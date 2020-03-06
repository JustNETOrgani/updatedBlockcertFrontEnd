/* 是否邮箱 */
/* 其他验证器: https://www.cnblogs.com/luoxuemei/p/9295506.html */
export function validateEMail(rule, value,callback) {
    const reg =/^([a-zA-Z0-9]+[-_\.]?)+@[a-zA-Z0-9]+\.[a-z]+$/;
    if(value==''||value==undefined||value==null){
      callback();
    }else{
      if (!reg.test(value)){
        callback(new Error('请输入正确的邮箱地址'));
      } else {
        callback();
      }
    }
  }