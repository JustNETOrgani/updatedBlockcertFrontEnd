import {request} from './request' 
import {fileRequest} from './request' 
import {certRequest} from './request'

export function login(data) {
  return request({
    url: '/v1/api/students/login',
    method: 'post',
    data: data
  });
}

export function register(data) {
  return request({
    url:'/v1/api/students/register',
    method: 'post',
    data: data
  });
}

export async function getCertFileDetails(data) { 
  return fileRequest({
    url: '/v1/api/files/',
    method: 'post',
    data: data
  });
}

export function getCertificates(params) {
  return certRequest({
    url:'/v1/api/certificates/',
    method: 'get',
    params: params
  });
}

export async function viewCertDetails(certID) {
  console.log("Getting cert details from: ", 'http://127.0.0.1:8000/v1/api/certificates/'+certID+'/detail') 
  return certRequest({
    url: '/v1/api/certificates/'+certID+'/detail/',
    method: 'get', 
  });
}

export function studentCertCreateRequest(data) {
  return certRequest({
    url:'/v1/api/certificates/',
    method: 'post',
    data: data
  });
}

export function getSchools() {
  return certRequest({
    url:'/v1/api/schools/',
    method: 'get',
  });
}
