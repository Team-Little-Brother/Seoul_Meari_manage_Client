import axios from 'axios';

// const API_BASE_URL = 'http://ec2-13-57-38-28.us-west-1.compute.amazonaws.com'; // TODO: .env 파일로 분리하는 것이 좋습니다.
const API_BASE_URL = '/api';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10초 타임아웃
});

// 요청 인터셉터: 모든 요청 전에 실행됩니다.
axiosInstance.interceptors.request.use(
  (config) => {
    // 예: 로컬 스토리지에서 토큰을 가져와 헤더에 추가
    // const token = localStorage.getItem('accessToken');
    // if (token) {
    //   config.headers['Authorization'] = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// 응답 인터셉터: 모든 응답을 받은 후 실행됩니다.
axiosInstance.interceptors.response.use(
  (response) => {
    // 성공적인 응답은 그대로 반환
    return response;
  },
  (error) => {
    // 서버 응답 에러 처리
    console.error('API Response Error:', error.response || error.message);
    // 예: 401 Unauthorized 에러 시 로그인 페이지로 리디렉션
    // if (error.response && error.response.status === 401) {
    //   window.location.href = '/login';
    // }
    return Promise.reject(error);
  }
);

export default axiosInstance;
export * from './dashboardAPI';
export * from './complaintsAPI';
export * from './echoAPI';