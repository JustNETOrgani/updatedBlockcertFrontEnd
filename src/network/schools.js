import {request} from './request'

export function Schlogin(data) {
  return request({
    url: '/v1/api/school/login',
    method: 'post',
    data: data
  });
}

export function register(data) {
  return request({
    url:'/v1/api/school/register',
    method: 'post',
    data: data
  });
}
