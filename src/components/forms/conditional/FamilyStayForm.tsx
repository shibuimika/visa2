import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAppStore } from '../../../stores/appStore';
import { FamilyStayInfo, ProcedureType } from '../../../types';

// バリデーションスキーマ
const createSchema = (procedureType: ProcedureType) => {
  if (procedureType === 'renewal') {
    return z.object({
      relationshipCertificate: z.string().min(1, '関係証明書は必須です'),
      incomeCertificate: z.string().min(1, '収入証明書は必須です'),
      residenceRecord: z.string().min(1, '住民票は必須です'),
    });
  } else if (procedureType === 'change') {
    return z.object({
      relationshipCertificate: z.string().min(1, '関係証明書は必須です'),
      incomeCertificate: z.string().min(1, '収入証明書は必須です'),
      residenceRecord: z.string().min(1, '住民票は必須です'),
      currentVisaInfo: z.string().min(1, '現資格情報は必須です'),
    });
  }
  
  // デフォルトスキーマ
  return z.object({
    relationshipCertificate: z.string().optional(),
    incomeCertificate: z.string().optional(),
    residenceRecord: z.string().optional(),
    currentVisaInfo: z.string().optional(),
  });
};

interface FamilyStayFormProps {
  onNext: () => void;
  onBack: () => void;
}

const FamilyStayForm: React.FC<FamilyStayFormProps> = ({ onNext, onBack }) => {
  const { formData, survey, updateFormData } = useAppStore();
  
  // surveyの初期値を設定してhooksが条件付きで呼ばれないようにする
  const currentSurvey = survey || { procedureType: 'renewal' as ProcedureType, visaType: 'family' as any };
  const schema = createSchema(currentSurvey.procedureType);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FamilyStayInfo>({
    resolver: zodResolver(schema),
    defaultValues: formData.familyStayInfo,
  });

  // survey が存在しない場合のみ早期リターン
  if (!survey) return null;

  const onSubmit = (data: FamilyStayInfo) => {
    updateFormData({ familyStayInfo: data });
    onNext();
  };

  const renderFormFields = () => {
    const { procedureType } = survey;
    
    return (
      <>
        <div>
          <label htmlFor="relationshipCertificate" className="block text-sm font-medium text-gray-700 mb-1">
            関係証明書 *
          </label>
          <textarea
            {...register('relationshipCertificate')}
            id="relationshipCertificate"
            rows={4}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="扶養者との関係を証明する書類について入力してください（結婚証明書、出生証明書等）"
          />
          {errors.relationshipCertificate && (
            <p className="text-red-600 text-sm mt-1">{String(errors.relationshipCertificate.message)}</p>
          )}
        </div>

        <div>
          <label htmlFor="incomeCertificate" className="block text-sm font-medium text-gray-700 mb-1">
            収入証明書 *
          </label>
          <textarea
            {...register('incomeCertificate')}
            id="incomeCertificate"
            rows={4}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="扶養者の収入を証明する書類について入力してください（給与明細、源泉徴収票等）"
          />
          {errors.incomeCertificate && (
            <p className="text-red-600 text-sm mt-1">{String(errors.incomeCertificate.message)}</p>
          )}
        </div>

        <div>
          <label htmlFor="residenceRecord" className="block text-sm font-medium text-gray-700 mb-1">
            住民票 *
          </label>
          <textarea
            {...register('residenceRecord')}
            id="residenceRecord"
            rows={3}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="家族全員が記載された住民票について入力してください"
          />
          {errors.residenceRecord && (
            <p className="text-red-600 text-sm mt-1">{String(errors.residenceRecord.message)}</p>
          )}
        </div>

        {procedureType === 'change' && (
          <div>
            <label htmlFor="currentVisaInfo" className="block text-sm font-medium text-gray-700 mb-1">
              現資格情報 *
            </label>
            <textarea
              {...register('currentVisaInfo')}
              id="currentVisaInfo"
              rows={3}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="現在の在留資格に関する情報を入力してください"
            />
            {errors.currentVisaInfo && (
              <p className="text-red-600 text-sm mt-1">{String(errors.currentVisaInfo.message)}</p>
            )}
          </div>
        )}


      </>
    );
  };

  const getFormTitle = () => {
    const { procedureType, familyRelation } = survey;
    const relationText = familyRelation === 'spouse' ? '配偶者' : 
                        familyRelation === 'child' ? '子' : 'その他';
    
    switch (procedureType) {
      case 'renewal':
        return `家族滞在（更新・${relationText}）`;
      case 'change':
        return `家族滞在（変更・${relationText}）`;
      default:
        return `家族滞在（${relationText}）`;
    }
  };

  const getFormDescription = () => {
    const { familyRelation } = survey;
    const relationText = familyRelation === 'spouse' ? '配偶者' : 
                        familyRelation === 'child' ? 'お子様' : '家族';
    
    return `家族滞在の在留資格（${relationText}）に関する情報を入力してください。`;
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-4 sm:p-6">
      <div className="text-center mb-6 sm:mb-8">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
          {getFormTitle()}
        </h2>
        <p className="text-sm sm:text-base text-gray-600">
          {getFormDescription()}
        </p>
      </div>

      {survey.familyRelation && (
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">関係性について</h3>
              <p className="text-sm text-blue-700 mt-1">
                選択された関係性: <strong>
                  {survey.familyRelation === 'spouse' ? '配偶者' :
                   survey.familyRelation === 'child' ? '子' : 'その他'}
                </strong>
              </p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {renderFormFields()}

        <div className="flex justify-between pt-6 border-t">
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

export default FamilyStayForm;
