import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../../stores/appStore';

const basicInfoSchema = z.object({
  nameEn: z.string().min(1, '英語名は必須です'),
  nameJa: z.string().min(1, '日本語名は必須です'),
  nationality: z.string().min(1, '国籍は必須です'),
  birthDate: z.string().min(1, '生年月日は必須です'),
  address: z.string().min(1, '住所は必須です'),
  phone: z.string().min(1, '電話番号は必須です'),
  email: z.string().email('有効なメールアドレスを入力してください'),
});

type BasicInfoFormData = z.infer<typeof basicInfoSchema>;

interface BasicInfoFormProps {
  onNext: () => void;
  onBack: () => void;
}

const BasicInfoForm: React.FC<BasicInfoFormProps> = ({ onNext, onBack }) => {
  const { t } = useTranslation();
  const { formData, updateFormData } = useAppStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BasicInfoFormData>({
    resolver: zodResolver(basicInfoSchema),
    defaultValues: formData.basicInfo,
  });

  const onSubmit = (data: BasicInfoFormData) => {
    updateFormData({ basicInfo: data });
    onNext();
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {t('form.basicInfo.title')}
        </h2>
        <p className="text-gray-600">
          基本的な個人情報を入力してください
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* 氏名（英語） */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <span className="text-red-500">*</span> {t('form.basicInfo.nameEn')}
          </label>
          <input
            type="text"
            {...register('nameEn')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="YAMADA Taro"
          />
          {errors.nameEn && (
            <p className="mt-1 text-sm text-red-600">{String(errors.nameEn.message)}</p>
          )}
        </div>

        {/* 氏名（日本語） */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <span className="text-red-500">*</span> {t('form.basicInfo.nameJa')}
          </label>
          <input
            type="text"
            {...register('nameJa')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="山田 太郎"
          />
          {errors.nameJa && (
            <p className="mt-1 text-sm text-red-600">{String(errors.nameJa.message)}</p>
          )}
        </div>

        {/* 国籍 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <span className="text-red-500">*</span> {t('form.basicInfo.nationality')}
          </label>
          <select
            {...register('nationality')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">国籍を選択してください</option>
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
          {errors.nationality && (
            <p className="mt-1 text-sm text-red-600">{String(errors.nationality.message)}</p>
          )}
        </div>

        {/* 生年月日 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <span className="text-red-500">*</span> {t('form.basicInfo.birthDate')}
          </label>
          <input
            type="date"
            {...register('birthDate')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.birthDate && (
            <p className="mt-1 text-sm text-red-600">{String(errors.birthDate.message)}</p>
          )}
        </div>

        {/* 住所 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <span className="text-red-500">*</span> {t('form.basicInfo.address')}
          </label>
          <textarea
            {...register('address')}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="〒123-4567 東京都渋谷区..."
          />
          {errors.address && (
            <p className="mt-1 text-sm text-red-600">{String(errors.address.message)}</p>
          )}
        </div>

        {/* 電話番号 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <span className="text-red-500">*</span> {t('form.basicInfo.phone')}
          </label>
          <input
            type="tel"
            {...register('phone')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="090-1234-5678"
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-red-600">{String(errors.phone.message)}</p>
          )}
        </div>

        {/* メールアドレス */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <span className="text-red-500">*</span> {t('form.basicInfo.email')}
          </label>
          <input
            type="email"
            {...register('email')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="example@email.com"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{String(errors.email.message)}</p>
          )}
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

export default BasicInfoForm;
