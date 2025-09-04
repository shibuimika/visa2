import React, { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAppStore } from '../../../stores/appStore';
import { SpecificSkill1Info, ProcedureType } from '../../../types';

// Zodスキーマとインターフェースの型を一致させる
const fileOrStringSchema = z.instanceof(File).or(z.string()).optional();

// バリデーションスキーマ - SpecificSkill1Infoインターフェースと完全に一致させる
const schema = z.object({
  employmentCertificate: fileOrStringSchema,
  salarySlip: fileOrStringSchema,
  supportReport: fileOrStringSchema,
  taxCertificate: fileOrStringSchema,
  skillTestCertificate: fileOrStringSchema,
  supportPlan: fileOrStringSchema,
  employmentContract: fileOrStringSchema,
});

interface SpecificSkill1FormProps {
  onNext: () => void;
  onBack: () => void;
}

const SpecificSkill1Form: React.FC<SpecificSkill1FormProps> = ({ onNext, onBack }) => {
  const { formData, survey, updateFormData } = useAppStore();
  const fileInputRefs = {
    employmentCertificate: useRef<HTMLInputElement>(null),
    salarySlip: useRef<HTMLInputElement>(null),
    supportReport: useRef<HTMLInputElement>(null),
    taxCertificate: useRef<HTMLInputElement>(null),
    skillTestCertificate: useRef<HTMLInputElement>(null),
    supportPlan: useRef<HTMLInputElement>(null),
    employmentContract: useRef<HTMLInputElement>(null),
  };

  // ファイルプレビュー状態
  const [filePreviews, setFilePreviews] = useState<{
    employmentCertificate?: string;
    salarySlip?: string;
    supportReport?: string;
    taxCertificate?: string;
    skillTestCertificate?: string;
    supportPlan?: string;
    employmentContract?: string;
  }>({
    employmentCertificate: typeof formData.specificSkill1Info?.employmentCertificate === 'string'
      ? formData.specificSkill1Info.employmentCertificate
      : undefined,
    salarySlip: typeof formData.specificSkill1Info?.salarySlip === 'string'
      ? formData.specificSkill1Info.salarySlip
      : undefined,
    supportReport: typeof formData.specificSkill1Info?.supportReport === 'string'
      ? formData.specificSkill1Info.supportReport
      : undefined,
    taxCertificate: typeof formData.specificSkill1Info?.taxCertificate === 'string'
      ? formData.specificSkill1Info.taxCertificate
      : undefined,
    skillTestCertificate: typeof formData.specificSkill1Info?.skillTestCertificate === 'string'
      ? formData.specificSkill1Info.skillTestCertificate
      : undefined,
    supportPlan: typeof formData.specificSkill1Info?.supportPlan === 'string'
      ? formData.specificSkill1Info.supportPlan
      : undefined,
    employmentContract: typeof formData.specificSkill1Info?.employmentContract === 'string'
      ? formData.specificSkill1Info.employmentContract
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
  const currentSurvey = survey || { procedureType: 'renewal' as ProcedureType, visaType: 'specific-1' as any };

  // 条件分岐による必須チェック（UI側で制御）
  const isRenewal = currentSurvey.procedureType === 'renewal';

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SpecificSkill1Info>({
    resolver: zodResolver(schema),
    defaultValues: formData.specificSkill1Info,
  });

  // survey が存在しない場合のみ早期リターン
  if (!survey) return null;

  // フォームの現在の値を取得
  const watchedValues = watch();

  // 次へ進むボタンの有効化チェック
  const isNextButtonEnabled = () => {
    const { procedureType } = survey;

    if (procedureType === 'renewal') {
      // 更新時は在職証明書、給与明細、支援報告書、納税証明書が必須
      return !!(
        watchedValues.employmentCertificate &&
        watchedValues.salarySlip &&
        watchedValues.supportReport &&
        watchedValues.taxCertificate
      );
    } else if (procedureType === 'change') {
      // 変更時は技能試験合格証、支援計画書、雇用契約書が必須
      return !!(
        watchedValues.skillTestCertificate &&
        watchedValues.supportPlan &&
        watchedValues.employmentContract
      );
    }

    return false;
  };

  // 必須フィールドのチェック関数
  const validateRequiredFields = (data: SpecificSkill1Info) => {
    const { procedureType } = survey;
    const errors: string[] = [];

    if (procedureType === 'renewal') {
      // 更新時は在職証明書、給与明細、支援報告書、納税証明書が必須
      if (!data.employmentCertificate) {
        errors.push('在職証明書');
      }
      if (!data.salarySlip) {
        errors.push('給与明細');
      }
      if (!data.supportReport) {
        errors.push('支援状況報告書');
      }
      if (!data.taxCertificate) {
        errors.push('納税証明書');
      }
    } else if (procedureType === 'change') {
      // 変更時は技能試験合格証、支援計画書、雇用契約書が必須
      if (!data.skillTestCertificate) {
        errors.push('技能試験合格証');
      }
      if (!data.supportPlan) {
        errors.push('支援計画書');
      }
      if (!data.employmentContract) {
        errors.push('雇用契約書');
      }
    }

    return errors;
  };

  const onSubmit = (data: SpecificSkill1Info) => {
    const validationErrors = validateRequiredFields(data);
    if (validationErrors.length > 0) {
      alert(`以下の項目は必須です：\n${validationErrors.join('\n')}`);
      return;
    }
    updateFormData({ specificSkill1Info: data });
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
            label="支援状況報告書"
            fieldName="supportReport"
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
          <FileUploadField
            label="評価試験合格証"
            fieldName="skillTestCertificate"
            required={true}
          />

          <FileUploadField
            label="支援計画書"
            fieldName="supportPlan"
            required={true}
          />

          <FileUploadField
            label="雇用契約書"
            fieldName="employmentContract"
            required={true}
          />
        </>
      );
    }
    
    return null;
  };

  const getFormTitle = () => {
    const { procedureType } = survey;
    switch (procedureType) {
      case 'renewal':
        return '特定技能1号（更新）';
      case 'change':
        return '特定技能1号（変更）';
      default:
        return '特定技能1号';
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-4 sm:p-6">
      <div className="text-center mb-6 sm:mb-8">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
          {getFormTitle()}
        </h2>
        <p className="text-sm sm:text-base text-gray-600">
          特定技能1号の在留資格に関する情報を入力してください。
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

export default SpecificSkill1Form;
