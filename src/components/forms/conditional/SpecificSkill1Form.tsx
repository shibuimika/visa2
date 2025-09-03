import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAppStore } from '../../../stores/appStore';
import { SpecificSkill1Info, ProcedureType } from '../../../types';

// バリデーションスキーマ
const createSchema = (procedureType: ProcedureType) => {
  if (procedureType === 'renewal') {
    return z.object({
      employmentCertificate: z.string().min(1, '在職証明書は必須です'),
      salarySlip: z.string().min(1, '給与明細は必須です'),
      supportReport: z.string().min(1, '支援状況報告書は必須です'),
      taxCertificate: z.string().min(1, '納税証明書は必須です'),
    });
  } else if (procedureType === 'change') {
    return z.object({
      skillTestCertificate: z.string().min(1, '評価試験合格証は必須です'),
      supportPlan: z.string().min(1, '支援計画書は必須です'),
      employmentContract: z.string().min(1, '雇用契約書は必須です'),
    });
  }
  
  // デフォルトスキーマ
  return z.object({
    employmentCertificate: z.string().optional(),
    salarySlip: z.string().optional(),
    supportReport: z.string().optional(),
    taxCertificate: z.string().optional(),
    skillTestCertificate: z.string().optional(),
    supportPlan: z.string().optional(),
    employmentContract: z.string().optional(),
  });
};

interface SpecificSkill1FormProps {
  onNext: () => void;
  onBack: () => void;
}

const SpecificSkill1Form: React.FC<SpecificSkill1FormProps> = ({ onNext, onBack }) => {
  const { formData, survey, updateFormData } = useAppStore();
  
  // surveyの初期値を設定してhooksが条件付きで呼ばれないようにする
  const currentSurvey = survey || { procedureType: 'renewal' as ProcedureType, visaType: 'specific-1' as any };
  const schema = createSchema(currentSurvey.procedureType);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SpecificSkill1Info>({
    resolver: zodResolver(schema),
    defaultValues: formData.specificSkill1Info,
  });

  // survey が存在しない場合のみ早期リターン
  if (!survey) return null;

  const onSubmit = (data: SpecificSkill1Info) => {
    updateFormData({ specificSkill1Info: data });
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
            <label htmlFor="supportReport" className="block text-sm font-medium text-gray-700 mb-1">
              支援状況報告書 *
            </label>
            <textarea
              {...register('supportReport')}
              id="supportReport"
              rows={4}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="登録支援機関からの支援状況報告書の内容を入力してください"
            />
            {errors.supportReport && (
              <p className="text-red-600 text-sm mt-1">{String(errors.supportReport.message)}</p>
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
            <label htmlFor="skillTestCertificate" className="block text-sm font-medium text-gray-700 mb-1">
              評価試験合格証 *
            </label>
            <textarea
              {...register('skillTestCertificate')}
              id="skillTestCertificate"
              rows={3}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="技能評価試験の合格証について入力してください"
            />
            {errors.skillTestCertificate && (
              <p className="text-red-600 text-sm mt-1">{String(errors.skillTestCertificate.message)}</p>
            )}
          </div>

          <div>
            <label htmlFor="supportPlan" className="block text-sm font-medium text-gray-700 mb-1">
              支援計画書 *
            </label>
            <textarea
              {...register('supportPlan')}
              id="supportPlan"
              rows={4}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="1号特定技能外国人支援計画書の内容を入力してください"
            />
            {errors.supportPlan && (
              <p className="text-red-600 text-sm mt-1">{String(errors.supportPlan.message)}</p>
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
              placeholder="特定技能雇用契約書の内容を入力してください（職種、報酬、勤務時間等）"
            />
            {errors.employmentContract && (
              <p className="text-red-600 text-sm mt-1">{String(errors.employmentContract.message)}</p>
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
        return '特定技能1号（更新）';
      case 'change':
        return '特定技能1号（変更）';
      default:
        return '特定技能1号';
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{getFormTitle()}</h2>
        <p className="text-gray-600">
          特定技能1号の在留資格に関する情報を入力してください。
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

export default SpecificSkill1Form;
