import axios from "axios";
//creating axios

let Url = "https://notifications-apiv3.onrender.com/notifications";
const ApiUrl = axios.create({
  baseURL: Url,
  timeout: 10000,
});

const savetoken = async (token) => {
  let resp = await ApiUrl.get(`/${token}`);
  return resp.data;
};


export {savetoken}
