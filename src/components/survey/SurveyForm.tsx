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
    <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="text-center mb-6 sm:mb-8 lg:mb-12">
        <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-blue-100 rounded-2xl mb-4 sm:mb-6">
          <svg className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v6a2 2 0 002 2h6a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
          {t('survey.title')}
        </h2>
        <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-lg mx-auto leading-relaxed">
          {t('survey.description')}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6 lg:space-y-8">
        {/* 質問1: 在留資格 */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 lg:p-8 shadow-sm">
          <label className="block text-base sm:text-lg font-semibold text-gray-900 mb-4 sm:mb-6">
            <span className="inline-flex items-center">
              <span className="flex items-center justify-center w-6 h-6 bg-blue-600 text-white text-sm font-bold rounded-full mr-3">1</span>
              <span className="text-red-500">*</span> {t('survey.visaType')}
            </span>
          </label>
          <div className="grid grid-cols-1 gap-4">
            {Object.entries(VISA_TYPES).map(([value, labels]) => (
              <label key={value} className="relative flex items-start p-4 sm:p-5 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-blue-300 hover:bg-blue-50/50 transition-all duration-200 group">
                <input
                  type="radio"
                  {...register('visaType')}
                  value={value}
                  className="h-5 w-5 mt-0.5 text-blue-600 focus:ring-blue-500 border-gray-300 group-hover:border-blue-400"
                />
                <div className="ml-4 flex-1">
                  <div className="text-base sm:text-lg font-semibold text-gray-900 group-hover:text-blue-900 transition-colors">
                    {labels.ja}
                  </div>
                  <div className="text-sm text-gray-500 mt-1 group-hover:text-blue-600 transition-colors">
                    {labels.en}
                  </div>
                </div>
                <div className="ml-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </label>
            ))}
          </div>
          {errors.visaType && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700">{String(errors.visaType.message || 'エラーが発生しました')}</p>
            </div>
          )}
        </div>

        {/* 質問2: 手続き種類 */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 lg:p-8 shadow-sm">
          <label className="block text-base sm:text-lg font-semibold text-gray-900 mb-4 sm:mb-6">
            <span className="inline-flex items-center">
              <span className="flex items-center justify-center w-6 h-6 bg-blue-600 text-white text-sm font-bold rounded-full mr-3">2</span>
              <span className="text-red-500">*</span> {t('survey.procedureType')}
            </span>
          </label>
          <div className="grid grid-cols-1 gap-4">
            {Object.entries(PROCEDURE_TYPES).map(([value, labels]) => (
              <label key={value} className="relative flex items-start p-4 sm:p-5 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-blue-300 hover:bg-blue-50/50 transition-all duration-200 group">
                <input
                  type="radio"
                  {...register('procedureType')}
                  value={value}
                  className="h-5 w-5 mt-0.5 text-blue-600 focus:ring-blue-500 border-gray-300 group-hover:border-blue-400"
                />
                <div className="ml-4 flex-1">
                  <div className="text-base sm:text-lg font-semibold text-gray-900 group-hover:text-blue-900 transition-colors">
                    {labels.ja}
                  </div>
                  <div className="text-sm text-gray-500 mt-1 group-hover:text-blue-600 transition-colors">
                    {labels.en}
                  </div>
                </div>
                <div className="ml-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </label>
            ))}
          </div>
          {errors.procedureType && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700">{String(errors.procedureType.message || 'エラーが発生しました')}</p>
            </div>
          )}
        </div>

        {/* 質問3: 家族滞在の関係性（条件付き表示） */}
        {selectedVisaType === 'family' && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 sm:p-8 shadow-sm">
            <label className="block text-lg font-semibold text-gray-900 mb-6">
              <span className="inline-flex items-center">
                <span className="flex items-center justify-center w-6 h-6 bg-blue-600 text-white text-sm font-bold rounded-full mr-3">3</span>
                <span className="text-red-500">*</span> {t('survey.familyRelation')}
              </span>
            </label>
            <div className="grid grid-cols-1 gap-4">
              {Object.entries(FAMILY_RELATIONS).map(([value, labels]) => (
                <label key={value} className="relative flex items-start p-4 sm:p-5 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-blue-300 hover:bg-blue-50/50 transition-all duration-200 group">
                  <input
                    type="radio"
                    {...register('familyRelation')}
                    value={value}
                    className="h-5 w-5 mt-0.5 text-blue-600 focus:ring-blue-500 border-gray-300 group-hover:border-blue-400"
                  />
                  <div className="ml-4 flex-1">
                    <div className="text-base sm:text-lg font-semibold text-gray-900 group-hover:text-blue-900 transition-colors">
                      {labels.ja}
                    </div>
                    <div className="text-sm text-gray-500 mt-1 group-hover:text-blue-600 transition-colors">
                      {labels.en}
                    </div>
                  </div>
                  <div className="ml-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </label>
              ))}
            </div>
            {errors.familyRelation && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700">{String(errors.familyRelation.message || 'エラーが発生しました')}</p>
              </div>
            )}
          </div>
        )}



        {/* 進行状況の表示 */}
        {selectedVisaType && selectedProcedureType && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200 p-4 sm:p-6 shadow-sm">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-green-900 mb-2">
                  選択完了
                </h3>
                <div className="text-sm text-green-700 space-y-1">
                  <p><span className="font-medium">在留資格:</span> {VISA_TYPES[selectedVisaType as VisaType]?.ja}</p>
                  <p><span className="font-medium">手続き:</span> {PROCEDURE_TYPES[selectedProcedureType as ProcedureType]?.ja}</p>
                  {selectedVisaType === 'family' && (
                    <p className="text-green-600 font-medium">次の質問で関係性を選択してください</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ナビゲーションボタン */}
        <div className="flex flex-col sm:flex-row justify-between gap-4 sm:gap-0 pt-6 sm:pt-8 pb-4 sm:pb-6 border-t border-gray-200 mt-8">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-8 py-3 text-base font-semibold text-gray-700 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 shadow-sm hover:shadow-md transition-all duration-200 min-w-[200px] order-2 sm:order-1"
          >
            {t('common.back')}
          </button>

          <button
            type="submit"
            disabled={isSubmitting || !selectedVisaType || !selectedProcedureType}
            className="px-8 py-3 text-base font-semibold text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md transition-all duration-200 min-w-[200px] order-1 sm:order-2"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                処理中...
              </span>
            ) : (
              t('common.next')
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SurveyForm;
