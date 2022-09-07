import { message } from '@wind/wind-ui';
import { GET_DATA, CLEAR_DATA } from './actionTypes';
import intl from '../../utils/intl';

export const getData = () => ({
  type: GET_DATA,
  payload: fetch(' http://localhost:9090/lists', {
    method: 'get',
    headers: {
      'Content-Type': 'application/json',
    },
  }).then((response) => {
    if (!response.ok) {
      message.error(intl('22827'/* 加载失败（本消息只在Debug情况下有）！ */));
      // throw new Error('Fail to get response with status ' + response.status);
    }
    return response.json().then(responseJson => responseJson);
  }),
});

export const clearData = () => ({
  type: CLEAR_DATA,
  payload: null,
});
