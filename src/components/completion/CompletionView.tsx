import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../stores/appStore';

const CompletionView: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { formData, survey, reset } = useAppStore();
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  if (!survey) {
    navigate('/survey');
    return null;
  }

  const handleDownloadPDF = async () => {
    setIsGeneratingPDF(true);
    
    try {
      // 実際のPDF生成処理をここに実装
      // 現在はモックとして2秒後にダウンロード完了とする
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // PDF生成のモック（実際には適切なPDFライブラリを使用）
      const pdfContent = generatePDFContent();
      const blob = new Blob([pdfContent], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `visa_application_${survey.visaType}_${survey.procedureType}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('PDF generation failed:', error);
      alert('PDF生成に失敗しました。もう一度お試しください。');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const generatePDFContent = () => {
    // 実際のPDF生成では適切なライブラリ（jsPDF、PDFKit等）を使用
    // ここでは簡易的なテキストファイルとして出力
    const fullNameEn = formData.basicInfo?.lastNameEn && formData.basicInfo?.firstNameEn
      ? `${formData.basicInfo.lastNameEn} ${formData.basicInfo.firstNameEn}`
      : '';

    const fullNameJa = formData.basicInfo?.lastNameJa && formData.basicInfo?.firstNameJa
      ? `${formData.basicInfo.lastNameJa} ${formData.basicInfo.firstNameJa}`
      : '';

    const fullAddress = [
      formData.basicInfo?.postalCode && `〒${formData.basicInfo.postalCode}`,
      formData.basicInfo?.country,
      formData.basicInfo?.prefecture,
      formData.basicInfo?.city,
      formData.basicInfo?.street,
      formData.basicInfo?.building
    ].filter(Boolean).join(' ');

    return `VISA申請書

申請者情報:
氏名（英語）: ${fullNameEn}
氏名（日本語）: ${fullNameJa}
国籍: ${formData.basicInfo?.nationality || ''}
生年月日: ${formData.basicInfo?.birthDate || ''}
住所: ${fullAddress || ''}
電話番号: ${formData.basicInfo?.phone || ''}
メールアドレス: ${formData.basicInfo?.email || ''}

パスポート情報:
パスポート番号: ${formData.passportInfo?.passportNumber || ''}
発行国: ${formData.passportInfo?.issueCountry || ''}
発行日: ${formData.passportInfo?.issueDate || ''}
有効期限: ${formData.passportInfo?.expiryDate || ''}

申請内容:
在留資格: ${survey.visaType}
手続き種類: ${survey.procedureType}

生成日時: ${new Date().toLocaleString('ja-JP')}
`;
  };

  const handleStartNew = () => {
    reset();
    navigate('/');
  };

  return (
    <div className="max-w-4xl mx-auto p-6 sm:p-8 lg:p-10">
      {/* 成功メッセージ */}
      <div className="text-center mb-12 sm:mb-16">
        <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-green-500 to-green-600 rounded-3xl mb-8 shadow-xl">
          <svg className="w-10 h-10 sm:w-12 sm:h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
          {t('completion.title')}
        </h1>
        <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
          {t('completion.description')}
        </p>
      </div>

      {/* 申請内容サマリー */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8 mb-8 sm:mb-12 relative overflow-hidden">
        {/* 装飾的な背景要素 */}
        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-100/50 to-purple-100/50 rounded-full -translate-y-10 translate-x-10"></div>

        <div className="flex items-center mb-6 relative z-10">
          <div className="w-2 h-8 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full mr-3"></div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">申請内容</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 relative z-10">
          <div className="bg-gradient-to-r from-blue-50/50 to-indigo-50/50 rounded-xl p-4 border border-blue-100/50">
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-gray-700">申請者氏名:</span>
              <span className="text-sm sm:text-base font-bold text-gray-900">
                {formData.basicInfo?.lastNameJa && formData.basicInfo?.firstNameJa
                  ? `${formData.basicInfo.lastNameJa} ${formData.basicInfo.firstNameJa}`
                  : (formData.basicInfo?.lastNameEn && formData.basicInfo?.firstNameEn
                      ? `${formData.basicInfo.lastNameEn} ${formData.basicInfo.firstNameEn}`
                      : '')}
              </span>
            </div>
          </div>
          <div className="bg-gradient-to-r from-green-50/50 to-emerald-50/50 rounded-xl p-4 border border-green-100/50">
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-gray-700">在留資格:</span>
              <span className="text-sm sm:text-base font-bold text-gray-900">{survey.visaType}</span>
            </div>
          </div>
          <div className="bg-gradient-to-r from-purple-50/50 to-pink-50/50 rounded-xl p-4 border border-purple-100/50">
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-gray-700">手続き種類:</span>
              <span className="text-sm sm:text-base font-bold text-gray-900">{survey.procedureType}</span>
            </div>
          </div>
          <div className="bg-gradient-to-r from-yellow-50/50 to-orange-50/50 rounded-xl p-4 border border-yellow-100/50">
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-gray-700">生成日時:</span>
              <span className="text-sm sm:text-base font-bold text-gray-900">{new Date().toLocaleString('ja-JP')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* アクションカード */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-12 sm:mb-16">
        {/* PDF申請書ダウンロード */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8 relative overflow-hidden hover:shadow-xl transition-all duration-300">
          {/* 装飾的な背景要素 */}
          <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-red-100/50 to-pink-100/50 rounded-full -translate-y-8 translate-x-8"></div>

          <div className="flex items-start space-x-4 mb-6 relative z-10">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-red-500 via-red-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">PDF申請書</h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                入力内容をPDF形式の申請書としてダウンロードできます。
              </p>
            </div>
          </div>

          <button
            onClick={handleDownloadPDF}
            disabled={isGeneratingPDF}
            className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-3 sm:py-4 px-6 rounded-xl hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all duration-200 font-semibold text-sm sm:text-base"
          >
            {isGeneratingPDF ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                PDF生成中...
              </span>
            ) : (
              <span className="flex items-center justify-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                {t('completion.downloadPdf')}
              </span>
            )}
          </button>
        </div>

        {/* 提出手順ガイド */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8 relative overflow-hidden hover:shadow-xl transition-all duration-300">
          {/* 装飾的な背景要素 */}
          <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-blue-100/50 to-indigo-100/50 rounded-full -translate-y-8 translate-x-8"></div>

          <div className="flex items-start space-x-4 mb-6 relative z-10">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">提出手順</h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                出入国在留管理庁への提出方法をご案内します。
              </p>
            </div>
          </div>

          <a
            href="https://www.moj.go.jp/isa/applications/procedures/index.html"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 sm:py-4 px-6 rounded-xl hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-lg hover:shadow-xl transition-all duration-200 font-semibold text-sm sm:text-base inline-flex items-center justify-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            {t('completion.submissionGuide')}
          </a>
        </div>
      </div>

      {/* 提出手順詳細 */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8 mb-12 sm:mb-16 relative overflow-hidden">
        {/* 装飾的な背景要素 */}
        <div className="absolute top-0 left-0 w-24 h-24 bg-gradient-to-br from-green-100/50 to-blue-100/50 rounded-full -translate-y-12 -translate-x-12"></div>

        <div className="flex items-center mb-8 relative z-10">
          <div className="w-2 h-8 bg-gradient-to-b from-green-500 to-blue-600 rounded-full mr-3"></div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">次のステップ</h2>
        </div>

        <div className="space-y-6 sm:space-y-8 relative z-10">
          <div className="flex items-start space-x-4 sm:space-x-6">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-sm sm:text-base">1</span>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">PDF申請書をダウンロード</h4>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">上記のボタンからPDF申請書をダウンロードしてください。</p>
            </div>
          </div>

          <div className="flex items-start space-x-4 sm:space-x-6">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-sm sm:text-base">2</span>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">必要書類を準備</h4>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">準備物チェックで確認した書類を用意してください。</p>
            </div>
          </div>

          <div className="flex items-start space-x-4 sm:space-x-6">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-sm sm:text-base">3</span>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">出入国在留管理庁に提出</h4>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">オンライン申請システムまたは窓口にて申請書と必要書類を提出してください。</p>
            </div>
          </div>
        </div>
      </div>

      {/* 行政書士相談オプション */}
      <div className="bg-gradient-to-r from-yellow-50 via-orange-50 to-amber-50 rounded-2xl border border-yellow-200/60 p-6 sm:p-8 mb-12 sm:mb-16 relative overflow-hidden">
        {/* 装飾的な背景要素 */}
        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-yellow-200/30 to-orange-200/30 rounded-full -translate-y-10 translate-x-10"></div>
        <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-amber-200/30 to-yellow-200/30 rounded-full translate-y-8 -translate-x-8"></div>

        <div className="flex items-start space-x-4 relative z-10">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-yellow-500 via-orange-500 to-amber-500 rounded-2xl flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 flex items-center">
              <span className="bg-gradient-to-r from-yellow-600 via-orange-600 to-amber-600 bg-clip-text text-transparent">
                専門家のサポートが必要ですか？
              </span>
            </h3>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-6">
              申請に不安がある場合は、行政書士による相談サービスをご利用いただけます。
            </p>
            <button className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-semibold rounded-lg hover:from-yellow-600 hover:to-orange-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 shadow-lg hover:shadow-xl transition-all duration-200">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              行政書士相談を申し込む
            </button>
          </div>
        </div>
      </div>

      {/* フッターアクション */}
      <div className="flex flex-col sm:flex-row justify-center gap-6 sm:gap-0 pt-8 pb-8">
        <button
          onClick={() => navigate('/confirmation')}
          className="px-8 py-3 text-base font-semibold text-gray-700 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 shadow-sm hover:shadow-md transition-all duration-200 min-w-[200px] order-2 sm:order-1"
        >
          確認画面に戻る
        </button>

        <button
          onClick={handleStartNew}
          className="px-8 py-4 text-lg font-bold text-white bg-gradient-to-r from-blue-500 to-blue-600 border border-transparent rounded-lg hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-lg hover:shadow-xl transition-all duration-200 min-w-[250px] order-1 sm:order-2"
        >
          <span className="flex items-center justify-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            新しい申請を開始
          </span>
        </button>
      </div>
    </div>
  );
};

export default CompletionView;
