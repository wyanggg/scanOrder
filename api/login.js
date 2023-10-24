import Request from "./request"
// 登录
export function loginAPI(data) {
  return Request({
    url: "/api/user/login",
    data,
    method: "get",
  })
}
// 注册
export function registerAPI(data) {
  return Request({
    url: "/api/user/register",
    data,
    method: "get",
  })
}
// 重置密码
export function resetPwdAPI(data) {
  return Request({
    url: "/api/user/resetPwd",
    data,
    method: "get",
  })
}
// 重置支付密码
export function setPaymentPasswordAPI(data) {
  return Request({
    url: "/api/user/setPaymentPassword",
    data,
    method: "get",
  })
}
// 发送验证码
export function sendCodeAPI(data) {
  return Request({
    url: "/api/sms/send",
    data,
    method: "get",
  })
}
// 个人信息
export function userInfoAPI(data) {
  return Request({
    url: "/api/user/my",
    data,
    method: "get",
  })
}

// gtfyInfo
export function gtfyInfoAPI(data) {
  return Request({
    url: "/api/user/queryAddressAll",
    data,
    method: "get",
  })
}

export const wxLogin = (data) => {
  return Request({
    url: "/api/user/weChatLogin",
    data,
    method: "get",
  })
}
