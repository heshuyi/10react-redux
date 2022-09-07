import { GET_DATA, CLEAR_DATA } from './actionTypes';

let list = {
  name: 123,
  age: 456,
  lang: 'java',
  birthday: '10-10-10'
};
export default (state = list, action) => {
  switch (action.type) {
    case `${GET_DATA}_FULFILLED`: {
      return {
        ...state,
        data: action.payload,
      };
    }
    case `${CLEAR_DATA}`: {
      return {
        ...state,
        data: {},
      };
    }
    default:
      return state;
  }
};
