import {request} from './request'
import {fileRequest} from './request'

export function Schlogin(data) {
  return request({
    url: '/v1/api/school/login',
    method: 'post',
    data: data
  });
}

export async function getSigImageDetails(data) {
  return fileRequest({
    url: '/v1/api/files/',
    method: 'post',
    data: data
  });
}

export async function getSchLogoDetails(data) {
  return fileRequest({
    url: '/v1/api/files/',
    method: 'post',
    data: data
  });
}

export function register(data) {
  console.log("Data for registration: ", data)
  return request({
    url:'/v1/api/schools/register',
    method: 'post',
    timeout: 30000,
    data: data
  });
}
