import { ADD_COUNTER } from './constant'

export const add_counter = (num) => ({
  type: ADD_COUNTER,
  payload: num
})