import React from 'react';
import RegistrationForm from '../components/auth/RegistrationForm';

const RegistrationPage: React.FC = () => {
  return (
    <div className="min-h-full flex flex-col justify-center">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          VISA申請サービス
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          在日外国人向けの簡単で安心なVISA申請サポートサービスです。<br />
          アンケートに答えるだけで、あなたに最適な申請フローをご案内します。
        </p>
      </div>
      
      <RegistrationForm />
      
      <div className="mt-8 text-center">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="flex flex-col items-center p-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-sm font-medium text-gray-900 mb-1">簡単アンケート</h3>
            <p className="text-xs text-gray-600 text-center">4問の質問で最適なフローを自動生成</p>
          </div>
          
          <div className="flex flex-col items-center p-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-3">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-sm font-medium text-gray-900 mb-1">必要書類明確化</h3>
            <p className="text-xs text-gray-600 text-center">準備すべき書類を事前に確認</p>
          </div>
          
          <div className="flex flex-col items-center p-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-3">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-sm font-medium text-gray-900 mb-1">PDF申請書生成</h3>
            <p className="text-xs text-gray-600 text-center">入力完了後、すぐにダウンロード可能</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationPage;
