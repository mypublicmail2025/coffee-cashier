/*
 * 发送请求 mixin
 */
import { ref } from 'vue';
import request from './server'

export default function () {
  const loading = ref(false)
  /*
  * 发送请求
  */
  function sendReq (params, callback, errorCallback) {
    request({
      method: params.method || 'POST',
      url: params.url,
      data: params.data || {},
      withCredentials: true,
      headers: {
        'Content-type':
          params.contentType || 'application/json;charset=utf-8',
      },
    })
      .then((res) => {
        if (res && res.data) {
          callback && callback(res.data)
        }
      })
      .catch((err) => {
        if (err) {
          errorCallback && errorCallback(err)
        }
      })
  }
  return {
    loading,
    sendReq
  }
}
