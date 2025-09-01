import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAppStore } from '../../../stores/appStore';
import { EngineerHumanitiesInfo, ProcedureType } from '../../../types';

// バリデーションスキーマ
const createSchema = (procedureType: ProcedureType) => {
  if (procedureType === 'renewal') {
    // 更新時の必須項目
    return z.object({
      employmentCertificate: z.string().min(1, '在職証明書は必須です'),
      salarySlip: z.string().min(1, '給与明細は必須です'),
      taxCertificate: z.string().min(1, '納税証明書は必須です'),
    });
  } else if (procedureType === 'change') {
    // 変更時の必須項目
    return z.object({
      educationHistory: z.string().min(1, '学歴は必須です'),
      workHistory: z.string().min(1, '職歴は必須です'),
      graduationCertificate: z.string().min(1, '卒業証明書は必須です'),
      employmentContract: z.string().min(1, '雇用契約書は必須です'),
      companyInfo: z.string().min(1, '勤務先情報は必須です'),
    });
  } else if (procedureType === 'acquisition') {
    // 取得時の必須項目
    return z.object({
      acquisitionReason: z.string().min(1, '取得理由は必須です'),
      residenceReason: z.string().min(1, '在留理由は必須です'),
      guarantorInfo: z.string().min(1, '身元保証人情報は必須です'),
    });
  }
  
  // デフォルトスキーマ（空だが正しい型を持つ）
  return z.object({
    employmentCertificate: z.string().optional(),
    salarySlip: z.string().optional(),
    taxCertificate: z.string().optional(),
    educationHistory: z.string().optional(),
    workHistory: z.string().optional(),
    graduationCertificate: z.string().optional(),
    employmentContract: z.string().optional(),
    companyInfo: z.string().optional(),
    acquisitionReason: z.string().optional(),
    residenceReason: z.string().optional(),
    guarantorInfo: z.string().optional(),
  });
};

interface EngineerHumanitiesFormProps {
  onNext: () => void;
  onBack: () => void;
}

const EngineerHumanitiesForm: React.FC<EngineerHumanitiesFormProps> = ({ onNext, onBack }) => {
  const { formData, survey, updateFormData } = useAppStore();
  
  // surveyの初期値を設定してhooksが条件付きで呼ばれないようにする
  const currentSurvey = survey || { procedureType: 'renewal' as ProcedureType, visaType: 'engineer' as any };
  const schema = createSchema(currentSurvey.procedureType);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EngineerHumanitiesInfo>({
    resolver: zodResolver(schema),
    defaultValues: formData.engineerHumanitiesInfo,
  });

  // survey が存在しない場合のみ早期リターン
  if (!survey) return null;

  const onSubmit = (data: EngineerHumanitiesInfo) => {
    updateFormData({ engineerHumanitiesInfo: data });
    onNext();
  };

  const renderFormFields = () => {
    const { procedureType } = survey;
    
    if (procedureType === 'renewal') {
      return (
        <>
          <div>
            <label htmlFor="employmentCertificate" className="block text-sm font-medium text-gray-700 mb-1">
              在職証明書 *
            </label>
            <textarea
              {...register('employmentCertificate')}
              id="employmentCertificate"
              rows={3}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="在職証明書の詳細を入力してください"
            />
            {errors.employmentCertificate && (
              <p className="text-red-600 text-sm mt-1">{String(errors.employmentCertificate.message)}</p>
            )}
          </div>

          <div>
            <label htmlFor="salarySlip" className="block text-sm font-medium text-gray-700 mb-1">
              給与明細 *
            </label>
            <textarea
              {...register('salarySlip')}
              id="salarySlip"
              rows={3}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="直近の給与明細について入力してください"
            />
            {errors.salarySlip && (
              <p className="text-red-600 text-sm mt-1">{String(errors.salarySlip.message)}</p>
            )}
          </div>

          <div>
            <label htmlFor="taxCertificate" className="block text-sm font-medium text-gray-700 mb-1">
              納税証明書 *
            </label>
            <textarea
              {...register('taxCertificate')}
              id="taxCertificate"
              rows={3}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="納税証明書の情報を入力してください"
            />
            {errors.taxCertificate && (
              <p className="text-red-600 text-sm mt-1">{String(errors.taxCertificate.message)}</p>
            )}
          </div>
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
            {errors.educationHistory && (
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
            {errors.workHistory && (
              <p className="text-red-600 text-sm mt-1">{String(errors.workHistory.message)}</p>
            )}
          </div>

          <div>
            <label htmlFor="graduationCertificate" className="block text-sm font-medium text-gray-700 mb-1">
              卒業証明書 *
            </label>
            <textarea
              {...register('graduationCertificate')}
              id="graduationCertificate"
              rows={3}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="卒業証明書の詳細を入力してください"
            />
            {errors.graduationCertificate && (
              <p className="text-red-600 text-sm mt-1">{String(errors.graduationCertificate.message)}</p>
            )}
          </div>

          <div>
            <label htmlFor="employmentContract" className="block text-sm font-medium text-gray-700 mb-1">
              雇用契約書 *
            </label>
            <textarea
              {...register('employmentContract')}
              id="employmentContract"
              rows={3}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="雇用契約書の内容を入力してください"
            />
            {errors.employmentContract && (
              <p className="text-red-600 text-sm mt-1">{String(errors.employmentContract.message)}</p>
            )}
          </div>

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
            {errors.companyInfo && (
              <p className="text-red-600 text-sm mt-1">{String(errors.companyInfo.message)}</p>
            )}
          </div>
        </>
      );
    } else if (procedureType === 'acquisition') {
      return (
        <>
          <div>
            <label htmlFor="acquisitionReason" className="block text-sm font-medium text-gray-700 mb-1">
              取得理由 *
            </label>
            <textarea
              {...register('acquisitionReason')}
              id="acquisitionReason"
              rows={4}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="技術・人文知識・国際業務の在留資格を取得する理由を詳しく記載してください"
            />
            {errors.acquisitionReason && (
              <p className="text-red-600 text-sm mt-1">{String(errors.acquisitionReason.message)}</p>
            )}
          </div>

          <div>
            <label htmlFor="residenceReason" className="block text-sm font-medium text-gray-700 mb-1">
              在留理由 *
            </label>
            <textarea
              {...register('residenceReason')}
              id="residenceReason"
              rows={4}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="日本に在留する理由を詳しく記載してください"
            />
            {errors.residenceReason && (
              <p className="text-red-600 text-sm mt-1">{String(errors.residenceReason.message)}</p>
            )}
          </div>

          <div>
            <label htmlFor="guarantorInfo" className="block text-sm font-medium text-gray-700 mb-1">
              身元保証人情報 *
            </label>
            <textarea
              {...register('guarantorInfo')}
              id="guarantorInfo"
              rows={5}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="身元保証人の氏名、住所、職業、電話番号、あなたとの関係を記載してください"
            />
            {errors.guarantorInfo && (
              <p className="text-red-600 text-sm mt-1">{String(errors.guarantorInfo.message)}</p>
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
      case 'acquisition':
        return '技術・人文知識・国際業務（取得）';
      default:
        return '技術・人文知識・国際業務';
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{getFormTitle()}</h2>
        <p className="text-gray-600">
          技術・人文知識・国際業務の在留資格に関する情報を入力してください。
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {renderFormFields()}

        <div className="flex justify-between pt-6">
          <button
            type="button"
            onClick={onBack}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            戻る
          </button>
          
          <button
            type="submit"
            className="px-6 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            次へ
          </button>
        </div>
      </form>
    </div>
  );
};

export default EngineerHumanitiesForm;
