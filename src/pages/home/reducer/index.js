import { ADD, GET_HOME_INFO } from '../../../store/constants';

// reducer 数组
const ACTION_HANDLERS = {
  [ADD]: (state, action) => Object.assign({}, state, { count: action.count }),
  [GET_HOME_INFO]: (state, action) => Object.assign({}, state, action.data)
};

const initialState = {
  count: 33,
  homeInfo: { name: '', age: '', id: '' }
}

export const HomeReducer = function(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]
  return handler ? handler(state, action) : state
}
