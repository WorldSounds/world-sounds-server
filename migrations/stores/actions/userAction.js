import axios from '../../config/axiosInstance'

const setUser = (user) => {
  return {
    type: 'LOGIN_USER',
    payload: user
  }
}

export function setUserData(payload) {
  return async (dispatch) => {
    try{
      const user = await axios({
        method: 'post',
        url: '/login',
        data: {
          validator: payload.validator,
          password: payload.password
        }
      })
      dispatch(setUser(user))
    }
    catch(err) {
      console.log(err) 
    }
  }
}
export function register(payload) {
  return async (dispatch) => {
    try {
      const newUser = await axios({
        url: '/register',
        method: 'post',
        data: {
          email: payload.email,
          username: payload.username,
          password: payload.password
        }
      })
    }
    catch(err) {
      console.log(err)
    }
  }
}