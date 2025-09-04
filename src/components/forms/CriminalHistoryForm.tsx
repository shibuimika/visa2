import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../../stores/appStore';

const criminalHistorySchema = z.object({
  hasCriminalHistory: z.string().min(1, '犯罪歴の有無は必須です'),
  criminalDetails: z.string().optional(),
  hasViolationHistory: z.string().min(1, '入管法違反歴の有無は必須です'),
  violationDetails: z.string().optional(),
  hasDeportationHistory: z.string().min(1, '退去強制歴の有無は必須です'),
  deportationDetails: z.string().optional(),
});

type CriminalHistoryFormData = z.infer<typeof criminalHistorySchema>;

interface CriminalHistoryFormProps {
  onNext: () => void;
  onBack: () => void;
}

const CriminalHistoryForm: React.FC<CriminalHistoryFormProps> = ({ onNext, onBack }) => {
  const { t } = useTranslation();
  const { formData, updateFormData } = useAppStore();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CriminalHistoryFormData>({
    resolver: zodResolver(criminalHistorySchema),
    defaultValues: formData.criminalHistory,
  });

  const hasCriminalHistory = watch('hasCriminalHistory');
  const hasViolationHistory = watch('hasViolationHistory');
  const hasDeportationHistory = watch('hasDeportationHistory');

  const onSubmit = (data: CriminalHistoryFormData) => {
    updateFormData({ criminalHistory: data });
    onNext();
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          犯罪歴・違反歴
        </h2>
        <p className="text-gray-600">
          正確な情報を入力してください。虚偽の申告は許可に影響する可能性があります。
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* 犯罪歴 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            <span className="text-red-500">*</span> 犯罪歴はありますか？
          </label>
          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="radio"
                {...register('hasCriminalHistory')}
                value="no"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <span className="ml-2 text-sm text-gray-900">いいえ</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                {...register('hasCriminalHistory')}
                value="yes"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <span className="ml-2 text-sm text-gray-900">はい</span>
            </label>
          </div>
          {errors.hasCriminalHistory && (
            <p className="mt-1 text-sm text-red-600">{String(errors.hasCriminalHistory.message)}</p>
          )}

          {hasCriminalHistory === 'yes' && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                犯罪歴の詳細
              </label>
              <textarea
                {...register('criminalDetails')}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="詳細を記入してください"
              />
            </div>
          )}
        </div>

        {/* 入管法違反歴 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            <span className="text-red-500">*</span> 出入国管理及び難民認定法違反歴はありますか？
          </label>
          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="radio"
                {...register('hasViolationHistory')}
                value="no"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <span className="ml-2 text-sm text-gray-900">いいえ</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                {...register('hasViolationHistory')}
                value="yes"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <span className="ml-2 text-sm text-gray-900">はい</span>
            </label>
          </div>
          {errors.hasViolationHistory && (
            <p className="mt-1 text-sm text-red-600">{String(errors.hasViolationHistory.message)}</p>
          )}

          {hasViolationHistory === 'yes' && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                違反歴の詳細
              </label>
              <textarea
                {...register('violationDetails')}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="詳細を記入してください"
              />
            </div>
          )}
        </div>

        {/* 退去強制歴 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            <span className="text-red-500">*</span> 退去強制歴はありますか？
          </label>
          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="radio"
                {...register('hasDeportationHistory')}
                value="no"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <span className="ml-2 text-sm text-gray-900">いいえ</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                {...register('hasDeportationHistory')}
                value="yes"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <span className="ml-2 text-sm text-gray-900">はい</span>
            </label>
          </div>
          {errors.hasDeportationHistory && (
            <p className="mt-1 text-sm text-red-600">{String(errors.hasDeportationHistory.message)}</p>
          )}

          {hasDeportationHistory === 'yes' && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                退去強制歴の詳細
              </label>
              <textarea
                {...register('deportationDetails')}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="詳細を記入してください"
              />
            </div>
          )}
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
                <strong>重要:</strong> 正確な情報を入力してください。虚偽の申告は入管法違反となり、在留資格の許可に重大な影響を与える可能性があります。
              </p>
            </div>
          </div>
        </div>

        {/* ナビゲーションボタン */}
        <div className="flex flex-col sm:flex-row justify-between gap-4 sm:gap-0 pt-6 sm:pt-8 pb-4 sm:pb-6 border-t border-gray-200 mt-8">
          <button
            type="button"
            onClick={onBack}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {t('common.back')}
          </button>
          
          <button
            type="submit"
            className="px-6 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {t('common.next')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CriminalHistoryForm;
