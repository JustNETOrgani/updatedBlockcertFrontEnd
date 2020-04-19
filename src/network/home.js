import {request} from './request' 

export function verifyCertList(params) {
    return request({
      url: '/v1/api/certificate/verify_list/',
      method: 'get',
      params: params
    });
  }

  export function verifyCert(data) {
    return request({
      url: '/v1/api/certificate/verify',
      method: 'post',
      data: data
    });
  }