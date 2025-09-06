import React from 'react';
import { useTranslation } from 'react-i18next';

interface LayoutProps {
  children: React.ReactNode;
  showHeader?: boolean;
  showProgress?: boolean;
  currentStep?: number;
  totalSteps?: number;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  showHeader = true,
  showProgress = false,
  currentStep = 0,
  totalSteps = 6,
}) => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {showHeader && (
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-12 sm:h-16">
              <div className="flex items-center">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-2 sm:mr-3">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h1 className="text-base sm:text-lg font-bold text-gray-900">
                  <span className="block sm:hidden">VISA申請</span>
                  <span className="hidden sm:block">VISA申請サービス</span>
                </h1>
              </div>

              <div className="flex items-center space-x-1 sm:space-x-4">
                <select
                  value={i18n.language}
                  onChange={(e) => changeLanguage(e.target.value)}
                  className="text-xs sm:text-sm rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-2 py-1 sm:px-3 sm:py-2 bg-white"
                >
                  <option value="ja">日本語</option>
                  <option value="en">English</option>
                  <option value="zh">中文</option>
                </select>
              </div>
            </div>
          </div>
        </header>
      )}

      <main className="max-w-full sm:max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-8 lg:py-12">
        <div className="bg-white sm:rounded-2xl sm:shadow-xl sm:border sm:border-gray-100 overflow-hidden">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
