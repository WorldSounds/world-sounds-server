import { createStore, applyMiddleware, combineReducers } from 'redux'
import userReducer from './reducers/userReducer'
import playlistReducers from './reducers/playlistReducer'
import thunk from 'redux-thunk'

const reducers = combineReducers({
  userReducer,
  playlistReducers
})
const store = createStore(reducers, applyMiddleware(thunk))

export default store