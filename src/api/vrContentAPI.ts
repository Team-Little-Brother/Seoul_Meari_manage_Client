// api/bundles.ts
import axios from 'axios';
import axiosInstance from '.';
import { AssetBundle } from '@/features/vr-contents/types';

type PresignedUrlResponse = {
  uploadId: string;
  urls: Array<{ fileName: string; url: string }>;
};

/**
 * Presigned URL 생성 요청 (POST /api/bundles/initiate-upload)
 */
export async function getPresignedUrls(
  fileInfos: { fileName: string; fileType: string }[],
): Promise<PresignedUrlResponse> {
  try {
    const { data } = await axiosInstance.post<PresignedUrlResponse>(
      '/s3/presigned-urls/bundle',
      { files: fileInfos },
      { headers: { 'Content-Type': 'application/json' } },
    );
    return data;
  } catch (err) {
    const msg = (err as any)?.response?.data?.message ?? 'Presigned URL 생성에 실패했습니다.';
    throw new Error(msg);
  }
}

/**
 * Presigned URL로 S3 업로드
 * - 인스턴스 우회(axios 기본 객체): Authorization 등 불필요한 헤더 차단
 * - Content-Type은 반드시 presign 시 지정한 값과 일치해야 함
 */
export async function uploadFileToS3(
  url: string,
  file: File | Blob,
  opts?: { onProgress?: (pct: number) => void },
) {
  try {
    await axios.put(url, file, {
      headers: { 'Content-Type': (file as File).type || 'application/octet-stream' },
      maxBodyLength: Infinity,
      onUploadProgress: (e) => {
        if (opts?.onProgress && e.total) {
          const pct = Math.round((e.loaded / e.total) * 100);
          opts.onProgress(pct);
        }
      },
      // axios는 2xx가 아니면 throw 하므로 별도 validateStatus 불필요
    });
  } catch (err) {
    const fileName = (file as File)?.name || '파일';
    const msg = (err as any)?.response?.data?.message ?? `'${fileName}' 파일 업로드에 실패했습니다.`;
    throw new Error(msg);
  }
}

/**
 * Defines the shape of the query parameters for getting bundles.
 */
export interface GetBundlesParams {
  q?: string;
  usage?: string;
  status?: string;
  sortBy?: 'recent' | 'size' | 'name';
  sortOrder?: 'ASC' | 'DESC';
  page?: number;
  limit?: number;
}

/**
 * Defines the shape of the API response.
 */
export interface GetBundlesResponse {
  data: AssetBundle[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Fetches bundles from the API with filtering and pagination.
 * @param params - The query parameters for the request.
 * @returns A promise that resolves to the API response.
 */
export async function getBundles(
  params: GetBundlesParams,
): Promise<GetBundlesResponse> {
  try {
    const { data } = await axiosInstance.get<GetBundlesResponse>('/bundles', {
      params,
    });
    return data;
  } catch (err) {
    const msg =
      (err as any)?.response?.data?.message ??
      '번들 목록을 불러오는 데 실패했습니다.';
    throw new Error(msg);
  }
}

/**
 * 모든 파일 업로드 후 최종 등록 (POST /api/bundles/finalize-upload)
 * - FormData는 브라우저가 적절한 boundary를 넣도록 Content-Type 헤더 지정 X
 */
export async function finalizeBundleUpload(payload: FormData) {
  try {
    const { data } = await axiosInstance.post('/bundles/finalize-upload', payload, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  } catch (err) {
    const msg = (err as any)?.response?.data?.message ?? '번들 최종 등록에 실패했습니다.';
    throw new Error(msg);
  }
}