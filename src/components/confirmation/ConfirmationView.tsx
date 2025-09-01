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
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <button
          onClick={onEdit}
          className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {t('common.edit')}
        </button>
      </div>
      {children}
    </div>
  );

  const DataRow: React.FC<{ label: string; value: string | undefined }> = ({ label, value }) => (
    <div className="flex justify-between py-2 border-b border-gray-100 last:border-b-0">
      <span className="text-sm font-medium text-gray-600">{label}:</span>
      <span className="text-sm text-gray-900">{value || '未入力'}</span>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          {t('confirmation.title')}
        </h1>
        <p className="text-lg text-gray-600">
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
            <DataRow label="氏名（英語）" value={formData.basicInfo?.nameEn} />
            <DataRow label="氏名（日本語）" value={formData.basicInfo?.nameJa} />
            <DataRow label="国籍" value={formData.basicInfo?.nationality} />
            <DataRow label="生年月日" value={formData.basicInfo?.birthDate} />
          </div>
          <div className="space-y-2">
            <DataRow label="電話番号" value={formData.basicInfo?.phone} />
            <DataRow label="メールアドレス" value={formData.basicInfo?.email} />
          </div>
        </div>
        <div className="mt-4">
          <div className="flex justify-between py-2">
            <span className="text-sm font-medium text-gray-600">住所:</span>
            <span className="text-sm text-gray-900 text-right max-w-md">
              {formData.basicInfo?.address || '未入力'}
            </span>
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
      {survey.procedureType !== 'acquisition' && (
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
            {formData.engineerHumanitiesInfo.acquisitionReason && (
              <DataRow label="取得理由" value={formData.engineerHumanitiesInfo.acquisitionReason.substring(0, 50) + '...'} />
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
            {formData.studentInfo.admissionPermit && (
              <DataRow label="入学許可書" value={formData.studentInfo.admissionPermit.substring(0, 50) + '...'} />
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
            {formData.familyStayInfo.dependentInfo && (
              <DataRow label="扶養者情報" value={formData.familyStayInfo.dependentInfo.substring(0, 50) + '...'} />
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
      <div className="bg-blue-50 rounded-lg p-6 mb-8">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800 mb-2">最終確認</h3>
            <p className="text-sm text-blue-700">
              上記の内容で申請書を生成します。間違いがないか再度ご確認ください。
              修正する場合は各セクションの「編集」ボタンをクリックしてください。
            </p>
          </div>
        </div>
      </div>

      {/* ナビゲーションボタン */}
      <div className="flex justify-between pt-6 border-t">
        <button
          onClick={() => navigate('/form')}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {t('common.back')}
        </button>
        
        <button
          onClick={handleSubmit}
          className="px-8 py-3 text-base font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        >
          ✅ 申請書を生成する
        </button>
      </div>
    </div>
  );
};

export default ConfirmationView;
