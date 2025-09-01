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
    return `VISA申請書

申請者情報:
氏名（英語）: ${formData.basicInfo?.nameEn || ''}
氏名（日本語）: ${formData.basicInfo?.nameJa || ''}
国籍: ${formData.basicInfo?.nationality || ''}
生年月日: ${formData.basicInfo?.birthDate || ''}
住所: ${formData.basicInfo?.address || ''}
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
    <div className="max-w-4xl mx-auto">
      {/* 成功メッセージ */}
      <div className="text-center mb-8">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
          <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          {t('completion.title')}
        </h1>
        <p className="text-lg text-gray-600">
          {t('completion.description')}
        </p>
      </div>

      {/* 申請内容サマリー */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">申請内容</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-sm font-medium text-gray-600">申請者氏名:</span>
            <span className="text-sm text-gray-900">{formData.basicInfo?.nameJa || formData.basicInfo?.nameEn}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-sm font-medium text-gray-600">在留資格:</span>
            <span className="text-sm text-gray-900">{survey.visaType}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-sm font-medium text-gray-600">手続き種類:</span>
            <span className="text-sm text-gray-900">{survey.procedureType}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-sm font-medium text-gray-600">生成日時:</span>
            <span className="text-sm text-gray-900">{new Date().toLocaleString('ja-JP')}</span>
          </div>
        </div>
      </div>

      {/* アクションカード */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* PDF申請書ダウンロード */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <div className="flex-shrink-0">
              <svg className="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-medium text-gray-900">PDF申請書</h3>
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            入力内容をPDF形式の申請書としてダウンロードできます。
          </p>
          <button
            onClick={handleDownloadPDF}
            disabled={isGeneratingPDF}
            className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGeneratingPDF ? 'PDF生成中...' : t('completion.downloadPdf')}
          </button>
        </div>

        {/* 提出手順ガイド */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <div className="flex-shrink-0">
              <svg className="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-medium text-gray-900">提出手順</h3>
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            出入国在留管理庁への提出方法をご案内します。
          </p>
          <a
            href="https://www.moj.go.jp/isa/applications/procedures/index.html"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 inline-block text-center"
          >
            {t('completion.submissionGuide')}
          </a>
        </div>
      </div>

      {/* 提出手順詳細 */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">次のステップ</h2>
        <div className="space-y-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-600 text-white text-sm font-medium">
                1
              </div>
            </div>
            <div className="ml-4">
              <h4 className="text-sm font-medium text-gray-900">PDF申請書をダウンロード</h4>
              <p className="text-sm text-gray-600">上記のボタンからPDF申請書をダウンロードしてください。</p>
            </div>
          </div>
          
          <div className="flex">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-600 text-white text-sm font-medium">
                2
              </div>
            </div>
            <div className="ml-4">
              <h4 className="text-sm font-medium text-gray-900">必要書類を準備</h4>
              <p className="text-sm text-gray-600">準備物チェックで確認した書類を用意してください。</p>
            </div>
          </div>
          
          <div className="flex">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-600 text-white text-sm font-medium">
                3
              </div>
            </div>
            <div className="ml-4">
              <h4 className="text-sm font-medium text-gray-900">出入国在留管理庁に提出</h4>
              <p className="text-sm text-gray-600">オンライン申請システムまたは窓口にて申請書と必要書類を提出してください。</p>
            </div>
          </div>
        </div>
      </div>

      {/* 行政書士相談オプション */}
      <div className="bg-yellow-50 rounded-lg p-6 mb-8">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800 mb-2">専門家のサポートが必要ですか？</h3>
            <p className="text-sm text-yellow-700 mb-3">
              申請に不安がある場合は、行政書士による相談サービスをご利用いただけます。
            </p>
            <button className="px-4 py-2 bg-yellow-600 text-white text-sm rounded-md hover:bg-yellow-700">
              行政書士相談を申し込む
            </button>
          </div>
        </div>
      </div>

      {/* フッターアクション */}
      <div className="flex justify-between items-center pt-6 border-t">
        <button
          onClick={() => navigate('/confirmation')}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          確認画面に戻る
        </button>
        
        <button
          onClick={handleStartNew}
          className="px-6 py-2 text-sm font-medium text-blue-600 bg-white border border-blue-300 rounded-md hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          新しい申請を開始
        </button>
      </div>
    </div>
  );
};

export default CompletionView;
