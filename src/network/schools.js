import {request} from './request'
import {fileRequest} from './request'

export function Schlogin(data) {
  return request({
    url: '/v1/api/schools/login',
    method: 'post',
    data: data
  });
}
export function getSigImageDetails(data) {
  return fileRequest({
    url: '/v1/api/files/',
    method: 'post',
    data: data
  });
}

export function getSchLogoDetails(data) {
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
    data: data
  });
}
