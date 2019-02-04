import axios from 'axios'
const baseUrl = 'https://restcountries.eu/rest/v2'

const getAll = () => {
    const request = axios.get(`${baseUrl}/all`)
    return request.then(res => res.data)
}

export default {getAll}