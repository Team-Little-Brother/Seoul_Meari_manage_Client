import axiosInstance from '.';

// 민원 목록 가져오기
export const getComplaintsList = async () => {
  const response = await axiosInstance.get('/complaints/complaints-list');
  return response.data;
};

// 특정 민원 정보 가져오기
export const getComplaintById = async (id: string) => {
  const response = await axiosInstance.get(`/complaints/complaints-list/${id}`);
  return response.data;
};

export const resolveComplaint = async (id: string) => {
  const response = await axiosInstance.patch(`/complaints/complaints-list/${id}/resolve`);
  return response.data;
};
