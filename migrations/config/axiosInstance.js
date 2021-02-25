import axios from 'axios'

const instance = axios.create({
  baseURL: 'http://localhost:6300'
})

export default instance