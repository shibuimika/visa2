import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../stores/appStore';
import BasicInfoForm from './BasicInfoForm';
import PassportInfoForm from './PassportInfoForm';
import ResidenceCardForm from './ResidenceCardForm';
import CriminalHistoryForm from './CriminalHistoryForm';
import FamilyInfoForm from './FamilyInfoForm';
import PhotoUploadForm from './PhotoUploadForm';
// 条件付きフォーム
import EngineerHumanitiesForm from './conditional/EngineerHumanitiesForm';
import SpecificSkill1Form from './conditional/SpecificSkill1Form';
import SpecificSkill2Form from './conditional/SpecificSkill2Form';
import StudentForm from './conditional/StudentForm';
import FamilyStayForm from './conditional/FamilyStayForm';

const FormContainer: React.FC = () => {
  const navigate = useNavigate();
  const { survey } = useAppStore();
  const [currentStep, setCurrentStep] = useState(0);

  // アンケート結果がない場合はアンケートページにリダイレクト
  if (!survey) {
    navigate('/survey');
    return null;
  }

  // 条件付きフォームのステップを決定
  const getConditionalStep = () => {
    switch (survey.visaType) {
      case 'engineer':
        return { 
          id: 'engineer', 
          title: '技人国情報', 
          component: EngineerHumanitiesForm,
          required: true 
        };
      case 'specific-1':
        return { 
          id: 'specific1', 
          title: '特定技能1号情報', 
          component: SpecificSkill1Form,
          required: true 
        };
      case 'specific-2':
        return { 
          id: 'specific2', 
          title: '特定技能2号情報', 
          component: SpecificSkill2Form,
          required: true 
        };
      case 'student':
        return { 
          id: 'student', 
          title: '留学情報', 
          component: StudentForm,
          required: true 
        };
      case 'family':
        return { 
          id: 'family-stay', 
          title: '家族滞在情報', 
          component: FamilyStayForm,
          required: true 
        };
      default:
        return null;
    }
  };

  const conditionalStep = getConditionalStep();

  const steps = [
    { 
      id: 'basic', 
      title: '基本情報', 
      component: BasicInfoForm,
      required: true 
    },
    { 
      id: 'passport', 
      title: 'パスポート情報', 
      component: PassportInfoForm,
      required: true 
    },
    {
      id: 'residence',
      title: '在留カード情報',
      component: ResidenceCardForm,
      required: survey.procedureType === 'renewal' // 更新時は必須
    },
    { 
      id: 'criminal', 
      title: '犯罪歴', 
      component: CriminalHistoryForm,
      required: true 
    },
    { 
      id: 'family', 
      title: '親族・同居者', 
      component: FamilyInfoForm,
      required: true 
    },
    // 条件付きフォーム（在留資格により動的に決定）
    ...(conditionalStep ? [conditionalStep] : []),
    { 
      id: 'photo', 
      title: '証明写真', 
      component: PhotoUploadForm,
      required: true 
    },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // 全てのステップが完了したら確認画面へ
      navigate('/confirmation');
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      // 最初のステップの場合は準備物チェックページに戻る
      navigate('/requirements');
    }
  };

  const CurrentStepComponent = steps[currentStep].component;

  return (
    <div className="min-h-full">
      {/* プログレスインジケーター */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                  index <= currentStep
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {index + 1}
              </div>
              <span
                className={`ml-2 text-sm font-medium ${
                  index <= currentStep ? 'text-blue-600' : 'text-gray-500'
                }`}
              >
                {step.title}
              </span>
              {index < steps.length - 1 && (
                <div
                  className={`w-12 h-0.5 mx-4 ${
                    index < currentStep ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 現在のステップのフォーム */}
      <CurrentStepComponent onNext={handleNext} onBack={handleBack} />

      {/* 進行状況の説明 */}
      <div className="max-w-2xl mx-auto mt-8 px-4">
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-900 mb-2">
            入力のヒント
          </h3>
          <div className="text-sm text-gray-600 space-y-1">
            {steps[currentStep].id === 'basic' && (
              <div>
                <p>• 氏名は公的書類（パスポート、在留カード）と完全に一致するように入力してください</p>
                <p>• 住所は現在お住まいの住所を正確に入力してください</p>
              </div>
            )}
            {steps[currentStep].id === 'passport' && (
              <div>
                <p>• パスポート番号は大文字で入力してください</p>
                <p>• 有効期限が6ヶ月以上残っていることを確認してください</p>
              </div>
            )}
            {steps[currentStep].id === 'residence' && (
              <div>
                <p>• 在留カード番号は12桁の英数字です</p>
                <p>• 現在の在留資格を正確に選択してください</p>
              </div>
            )}
            {steps[currentStep].id === 'criminal' && (
              <div>
                <p>• 正確な情報を入力してください。虚偽の申告は許可に影響します</p>
                <p>• わからない場合は「いいえ」を選択し、詳細は空欄にしてください</p>
              </div>
            )}
            {steps[currentStep].id === 'family' && (
              <div>
                <p>• 日本にいる親族や同居者の情報を入力してください</p>
                <p>• いない場合は「いいえ」を選択してください</p>
              </div>
            )}
            {steps[currentStep].id === 'engineer' && (
              <div>
                <p>• 技術・人文知識・国際業務の在留資格に必要な情報を入力してください</p>
                <p>• 手続き種類（{survey.procedureType === 'renewal' ? '更新' : survey.procedureType === 'change' ? '変更' : '取得'}）に応じて必要項目が変わります</p>
              </div>
            )}
            {steps[currentStep].id === 'specific1' && (
              <div>
                <p>• 特定技能1号の在留資格に必要な情報を入力してください</p>
                <p>• 支援計画書や評価試験合格証などの正確な情報を入力してください</p>
              </div>
            )}
            {steps[currentStep].id === 'specific2' && (
              <div>
                <p>• 特定技能2号の在留資格に必要な情報を入力してください</p>
                <p>• 実務経験証明または技能試験合格証のいずれかは必須です</p>
              </div>
            )}
            {steps[currentStep].id === 'student' && (
              <div>
                <p>• 留学の在留資格に必要な情報を入力してください</p>
                <p>• 学校からの証明書は原本または認証済みコピーを準備してください</p>
              </div>
            )}
            {steps[currentStep].id === 'family-stay' && (
              <div>
                <p>• 家族滞在の在留資格に必要な情報を入力してください</p>
                <p>• 扶養者との関係を証明する書類が重要です</p>
              </div>
            )}
            {steps[currentStep].id === 'photo' && (
              <div>
                <p>• 6ヶ月以内に撮影された証明写真をアップロードしてください</p>
                <p>• サイズは縦4cm×横3cm（パスポート写真サイズ）が理想的です</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormContainer;
