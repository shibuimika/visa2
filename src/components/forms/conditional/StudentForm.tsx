import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAppStore } from '../../../stores/appStore';
import { StudentInfo, ProcedureType } from '../../../types';

// バリデーションスキーマ
const createSchema = (procedureType: ProcedureType) => {
  if (procedureType === 'renewal') {
    return z.object({
      enrollmentCertificate: z.string().min(1, '在学証明書は必須です'),
      transcript: z.string().min(1, '成績証明書は必須です'),
      attendanceCertificate: z.string().min(1, '出席証明書は必須です'),
      tuitionPaymentCertificate: z.string().min(1, '学費納入証明書は必須です'),
    });
  } else if (procedureType === 'change') {
    return z.object({
      graduationCertificate: z.string().min(1, '卒業証明書は必須です'),
      employmentContract: z.string().min(1, '雇用契約書は必須です'),
      companyInfo: z.string().min(1, '勤務先情報は必須です'),
    });
  }
  
  // デフォルトスキーマ
  return z.object({
    enrollmentCertificate: z.string().optional(),
    transcript: z.string().optional(),
    attendanceCertificate: z.string().optional(),
    tuitionPaymentCertificate: z.string().optional(),
    graduationCertificate: z.string().optional(),
    employmentContract: z.string().optional(),
    companyInfo: z.string().optional(),
  });
};

interface StudentFormProps {
  onNext: () => void;
  onBack: () => void;
}

const StudentForm: React.FC<StudentFormProps> = ({ onNext, onBack }) => {
  const { formData, survey, updateFormData } = useAppStore();
  
  // surveyの初期値を設定してhooksが条件付きで呼ばれないようにする
  const currentSurvey = survey || { procedureType: 'renewal' as ProcedureType, visaType: 'student' as any };
  const schema = createSchema(currentSurvey.procedureType);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<StudentInfo>({
    resolver: zodResolver(schema),
    defaultValues: formData.studentInfo,
  });

  // survey が存在しない場合のみ早期リターン
  if (!survey) return null;

  const onSubmit = (data: StudentInfo) => {
    updateFormData({ studentInfo: data });
    onNext();
  };

  const renderFormFields = () => {
    const { procedureType } = survey;

    if (procedureType === 'renewal') {
      return (
        <>
          <div>
            <label htmlFor="enrollmentCertificate" className="block text-sm font-medium text-gray-700 mb-1">
              在学証明書 *
            </label>
            <textarea
              {...register('enrollmentCertificate')}
              id="enrollmentCertificate"
              rows={3}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="在学証明書の詳細を入力してください"
            />
            {errors.enrollmentCertificate?.message && (
              <p className="text-red-600 text-sm mt-1">{String(errors.enrollmentCertificate.message)}</p>
            )}
          </div>

          <div>
            <label htmlFor="transcript" className="block text-sm font-medium text-gray-700 mb-1">
              成績証明書 *
            </label>
            <textarea
              {...register('transcript')}
              id="transcript"
              rows={3}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="最新の成績証明書について入力してください"
            />
            {errors.transcript?.message && (
              <p className="text-red-600 text-sm mt-1">{String(errors.transcript.message)}</p>
            )}
          </div>

          <div>
            <label htmlFor="attendanceCertificate" className="block text-sm font-medium text-gray-700 mb-1">
              出席証明書 *
            </label>
            <textarea
              {...register('attendanceCertificate')}
              id="attendanceCertificate"
              rows={3}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="出席状況に関する証明書の内容を入力してください"
            />
            {errors.attendanceCertificate && (
              <p className="text-red-600 text-sm mt-1">{String(errors.attendanceCertificate.message)}</p>
            )}
          </div>

          <div>
            <label htmlFor="tuitionPaymentCertificate" className="block text-sm font-medium text-gray-700 mb-1">
              学費納入証明書 *
            </label>
            <textarea
              {...register('tuitionPaymentCertificate')}
              id="tuitionPaymentCertificate"
              rows={3}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="学費の納入状況に関する証明書を入力してください"
            />
            {errors.tuitionPaymentCertificate?.message && (
              <p className="text-red-600 text-sm mt-1">{String(errors.tuitionPaymentCertificate.message)}</p>
            )}
          </div>
        </>
      );
    } else if (procedureType === 'change') {
      return (
        <>
          <div>
            <label htmlFor="graduationCertificate" className="block text-sm font-medium text-gray-700 mb-1">
              卒業証明書 *
            </label>
            <textarea
              {...register('graduationCertificate')}
              id="graduationCertificate"
              rows={3}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="学校からの卒業証明書について入力してください"
            />
            {errors.graduationCertificate?.message && (
              <p className="text-red-600 text-sm mt-1">{String(errors.graduationCertificate.message)}</p>
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
              placeholder="就職先との雇用契約書の内容を入力してください"
            />
            {errors.employmentContract?.message && (
              <p className="text-red-600 text-sm mt-1">{String(errors.employmentContract.message)}</p>
            )}
          </div>

          <div>
            <label htmlFor="companyInfo" className="block text-sm font-medium text-gray-700 mb-1">
              勤務先情報 *
            </label>
            <textarea
              {...register('companyInfo')}
              id="companyInfo"
              rows={4}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="就職先企業の詳細情報を入力してください（会社名、住所、業種、資本金等）"
            />
            {errors.companyInfo?.message && (
              <p className="text-red-600 text-sm mt-1">{String(errors.companyInfo.message)}</p>
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
        return '留学（更新）';
      case 'change':
        return '留学（変更）';
      default:
        return '留学';
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{getFormTitle()}</h2>
        <p className="text-gray-600">
          留学の在留資格に関する情報を入力してください。
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

export default StudentForm;
