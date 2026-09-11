import axiosInstance from '.';

// AR 메아리 목록 가져오기
export const getEchoList = async (params?: { page?: number; limit?: number; search?: string }) => {
  const response = await axiosInstance.get('/echo/echo-list', { params });
  return response.data;
};

// 특정 AR 메아리 정보 가져오기
export const getEchoById = async (id: string) => {
    const response = await axiosInstance.get(`/echo/echo-list/${id}`);
    return response.data;
};

// AR 메아리 삭제하기
export const deleteEcho = async (id: string) => {
    const response = await axiosInstance.delete(`/echo/echo-list/${id}`);
    return response.data;
};
