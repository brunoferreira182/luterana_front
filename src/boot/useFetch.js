import axios from 'axios'
import { LocalStorage, Loading, Notify } from 'quasar'
import CryptoJS from 'crypto-js'
import { masterServerRoute } from './masterServerRoutes.js'
import { PROJECT_NAME, MODE_APP_SERVER, DEFAULT_SERVER_NAME, COMPANY_ID, MODE_SERVER } from './variables.js'

const useFetch = async ({
  project,
  serverName,
  mode,
  method,
  route,
  body,
  destinationroute,
  destinationserver,
  files,
  destinationUrl,
}) => {
  // verifica se o body tem 'project'. Se não tiver, coloca o padrão do .env
  // isso é para não ter que colocar toda hora, somente quando for exceção
  if (!project) project = PROJECT_NAME;
  if (!mode) mode = MODE_APP_SERVER;
  if (!serverName) serverName = DEFAULT_SERVER_NAME;
  if (!method) method = "POST";
  const newBody = {
    project,
    serverName,
    mode,
    method,
    route,
    body,
  };
  const udCr = LocalStorage.getItem("u");
  let token;
  if (udCr) {
    const key = LocalStorage.getItem("$k");
    const ud = JSON.parse(
      CryptoJS.AES.decrypt(udCr, key).toString(CryptoJS.enc.Utf8)
    );
    token = ud.token + ":" + ud.userId;
  }
  if (token) {
    axios.defaults.headers.common["Authorization"] = token;
  }
  axios.defaults.headers.common["cid"] = COMPANY_ID;
  axios.defaults.headers.common["pid"] = 18;

  let routeMasterServer = masterServerRoute();
  let bodyToSend = newBody;
  /// ANEXOS ///////////////////////////////////////
  let form;
  if (files && files.length > 0) {
    newBody.destinationserver = destinationserver
    newBody.destinationroute = destinationroute
    form = new FormData();
    form.append("body", JSON.stringify(newBody));
    files.forEach(f => {
      const fileName = f.file.name ? f.file.name : 'userFile.png';
      console.log(f.file.type, 'fffff')
      const blob = new Blob([f.file], { type: f.file.type });
      console.log([f.file], 'f.file')
      form.append('file', blob, fileName);
    });
    bodyToSend = form;
    console.log(bodyToSend, 'PODKASOPKD')
  }
  //////////////////////////////////////////////////

  if (destinationUrl) routeMasterServer = destinationUrl;

  /////// tirando do master server
  if (MODE_SERVER !== 'master') routeMasterServer += route

  let ret;
  try {
    ret = method === 'POST' ? await axios.post(routeMasterServer, bodyToSend) : await axios.get(routeMasterServer, bodyToSend)
    // console.log(ret, 'aqui')
  } catch (e) {
    
    Loading.hide();
    console.log("AQUI ERRO CATCH", e);
  }
  console.log("retorno fetch " + route, ret.data)
  Loading.hide();
  if (ret.data.error && ret.data.errorFetch)
    Notify.create(ret.data.errorFetch.message);
  
  else if (ret.data.error) {
    if (ret.data.errorMessage) Notify.create(ret.data.errorMessage);
    if (
      (ret.data.errorType === "tokenNonExistent" ||
        ret.data.errorType === "loginNonExistent" ||
        ret.data.errorType === "inactiveUser" ||
        ret.data.errorType === "userNotActiveInCompany" ||
        ret.data.errorType === "companyNotActive" ||
        ret.data.errorType === "productCompanyNotActive") &&
      route !== "/getKey"
    ) {
      Notify.create("Token expirada. Refaça o login");
      return;
    }
    return ret.data;
  } else return ret.data;
};
export default useFetch;
