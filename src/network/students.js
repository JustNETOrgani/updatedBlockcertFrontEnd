import {request} from './request'

export function login(data) {
  return request({
    url: '/v1/api/student/login',
    method: 'post',
    data: data
  });
}

export function register(data) {
  return request({
    url:'/v1/api/student/register',
    method: 'post',
    data: data
  });
}
