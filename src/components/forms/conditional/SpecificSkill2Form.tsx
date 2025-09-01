import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAppStore } from '../../../stores/appStore';
import { SpecificSkill2Info, ProcedureType } from '../../../types';

// バリデーションスキーマ
const createSchema = (procedureType: ProcedureType) => {
  if (procedureType === 'renewal') {
    return z.object({
      employmentCertificate: z.string().min(1, '在職証明書は必須です'),
      salarySlip: z.string().min(1, '給与明細は必須です'),
      taxCertificate: z.string().min(1, '納税証明書は必須です'),
    });
  } else if (procedureType === 'change') {
    return z.object({
      workExperienceCertificate: z.string().optional(),
      skillTestCertificate: z.string().optional(),
      employmentContract: z.string().min(1, '雇用契約書は必須です'),
      organizationInfo: z.string().min(1, '所属機関情報は必須です'),
    }).refine(
      (data) => data.workExperienceCertificate || data.skillTestCertificate,
      {
        message: '実務経験証明または技能試験合格証のいずれかは必須です',
        path: ['workExperienceCertificate'],
      }
    );
  } else if (procedureType === 'acquisition') {
    return z.object({
      workExperienceCertificate: z.string().optional(),
      skillTestCertificate: z.string().optional(),
      employmentContract: z.string().min(1, '雇用契約書は必須です'),
      organizationInfo: z.string().min(1, '所属機関情報は必須です'),
      guarantorInfo: z.string().min(1, '身元保証人情報は必須です'),
    }).refine(
      (data) => data.workExperienceCertificate || data.skillTestCertificate,
      {
        message: '実務経験証明または技能試験合格証のいずれかは必須です',
        path: ['workExperienceCertificate'],
      }
    );
  }
  
  // デフォルトスキーマ
  return z.object({
    employmentCertificate: z.string().optional(),
    salarySlip: z.string().optional(),
    taxCertificate: z.string().optional(),
    workExperienceCertificate: z.string().optional(),
    skillTestCertificate: z.string().optional(),
    employmentContract: z.string().optional(),
    organizationInfo: z.string().optional(),
    guarantorInfo: z.string().optional(),
  });
};

interface SpecificSkill2FormProps {
  onNext: () => void;
  onBack: () => void;
}

const SpecificSkill2Form: React.FC<SpecificSkill2FormProps> = ({ onNext, onBack }) => {
  const { formData, survey, updateFormData } = useAppStore();
  
  // surveyの初期値を設定してhooksが条件付きで呼ばれないようにする
  const currentSurvey = survey || { procedureType: 'renewal' as ProcedureType, visaType: 'specific-2' as any };
  const schema = createSchema(currentSurvey.procedureType);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SpecificSkill2Info>({
    resolver: zodResolver(schema),
    defaultValues: formData.specificSkill2Info,
  });

  // survey が存在しない場合のみ早期リターン
  if (!survey) return null;

  const onSubmit = (data: SpecificSkill2Info) => {
    updateFormData({ specificSkill2Info: data });
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
    } else if (procedureType === 'change' || procedureType === 'acquisition') {
      return (
        <>
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6">
            <p className="text-sm text-yellow-800">
              <strong>注意:</strong> 実務経験証明または技能試験合格証のいずれか一方は必須です。
            </p>
          </div>

          <div>
            <label htmlFor="workExperienceCertificate" className="block text-sm font-medium text-gray-700 mb-1">
              実務経験証明 *（いずれか必須）
            </label>
            <textarea
              {...register('workExperienceCertificate')}
              id="workExperienceCertificate"
              rows={4}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="5年以上の実務経験に関する証明書の内容を入力してください"
            />
            {errors.workExperienceCertificate && (
              <p className="text-red-600 text-sm mt-1">{String(errors.workExperienceCertificate.message)}</p>
            )}
          </div>

          <div>
            <label htmlFor="skillTestCertificate" className="block text-sm font-medium text-gray-700 mb-1">
              技能試験合格証 *（いずれか必須）
            </label>
            <textarea
              {...register('skillTestCertificate')}
              id="skillTestCertificate"
              rows={3}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="特定技能2号技能試験の合格証について入力してください"
            />
            {errors.skillTestCertificate && (
              <p className="text-red-600 text-sm mt-1">{String(errors.skillTestCertificate.message)}</p>
            )}
          </div>

          <div>
            <label htmlFor="employmentContract" className="block text-sm font-medium text-gray-700 mb-1">
              雇用契約書 *
            </label>
            <textarea
              {...register('employmentContract')}
              id="employmentContract"
              rows={4}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="特定技能2号雇用契約書の内容を入力してください（職種、報酬、勤務時間等）"
            />
            {errors.employmentContract && (
              <p className="text-red-600 text-sm mt-1">{String(errors.employmentContract.message)}</p>
            )}
          </div>

          <div>
            <label htmlFor="organizationInfo" className="block text-sm font-medium text-gray-700 mb-1">
              所属機関情報 *
            </label>
            <textarea
              {...register('organizationInfo')}
              id="organizationInfo"
              rows={4}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="所属機関（雇用主）の詳細情報を入力してください（会社名、住所、業種、従業員数等）"
            />
            {errors.organizationInfo && (
              <p className="text-red-600 text-sm mt-1">{String(errors.organizationInfo.message)}</p>
            )}
          </div>

          {procedureType === 'acquisition' && (
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
          )}
        </>
      );
    }
    
    return null;
  };

  const getFormTitle = () => {
    const { procedureType } = survey;
    switch (procedureType) {
      case 'renewal':
        return '特定技能2号（更新）';
      case 'change':
        return '特定技能2号（変更）';
      case 'acquisition':
        return '特定技能2号（取得）';
      default:
        return '特定技能2号';
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{getFormTitle()}</h2>
        <p className="text-gray-600">
          特定技能2号の在留資格に関する情報を入力してください。
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

export default SpecificSkill2Form;
