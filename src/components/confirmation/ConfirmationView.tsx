import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../stores/appStore';
import { VISA_TYPES, PROCEDURE_TYPES, FAMILY_RELATIONS } from '../../constants';

const ConfirmationView: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { formData, survey } = useAppStore();

  if (!survey) {
    navigate('/survey');
    return null;
  }

  const handleEdit = (section: string) => {
    // フォームページに戻り、特定のセクションにジャンプ
    navigate('/form');
  };

  const handleSubmit = () => {
    // 完了ページに遷移
    navigate('/completion');
  };

  const InfoSection: React.FC<{ title: string; children: React.ReactNode; onEdit: () => void }> = ({
    title,
    children,
    onEdit,
  }) => (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8 mb-6 sm:mb-8 relative overflow-hidden">
      {/* 装飾的な背景要素 */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-100/50 to-purple-100/50 rounded-full -translate-y-10 translate-x-10"></div>

      <div className="flex justify-between items-center mb-6 relative z-10">
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center">
          <div className="w-2 h-8 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full mr-3"></div>
          {title}
        </h3>
        <button
          onClick={onEdit}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-sm hover:shadow-md transition-all duration-200"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          {t('common.edit')}
        </button>
      </div>
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );

  const DataRow: React.FC<{ label: string; value: string | undefined }> = ({ label, value }) => (
    <div className="flex justify-between items-center py-3 px-4 bg-gray-50/50 rounded-lg border border-gray-100 last:border-b-0 hover:bg-gray-100/50 transition-colors duration-150">
      <span className="text-sm sm:text-base font-medium text-gray-700">{label}:</span>
      <span className={`text-sm sm:text-base font-semibold ${
        value && value !== '未入力' ? 'text-gray-900' : 'text-gray-400 italic'
      }`}>
        {value || '未入力'}
      </span>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6 sm:p-8 lg:p-10">
      <div className="text-center mb-10 sm:mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl mb-6 shadow-lg">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
          {t('confirmation.title')}
        </h1>
        <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
          {t('confirmation.description')}
        </p>
      </div>

      {/* アンケート結果 */}
      <InfoSection title="アンケート結果" onEdit={() => navigate('/survey')}>
        <div className="space-y-2">
          <DataRow label="在留資格" value={VISA_TYPES[survey.visaType]?.ja} />
          <DataRow label="手続き種類" value={PROCEDURE_TYPES[survey.procedureType]?.ja} />
          {survey.familyRelation && (
            <DataRow label="家族滞在の関係性" value={FAMILY_RELATIONS[survey.familyRelation]?.ja} />
          )}
          {survey.workStatus && (
            <DataRow label="勤務先・学校の状況" value={survey.workStatus} />
          )}
        </div>
      </InfoSection>

      {/* 基本情報 */}
      <InfoSection title="基本情報" onEdit={() => handleEdit('basic')}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <DataRow
              label="氏名（英語）"
              value={formData.basicInfo?.lastNameEn && formData.basicInfo?.firstNameEn
                ? `${formData.basicInfo.lastNameEn} ${formData.basicInfo.firstNameEn}`
                : ''}
            />
            <DataRow
              label="氏名（日本語）"
              value={formData.basicInfo?.lastNameJa && formData.basicInfo?.firstNameJa
                ? `${formData.basicInfo.lastNameJa} ${formData.basicInfo.firstNameJa}`
                : ''}
            />
            <DataRow label="国籍" value={formData.basicInfo?.nationality} />
            <DataRow label="生年月日" value={formData.basicInfo?.birthDate} />
          </div>
          <div className="space-y-2">
            <DataRow label="電話番号" value={formData.basicInfo?.phone} />
            <DataRow label="メールアドレス" value={formData.basicInfo?.email} />
          </div>
        </div>
        <div className="mt-4">
          <div className="flex justify-between items-start py-3 px-4 bg-gray-50/50 rounded-lg border border-gray-100 hover:bg-gray-100/50 transition-colors duration-150">
            <span className="text-sm sm:text-base font-medium text-gray-700 mt-1">住所:</span>
            <div className="flex-1 ml-4 text-right">
              {(() => {
                const addressParts = [
                  formData.basicInfo?.postalCode && `〒${formData.basicInfo.postalCode}`,
                  formData.basicInfo?.country,
                  formData.basicInfo?.prefecture,
                  formData.basicInfo?.city,
                  formData.basicInfo?.street,
                  formData.basicInfo?.building
                ].filter(Boolean);

                const fullAddress = addressParts.join(' ');
                return (
                  <span className={`text-sm sm:text-base font-semibold ${
                    fullAddress ? 'text-gray-900' : 'text-gray-400 italic'
                  }`}>
                    {fullAddress || '未入力'}
                  </span>
                );
              })()}
            </div>
          </div>
        </div>
      </InfoSection>

      {/* パスポート情報 */}
      <InfoSection title="パスポート情報" onEdit={() => handleEdit('passport')}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <DataRow label="パスポート番号" value={formData.passportInfo?.passportNumber} />
            <DataRow label="発行国" value={formData.passportInfo?.issueCountry} />
          </div>
          <div className="space-y-2">
            <DataRow label="発行日" value={formData.passportInfo?.issueDate} />
            <DataRow label="有効期限" value={formData.passportInfo?.expiryDate} />
          </div>
        </div>
      </InfoSection>

      {/* 在留カード情報 */}
      {survey.procedureType === 'renewal' && (
        <InfoSection title="在留カード情報" onEdit={() => handleEdit('residence')}>
          <div className="space-y-2">
            <DataRow label="在留カード番号" value={formData.residenceCardInfo?.cardNumber} />
            <DataRow label="有効期限" value={formData.residenceCardInfo?.expiryDate} />
            <DataRow label="現在の在留資格" value={formData.residenceCardInfo?.currentVisa} />
          </div>
        </InfoSection>
      )}

      {/* 犯罪歴 */}
      <InfoSection title="犯罪歴・違反歴" onEdit={() => handleEdit('criminal')}>
        <div className="space-y-2">
          <DataRow 
            label="犯罪歴" 
            value={formData.criminalHistory?.hasCriminalHistory === 'yes' ? 'あり' : 
                   formData.criminalHistory?.hasCriminalHistory === 'no' ? 'なし' : '未入力'} 
          />
          {formData.criminalHistory?.hasCriminalHistory === 'yes' && formData.criminalHistory?.criminalDetails && (
            <div className="mt-2 p-3 bg-yellow-50 rounded-md">
              <p className="text-sm text-yellow-800">詳細: {formData.criminalHistory.criminalDetails}</p>
            </div>
          )}
          <DataRow 
            label="入管法違反歴" 
            value={formData.criminalHistory?.hasViolationHistory === 'yes' ? 'あり' : 
                   formData.criminalHistory?.hasViolationHistory === 'no' ? 'なし' : '未入力'} 
          />
          <DataRow 
            label="退去強制歴" 
            value={formData.criminalHistory?.hasDeportationHistory === 'yes' ? 'あり' : 
                   formData.criminalHistory?.hasDeportationHistory === 'no' ? 'なし' : '未入力'} 
          />
        </div>
      </InfoSection>

      {/* 親族・同居者情報 */}
      <InfoSection title="在日親族・同居者情報" onEdit={() => handleEdit('family')}>
        <div className="space-y-2">
          <DataRow 
            label="在日親族・同居者" 
            value={formData.familyInfo?.hasFamily === 'yes' ? 'あり' : 
                   formData.familyInfo?.hasFamily === 'no' ? 'なし' : '未入力'} 
          />
          {formData.familyInfo?.hasFamily === 'yes' && formData.familyInfo?.familyMembers && (
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">詳細:</h4>
              {formData.familyInfo.familyMembers.map((member, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-md mb-2">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>氏名: {member.name}</div>
                    <div>続柄: {member.relationship}</div>
                    <div>国籍: {member.nationality}</div>
                    {member.visaStatus && <div>在留資格: {member.visaStatus}</div>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </InfoSection>

      {/* 条件付きフォーム情報 */}
      {survey.visaType === 'engineer' && formData.engineerHumanitiesInfo && Object.keys(formData.engineerHumanitiesInfo).length > 0 && (
        <InfoSection title="技術・人文知識・国際業務情報" onEdit={() => handleEdit('engineer')}>
          <div className="space-y-2">
            {formData.engineerHumanitiesInfo.employmentCertificate && (
              <DataRow label="在職証明書" value={formData.engineerHumanitiesInfo.employmentCertificate.substring(0, 50) + '...'} />
            )}
            {formData.engineerHumanitiesInfo.educationHistory && (
              <DataRow label="学歴" value={formData.engineerHumanitiesInfo.educationHistory.substring(0, 50) + '...'} />
            )}

          </div>
        </InfoSection>
      )}

      {survey.visaType === 'specific-1' && formData.specificSkill1Info && Object.keys(formData.specificSkill1Info).length > 0 && (
        <InfoSection title="特定技能1号情報" onEdit={() => handleEdit('specific1')}>
          <div className="space-y-2">
            {formData.specificSkill1Info.skillTestCertificate && (
              <DataRow label="評価試験合格証" value={formData.specificSkill1Info.skillTestCertificate.substring(0, 50) + '...'} />
            )}
            {formData.specificSkill1Info.supportPlan && (
              <DataRow label="支援計画書" value={formData.specificSkill1Info.supportPlan.substring(0, 50) + '...'} />
            )}
          </div>
        </InfoSection>
      )}

      {survey.visaType === 'specific-2' && formData.specificSkill2Info && Object.keys(formData.specificSkill2Info).length > 0 && (
        <InfoSection title="特定技能2号情報" onEdit={() => handleEdit('specific2')}>
          <div className="space-y-2">
            {formData.specificSkill2Info.workExperienceCertificate && (
              <DataRow label="実務経験証明" value={formData.specificSkill2Info.workExperienceCertificate.substring(0, 50) + '...'} />
            )}
            {formData.specificSkill2Info.skillTestCertificate && (
              <DataRow label="技能試験合格証" value={formData.specificSkill2Info.skillTestCertificate.substring(0, 50) + '...'} />
            )}
          </div>
        </InfoSection>
      )}

      {survey.visaType === 'student' && formData.studentInfo && Object.keys(formData.studentInfo).length > 0 && (
        <InfoSection title="留学情報" onEdit={() => handleEdit('student')}>
          <div className="space-y-2">
            {formData.studentInfo.enrollmentCertificate && (
              <DataRow label="在学証明書" value={formData.studentInfo.enrollmentCertificate.substring(0, 50) + '...'} />
            )}

          </div>
        </InfoSection>
      )}

      {survey.visaType === 'family' && formData.familyStayInfo && Object.keys(formData.familyStayInfo).length > 0 && (
        <InfoSection title="家族滞在情報" onEdit={() => handleEdit('family-stay')}>
          <div className="space-y-2">
            {formData.familyStayInfo.relationshipCertificate && (
              <DataRow label="関係証明書" value={formData.familyStayInfo.relationshipCertificate.substring(0, 50) + '...'} />
            )}

          </div>
        </InfoSection>
      )}

      {/* 証明写真 */}
      <InfoSection title="証明写真" onEdit={() => handleEdit('photo')}>
        <div className="flex items-center space-x-4">
          {formData.photoUpload?.photoDataUrl ? (
            <div className="flex items-center space-x-4">
              <img
                src={formData.photoUpload.photoDataUrl}
                alt="証明写真"
                className="w-16 h-20 object-cover border border-gray-300 rounded-md"
              />
              <span className="text-sm text-green-600">✓ アップロード済み</span>
            </div>
          ) : (
            <span className="text-sm text-gray-500">未アップロード</span>
          )}
        </div>
      </InfoSection>

      {/* 最終確認 */}
      <div className="bg-gradient-to-r from-green-50 via-blue-50 to-purple-50 rounded-2xl border border-green-200/60 p-6 sm:p-8 mb-12 sm:mb-16 shadow-xl relative overflow-hidden">
        {/* 装飾的な背景要素 */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-200/30 to-blue-200/30 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-purple-200/30 to-green-200/30 rounded-full translate-y-12 -translate-x-12"></div>

        <div className="flex items-start space-x-4 relative z-10">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-green-500 via-green-600 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <span className="bg-gradient-to-r from-green-600 via-green-700 to-blue-600 bg-clip-text text-transparent">
                最終確認
              </span>
              <div className="ml-4 h-0.5 bg-gradient-to-r from-green-200 via-green-300 to-blue-200 flex-1 rounded-full"></div>
            </h3>
            <div className="text-sm sm:text-base text-gray-700 space-y-3 leading-relaxed">
              <p>上記の内容で申請書を生成します。間違いがないか再度ご確認ください。</p>
              <p className="text-green-700 font-medium">修正する場合は各セクションの「編集」ボタンをクリックしてください。</p>
            </div>
          </div>
        </div>
      </div>

      {/* ナビゲーションボタン */}
      <div className="flex flex-col sm:flex-row justify-center gap-6 sm:gap-0 pt-8 pb-8">
        <button
          onClick={() => navigate('/form')}
          className="px-8 py-3 text-base font-semibold text-gray-700 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 shadow-sm hover:shadow-md transition-all duration-200 min-w-[200px] order-2 sm:order-1"
        >
          {t('common.back')}
        </button>

        <button
          onClick={handleSubmit}
          className="px-8 py-4 text-lg font-bold text-white bg-gradient-to-r from-green-500 to-green-600 border border-transparent rounded-lg hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 shadow-lg hover:shadow-xl transition-all duration-200 min-w-[280px] order-1 sm:order-2"
        >
          <span className="flex items-center justify-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            申請書を生成する
          </span>
        </button>
      </div>
    </div>
  );
};

export default ConfirmationView;
