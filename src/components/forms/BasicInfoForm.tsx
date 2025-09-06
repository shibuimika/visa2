import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../../stores/appStore';

const basicInfoSchema = z.object({
  lastNameEn: z.string().min(1, '英語姓は必須です'),
  firstNameEn: z.string().min(1, '英語名は必須です'),
  lastNameJa: z.string().min(1, '日本語姓は必須です'),
  firstNameJa: z.string().min(1, '日本語名は必須です'),
  nationality: z.string().min(1, '国籍は必須です'),
  birthDate: z.string().min(1, '生年月日は必須です'),
  postalCode: z.string().min(1, '郵便番号は必須です'),
  country: z.string().min(1, '国は必須です'),
  prefecture: z.string().min(1, '都道府県は必須です'),
  city: z.string().min(1, '市区町村は必須です'),
  street: z.string().min(1, '番地は必須です'),
  building: z.string().optional(),
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
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-3 sm:p-4 lg:p-6">
      <div className="text-center mb-4 sm:mb-6 lg:mb-8">
        <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">
          {t('form.basicInfo.title')}
        </h2>
        <p className="text-xs sm:text-sm lg:text-base text-gray-600">
          基本的な個人情報を入力してください
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 sm:space-y-4 lg:space-y-6">
        {/* 氏名（英語） */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 sm:mb-3">
            <span className="text-red-500">*</span> 氏名（英語）
          </label>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-600 mb-1">氏（英語）</label>
              <input
                type="text"
                {...register('lastNameEn')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="YAMADA"
              />
              {errors.lastNameEn && (
                <p className="mt-1 text-sm text-red-600">{String(errors.lastNameEn.message)}</p>
              )}
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">名（英語）</label>
              <input
                type="text"
                {...register('firstNameEn')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="TARO"
              />
              {errors.firstNameEn && (
                <p className="mt-1 text-sm text-red-600">{String(errors.firstNameEn.message)}</p>
              )}
            </div>
          </div>
        </div>

        {/* 氏名（日本語） */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 sm:mb-3">
            <span className="text-red-500">*</span> 氏名（日本語）
          </label>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-600 mb-1">氏（日本語）</label>
              <input
                type="text"
                {...register('lastNameJa')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="山田"
              />
              {errors.lastNameJa && (
                <p className="mt-1 text-sm text-red-600">{String(errors.lastNameJa.message)}</p>
              )}
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">名（日本語）</label>
              <input
                type="text"
                {...register('firstNameJa')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="太郎"
              />
              {errors.firstNameJa && (
                <p className="mt-1 text-sm text-red-600">{String(errors.firstNameJa.message)}</p>
              )}
            </div>
          </div>
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none text-left !text-left"
            style={{ textAlign: 'left' }}
          />
          {errors.birthDate && (
            <p className="mt-1 text-sm text-red-600">{String(errors.birthDate.message)}</p>
          )}
        </div>

        {/* 住所 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 sm:mb-3">
            <span className="text-red-500">*</span> 住所
          </label>
          <div className="space-y-3">
            {/* 郵便番号 */}
            <div>
              <label className="block text-xs text-gray-600 mb-1">郵便番号</label>
              <input
                type="text"
                {...register('postalCode')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="123-4567"
              />
              {errors.postalCode && (
                <p className="mt-1 text-sm text-red-600">{String(errors.postalCode.message)}</p>
              )}
            </div>

            {/* 国 */}
            <div>
              <label className="block text-xs text-gray-600 mb-1">国</label>
              <input
                type="text"
                {...register('country')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="日本"
                defaultValue="日本"
              />
              {errors.country && (
                <p className="mt-1 text-sm text-red-600">{String(errors.country.message)}</p>
              )}
            </div>

            {/* 都道府県 */}
            <div>
              <label className="block text-xs text-gray-600 mb-1">都道府県</label>
              <select
                {...register('prefecture')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">都道府県を選択してください</option>
                <option value="北海道">北海道</option>
                <option value="青森県">青森県</option>
                <option value="岩手県">岩手県</option>
                <option value="宮城県">宮城県</option>
                <option value="秋田県">秋田県</option>
                <option value="山形県">山形県</option>
                <option value="福島県">福島県</option>
                <option value="茨城県">茨城県</option>
                <option value="栃木県">栃木県</option>
                <option value="群馬県">群馬県</option>
                <option value="埼玉県">埼玉県</option>
                <option value="千葉県">千葉県</option>
                <option value="東京都">東京都</option>
                <option value="神奈川県">神奈川県</option>
                <option value="新潟県">新潟県</option>
                <option value="富山県">富山県</option>
                <option value="石川県">石川県</option>
                <option value="福井県">福井県</option>
                <option value="山梨県">山梨県</option>
                <option value="長野県">長野県</option>
                <option value="岐阜県">岐阜県</option>
                <option value="静岡県">静岡県</option>
                <option value="愛知県">愛知県</option>
                <option value="三重県">三重県</option>
                <option value="滋賀県">滋賀県</option>
                <option value="京都府">京都府</option>
                <option value="大阪府">大阪府</option>
                <option value="兵庫県">兵庫県</option>
                <option value="奈良県">奈良県</option>
                <option value="和歌山県">和歌山県</option>
                <option value="鳥取県">鳥取県</option>
                <option value="島根県">島根県</option>
                <option value="岡山県">岡山県</option>
                <option value="広島県">広島県</option>
                <option value="山口県">山口県</option>
                <option value="徳島県">徳島県</option>
                <option value="香川県">香川県</option>
                <option value="愛媛県">愛媛県</option>
                <option value="高知県">高知県</option>
                <option value="福岡県">福岡県</option>
                <option value="佐賀県">佐賀県</option>
                <option value="長崎県">長崎県</option>
                <option value="熊本県">熊本県</option>
                <option value="大分県">大分県</option>
                <option value="宮崎県">宮崎県</option>
                <option value="鹿児島県">鹿児島県</option>
                <option value="沖縄県">沖縄県</option>
              </select>
              {errors.prefecture && (
                <p className="mt-1 text-sm text-red-600">{String(errors.prefecture.message)}</p>
              )}
            </div>

            {/* 市区町村 */}
            <div>
              <label className="block text-xs text-gray-600 mb-1">市区町村</label>
              <input
                type="text"
                {...register('city')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="渋谷区"
              />
              {errors.city && (
                <p className="mt-1 text-sm text-red-600">{String(errors.city.message)}</p>
              )}
            </div>

            {/* 番地 */}
            <div>
              <label className="block text-xs text-gray-600 mb-1">番地</label>
              <input
                type="text"
                {...register('street')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="1-2-3"
              />
              {errors.street && (
                <p className="mt-1 text-sm text-red-600">{String(errors.street.message)}</p>
              )}
            </div>

            {/* 建物名・部屋番号 */}
            <div>
              <label className="block text-xs text-gray-600 mb-1">建物名・部屋番号（任意）</label>
              <input
                type="text"
                {...register('building')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="○○マンション101号室"
              />
              {errors.building && (
                <p className="mt-1 text-sm text-red-600">{String(errors.building.message)}</p>
              )}
            </div>
          </div>
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
        <div className="flex flex-col sm:flex-row justify-between gap-4 sm:gap-0 pt-6 sm:pt-8 pb-4 sm:pb-6 border-t border-gray-200 mt-8">
          <button
            type="button"
            onClick={onBack}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 order-2 sm:order-1"
          >
            {t('common.back')}
          </button>

          <button
            type="submit"
            className="px-6 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 order-1 sm:order-2"
          >
            {t('common.next')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BasicInfoForm;
