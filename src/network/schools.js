import {request} from './request'
import {fileRequest} from './request'
import {certRequest} from './request'
import {certRevokeRequest} from './request'

export function Schlogin(data) {
  return request({
    url: '/v1/api/schools/login',
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

export function getSchCertificates() {
  console.log("Getting school certificates. Please wait...")
  return certRequest({
    url:'/v1/api/school_certificates',
    method: 'get'
  });
}

export async function viewCertDetails(certID) {
  console.log("Getting cert details from: ", 'http://127.0.0.1:8000/v1/api/school_certificates/'+certID+'/detail') 
  return certRequest({
    url: '/v1/api/school_certificates/'+certID+'/detail',
    method: 'get', 
  });
}

export async function createCertInterface(data,certID) {
  console.log("Creating cert using interface: ", 'http://127.0.0.1:8000/v1/api/school_certificates/'+certID+'/issue/') 
  return certRequest({
    url: '/v1/api/school_certificates/'+certID+'/issue/',
    method: 'post',
    data: data 
  });
}

export async function revokeCertificate(data,schPubKey) {
  console.log("Revoking cert using interface: ", 'http://127.0.0.1:8000/v1/api/schools/'+schPubKey+'/certificates/revocations/') 
  console.log("cert_id of Data being sent is: ", data["cert_id"])
  console.log("revocationReason of Data being sent is: ", data["revocationReason"])
  return certRevokeRequest({
    url: '/v1/api/schools/'+schPubKey+'/certificates/revocations/',
    method: 'post',
    data: data 
  });
}

