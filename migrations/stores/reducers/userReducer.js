const initialState = {
  accessToken: null,
  refreshToken: null,
  userSpotify: {
    loading: false,
    country: null,
    display_name: null,
    email: null,
    external_urls: {},
    followers: {},
    href: null,
    id: null,
    images: [],
    product: null,
    type: null,
    uri: null,
  },
  user: {
    validator: '',
    password: ''
  }
}

const userReducers = (state=initialState, action) => {
  switch(action.type){
    case 'GET_USER_SPOTIFY':
      return {...state, [state.userSpotify]: action.payload }
    case 'LOGIN_USER':
      return {...state, [state.user]: action.payload}
    default: 
      return state
  }
}
export default userReducers