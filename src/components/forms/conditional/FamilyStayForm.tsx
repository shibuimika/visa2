import React, { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAppStore } from '../../../stores/appStore';
import { FamilyStayInfo, ProcedureType } from '../../../types';

// Zodスキーマとインターフェースの型を一致させる
const fileOrStringSchema = z.instanceof(File).or(z.string()).optional();

// バリデーションスキーマ - FamilyStayInfoインターフェースと完全に一致させる
const schema = z.object({
  relationshipCertificate: fileOrStringSchema,
  incomeCertificate: fileOrStringSchema,
  residenceRecord: fileOrStringSchema,
  currentVisaInfo: z.string().optional(),
});

interface FamilyStayFormProps {
  onNext: () => void;
  onBack: () => void;
}

const FamilyStayForm: React.FC<FamilyStayFormProps> = ({ onNext, onBack }) => {
  const { formData, survey, updateFormData } = useAppStore();
  const fileInputRefs = {
    relationshipCertificate: useRef<HTMLInputElement>(null),
    incomeCertificate: useRef<HTMLInputElement>(null),
    residenceRecord: useRef<HTMLInputElement>(null),
  };

  // ファイルプレビュー状態
  const [filePreviews, setFilePreviews] = useState<{
    relationshipCertificate?: string;
    incomeCertificate?: string;
    residenceRecord?: string;
  }>({
    relationshipCertificate: typeof formData.familyStayInfo?.relationshipCertificate === 'string'
      ? formData.familyStayInfo.relationshipCertificate
      : undefined,
    incomeCertificate: typeof formData.familyStayInfo?.incomeCertificate === 'string'
      ? formData.familyStayInfo.incomeCertificate
      : undefined,
    residenceRecord: typeof formData.familyStayInfo?.residenceRecord === 'string'
      ? formData.familyStayInfo.residenceRecord
      : undefined,
  });

  const [uploadErrors, setUploadErrors] = useState<{[key: string]: string}>({});

  // ファイル処理関数
  const handleFileChange = (
    fieldName: keyof typeof fileInputRefs,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    setUploadErrors(prev => ({ ...prev, [fieldName]: '' }));

    if (!file) return;

    // ファイルサイズチェック（10MB以下）
    if (file.size > 10 * 1024 * 1024) {
      setUploadErrors(prev => ({ ...prev, [fieldName]: 'ファイルサイズは10MB以下にしてください' }));
      return;
    }

    // ファイル形式チェック（PDF, JPG, PNG）
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      setUploadErrors(prev => ({ ...prev, [fieldName]: 'PDF、JPG、PNGファイルを選択してください' }));
      return;
    }

    // 画像をBase64に変換してプレビュー表示（サイズを最適化）
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;

      // 画像ファイルの場合のみ圧縮処理
      if (file.type.startsWith('image/')) {
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

          setFilePreviews(prev => ({ ...prev, [fieldName]: compressedDataUrl }));
          setValue(fieldName, compressedDataUrl);
        };
        img.src = dataUrl;
      } else {
        // PDFなどのファイルはそのまま保存
        setFilePreviews(prev => ({ ...prev, [fieldName]: dataUrl }));
        setValue(fieldName, dataUrl);
      }
    };
    reader.readAsDataURL(file);
  };

  const removeFile = (fieldName: keyof typeof fileInputRefs) => {
    setFilePreviews(prev => ({ ...prev, [fieldName]: undefined }));
    setValue(fieldName, '');
    if (fileInputRefs[fieldName].current) {
      fileInputRefs[fieldName].current!.value = '';
    }
  };

  // surveyの初期値を設定してhooksが条件付きで呼ばれないようにする
  const currentSurvey = survey || { procedureType: 'renewal' as ProcedureType, visaType: 'family' as any };

  // 条件分岐による必須チェック（UI側で制御）
  const isRenewal = currentSurvey.procedureType === 'renewal';

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FamilyStayInfo>({
    resolver: zodResolver(schema),
    defaultValues: formData.familyStayInfo,
  });

  // survey が存在しない場合のみ早期リターン
  if (!survey) return null;

  // フォームの現在の値を取得
  const watchedValues = watch();

  // 次へ進むボタンの有効化チェック
  const isNextButtonEnabled = () => {
    const { procedureType } = survey;

    if (procedureType === 'renewal') {
      // 更新時は関係証明書、収入証明書、在留記録が必須
      return !!(
        watchedValues.relationshipCertificate &&
        watchedValues.incomeCertificate &&
        watchedValues.residenceRecord
      );
    } else if (procedureType === 'change') {
      // 変更時は関係証明書、収入証明書、在留記録、現資格情報が必須
      return !!(
        watchedValues.relationshipCertificate &&
        watchedValues.incomeCertificate &&
        watchedValues.residenceRecord &&
        watchedValues.currentVisaInfo && watchedValues.currentVisaInfo.trim() !== ''
      );
    }

    return false;
  };

  // 必須フィールドのチェック関数
  const validateRequiredFields = (data: FamilyStayInfo) => {
    const { procedureType } = survey;
    const errors: string[] = [];

    if (procedureType === 'renewal') {
      // 更新時は関係証明書、収入証明書、在留記録が必須
      if (!data.relationshipCertificate) {
        errors.push('関係証明書');
      }
      if (!data.incomeCertificate) {
        errors.push('収入証明書');
      }
      if (!data.residenceRecord) {
        errors.push('住民票');
      }
    } else if (procedureType === 'change') {
      // 変更時は関係証明書、収入証明書、在留記録、現資格情報が必須
      if (!data.relationshipCertificate) {
        errors.push('関係証明書');
      }
      if (!data.incomeCertificate) {
        errors.push('収入証明書');
      }
      if (!data.residenceRecord) {
        errors.push('住民票');
      }
      if (!data.currentVisaInfo || data.currentVisaInfo.trim() === '') {
        errors.push('現資格情報');
      }
    }

    return errors;
  };

  const onSubmit = (data: FamilyStayInfo) => {
    const validationErrors = validateRequiredFields(data);
    if (validationErrors.length > 0) {
      alert(`以下の項目は必須です：\n${validationErrors.join('\n')}`);
      return;
    }
    updateFormData({ familyStayInfo: data });
    onNext();
  };

  // ファイルアップロードフィールドコンポーネント
  const FileUploadField: React.FC<{
    label: string;
    fieldName: keyof typeof fileInputRefs;
    required?: boolean;
    placeholder?: string;
  }> = ({ label, fieldName, required = false, placeholder }) => (
    <div>
      <label htmlFor={fieldName} className="block text-sm font-medium text-gray-700 mb-1">
        {required && <span className="text-red-500">*</span>} {label}
      </label>

      {/* ファイルプレビュー */}
      <div className="flex flex-col items-center space-y-4 mb-4">
        {filePreviews[fieldName] ? (
          <div className="relative">
            {filePreviews[fieldName]?.startsWith('data:image/') ? (
              <img
                src={filePreviews[fieldName]}
                alt={`${label}プレビュー`}
                className="w-32 h-40 object-cover border-2 border-gray-300 rounded-md"
              />
            ) : (
              <div className="w-32 h-40 border-2 border-gray-300 rounded-md flex items-center justify-center bg-gray-50">
                <div className="text-center">
                  <svg className="mx-auto h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-xs text-gray-500 mt-1">PDFファイル</p>
                </div>
              </div>
            )}
            <button
              type="button"
              onClick={() => removeFile(fieldName)}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
            >
              ×
            </button>
          </div>
        ) : (
          <div className="w-32 h-40 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <svg className="mx-auto h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
              </svg>
              <p className="text-xs text-gray-500 mt-1">ファイルなし</p>
            </div>
          </div>
        )}

        {/* ファイル選択ボタン */}
        <div>
          <input
            ref={fileInputRefs[fieldName]}
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={(e) => handleFileChange(fieldName, e)}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRefs[fieldName].current?.click()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm"
          >
            {filePreviews[fieldName] ? 'ファイルを変更' : 'ファイルを選択'}
          </button>
        </div>
      </div>

      {uploadErrors[fieldName] && (
        <p className="mt-2 text-sm text-red-600">{uploadErrors[fieldName]}</p>
      )}
    </div>
  );

  const renderFormFields = () => {
    const { procedureType } = survey;
    
    return (
      <>
        <FileUploadField
          label="関係証明書"
          fieldName="relationshipCertificate"
          required={true}
        />

        <FileUploadField
          label="収入証明書"
          fieldName="incomeCertificate"
          required={true}
        />

        <FileUploadField
          label="住民票"
          fieldName="residenceRecord"
          required={true}
        />

        {procedureType === 'change' && (
          <div>
            <label htmlFor="currentVisaInfo" className="block text-sm font-medium text-gray-700 mb-1">
              現資格情報 *
            </label>
            <textarea
              {...register('currentVisaInfo')}
              id="currentVisaInfo"
              rows={3}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="現在の在留資格に関する情報を入力してください"
            />
            {errors.currentVisaInfo && (
              <p className="text-red-600 text-sm mt-1">{String(errors.currentVisaInfo.message)}</p>
            )}
          </div>
        )}
      </>
    );
  };

  const getFormTitle = () => {
    const { procedureType, familyRelation } = survey;
    const relationText = familyRelation === 'spouse' ? '配偶者' : 
                        familyRelation === 'child' ? '子' : 'その他';
    
    switch (procedureType) {
      case 'renewal':
        return `家族滞在（更新・${relationText}）`;
      case 'change':
        return `家族滞在（変更・${relationText}）`;
      default:
        return `家族滞在（${relationText}）`;
    }
  };

  const getFormDescription = () => {
    const { familyRelation } = survey;
    const relationText = familyRelation === 'spouse' ? '配偶者' : 
                        familyRelation === 'child' ? 'お子様' : '家族';
    
    return `家族滞在の在留資格（${relationText}）に関する情報を入力してください。`;
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-4 sm:p-6">
      <div className="text-center mb-6 sm:mb-8">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
          {getFormTitle()}
        </h2>
        <p className="text-sm sm:text-base text-gray-600">
          {getFormDescription()}
        </p>
      </div>

      {survey.familyRelation && (
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">関係性について</h3>
              <p className="text-sm text-blue-700 mt-1">
                選択された関係性: <strong>
                  {survey.familyRelation === 'spouse' ? '配偶者' :
                   survey.familyRelation === 'child' ? '子' : 'その他'}
                </strong>
              </p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {renderFormFields()}

        <div className="flex flex-col sm:flex-row justify-between gap-4 sm:gap-0 pt-6 sm:pt-8 pb-4 sm:pb-6 border-t border-gray-200 mt-8">
          <button
            type="button"
            onClick={onBack}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            戻る
          </button>

          <button
            type="submit"
            disabled={!isNextButtonEnabled()}
            className={`px-6 py-2 text-sm font-medium text-white border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              isNextButtonEnabled()
                ? 'bg-blue-600 hover:bg-blue-700'
                : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            次へ
          </button>
        </div>
      </form>
    </div>
  );
};

export default FamilyStayForm;
