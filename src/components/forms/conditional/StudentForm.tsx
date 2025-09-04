import React, { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAppStore } from '../../../stores/appStore';
import { StudentInfo, ProcedureType } from '../../../types';

// Zodスキーマとインターフェースの型を一致させる
const fileOrStringSchema = z.instanceof(File).or(z.string()).optional();

// バリデーションスキーマ - StudentInfoインターフェースと完全に一致させる
const schema = z.object({
  enrollmentCertificate: fileOrStringSchema,
  transcript: fileOrStringSchema,
  attendanceCertificate: fileOrStringSchema,
  tuitionPaymentCertificate: fileOrStringSchema,
  graduationCertificate: fileOrStringSchema,
  employmentContract: fileOrStringSchema,
  companyInfo: z.string().optional(),
});

interface StudentFormProps {
  onNext: () => void;
  onBack: () => void;
}

const StudentForm: React.FC<StudentFormProps> = ({ onNext, onBack }) => {
  const { formData, survey, updateFormData } = useAppStore();
  const fileInputRefs = {
    enrollmentCertificate: useRef<HTMLInputElement>(null),
    transcript: useRef<HTMLInputElement>(null),
    attendanceCertificate: useRef<HTMLInputElement>(null),
    tuitionPaymentCertificate: useRef<HTMLInputElement>(null),
    graduationCertificate: useRef<HTMLInputElement>(null),
    employmentContract: useRef<HTMLInputElement>(null),
  };

  // ファイルプレビュー状態
  const [filePreviews, setFilePreviews] = useState<{
    enrollmentCertificate?: string;
    transcript?: string;
    attendanceCertificate?: string;
    tuitionPaymentCertificate?: string;
    graduationCertificate?: string;
    employmentContract?: string;
  }>({
    enrollmentCertificate: typeof formData.studentInfo?.enrollmentCertificate === 'string'
      ? formData.studentInfo.enrollmentCertificate
      : undefined,
    transcript: typeof formData.studentInfo?.transcript === 'string'
      ? formData.studentInfo.transcript
      : undefined,
    attendanceCertificate: typeof formData.studentInfo?.attendanceCertificate === 'string'
      ? formData.studentInfo.attendanceCertificate
      : undefined,
    tuitionPaymentCertificate: typeof formData.studentInfo?.tuitionPaymentCertificate === 'string'
      ? formData.studentInfo.tuitionPaymentCertificate
      : undefined,
    graduationCertificate: typeof formData.studentInfo?.graduationCertificate === 'string'
      ? formData.studentInfo.graduationCertificate
      : undefined,
    employmentContract: typeof formData.studentInfo?.employmentContract === 'string'
      ? formData.studentInfo.employmentContract
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

    // 画像をBase64に変換してプレビュー表示
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setFilePreviews(prev => ({ ...prev, [fieldName]: dataUrl }));
      setValue(fieldName, dataUrl);
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
  const currentSurvey = survey || { procedureType: 'renewal' as ProcedureType, visaType: 'student' as any };

  // 条件分岐による必須チェック（UI側で制御）
  const isRenewal = currentSurvey.procedureType === 'renewal';

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<StudentInfo>({
    resolver: zodResolver(schema),
    defaultValues: formData.studentInfo,
  });

  // survey が存在しない場合のみ早期リターン
  if (!survey) return null;

  // フォームの現在の値を取得
  const watchedValues = watch();

  // 次へ進むボタンの有効化チェック
  const isNextButtonEnabled = () => {
    const { procedureType } = survey;

    if (procedureType === 'renewal') {
      // 更新時は在学証明書、成績証明書、出席証明書、学費納入証明書が必須
      return !!(
        watchedValues.enrollmentCertificate &&
        watchedValues.transcript &&
        watchedValues.attendanceCertificate &&
        watchedValues.tuitionPaymentCertificate
      );
    } else if (procedureType === 'change') {
      // 変更時は卒業証明書、雇用契約書が必須
      return !!(
        watchedValues.graduationCertificate &&
        watchedValues.employmentContract
      );
    }

    return false;
  };

  // 必須フィールドのチェック関数
  const validateRequiredFields = (data: StudentInfo) => {
    const { procedureType } = survey;
    const errors: string[] = [];

    if (procedureType === 'renewal') {
      // 更新時は在学証明書、成績証明書、出席証明書、学費納入証明書が必須
      if (!data.enrollmentCertificate) {
        errors.push('在学証明書');
      }
      if (!data.transcript) {
        errors.push('成績証明書');
      }
      if (!data.attendanceCertificate) {
        errors.push('出席証明書');
      }
      if (!data.tuitionPaymentCertificate) {
        errors.push('学費納入証明書');
      }
    } else if (procedureType === 'change') {
      // 変更時は卒業証明書、雇用契約書が必須
      if (!data.graduationCertificate) {
        errors.push('卒業証明書');
      }
      if (!data.employmentContract) {
        errors.push('雇用契約書');
      }
    }

    return errors;
  };

  const onSubmit = (data: StudentInfo) => {
    const validationErrors = validateRequiredFields(data);
    if (validationErrors.length > 0) {
      alert(`以下の項目は必須です：\n${validationErrors.join('\n')}`);
      return;
    }
    updateFormData({ studentInfo: data });
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
            label="在学証明書"
            fieldName="enrollmentCertificate"
            required={true}
          />

          <FileUploadField
            label="成績証明書"
            fieldName="transcript"
            required={true}
          />

          <FileUploadField
            label="出席証明書"
            fieldName="attendanceCertificate"
            required={true}
          />

          <FileUploadField
            label="学費納入証明書"
            fieldName="tuitionPaymentCertificate"
            required={true}
          />
        </>
      );
    } else if (procedureType === 'change') {
      return (
        <>
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
              placeholder="就職先企業の詳細情報を入力してください（会社名、住所、業種、資本金等）"
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
        return '留学（更新）';
      case 'change':
        return '留学（変更）';
      default:
        return '留学';
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-4 sm:p-6">
      <div className="text-center mb-6 sm:mb-8">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
          {getFormTitle()}
        </h2>
        <p className="text-sm sm:text-base text-gray-600">
          留学の在留資格に関する情報を入力してください。
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {renderFormFields()}

        <div className="flex justify-between pt-6 border-t">
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

export default StudentForm;
