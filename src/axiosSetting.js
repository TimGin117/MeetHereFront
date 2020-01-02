import axios from "axios";
import qs from "qs";

axios.defaults.baseURL = "http://localhost:3000";
axios.defaults.timeout = 10000;
axios.defaults.headers.post["Content-Type"] =
  "application/x-www-form-urlencoded";

//不便引入context，使用sessionStorage
axios.interceptors.request.use(
  config => {
    const token = window.sessionStorage.getItem("token");
    token && (config.headers.user_token = token);
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

//拦截response并进行result的错误处理，返回result.data
axios.interceptors.response.use(
  response => {
    console.log(response);
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
    console.log(error);
    return null;
  }
};
const post = async (url, data) => {
  try {
    let response = await axios.post(url, qs.stringify(data));
    return response.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const postJSON = async (url, data) => {
  try {
    let response = await axios.post(url, data, {
      headers: { "Content-Type": "application/json" }
    });
    return response.data;
  } catch (error) {
    console.log(error);
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
    console.log(error);
    return null;
  }
};

export { get, post, postJSON, upload, axios };
