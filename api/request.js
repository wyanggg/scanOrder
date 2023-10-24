const baseURL = "http://ordershop.api.qzpfslc.cn"
export default function Request(options) {
    return new Promise((resolve, reject) => {
        const token = uni.getStorageSync("token")
        var header = {}
        if (options.header == "json") {
            header = {
                token: token,
                "content-type": "application/json",
            }
        } else if (options.header == "notoken") {
            header = {
                "content-type": "application/x-www-form-urlencoded",
            }
        } else {
            header = {
                token: token,
                "content-type": "application/x-www-form-urlencoded",
                type: "1",
            }
        }

        uni.request({
            url: baseURL + options.url,
            data: options.data,
            header: header,
            method: options.method,
            success: (res) => {
                if (res.statusCode == 400) {
                    uni.reLaunch({
                        url: '/pages/login/login'
                    });
                    // 未登录 调用登录
                    return
                }
                if (res.data.code == 200) {
                    resolve(res.data)
                } else {
                    reject(res)
                    uni.showToast({
                        title: res.data.msg.length > 30 ? "系统错误" : res.data.msg,
                        duration: 800,
                        icon: "none",
                    })
                }
            },
            fail: (err) => {
                uni.showToast({
                    title: "请求失败",
                    duration: 2000,
                })
                reject(err)
            },
        })
    })
}

