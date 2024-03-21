import { ADD_COUNTER } from './constant'
// 设置默认值
const initialState = {
  counter: 0
}

const reducer = (state = initialState, action) => {
  const { type, payload } = action
  console.log(type, payload, "action")

  switch(type) {
    case ADD_COUNTER: 
      return { ...state, counter: state.counter + payload };
    default:
      return state
  }
}

export default reducer