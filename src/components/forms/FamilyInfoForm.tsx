import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../../stores/appStore';

const familyMemberSchema = z.object({
  name: z.string().min(1, '氏名は必須です'),
  relationship: z.string().min(1, '続柄は必須です'),
  nationality: z.string().min(1, '国籍は必須です'),
  birthDate: z.string().optional(),
  occupation: z.string().optional(),
  visaStatus: z.string().optional(),
});

const familyInfoSchema = z.object({
  hasFamily: z.string().optional(),
  familyMembers: z.array(familyMemberSchema).optional(),
});

type FamilyInfoFormData = z.infer<typeof familyInfoSchema>;

interface FamilyInfoFormProps {
  onNext: () => void;
  onBack: () => void;
}

const FamilyInfoForm: React.FC<FamilyInfoFormProps> = ({ onNext, onBack }) => {
  const { t } = useTranslation();
  const { formData, updateFormData } = useAppStore();

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm<FamilyInfoFormData>({
    resolver: zodResolver(familyInfoSchema),
    defaultValues: {
      hasFamily: formData.familyInfo?.hasFamily || '',
      familyMembers: formData.familyInfo?.familyMembers || [{ name: '', relationship: '', nationality: '', birthDate: '', occupation: '', visaStatus: '' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'familyMembers',
  });

  const hasFamily = watch('hasFamily');
  const watchedValues = watch();

  // 次へ進むボタンの有効化チェック
  const isNextButtonEnabled = () => {
    // hasFamilyが選択されていない場合は無効
    if (!watchedValues.hasFamily) {
      return false;
    }

    // 「はい」を選択した場合のみ、familyMembersのチェックを行う
    if (watchedValues.hasFamily === 'yes') {
      const hasValidMembers = watchedValues.familyMembers && watchedValues.familyMembers.length > 0 &&
        watchedValues.familyMembers.some(member =>
          member.name.trim() !== '' ||
          member.relationship !== '' ||
          member.nationality.trim() !== ''
        );
      return hasValidMembers;
    }

    // 「いいえ」を選択した場合は有効
    return true;
  };

  const onSubmit = (data: FamilyInfoFormData) => {
    // 「はい」を選択した場合のみ、familyMembersのバリデーションを行う
    if (data.hasFamily === 'yes') {
      const hasValidMembers = data.familyMembers && data.familyMembers.length > 0 &&
        data.familyMembers.some(member =>
          member.name.trim() !== '' ||
          member.relationship !== '' ||
          member.nationality.trim() !== ''
        );

      if (!hasValidMembers) {
        alert('親族・同居者の情報を少なくとも1人入力してください。');
        return;
      }
    }

    // 「いいえ」を選択した場合、または未選択の場合はfamilyMembersをクリア
    const processedData = {
      ...data,
      familyMembers: data.hasFamily === 'yes' ? data.familyMembers : [],
    };

    updateFormData({ familyInfo: processedData });
    onNext();
  };

  const addFamilyMember = () => {
    append({ name: '', relationship: '', nationality: '', birthDate: '', occupation: '', visaStatus: '' });
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          在日親族・同居者情報
        </h2>
        <p className="text-gray-600">
          日本にいる親族や同居者の情報を入力してください
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* 在日親族・同居者の有無 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            日本に親族または同居者はいますか？
          </label>
          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="radio"
                {...register('hasFamily')}
                value="no"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <span className="ml-2 text-sm text-gray-900">いいえ</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                {...register('hasFamily')}
                value="yes"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <span className="ml-2 text-sm text-gray-900">はい</span>
            </label>
          </div>
          {errors.hasFamily && (
            <p className="mt-1 text-sm text-red-600">{String(errors.hasFamily.message)}</p>
          )}
        </div>

        {/* 親族・同居者の詳細 */}
        {hasFamily === 'yes' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">親族・同居者の詳細</h3>
              <button
                type="button"
                onClick={addFamilyMember}
                className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                + 追加
              </button>
            </div>

            {fields.map((field, index) => (
              <div key={field.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-md font-medium text-gray-800">
                    {index + 1}人目
                  </h4>
                  {fields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      削除
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* 氏名 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {hasFamily === 'yes' && <span className="text-red-500">*</span>} 氏名
                    </label>
                    <input
                      type="text"
                      {...register(`familyMembers.${index}.name`)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="山田太郎"
                    />
                    {errors.familyMembers?.[index]?.name && (
                      <p className="mt-1 text-sm text-red-600">
                        {String(errors.familyMembers[index]?.name?.message)}
                      </p>
                    )}
                  </div>

                  {/* 続柄 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {hasFamily === 'yes' && <span className="text-red-500">*</span>} 続柄
                    </label>
                    <select
                      {...register(`familyMembers.${index}.relationship`)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">選択してください</option>
                      <option value="配偶者">配偶者</option>
                      <option value="子">子</option>
                      <option value="父">父</option>
                      <option value="母">母</option>
                      <option value="兄弟姉妹">兄弟姉妹</option>
                      <option value="同居者">同居者</option>
                      <option value="その他">その他</option>
                    </select>
                    {errors.familyMembers?.[index]?.relationship && (
                      <p className="mt-1 text-sm text-red-600">
                        {String(errors.familyMembers[index]?.relationship?.message)}
                      </p>
                    )}
                  </div>

                  {/* 国籍 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {hasFamily === 'yes' && <span className="text-red-500">*</span>} 国籍
                    </label>
                    <input
                      type="text"
                      {...register(`familyMembers.${index}.nationality`)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="日本"
                    />
                    {errors.familyMembers?.[index]?.nationality && (
                      <p className="mt-1 text-sm text-red-600">
                        {String(errors.familyMembers[index]?.nationality?.message)}
                      </p>
                    )}
                  </div>

                  {/* 生年月日 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      生年月日
                    </label>
                    <input
                      type="date"
                      {...register(`familyMembers.${index}.birthDate`)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none text-left"
                      style={{ textAlign: 'left' }}
                    />
                  </div>

                  {/* 職業 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      職業
                    </label>
                    <input
                      type="text"
                      {...register(`familyMembers.${index}.occupation`)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="会社員"
                    />
                  </div>

                  {/* 在留資格 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      在留資格
                    </label>
                    <input
                      type="text"
                      {...register(`familyMembers.${index}.visaStatus`)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="日本国籍、永住者、技術・人文知識・国際業務 等"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

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
            disabled={!isNextButtonEnabled()}
            className={`px-6 py-2 text-sm font-medium text-white border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              isNextButtonEnabled()
                ? 'bg-blue-600 hover:bg-blue-700'
                : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            {t('common.next')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FamilyInfoForm;
