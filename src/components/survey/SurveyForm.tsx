import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../stores/appStore';
import { VISA_TYPES, PROCEDURE_TYPES, FAMILY_RELATIONS } from '../../constants';
import { determineRequirements } from '../../utils/requirements';
import { safeVisaTypeConversion, safeProcedureTypeConversion, safeFamilyRelationConversion } from '../../utils/formValidation';
import type { VisaType, ProcedureType } from '../../types';

const surveySchema = z.object({
  visaType: z.string(),
  procedureType: z.string(),
  familyRelation: z.string().optional(),
  workStatus: z.string().optional(),
});

type SurveyFormData = z.infer<typeof surveySchema>;

const SurveyForm: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { setSurveyAnswers, setRequirements } = useAppStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SurveyFormData>({
    resolver: zodResolver(surveySchema),
  });

  const selectedVisaType = watch('visaType');
  const selectedProcedureType = watch('procedureType');

  const onSubmit = async (data: SurveyFormData) => {
    setIsSubmitting(true);
    
    try {
      // 安全な型変換でアンケート結果を保存
      const visaType = safeVisaTypeConversion(data.visaType);
      const procedureType = safeProcedureTypeConversion(data.procedureType);
      const familyRelation = data.familyRelation ? safeFamilyRelationConversion(data.familyRelation) : undefined;
      
      if (!visaType || !procedureType) {
        console.error('Invalid form data');
        return;
      }
      
      const surveyData = {
        visaType,
        procedureType,
        familyRelation,
        workStatus: data.workStatus,
      };
      
      setSurveyAnswers(surveyData);
      
      // 必要準備物を決定
      const requirements = determineRequirements(surveyData);
      setRequirements(requirements);
      
      // 準備物チェックページに遷移
      navigate('/requirements');
    } catch (error) {
      console.error('Survey submission failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {t('survey.title')}
        </h2>
        <p className="text-gray-600">
          {t('survey.description')}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* 質問1: 在留資格 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            <span className="text-red-500">*</span> {t('survey.visaType')}
          </label>
          <div className="grid grid-cols-1 gap-3">
            {Object.entries(VISA_TYPES).map(([value, labels]) => (
              <label key={value} className="relative flex items-center p-3 border rounded-md cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  {...register('visaType')}
                  value={value}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <div className="ml-3">
                  <div className="text-sm font-medium text-gray-900">
                    {labels.ja}
                  </div>
                  <div className="text-xs text-gray-500">
                    {labels.en}
                  </div>
                </div>
              </label>
            ))}
          </div>
          {errors.visaType && (
            <p className="mt-1 text-sm text-red-600">{String(errors.visaType.message || 'エラーが発生しました')}</p>
          )}
        </div>

        {/* 質問2: 手続き種類 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            <span className="text-red-500">*</span> {t('survey.procedureType')}
          </label>
          <div className="grid grid-cols-1 gap-3">
            {Object.entries(PROCEDURE_TYPES).map(([value, labels]) => (
              <label key={value} className="relative flex items-center p-3 border rounded-md cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  {...register('procedureType')}
                  value={value}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <div className="ml-3">
                  <div className="text-sm font-medium text-gray-900">
                    {labels.ja}
                  </div>
                  <div className="text-xs text-gray-500">
                    {labels.en}
                  </div>
                </div>
              </label>
            ))}
          </div>
          {errors.procedureType && (
            <p className="mt-1 text-sm text-red-600">{String(errors.procedureType.message || 'エラーが発生しました')}</p>
          )}
        </div>

        {/* 質問3: 家族滞在の関係性（条件付き表示） */}
        {selectedVisaType === 'family' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              <span className="text-red-500">*</span> {t('survey.familyRelation')}
            </label>
            <div className="grid grid-cols-1 gap-3">
              {Object.entries(FAMILY_RELATIONS).map(([value, labels]) => (
                <label key={value} className="relative flex items-center p-3 border rounded-md cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    {...register('familyRelation')}
                    value={value}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <div className="ml-3">
                    <div className="text-sm font-medium text-gray-900">
                      {labels.ja}
                    </div>
                    <div className="text-xs text-gray-500">
                      {labels.en}
                    </div>
                  </div>
                </label>
              ))}
            </div>
            {errors.familyRelation && (
              <p className="mt-1 text-sm text-red-600">{String(errors.familyRelation.message || 'エラーが発生しました')}</p>
            )}
          </div>
        )}

        {/* 質問4: 勤務先・学校の状況（任意） */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('survey.workStatus')}
          </label>
          <textarea
            {...register('workStatus')}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="現在の勤務先や学校での状況があれば記入してください（任意）"
          />
        </div>

        {/* 進行状況の表示 */}
        {selectedVisaType && selectedProcedureType && (
          <div className="p-4 bg-green-50 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">
                  選択完了
                </h3>
                <div className="mt-1 text-sm text-green-700">
                  <p>在留資格: {VISA_TYPES[selectedVisaType as VisaType]?.ja}</p>
                  <p>手続き: {PROCEDURE_TYPES[selectedProcedureType as ProcedureType]?.ja}</p>
                  {selectedVisaType === 'family' && (
                    <p>次の質問で関係性を選択してください</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 送信ボタン */}
        <div className="flex justify-between pt-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {t('common.back')}
          </button>
          
          <button
            type="submit"
            disabled={isSubmitting || !selectedVisaType || !selectedProcedureType}
            className="px-6 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? t('common.loading') : t('common.next')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SurveyForm;
