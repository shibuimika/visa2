import React, { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAppStore } from '../../../stores/appStore';
import { EngineerHumanitiesInfo, ProcedureType } from '../../../types';

// Zodスキーマとインターフェースの型を一致させる
const fileOrStringSchema = z.instanceof(File).or(z.string()).optional();

// バリデーションスキーマ - EngineerHumanitiesInfoインターフェースと完全に一致させる
const schema = z.object({
  employmentCertificate: fileOrStringSchema,
  salarySlip: fileOrStringSchema,
  taxCertificate: fileOrStringSchema,
  educationHistory: z.string().optional(),
  workHistory: z.string().optional(),
  graduationCertificate: fileOrStringSchema,
  employmentContract: fileOrStringSchema,
  companyInfo: z.string().optional(),
});

interface EngineerHumanitiesFormProps {
  onNext: () => void;
  onBack: () => void;
}

const EngineerHumanitiesForm: React.FC<EngineerHumanitiesFormProps> = ({ onNext, onBack }) => {
  const { formData, survey, updateFormData } = useAppStore();
  const fileInputRefs = {
    employmentCertificate: useRef<HTMLInputElement>(null),
    salarySlip: useRef<HTMLInputElement>(null),
    taxCertificate: useRef<HTMLInputElement>(null),
    graduationCertificate: useRef<HTMLInputElement>(null),
    employmentContract: useRef<HTMLInputElement>(null),
  };

  // ファイルプレビュー状態
  const [filePreviews, setFilePreviews] = useState<{
    employmentCertificate?: string;
    salarySlip?: string;
    taxCertificate?: string;
    graduationCertificate?: string;
    employmentContract?: string;
  }>({
    employmentCertificate: typeof formData.engineerHumanitiesInfo?.employmentCertificate === 'string'
      ? formData.engineerHumanitiesInfo.employmentCertificate
      : undefined,
    salarySlip: typeof formData.engineerHumanitiesInfo?.salarySlip === 'string'
      ? formData.engineerHumanitiesInfo.salarySlip
      : undefined,
    taxCertificate: typeof formData.engineerHumanitiesInfo?.taxCertificate === 'string'
      ? formData.engineerHumanitiesInfo.taxCertificate
      : undefined,
    graduationCertificate: typeof formData.engineerHumanitiesInfo?.graduationCertificate === 'string'
      ? formData.engineerHumanitiesInfo.graduationCertificate
      : undefined,
    employmentContract: typeof formData.engineerHumanitiesInfo?.employmentContract === 'string'
      ? formData.engineerHumanitiesInfo.employmentContract
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
  const currentSurvey = survey || { procedureType: 'renewal' as ProcedureType, visaType: 'engineer' as any };

  // 条件分岐による必須チェック（UI側で制御）
  const isRenewal = currentSurvey.procedureType === 'renewal';
  
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<EngineerHumanitiesInfo>({
    resolver: zodResolver(schema),
    defaultValues: formData.engineerHumanitiesInfo,
  });

  // survey が存在しない場合のみ早期リターン
  if (!survey) return null;

  // フォームの現在の値を取得
  const watchedValues = watch();

  // 次へ進むボタンの有効化チェック
  const isNextButtonEnabled = () => {
    const { procedureType } = survey;

    if (procedureType === 'renewal') {
      // 更新時は在職証明書、給与明細、納税証明書が必須
      return !!(
        watchedValues.employmentCertificate &&
        watchedValues.salarySlip &&
        watchedValues.taxCertificate
      );
    } else if (procedureType === 'change') {
      // 変更時は学歴、職歴、卒業証明書、雇用契約書、勤務先情報が必須
      return !!(
        watchedValues.educationHistory && watchedValues.educationHistory.trim() !== '' &&
        watchedValues.workHistory && watchedValues.workHistory.trim() !== '' &&
        watchedValues.graduationCertificate &&
        watchedValues.employmentContract &&
        watchedValues.companyInfo && watchedValues.companyInfo.trim() !== ''
      );
    }

    return false;
  };

  // 必須フィールドのチェック関数
  const validateRequiredFields = (data: EngineerHumanitiesInfo) => {
    const { procedureType } = survey;
    const errors: string[] = [];

    if (procedureType === 'renewal') {
      // 更新時は在職証明書、給与明細、納税証明書が必須
      if (!data.employmentCertificate) {
        errors.push('在職証明書');
      }
      if (!data.salarySlip) {
        errors.push('給与明細');
      }
      if (!data.taxCertificate) {
        errors.push('納税証明書');
      }
    } else if (procedureType === 'change') {
      // 変更時は学歴、職歴、卒業証明書、雇用契約書、勤務先情報が必須
      if (!data.educationHistory || data.educationHistory.trim() === '') {
        errors.push('学歴');
      }
      if (!data.workHistory || data.workHistory.trim() === '') {
        errors.push('職歴');
      }
      if (!data.graduationCertificate) {
        errors.push('卒業証明書');
      }
      if (!data.employmentContract) {
        errors.push('雇用契約書');
      }
      if (!data.companyInfo || data.companyInfo.trim() === '') {
        errors.push('勤務先情報');
      }
    }

    return errors;
  };

  const onSubmit = (data: EngineerHumanitiesInfo) => {
    const validationErrors = validateRequiredFields(data);
    if (validationErrors.length > 0) {
      alert(`以下の項目は必須です：\n${validationErrors.join('\n')}`);
      return;
    }
    updateFormData({ engineerHumanitiesInfo: data });
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

    if (procedureType === 'renewal') {
      return (
        <>
          <FileUploadField
            label="在職証明書"
            fieldName="employmentCertificate"
            required={true}
          />

          <FileUploadField
            label="給与明細"
            fieldName="salarySlip"
            required={true}
          />

          <FileUploadField
            label="納税証明書"
            fieldName="taxCertificate"
            required={true}
          />
        </>
      );
    } else if (procedureType === 'change') {
      return (
        <>
          <div>
            <label htmlFor="educationHistory" className="block text-sm font-medium text-gray-700 mb-1">
              学歴 *
            </label>
            <textarea
              {...register('educationHistory')}
              id="educationHistory"
              rows={4}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="最終学歴から順に記載してください"
            />
            {errors.educationHistory?.message && (
              <p className="text-red-600 text-sm mt-1">{String(errors.educationHistory.message)}</p>
            )}
          </div>

          <div>
            <label htmlFor="workHistory" className="block text-sm font-medium text-gray-700 mb-1">
              職歴 *
            </label>
            <textarea
              {...register('workHistory')}
              id="workHistory"
              rows={4}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="職歴を時系列で記載してください"
            />
            {errors.workHistory?.message && (
              <p className="text-red-600 text-sm mt-1">{String(errors.workHistory.message)}</p>
            )}
          </div>

          <FileUploadField
            label="卒業証明書"
            fieldName="graduationCertificate"
            required={true}
          />

          <FileUploadField
            label="雇用契約書"
            fieldName="employmentContract"
            required={true}
          />

          <div>
            <label htmlFor="companyInfo" className="block text-sm font-medium text-gray-700 mb-1">
              勤務先情報 *
            </label>
            <textarea
              {...register('companyInfo')}
              id="companyInfo"
              rows={4}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="勤務先の詳細情報を入力してください（会社名、住所、業種、資本金等）"
            />
            {errors.companyInfo?.message && (
              <p className="text-red-600 text-sm mt-1">{String(errors.companyInfo.message)}</p>
            )}
          </div>
        </>
      );
    }

    return null;
  };

  const getFormTitle = () => {
    const { procedureType } = survey;
    switch (procedureType) {
      case 'renewal':
        return '技術・人文知識・国際業務（更新）';
      case 'change':
        return '技術・人文知識・国際業務（変更）';
      default:
        return '技術・人文知識・国際業務';
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-4 sm:p-6">
      <div className="text-center mb-6 sm:mb-8">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
          {getFormTitle()}
        </h2>
        <p className="text-sm sm:text-base text-gray-600">
          技術・人文知識・国際業務の在留資格に関する情報を入力してください。
        </p>
      </div>

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

export default EngineerHumanitiesForm;
