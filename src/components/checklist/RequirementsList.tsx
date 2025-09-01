import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../stores/appStore';
import { areAllRequirementsMet } from '../../utils/requirements';
import type { RequirementItem } from '../../types';

const RequirementsList: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { requirements, setRequirements } = useAppStore();

  if (!requirements) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">アンケートを完了してください</p>
        <button
          onClick={() => navigate('/survey')}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          アンケートに戻る
        </button>
      </div>
    );
  }

  const toggleRequirement = (itemId: string, category: 'system' | 'document') => {
    const updatedRequirements = { ...requirements };
    
    if (category === 'system') {
      updatedRequirements.systemRequirements = requirements.systemRequirements.map(item =>
        item.id === itemId ? { ...item, checked: !item.checked } : item
      );
    } else {
      updatedRequirements.documentRequirements = requirements.documentRequirements.map(item =>
        item.id === itemId ? { ...item, checked: !item.checked } : item
      );
    }
    
    setRequirements(updatedRequirements);
  };

  const allRequirementsMet = areAllRequirementsMet(requirements);

  const RequirementItem: React.FC<{ item: RequirementItem; category: 'system' | 'document' }> = ({ item, category }) => (
    <div 
      className={`flex items-start p-4 border rounded-lg cursor-pointer transition-colors ${
        item.checked 
          ? 'bg-green-50 border-green-200' 
          : 'bg-white border-gray-200 hover:bg-gray-50'
      }`}
      onClick={() => toggleRequirement(item.id, category)}
    >
      <div className="flex-shrink-0 mt-1">
        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
          item.checked 
            ? 'bg-green-600 border-green-600' 
            : 'border-gray-300'
        }`}>
          {item.checked && (
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          )}
        </div>
      </div>
      
      <div className="ml-3 flex-1">
        <div className="flex items-center">
          <h3 className={`text-sm font-medium ${item.checked ? 'text-green-900' : 'text-gray-900'}`}>
            {item.name}
            {item.required && <span className="text-red-500 ml-1">*</span>}
          </h3>
        </div>
        {item.description && (
          <p className={`mt-1 text-sm ${item.checked ? 'text-green-700' : 'text-gray-600'}`}>
            {item.description}
          </p>
        )}
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {t('requirements.title')}
          </h2>
          <p className="text-gray-600">
            {t('requirements.description')}
          </p>
        </div>

        {/* システム環境要件 */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-2">
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
              </svg>
            </div>
            {t('requirements.systemTitle')}
          </h3>
          
          <div className="space-y-3">
            {requirements.systemRequirements.map((item) => (
              <RequirementItem key={item.id} item={item} category="system" />
            ))}
          </div>
        </div>

        {/* 必要書類 */}
        {requirements.documentRequirements.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <div className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center mr-2">
                <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              {t('requirements.documentsTitle')}
            </h3>
            
            <div className="space-y-3">
              {requirements.documentRequirements.map((item) => (
                <RequirementItem key={item.id} item={item} category="document" />
              ))}
            </div>
          </div>
        )}

        {/* 進行状況 */}
        {allRequirementsMet && (
          <div className="mb-6 p-4 bg-green-50 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">
                  {t('requirements.allComplete')}
                </h3>
                <div className="mt-1 text-sm text-green-700">
                  <p>全ての準備が完了しました。申請フォームの入力に進んでください。</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ナビゲーションボタン */}
        <div className="flex justify-between pt-6 border-t">
          <button
            onClick={() => navigate('/survey')}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {t('common.back')}
          </button>
          
          <button
            onClick={() => navigate('/form')}
            disabled={!allRequirementsMet}
            className="px-6 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t('requirements.proceedToForm')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RequirementsList;
