import React, { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../../stores/appStore';

const photoUploadSchema = z.object({
  photoFile: z.any().optional(),
  photoDataUrl: z.string().optional(),
});

type PhotoUploadFormData = z.infer<typeof photoUploadSchema>;

interface PhotoUploadFormProps {
  onNext: () => void;
  onBack: () => void;
}

const PhotoUploadForm: React.FC<PhotoUploadFormProps> = ({ onNext, onBack }) => {
  const { t } = useTranslation();
  const { formData, updateFormData } = useAppStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(
    formData.photoUpload?.photoDataUrl || null
  );
  const [uploadError, setUploadError] = useState<string>('');

  const {
    handleSubmit,
    setValue,
  } = useForm<PhotoUploadFormData>({
    resolver: zodResolver(photoUploadSchema),
    defaultValues: formData.photoUpload,
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setUploadError('');

    if (!file) return;

    // ファイルサイズチェック（5MB以下）
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('ファイルサイズは5MB以下にしてください');
      return;
    }

    // ファイル形式チェック
    if (!file.type.startsWith('image/')) {
      setUploadError('画像ファイルを選択してください');
      return;
    }

    // 画像をBase64に変換してプレビュー表示（サイズを最適化）
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;

      // 画像を圧縮してから保存
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // サイズを最大500pxに制限して圧縮
        const maxSize = 500;
        let { width, height } = img;

        if (width > height) {
          if (width > maxSize) {
            height = (height * maxSize) / width;
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width = (width * maxSize) / height;
            height = maxSize;
          }
        }

        canvas.width = width;
        canvas.height = height;

        ctx?.drawImage(img, 0, 0, width, height);
        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.8); // 80%品質で圧縮

        setPhotoPreview(compressedDataUrl);
        setValue('photoDataUrl', compressedDataUrl);
        setValue('photoFile', file);
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  };

  const removePhoto = () => {
    setPhotoPreview(null);
    setValue('photoDataUrl', '');
    setValue('photoFile', null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const onSubmit = (data: PhotoUploadFormData) => {
    if (!photoPreview) {
      setUploadError('証明写真をアップロードしてください');
      return;
    }

    updateFormData({ photoUpload: data });
    onNext();
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          証明写真アップロード
        </h2>
        <p className="text-gray-600">
          申請用の証明写真をアップロードしてください
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* 写真アップロード */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            <span className="text-red-500">*</span> 証明写真
          </label>

          {/* 写真プレビュー */}
          <div className="flex flex-col items-center space-y-4">
            {photoPreview ? (
              <div className="relative">
                <img
                  src={photoPreview}
                  alt="証明写真プレビュー"
                  className="w-32 h-40 object-cover border-2 border-gray-300 rounded-md"
                />
                <button
                  type="button"
                  onClick={removePhoto}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                >
                  ×
                </button>
              </div>
            ) : (
              <div className="w-32 h-40 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center bg-gray-50">
                <div className="text-center">
                  <svg className="mx-auto h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-xs text-gray-500 mt-1">写真なし</p>
                </div>
              </div>
            )}

            {/* ファイル選択ボタン */}
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                {photoPreview ? '写真を変更' : '写真を選択'}
              </button>
            </div>
          </div>

          {uploadError && (
            <p className="mt-2 text-sm text-red-600">{uploadError}</p>
          )}
        </div>

        {/* 写真要件の説明 */}
        <div className="p-4 bg-blue-50 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800 mb-2">証明写真の要件</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• 6ヶ月以内に撮影されたもの</li>
                <li>• 縦4cm × 横3cm（パスポート写真サイズ）</li>
                <li>• 正面向き、無帽、無背景</li>
                <li>• カラー写真（白黒不可）</li>
                <li>• ファイルサイズ: 5MB以下</li>
                <li>• ファイル形式: JPEG、PNG</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 注意事項 */}
        <div className="p-4 bg-yellow-50 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                <strong>注意:</strong> アップロードした写真は申請書に印刷されます。要件を満たしていない写真は申請が受理されない可能性があります。
              </p>
            </div>
          </div>
        </div>

        {/* ナビゲーションボタン */}
        <div className="flex flex-col sm:flex-row justify-between gap-4 sm:gap-0 pt-6 sm:pt-8 pb-4 sm:pb-6 border-t border-gray-200 mt-8">
          <button
            type="submit"
            className="px-6 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 order-1 sm:order-2"
          >
            {t('common.next')}
          </button>
          
          <button
            type="button"
            onClick={onBack}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 order-2 sm:order-1"
          >
            {t('common.back')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PhotoUploadForm;
