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
      <div className="w-full px-2 sm:px-4 mb-6 sm:mb-8">
        {/* 超コンパクト版：1画面に7ステップ全て収まる */}
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-center">
            <div className="w-full max-w-2xl">
              <div className="flex items-center justify-center space-x-1 overflow-x-auto px-1 py-2 scrollbar-hide">
                {steps.map((step, index) => (
                  <div key={step.id} className="flex items-center flex-shrink-0 min-w-0 group">
                    <div
                      className={`flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-full text-xs font-bold transition-all duration-300 ${
                        index <= currentStep
                          ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-md'
                          : 'bg-gray-100 text-gray-400 border border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      {index + 1}
                    </div>
                    {index < steps.length - 1 && (
                      <div
                        className={`w-3 h-0.5 mx-1 transition-all duration-300 ${
                          index < currentStep
                            ? 'bg-gradient-to-r from-blue-500 to-blue-600'
                            : 'bg-gray-200'
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 現在のステップ名表示（モバイル・デスクトップ共通） */}
        <div className="text-center mt-2">
          <div className="inline-flex items-center px-3 py-1 bg-blue-50 rounded-full border border-blue-200">
            <span className="text-xs font-semibold text-blue-700">
              {currentStep + 1}. {steps[currentStep]?.title}
            </span>
          </div>
        </div>
      </div>

      {/* 現在のステップのフォーム */}
      <div className="mb-12 sm:mb-16">
        <CurrentStepComponent onNext={handleNext} onBack={handleBack} />
      </div>

      {/* 進行状況の説明 */}
      <div className="max-w-3xl mx-auto mb-16 sm:mb-20 px-4 sm:px-6">
        <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl border border-blue-200/60 p-6 sm:p-8 shadow-xl backdrop-blur-sm relative overflow-hidden">
          {/* 装飾的な背景要素 */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-200/20 to-purple-200/20 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-indigo-200/20 to-blue-200/20 rounded-full translate-y-12 -translate-x-12"></div>

          <div className="flex items-start space-x-4 relative z-10">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-600 bg-clip-text text-transparent">
                  入力のヒント
                </span>
                <div className="ml-4 h-0.5 bg-gradient-to-r from-blue-200 via-blue-300 to-indigo-200 flex-1 rounded-full"></div>
              </h3>
              <div className="text-sm sm:text-base text-gray-700 space-y-4 leading-relaxed">
                {steps[currentStep].id === 'basic' && (
                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex items-start space-x-3 sm:space-x-4">
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500 rounded-full mt-2 sm:mt-2.5 flex-shrink-0"></div>
                      <p className="text-gray-700 text-sm sm:text-base leading-relaxed">氏名は公的書類（パスポート、在留カード）と完全に一致するように入力してください</p>
                    </div>
                    <div className="flex items-start space-x-3 sm:space-x-4">
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500 rounded-full mt-2 sm:mt-2.5 flex-shrink-0"></div>
                      <p className="text-gray-700 text-sm sm:text-base leading-relaxed">住所は現在お住まいの住所を正確に入力してください</p>
                    </div>
                  </div>
                )}
                {steps[currentStep].id === 'passport' && (
                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex items-start space-x-3 sm:space-x-4">
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500 rounded-full mt-2 sm:mt-2.5 flex-shrink-0"></div>
                      <p className="text-gray-700 text-sm sm:text-base leading-relaxed">パスポート番号は大文字で入力してください</p>
                    </div>
                    <div className="flex items-start space-x-3 sm:space-x-4">
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500 rounded-full mt-2 sm:mt-2.5 flex-shrink-0"></div>
                      <p className="text-gray-700 text-sm sm:text-base leading-relaxed">有効期限が6ヶ月以上残っていることを確認してください</p>
                    </div>
                  </div>
                )}
                {steps[currentStep].id === 'residence' && (
                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex items-start space-x-3 sm:space-x-4">
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500 rounded-full mt-2 sm:mt-2.5 flex-shrink-0"></div>
                      <p className="text-gray-700 text-sm sm:text-base leading-relaxed">在留カード番号は12桁の英数字です</p>
                    </div>
                    <div className="flex items-start space-x-3 sm:space-x-4">
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500 rounded-full mt-2 sm:mt-2.5 flex-shrink-0"></div>
                      <p className="text-gray-700 text-sm sm:text-base leading-relaxed">現在の在留資格を正確に選択してください</p>
                    </div>
                  </div>
                )}
                {steps[currentStep].id === 'criminal' && (
                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex items-start space-x-3 sm:space-x-4">
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500 rounded-full mt-2 sm:mt-2.5 flex-shrink-0"></div>
                      <p className="text-gray-700 text-sm sm:text-base leading-relaxed">正確な情報を入力してください。虚偽の申告は許可に影響します</p>
                    </div>
                    <div className="flex items-start space-x-3 sm:space-x-4">
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500 rounded-full mt-2 sm:mt-2.5 flex-shrink-0"></div>
                      <p className="text-gray-700 text-sm sm:text-base leading-relaxed">わからない場合は「いいえ」を選択し、詳細は空欄にしてください</p>
                    </div>
                  </div>
                )}
                {steps[currentStep].id === 'family' && (
                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex items-start space-x-3 sm:space-x-4">
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500 rounded-full mt-2 sm:mt-2.5 flex-shrink-0"></div>
                      <p className="text-gray-700 text-sm sm:text-base leading-relaxed">日本にいる親族や同居者の情報を入力してください</p>
                    </div>
                    <div className="flex items-start space-x-3 sm:space-x-4">
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500 rounded-full mt-2 sm:mt-2.5 flex-shrink-0"></div>
                      <p className="text-gray-700 text-sm sm:text-base leading-relaxed">いない場合は「いいえ」を選択してください</p>
                    </div>
                  </div>
                )}
                {steps[currentStep].id === 'engineer' && (
                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex items-start space-x-3 sm:space-x-4">
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500 rounded-full mt-2 sm:mt-2.5 flex-shrink-0"></div>
                      <p className="text-gray-700 text-sm sm:text-base leading-relaxed">技術・人文知識・国際業務の在留資格に必要な情報を入力してください</p>
                    </div>
                    <div className="flex items-start space-x-3 sm:space-x-4">
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500 rounded-full mt-2 sm:mt-2.5 flex-shrink-0"></div>
                      <p className="text-gray-700 text-sm sm:text-base leading-relaxed">手続き種類（{survey.procedureType === 'renewal' ? '更新' : survey.procedureType === 'change' ? '変更' : '取得'}）に応じて必要項目が変わります</p>
                    </div>
                  </div>
                )}
                {steps[currentStep].id === 'specific1' && (
                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex items-start space-x-3 sm:space-x-4">
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500 rounded-full mt-2 sm:mt-2.5 flex-shrink-0"></div>
                      <p className="text-gray-700 text-sm sm:text-base leading-relaxed">特定技能1号の在留資格に必要な情報を入力してください</p>
                    </div>
                    <div className="flex items-start space-x-3 sm:space-x-4">
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500 rounded-full mt-2 sm:mt-2.5 flex-shrink-0"></div>
                      <p className="text-gray-700 text-sm sm:text-base leading-relaxed">支援計画書や評価試験合格証などの正確な情報を入力してください</p>
                    </div>
                  </div>
                )}
                {steps[currentStep].id === 'specific2' && (
                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex items-start space-x-3 sm:space-x-4">
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500 rounded-full mt-2 sm:mt-2.5 flex-shrink-0"></div>
                      <p className="text-gray-700 text-sm sm:text-base leading-relaxed">特定技能2号の在留資格に必要な情報を入力してください</p>
                    </div>
                    <div className="flex items-start space-x-3 sm:space-x-4">
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500 rounded-full mt-2 sm:mt-2.5 flex-shrink-0"></div>
                      <p className="text-gray-700 text-sm sm:text-base leading-relaxed">実務経験証明または技能試験合格証のいずれかは必須です</p>
                    </div>
                  </div>
                )}
                {steps[currentStep].id === 'student' && (
                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex items-start space-x-3 sm:space-x-4">
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500 rounded-full mt-2 sm:mt-2.5 flex-shrink-0"></div>
                      <p className="text-gray-700 text-sm sm:text-base leading-relaxed">留学の在留資格に必要な情報を入力してください</p>
                    </div>
                    <div className="flex items-start space-x-3 sm:space-x-4">
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500 rounded-full mt-2 sm:mt-2.5 flex-shrink-0"></div>
                      <p className="text-gray-700 text-sm sm:text-base leading-relaxed">学校からの証明書は原本または認証済みコピーを準備してください</p>
                    </div>
                  </div>
                )}
                {steps[currentStep].id === 'family-stay' && (
                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex items-start space-x-3 sm:space-x-4">
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500 rounded-full mt-2 sm:mt-2.5 flex-shrink-0"></div>
                      <p className="text-gray-700 text-sm sm:text-base leading-relaxed">家族滞在の在留資格に必要な情報を入力してください</p>
                    </div>
                    <div className="flex items-start space-x-3 sm:space-x-4">
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500 rounded-full mt-2 sm:mt-2.5 flex-shrink-0"></div>
                      <p className="text-gray-700 text-sm sm:text-base leading-relaxed">扶養者との関係を証明する書類が重要です</p>
                    </div>
                  </div>
                )}
                {steps[currentStep].id === 'photo' && (
                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex items-start space-x-3 sm:space-x-4">
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500 rounded-full mt-2 sm:mt-2.5 flex-shrink-0"></div>
                      <p className="text-gray-700 text-sm sm:text-base leading-relaxed">6ヶ月以内に撮影された証明写真をアップロードしてください</p>
                    </div>
                    <div className="flex items-start space-x-3 sm:space-x-4">
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500 rounded-full mt-2 sm:mt-2.5 flex-shrink-0"></div>
                      <p className="text-gray-700 text-sm sm:text-base leading-relaxed">サイズは縦4cm×横3cm（パスポート写真サイズ）が理想的です</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormContainer;
