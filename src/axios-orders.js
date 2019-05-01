import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://react-burger-34103.firebaseio.com/',
});

export default instance;
