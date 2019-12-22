import axios from "axios";

axios.defaults.baseURL = "http://localhost:3000";
axios.defaults.timeout = 10000;

// const codeMessage = {
//   200: "服务器成功返回请求的数据。",
//   201: "新建或修改数据成功。",
//   202: "一个请求已经进入后台排队（异步任务）。",
//   204: "删除数据成功。",
//   400: "发出的请求有错误，服务器没有进行新建或修改数据的操作。",
//   401: "用户没有权限（令牌、用户名、密码错误）。",
//   403: "用户得到授权，但是访问是被禁止的。",
//   404: "发出的请求针对的是不存在的记录，服务器没有进行操作。",
//   406: "请求的格式不可得。",
//   410: "请求的资源被永久删除，且不会再得到的。",
//   422: "当创建一个对象时，发生一个验证错误。",
//   500: "服务器发生错误，请检查服务器。",
//   502: "网关错误。",
//   503: "服务不可用，服务器暂时过载或维护。",
//   504: "网关超时。"
// };

//不便引入context，使用sessionStorage
axios.interceptors.request.use(
  config => {
    const token = window.sessionStorage.getItem("token");
    token && (config.headers.user_token = token);
    return config;
  },
  error => {
    return Promise.error(error);
  }
);

//拦截response并进行result的错误处理，返回result.data
axios.interceptors.response.use(
  response => {
    if (response.status === 200) {
      if (response.data.code !== 0 && response.data.code !== 1001)
        window.alert(response.data.message);
      return Promise.resolve(response);
    } else {
      return Promise.reject(response);
    }
  },
  error => {
    if (error === undefined || error.code === "ECONNABORTED") {
      window.alert("服务请求超时");
    } else {
      window.alert(error);
    }
    return Promise.reject(error);
  }
);

//返回res={message:,data:,code:}
const get = async (url, data) => {
  try {
    let response = await axios.get(url, { params: data });
    return response.data;
  } catch (error) {
    return null;
  }
};
const post = async (url, data) => {
  try {
    let response = await axios.post(url, data);
    return response.data;
  } catch (error) {
    return null;
  }
};

const upload = async (url, data) => {
  try {
    let response = await axios.post(url, data, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    return response.data;
  } catch (error) {
    return null;
  }
};

export { get, post, upload };
