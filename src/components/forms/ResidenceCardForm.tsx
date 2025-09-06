import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../../stores/appStore';
import { VISA_TYPES } from '../../constants';

const residenceCardSchema = z.object({
  cardNumber: z.string().min(1, '在留カード番号は必須です'),
  expiryDate: z.string().min(1, '有効期限は必須です'),
  currentVisa: z.string().min(1, '現在の在留資格は必須です'),
});

type ResidenceCardFormData = z.infer<typeof residenceCardSchema>;

interface ResidenceCardFormProps {
  onNext: () => void;
  onBack: () => void;
}

const ResidenceCardForm: React.FC<ResidenceCardFormProps> = ({ onNext, onBack }) => {
  const { t } = useTranslation();
  const { formData, updateFormData } = useAppStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResidenceCardFormData>({
    resolver: zodResolver(residenceCardSchema),
    defaultValues: formData.residenceCardInfo,
  });

  const onSubmit = (data: ResidenceCardFormData) => {
    updateFormData({ residenceCardInfo: data });
    onNext();
  };



  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {t('form.residenceCard.title')}
        </h2>
        <p className="text-gray-600">
          現在お持ちの在留カードの情報を入力してください
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* 在留カード番号 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <span className="text-red-500">*</span> {t('form.residenceCard.cardNumber')}
          </label>
          <input
            type="text"
            {...register('cardNumber')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono"
            placeholder="AB1234567890"
            maxLength={12}
          />
          {errors.cardNumber && (
            <p className="mt-1 text-sm text-red-600">{String(errors.cardNumber.message)}</p>
          )}
          <p className="mt-1 text-sm text-gray-500">
            在留カード右下の12桁の番号を入力してください
          </p>
        </div>

        {/* 有効期限 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <span className="text-red-500">*</span> {t('form.residenceCard.expiryDate')}
          </label>
          <input
            type="date"
            {...register('expiryDate')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none text-left"
            style={{ textAlign: 'left' }}
          />
          {errors.expiryDate && (
            <p className="mt-1 text-sm text-red-600">{String(errors.expiryDate.message)}</p>
          )}
        </div>

        {/* 現在の在留資格 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <span className="text-red-500">*</span> {t('form.residenceCard.currentVisa')}
          </label>
          <select
            {...register('currentVisa')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">現在の在留資格を選択してください</option>
            {Object.entries(VISA_TYPES).map(([key, value]) => (
              <option key={key} value={key}>
                {value.ja}
              </option>
            ))}
            <option value="短期滞在">短期滞在</option>
            <option value="その他">その他</option>
          </select>
          {errors.currentVisa && (
            <p className="mt-1 text-sm text-red-600">{String(errors.currentVisa.message)}</p>
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
                在留カードに記載されている情報と完全に一致するように入力してください。更新・変更手続きの場合、現在の在留カードが必要です。
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

export default ResidenceCardForm;
