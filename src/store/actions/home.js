import { ADD, GET_HOME_INFO } from '../constants'

// Action Creater
export const add = (count) =>
  ({
    type: ADD,
    count,
  })

// redux-thunk 异步请求
export const getHomeInfo = (sendId = 1) => {
  // 返回一个function 类型的 action，
  return async (dispatch, getState) => {
    // 获取全局state
    const state = getState();

    let {id} = state.HomeReducer.homeInfo;
    if (id === sendId) {
      return
    }

    //上面的return是通过对请求id和已有数据的标识性id进行对比校验，避免重复获取数据。
    await new Promise(resolve => {
      let homeInfo = {
        name: 'wd2010',
        age: '25',
        id: sendId,
      }
      // 调用 setTimeout 模拟异步请求
      setTimeout(() => resolve(homeInfo), 1000)
    }).then(homeInfo => {
      dispatch({
        type: GET_HOME_INFO,
        data: {
          homeInfo,
        }
      })
    })
  }
}
