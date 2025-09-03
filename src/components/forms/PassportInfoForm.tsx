import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../../stores/appStore';

const passportInfoSchema = z.object({
  passportNumber: z.string().min(1, 'パスポート番号は必須です'),
  issueDate: z.string().min(1, '発行日は必須です'),
  expiryDate: z.string().min(1, '有効期限は必須です'),
  issueCountry: z.string().min(1, '発行国は必須です'),
});

type PassportInfoFormData = z.infer<typeof passportInfoSchema>;

interface PassportInfoFormProps {
  onNext: () => void;
  onBack: () => void;
}

const PassportInfoForm: React.FC<PassportInfoFormProps> = ({ onNext, onBack }) => {
  const { t } = useTranslation();
  const { formData, updateFormData } = useAppStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PassportInfoFormData>({
    resolver: zodResolver(passportInfoSchema),
    defaultValues: formData.passportInfo,
  });

  const onSubmit = (data: PassportInfoFormData) => {
    updateFormData({ passportInfo: data });
    onNext();
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {t('form.passport.title')}
        </h2>
        <p className="text-gray-600">
          パスポートの情報を正確に入力してください
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* パスポート番号 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <span className="text-red-500">*</span> {t('form.passport.passportNumber')}
          </label>
          <input
            type="text"
            {...register('passportNumber')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono"
            placeholder="AB1234567"
            style={{ textTransform: 'uppercase' }}
          />
          {errors.passportNumber && (
            <p className="mt-1 text-sm text-red-600">{String(errors.passportNumber.message)}</p>
          )}
        </div>

        {/* 発行日 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <span className="text-red-500">*</span> {t('form.passport.issueDate')}
          </label>
          <input
            type="date"
            {...register('issueDate')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none text-left"
            style={{ textAlign: 'left' }}
          />
          {errors.issueDate && (
            <p className="mt-1 text-sm text-red-600">{String(errors.issueDate.message)}</p>
          )}
        </div>

        {/* 有効期限 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <span className="text-red-500">*</span> {t('form.passport.expiryDate')}
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

        {/* 発行国 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <span className="text-red-500">*</span> {t('form.passport.issueCountry')}
          </label>
          <select
            {...register('issueCountry')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">発行国を選択してください</option>
            <option value="中国">中国</option>
            <option value="韓国">韓国</option>
            <option value="アメリカ">アメリカ</option>
            <option value="イギリス">イギリス</option>
            <option value="フランス">フランス</option>
            <option value="ドイツ">ドイツ</option>
            <option value="インド">インド</option>
            <option value="ベトナム">ベトナム</option>
            <option value="タイ">タイ</option>
            <option value="フィリピン">フィリピン</option>
            <option value="その他">その他</option>
          </select>
          {errors.issueCountry && (
            <p className="mt-1 text-sm text-red-600">{String(errors.issueCountry.message)}</p>
          )}
        </div>

        {/* 注意事項 */}
        <div className="p-4 bg-blue-50 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                パスポートに記載されている情報と完全に一致するように入力してください。有効期限が6ヶ月以上残っていることを確認してください。
              </p>
            </div>
          </div>
        </div>

        {/* ナビゲーションボタン */}
        <div className="flex justify-between pt-6 border-t">
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

export default PassportInfoForm;
