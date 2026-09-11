import axiosInstance from '.';

// Presigned URL 생성하기
export const getPresignedUrl = async (s3_url: string) => {
  const response = await axiosInstance.post('s3/presigned-url/manage', { S3_url: s3_url });
  return response.data.presigned_url;
};