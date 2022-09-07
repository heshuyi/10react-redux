let list = {
  list: [{
    name: 123,
    age: 456,
    lang: 'java',
    birthday: '10-10-10'
  }]
};
export default (state = list, action) => {
  switch (action.type) {
    case 'UP_DATA': {
      return {
        ...state,
        list: [...action.payload]
      };
    }
    case '_FULFILLED': {
      return {
        ...state,
        list: [...action.payload]
      };
    }
    default:
      return state;
  }
};
