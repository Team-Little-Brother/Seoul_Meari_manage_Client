import React from 'react';
import ReactDOM from 'react-dom';
import { UploadBundleModalProps } from '@/features/vr-contents/types';
import ModalShell from '@/components/common/ModalShell';
import ActionButton from '@/components/common/ActionButton';
import { useBundleUploadForm } from '../hooks/useBundleUploadForm';
import BundleFilesFields from './BundleFilesFields';
import LayoutAndMetaFields from './LayoutAndMetaFields';
import LayoutJsonExample from './LayoutJsonExample';
import { buildExampleLayout } from '../examples/layoutExample';


const UploadBundleModal: React.FC<UploadBundleModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const {
    // 상태
    mainManifest, assetBundle, layoutFile,
    name, version, usage, os, tags, description,
    latitude, longitude, altitude,
    isUploading, error, showExample,

    // setter
    setMainManifest, setAssetBundle, setLayoutFile,
    setName, setVersion, setUsage, setOs, setTags, setDescription,
    setLatitude, setLongitude, setAltitude,
    setShowExample,

    handleSubmit, handleClose,
  } = useBundleUploadForm(onSubmit, onClose);

  const modalContent = (
    <ModalShell
      isOpen={isOpen}
      onClose={handleClose}
      title="새 에셋 번들 업로드"
      subtitle="Presigned URL 방식으로 파일을 S3에 직접 업로드합니다."
      maxWidthClassName="max-w-3xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* 1) 유니티 빌드 파일 */}
        <BundleFilesFields
          mainManifest={mainManifest}
          assetBundle={assetBundle}
          setMainManifest={setMainManifest}
          setAssetBundle={setAssetBundle}
        />

        {/* 2) 레이아웃 및 메타데이터 */}
        <LayoutAndMetaFields
          layoutFile={layoutFile}
          setLayoutFile={setLayoutFile}
          name={name}
          setName={setName}
          version={version}
          setVersion={setVersion}
          usage={usage}
          setUsage={setUsage}
          os={os}
          setOs={setOs}
          tags={tags}
          setTags={setTags}
          description={description}
          setDescription={setDescription}

          latitude={Number(latitude) || 0}
          setLatitude={(v: number) => setLatitude(String(v))}
          longitude={Number(longitude) || 0}
          setLongitude={(v: number) => setLongitude(String(v))}
          altitude={altitude === '' ? 0 : Number(altitude)}
          setAltitude={(v: number) => setAltitude(String(v))}
        />

        {error && <p className="p-3 text-sm text-red-700 bg-red-100 rounded-md">{error}</p>}

        <div className="pt-2">
          <ActionButton type="button" variant="subtle" onClick={() => setShowExample((s) => !s)}>
            {showExample ? '레이아웃 JSON 예시 숨기기' : '레이아웃 JSON 예시 보기'}
          </ActionButton>
        </div>

        {showExample && (
          <LayoutJsonExample dataBuilder={buildExampleLayout} />
        )}

        <div className="flex justify-end gap-3 pt-4 border-t">
          <ActionButton type="button" variant="secondary" onClick={handleClose} disabled={isUploading}>
            취소
          </ActionButton>
          <ActionButton type="submit" disabled={isUploading}>
            {isUploading ? '업로드 중...' : '업로드 등록'}
          </ActionButton>
        </div>
      </form>
    </ModalShell>
  );

  const modalRoot = document.getElementById('modal-root');
  return modalRoot ? ReactDOM.createPortal(modalContent, modalRoot) : null;
};

export default UploadBundleModal;