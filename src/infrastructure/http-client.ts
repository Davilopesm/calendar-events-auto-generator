import axios from 'axios';

const httpClient = axios.create({});

httpClient.interceptors.request.use(request => {
  console.info(`Starting request to ${request.url}`);
  return request;
})

httpClient.interceptors.response.use(response => {
  console.info(`Finished request to ${response.config.url} with status ${response?.status}`);
  return response;
}, async error => {
  console.error(`Finished request to ${JSON.stringify(error.config.url)} with error ${JSON.stringify(error?.response?.status)}`);
  throw error;
});

export default httpClient;
