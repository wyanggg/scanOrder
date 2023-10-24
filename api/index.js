import Request from "./request";
/**
 * 分类
 * @param {*} data 
 * @returns 
 */
export const getCategory = (data) => Request({
    url: "/api/home/categories",
    data,
    method: "get",
})

export const getMsg = (data) => Request({
    url: "/api/notice/list",
    data,
    method: "get",
})

export const getSwiper = (data) => Request({
    url: "/api/home/banners",
    data,
    method: "get",
})


export const getProducts = (data) => Request({
    url: "/api/home/products",
    data,
    method: "get",
})

export const getUserInfo = (data) => Request({
    url: "/api/user/my",
    data,
    method: "get",
})

