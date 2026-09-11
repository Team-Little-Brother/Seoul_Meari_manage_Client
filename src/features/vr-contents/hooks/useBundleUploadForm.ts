import { useState } from 'react';
import type { AssetOS, AssetUsage, BundleFinalizePayload } from '../types';
import { finalizeBundleUpload, getPresignedUrls, uploadFileToS3 } from '@/api/vrContentAPI';

// =================================================================
// 업로드 폼 상태/핸들러 훅 (+ 좌표 필드)
// =================================================================
export function useBundleUploadForm(onSubmit: (payload: BundleFinalizePayload) => void, onClose: () => void) {
  // --- 파일 상태 ---
  const [mainManifest, setMainManifest] = useState<File | null>(null);
  const [assetBundle, setAssetBundle] = useState<File | null>(null);
  const [layoutFile, setLayoutFile] = useState<File | null>(null);

  // --- 메타데이터 상태 ---
  const [name, setName] = useState('');
  const [version, setVersion] = useState('1.0.0');
  const [usage, setUsage] = useState<AssetUsage>('historical');
  const [os, setOs] = useState<AssetOS>('android');
  const [tags, setTags] = useState('');
  const [description, setDescription] = useState('');

  // --- 좌표 상태 (문자열로 받아서 제출 시 숫자로 파싱) ---
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [altitude, setAltitude] = useState('');

  // --- UI 상태 ---
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showExample, setShowExample] = useState(false);

  const resetAllStates = () => {
    setMainManifest(null);
    setAssetBundle(null);
    setLayoutFile(null);
    setName('');
    setVersion('1.0.0');
    setUsage('historical');
    setOs('android');
    setTags('');
    setDescription('');
    setLatitude('');   // NEW
    setLongitude('');  // NEW
    setAltitude('');          // NEW
    setError(null);
    setIsUploading(false);
    setShowExample(false);
  };

  const handleClose = () => {
    resetAllStates();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const allFiles = [mainManifest, assetBundle, layoutFile];
    if (allFiles.some((f) => !f) || !name || !version) {
      setError('모든 파일과 필수 정보(이름, 버전)를 입력해야 합니다.');
      return;
    }

    // --- 좌표 검증 ---
    const latNum = parseFloat(latitude);
    const lonNum = parseFloat(longitude);
    const altitudeNum = altitude === '' ? undefined : parseFloat(altitude);

    if (!Number.isFinite(latNum) || latNum < -90 || latNum > 90) {
      setError('위도(latitude)는 -90 ~ 90 사이의 숫자여야 합니다.');
      return;
    }
    if (!Number.isFinite(lonNum) || lonNum < -180 || lonNum > 180) {
      setError('경도(longitude)는 -180 ~ 180 사이의 숫자여야 합니다.');
      return;
    }
    if (altitude !== '' && !Number.isFinite(altitudeNum!)) {
      setError('고도(altitude)는 숫자여야 합니다.');
      return;
    }

    setError(null);
    setIsUploading(true);

    try {
      // 1) Presigned URL 요청
      const bundleFiles = [mainManifest!, assetBundle!];
      const fileInfos = bundleFiles.map((f) => ({ fileName: f.name, fileType: f.type }));
      const { uploadId, urls } = await getPresignedUrls(fileInfos);

      // 2) S3 병렬 업로드
      await Promise.all(
        urls.map(({ fileName, url }) => {
          const fileToUpload = bundleFiles.find((f) => f.name === fileName);
          if (!fileToUpload) throw new Error(`업로드할 파일 '${fileName}'을 찾을 수 없습니다.`);
          return uploadFileToS3(url, fileToUpload);
        }),
      );

      // 3) 최종 등록 (서버에는 FormData로 전송)
      const formData = new FormData();
      formData.append('uploadId', uploadId);
      formData.append('layoutFile', layoutFile as File);
      formData.append('name', name);
      formData.append('version', version);
      formData.append('usage', usage);
      formData.append('os', os);
      formData.append('tags', tags); // 문자열
      formData.append('description', description);
      formData.append('latitude', String(latNum));   // NEW
      formData.append('longitude', String(lonNum));  // NEW
      if (altitudeNum !== undefined) formData.append('altitude', String(altitudeNum)); // NEW (선택)


      const formDataObject = Object.fromEntries(formData.entries());
      console.log(formDataObject); // { key1: value1, key2: value2, ... } 처럼 보임 (O)

      await finalizeBundleUpload(formData);

      // 부모로 알림 (프론트 내에서 사용할 구조로 전달)
      onSubmit({
        uploadId,
        layoutFile: layoutFile as File,
        name,
        version,
        usage,
        os,
        tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
        description,
        // 좌표도 함께 넘김 (타입에 없다면 확장)
        ...( { latitude: latNum, longitude: lonNum, altitude: altitudeNum } as any ),
      } as BundleFinalizePayload);

      handleClose();
    } catch (err: any) {
      setError(err.message || '업로드 중 알 수 없는 오류가 발생했습니다.');
    } finally {
      setIsUploading(false);
    }
  };

  return {
    // 상태
    mainManifest, assetBundle, layoutFile,
    name, version, usage, os, tags, description,
    latitude, longitude, altitude, // NEW
    isUploading, error, showExample,

    // setter
    setMainManifest, setAssetBundle, setLayoutFile,
    setName, setVersion, setUsage, setOs, setTags, setDescription,
    setLatitude, setLongitude, setAltitude, // NEW
    setShowExample,

    // 핸들러
    handleSubmit, handleClose,
  };
}