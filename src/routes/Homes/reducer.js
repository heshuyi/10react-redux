let list = {
  list: [
    {
      key: 'java',
      text: 'JAVA'
    },
    {
      key: 'javascript',
      text: 'JAVASCRIPT'
    },
    {
      key: 'c++',
      text: 'C++'
    },
    {
      key: 'python',
      text: 'PYTHON'
    }
  ]
};
export default (state = list, action) => {
  console.log(action);
  switch (action.type) {
    case 'UP_DATA': {
      return {
        ...state,
        list: action.payload
      };
    }
    case 'UP_DATA_FULFILLED': {
      return {
        ...state,
        list: action.payload
      };
    }
    default:
      return state;
  }
};
