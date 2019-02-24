import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const setToken = newToken => {
  token = `bearer ${newToken}`
}

const create = async newObj => {
  const conf = {
    headers: { Authorization: token }
  }
  const res = await axios.post(baseUrl, newObj, conf)
  return res.data
}

const update = async updatedObj => {
  const res = await axios.put(`${baseUrl}/${updatedObj.id}`, updatedObj)
  return res.data
}

const deleteBlog = async id => {
  const conf = {
    headers: { Authorization: token }
  }
  const res = await axios.delete(`${baseUrl}/${id}`, conf)
  return res.data
}

export default { getAll, setToken, create, update, deleteBlog }