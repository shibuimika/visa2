import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../stores/appStore';
import { VISA_TYPES, PROCEDURE_TYPES, FAMILY_RELATIONS } from '../../constants';

// PDFサムネイル表示用のユーティリティ関数
const renderFileDisplay = (fileData: File | string | undefined, label: string) => {
  if (!fileData) return null;

  // Fileオブジェクトの場合
  if (fileData instanceof File) {
    const isImage = fileData.type.startsWith('image/');
    const isPdf = fileData.type === 'application/pdf';

    return (
      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
        <div className="flex-shrink-0">
          {isImage && (
            <img
              src={URL.createObjectURL(fileData)}
              alt={label}
              className="w-12 h-12 object-cover border border-gray-300 rounded-md"
            />
          )}
          {isPdf && (
            <div className="w-12 h-12 bg-red-100 border border-red-300 rounded-md flex items-center justify-center">
              <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
              </svg>
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">{label}</p>
          <p className="text-xs text-gray-500">{fileData.name} ({(fileData.size / 1024 / 1024).toFixed(2)}MB)</p>
        </div>
      </div>
    );
  }

  // 文字列（Base64）の場合
  if (typeof fileData === 'string') {
    const isImage = fileData.startsWith('data:image/');
    const isPdf = fileData.startsWith('data:application/pdf');

    return (
      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
        <div className="flex-shrink-0">
          {isImage && (
            <img
              src={fileData}
              alt={label}
              className="w-12 h-12 object-cover border border-gray-300 rounded-md"
            />
          )}
          {isPdf && (
            <div className="w-12 h-12 bg-red-100 border border-red-300 rounded-md flex items-center justify-center">
              <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
              </svg>
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">{label}</p>
          <p className="text-xs text-gray-500">
            {isPdf ? 'PDFファイル' : isImage ? '画像ファイル' : 'ファイル'}
          </p>
        </div>
      </div>
    );
  }

  return null;
};

const ConfirmationView: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { formData, survey } = useAppStore();

  if (!survey) {
    navigate('/survey');
    return null;
  }

  const handleEdit = (section: string) => {
    // 編集するセクションを特定して、対応するステップ番号を計算
    let targetStepIndex = 0;

    // 固定ステップのインデックスを定義
    const fixedSteps = [
      { id: 'basic', index: 0 },
      { id: 'passport', index: 1 },
      { id: 'residence', index: 2 },
      { id: 'criminal', index: 3 },
      { id: 'family', index: 4 },
      { id: 'photo', index: 6 } // 条件付きフォームの後に配置
    ];

    // 条件付きフォームの情報を設定
    let conditionalStepId = '';
    if (survey.visaType === 'engineer') conditionalStepId = 'engineer';
    else if (survey.visaType === 'specific-1') conditionalStepId = 'specific1';
    else if (survey.visaType === 'specific-2') conditionalStepId = 'specific2';
    else if (survey.visaType === 'student') conditionalStepId = 'student';
    else if (survey.visaType === 'family') conditionalStepId = 'family-stay';

    // ターゲットセクションのステップインデックスを計算
    if (section === 'residence' && survey.procedureType !== 'renewal') {
      // 在留カード情報は更新時のみ存在するので、他の場合はパスポート情報に遷移
      targetStepIndex = 1;
    } else {
      const fixedStep = fixedSteps.find(step => step.id === section);
      if (fixedStep) {
        targetStepIndex = fixedStep.index;

        // 条件付きフォームが存在する場合、photoのインデックスを調整
        if (conditionalStepId && fixedStep.id === 'photo') {
          targetStepIndex = 6;
        }
      } else if (section === conditionalStepId) {
        // 条件付きフォームの場合
        targetStepIndex = 5;
      }
    }

    // ターゲットステップをlocalStorageに保存
    localStorage.setItem('formTargetStep', targetStepIndex.toString());

    // フォームページに遷移
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
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6 lg:p-8 mb-4 sm:mb-6 lg:mb-8 relative overflow-hidden">
      {/* 装飾的な背景要素 */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-100/50 to-purple-100/50 rounded-full -translate-y-10 translate-x-10"></div>

      <div className="flex justify-between items-center mb-4 sm:mb-6 relative z-10">
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

  // 値の表示用ヘルパー関数
  const formatValue = (value: string | File | undefined): string => {
    if (!value) return t('common.notEntered', '未入力');
    if (value instanceof File) {
      return `${value.name} (${(value.size / 1024 / 1024).toFixed(2)}MB)`;
    }
    if (value.length > 50) {
      return value.substring(0, 50) + '...';
    }
    return value;
  };

  const DataRow: React.FC<{ label: string; value: string | File | undefined }> = ({ label, value }) => (
    <div className="flex justify-between items-center py-3 px-4 bg-gray-50/50 rounded-lg border border-gray-100 last:border-b-0 hover:bg-gray-100/50 transition-colors duration-150">
      <span className="text-sm sm:text-base font-medium text-gray-700">{label}:</span>
      <span className={`text-sm sm:text-base font-semibold ${
        value ? 'text-gray-900' : 'text-gray-400 italic'
      }`}>
        {formatValue(value)}
      </span>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="text-center mb-6 sm:mb-8 lg:mb-12">
        <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl mb-4 sm:mb-6 shadow-lg">
          <svg className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
          {t('confirmation.title')}
        </h1>
        <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
          {t('confirmation.description')}
        </p>
      </div>

      {/* アンケート結果 */}
      <InfoSection title={t('confirmation.surveyResults', 'アンケート結果')} onEdit={() => navigate('/survey')}>
        <div className="space-y-2">
          <DataRow
            label={t('survey.visaType', '在留資格')}
            value={VISA_TYPES[survey.visaType]?.ja || survey.visaType}
          />
          <DataRow
            label={t('survey.procedureType', '手続き種類')}
            value={PROCEDURE_TYPES[survey.procedureType]?.ja || survey.procedureType}
          />
          {survey.familyRelation && (
            <DataRow
              label={t('survey.familyRelation', '家族滞在の関係性')}
              value={FAMILY_RELATIONS[survey.familyRelation]?.ja || survey.familyRelation}
            />
          )}
          {survey.workStatus && (
            <DataRow
              label={t('survey.workStatus', '勤務先・学校の状況')}
              value={survey.workStatus}
            />
          )}
        </div>
      </InfoSection>

      {/* 基本情報 */}
      <InfoSection title={t('confirmation.basicInfo', '基本情報')} onEdit={() => handleEdit('basic')}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <DataRow
              label={t('basicInfo.fullNameEn', '氏名（英語）')}
              value={formData.basicInfo?.lastNameEn && formData.basicInfo?.firstNameEn
                ? `${formData.basicInfo.lastNameEn} ${formData.basicInfo.firstNameEn}`
                : ''}
            />
            <DataRow
              label={t('basicInfo.fullNameJa', '氏名（日本語）')}
              value={formData.basicInfo?.lastNameJa && formData.basicInfo?.firstNameJa
                ? `${formData.basicInfo.lastNameJa} ${formData.basicInfo.firstNameJa}`
                : ''}
            />
            <DataRow label={t('basicInfo.nationality', '国籍')} value={formData.basicInfo?.nationality} />
            <DataRow label={t('basicInfo.birthDate', '生年月日')} value={formData.basicInfo?.birthDate} />
          </div>
          <div className="space-y-2">
            <DataRow label={t('basicInfo.phone', '電話番号')} value={formData.basicInfo?.phone} />
            <DataRow label={t('basicInfo.email', 'メールアドレス')} value={formData.basicInfo?.email} />
          </div>
        </div>
        <div className="mt-4">
          <div className="flex justify-between items-start py-3 px-4 bg-gray-50/50 rounded-lg border border-gray-100 hover:bg-gray-100/50 transition-colors duration-150">
            <span className="text-sm sm:text-base font-medium text-gray-700 mt-1">
              {t('basicInfo.address', '住所')}:
            </span>
            <div className="flex-1 ml-4 text-right">
              {(() => {
                const addressParts = [
                  formData.basicInfo?.postalCode && `${t('basicInfo.postalCode', '〒')}${formData.basicInfo.postalCode}`,
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
                    {fullAddress || t('common.notEntered', '未入力')}
                  </span>
                );
              })()}
            </div>
          </div>
        </div>
      </InfoSection>

      {/* パスポート情報 */}
      <InfoSection title={t('confirmation.passportInfo', 'パスポート情報')} onEdit={() => handleEdit('passport')}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <DataRow label={t('passport.passportNumber', 'パスポート番号')} value={formData.passportInfo?.passportNumber} />
            <DataRow label={t('passport.issueCountry', '発行国')} value={formData.passportInfo?.issueCountry} />
          </div>
          <div className="space-y-2">
            <DataRow label={t('passport.issueDate', '発行日')} value={formData.passportInfo?.issueDate} />
            <DataRow label={t('passport.expiryDate', '有効期限')} value={formData.passportInfo?.expiryDate} />
          </div>
        </div>
      </InfoSection>

      {/* 在留カード情報 */}
      {survey.procedureType === 'renewal' && (
        <InfoSection title={t('confirmation.residenceCardInfo', '在留カード情報')} onEdit={() => handleEdit('residence')}>
          <div className="space-y-2">
            <DataRow label={t('residenceCard.cardNumber', '在留カード番号')} value={formData.residenceCardInfo?.cardNumber} />
            <DataRow label={t('residenceCard.expiryDate', '有効期限')} value={formData.residenceCardInfo?.expiryDate} />
            <DataRow label={t('residenceCard.currentVisa', '現在の在留資格')} value={formData.residenceCardInfo?.currentVisa} />
          </div>
        </InfoSection>
      )}

      {/* 犯罪歴 */}
      <InfoSection title={t('confirmation.criminalHistory', '犯罪歴・違反歴')} onEdit={() => handleEdit('criminal')}>
        <div className="space-y-2">
          <DataRow
            label={t('criminal.hasCriminalHistory', '犯罪歴')}
            value={formData.criminalHistory?.hasCriminalHistory === 'yes' ? t('common.yes', 'あり') :
                   formData.criminalHistory?.hasCriminalHistory === 'no' ? t('common.no', 'なし') :
                   t('common.notEntered', '未入力')}
          />
          {formData.criminalHistory?.hasCriminalHistory === 'yes' && formData.criminalHistory?.criminalDetails && (
            <div className="mt-2 p-3 bg-yellow-50 rounded-md">
              <p className="text-sm text-yellow-800">
                {t('criminal.details', '詳細')}: {formData.criminalHistory.criminalDetails}
              </p>
            </div>
          )}
          <DataRow
            label={t('criminal.hasViolationHistory', '入管法違反歴')}
            value={formData.criminalHistory?.hasViolationHistory === 'yes' ? t('common.yes', 'あり') :
                   formData.criminalHistory?.hasViolationHistory === 'no' ? t('common.no', 'なし') :
                   t('common.notEntered', '未入力')}
          />
          <DataRow
            label={t('criminal.hasDeportationHistory', '退去強制歴')}
            value={formData.criminalHistory?.hasDeportationHistory === 'yes' ? t('common.yes', 'あり') :
                   formData.criminalHistory?.hasDeportationHistory === 'no' ? t('common.no', 'なし') :
                   t('common.notEntered', '未入力')}
          />
        </div>
      </InfoSection>

      {/* 親族・同居者情報 */}
      <InfoSection title={t('confirmation.familyInfo', '在日親族・同居者情報')} onEdit={() => handleEdit('family')}>
        <div className="space-y-2">
          <DataRow
            label={t('family.hasFamily', '在日親族・同居者')}
            value={formData.familyInfo?.hasFamily === 'yes' ? t('common.yes', 'あり') :
                   formData.familyInfo?.hasFamily === 'no' ? t('common.no', 'なし') :
                   t('common.notEntered', '未入力')}
          />
          {formData.familyInfo?.hasFamily === 'yes' && formData.familyInfo?.familyMembers && (
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                {t('family.details', '詳細')}:
              </h4>
              {formData.familyInfo.familyMembers.map((member, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-md mb-2">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>{t('family.name', '氏名')}: {member.name}</div>
                    <div>{t('family.relationship', '続柄')}: {member.relationship}</div>
                    <div>{t('family.nationality', '国籍')}: {member.nationality}</div>
                    {member.visaStatus && <div>{t('family.visaStatus', '在留資格')}: {member.visaStatus}</div>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </InfoSection>

      {/* 条件付きフォーム情報 */}
      {survey.visaType === 'engineer' && formData.engineerHumanitiesInfo && Object.keys(formData.engineerHumanitiesInfo).length > 0 && (
        <InfoSection title={t('confirmation.engineerInfo')} onEdit={() => handleEdit('engineer')}>
          <div className="space-y-4">
            {/* 更新時の必須項目 */}
            {survey.procedureType === 'renewal' && (
              <>
                {renderFileDisplay(formData.engineerHumanitiesInfo.employmentCertificate, t('engineer.employmentCertificate', '在職証明書'))}
                {renderFileDisplay(formData.engineerHumanitiesInfo.salarySlip, t('engineer.salarySlip', '給与明細'))}
                {renderFileDisplay(formData.engineerHumanitiesInfo.taxCertificate, t('engineer.taxCertificate', '納税証明書'))}
              </>
            )}

            {/* 変更時の必須項目 */}
            {survey.procedureType === 'change' && (
              <>
                {formData.engineerHumanitiesInfo.educationHistory && (
                  <DataRow label={t('engineer.educationHistory', '学歴')} value={formData.engineerHumanitiesInfo.educationHistory} />
                )}
                {formData.engineerHumanitiesInfo.workHistory && (
                  <DataRow label={t('engineer.workHistory', '職歴')} value={formData.engineerHumanitiesInfo.workHistory} />
                )}
                {renderFileDisplay(formData.engineerHumanitiesInfo.graduationCertificate, t('engineer.graduationCertificate', '卒業証明書'))}
                {renderFileDisplay(formData.engineerHumanitiesInfo.employmentContract, t('engineer.employmentContract', '雇用契約書'))}
                {formData.engineerHumanitiesInfo.companyInfo && (
                  <DataRow label={t('engineer.companyInfo', '勤務先情報')} value={formData.engineerHumanitiesInfo.companyInfo} />
                )}
              </>
            )}
          </div>
        </InfoSection>
      )}

      {survey.visaType === 'specific-1' && formData.specificSkill1Info && Object.keys(formData.specificSkill1Info).length > 0 && (
        <InfoSection title={t('confirmation.specificSkill1Info', '特定技能1号情報')} onEdit={() => handleEdit('specific1')}>
          <div className="space-y-4">
            {/* 更新時の必須項目 */}
            {survey.procedureType === 'renewal' && (
              <>
                {renderFileDisplay(formData.specificSkill1Info.employmentCertificate, t('specificSkill.employmentCertificate', '在職証明書'))}
                {renderFileDisplay(formData.specificSkill1Info.salarySlip, t('specificSkill.salarySlip', '給与明細'))}
                {renderFileDisplay(formData.specificSkill1Info.supportReport, t('specificSkill.supportReport', '支援状況報告書'))}
                {renderFileDisplay(formData.specificSkill1Info.taxCertificate, t('specificSkill.taxCertificate', '納税証明書'))}
              </>
            )}

            {/* 変更時の必須項目 */}
            {survey.procedureType === 'change' && (
              <>
                {renderFileDisplay(formData.specificSkill1Info.skillTestCertificate, t('specificSkill.skillTestCertificate', '評価試験合格証'))}
                {renderFileDisplay(formData.specificSkill1Info.supportPlan, t('specificSkill.supportPlan', '支援計画書'))}
                {renderFileDisplay(formData.specificSkill1Info.employmentContract, t('specificSkill.employmentContract', '雇用契約書'))}
              </>
            )}
          </div>
        </InfoSection>
      )}

      {survey.visaType === 'specific-2' && formData.specificSkill2Info && Object.keys(formData.specificSkill2Info).length > 0 && (
        <InfoSection title={t('confirmation.specificSkill2Info', '特定技能2号情報')} onEdit={() => handleEdit('specific2')}>
          <div className="space-y-4">
            {/* 更新時の必須項目 */}
            {survey.procedureType === 'renewal' && (
              <>
                {renderFileDisplay(formData.specificSkill2Info.employmentCertificate, t('specificSkill.employmentCertificate', '在職証明書'))}
                {renderFileDisplay(formData.specificSkill2Info.salarySlip, t('specificSkill.salarySlip', '給与明細'))}
                {renderFileDisplay(formData.specificSkill2Info.taxCertificate, t('specificSkill.taxCertificate', '納税証明書'))}
              </>
            )}

            {/* 変更時の必須項目 */}
            {survey.procedureType === 'change' && (
              <>
                {renderFileDisplay(formData.specificSkill2Info.workExperienceCertificate, t('specificSkill.workExperienceCertificate', '実務経験証明'))}
                {renderFileDisplay(formData.specificSkill2Info.skillTestCertificate, t('specificSkill.skillTestCertificate', '技能試験合格証'))}
                {renderFileDisplay(formData.specificSkill2Info.employmentContract, t('specificSkill.employmentContract', '雇用契約書'))}
                {formData.specificSkill2Info.organizationInfo && (
                  <DataRow label={t('specificSkill.organizationInfo', '所属機関情報')} value={formData.specificSkill2Info.organizationInfo} />
                )}
              </>
            )}
          </div>
        </InfoSection>
      )}

      {survey.visaType === 'student' && formData.studentInfo && Object.keys(formData.studentInfo).length > 0 && (
        <InfoSection title={t('confirmation.studentInfo', '留学情報')} onEdit={() => handleEdit('student')}>
          <div className="space-y-4">
            {/* 更新時の必須項目 */}
            {survey.procedureType === 'renewal' && (
              <>
                {renderFileDisplay(formData.studentInfo.enrollmentCertificate, t('student.enrollmentCertificate', '在学証明書'))}
                {renderFileDisplay(formData.studentInfo.transcript, t('student.transcript', '成績証明書'))}
                {renderFileDisplay(formData.studentInfo.attendanceCertificate, t('student.attendanceCertificate', '出席証明書'))}
                {renderFileDisplay(formData.studentInfo.tuitionPaymentCertificate, t('student.tuitionPaymentCertificate', '学費納入証明書'))}
              </>
            )}

            {/* 変更時の必須項目 */}
            {survey.procedureType === 'change' && (
              <>
                {renderFileDisplay(formData.studentInfo.graduationCertificate, t('student.graduationCertificate', '卒業証明書'))}
                {renderFileDisplay(formData.studentInfo.employmentContract, t('student.employmentContract', '雇用契約書'))}
                {formData.studentInfo.companyInfo && (
                  <DataRow label={t('student.companyInfo', '勤務先情報')} value={formData.studentInfo.companyInfo} />
                )}
              </>
            )}
          </div>
        </InfoSection>
      )}

      {survey.visaType === 'family' && formData.familyStayInfo && Object.keys(formData.familyStayInfo).length > 0 && (
        <InfoSection title={t('confirmation.familyStayInfo', '家族滞在情報')} onEdit={() => handleEdit('family-stay')}>
          <div className="space-y-4">
            {/* 更新時の必須項目 */}
            {survey.procedureType === 'renewal' && (
              <>
                {renderFileDisplay(formData.familyStayInfo.relationshipCertificate, t('family.relationshipCertificate', '関係証明書'))}
                {renderFileDisplay(formData.familyStayInfo.incomeCertificate, t('family.incomeCertificate', '収入証明書'))}
                {renderFileDisplay(formData.familyStayInfo.residenceRecord, t('family.residenceRecord', '住民票'))}
              </>
            )}

            {/* 変更時の必須項目 */}
            {survey.procedureType === 'change' && (
              <>
                {renderFileDisplay(formData.familyStayInfo.relationshipCertificate, t('family.relationshipCertificate', '関係証明書'))}
                {renderFileDisplay(formData.familyStayInfo.incomeCertificate, t('family.incomeCertificate', '収入証明書'))}
                {renderFileDisplay(formData.familyStayInfo.residenceRecord, t('family.residenceRecord', '住民票'))}
                {formData.familyStayInfo.currentVisaInfo && (
                  <DataRow label={t('family.currentVisaInfo', '現資格情報')} value={formData.familyStayInfo.currentVisaInfo} />
                )}
              </>
            )}
          </div>
        </InfoSection>
      )}

      {/* 証明写真 */}
      <InfoSection title={t('confirmation.photoUpload', '証明写真')} onEdit={() => handleEdit('photo')}>
        <div className="space-y-4">
          {formData.photoUpload?.photoDataUrl ? (
            <div className="flex items-center space-x-4">
              <img
                src={formData.photoUpload.photoDataUrl}
                alt={t('confirmation.photoAlt', '証明写真')}
                className="w-16 h-20 object-cover border border-gray-300 rounded-md"
              />
              <div className="flex flex-col">
                <span className="text-sm font-medium text-green-600">
                  ✓ {t('confirmation.photoUploaded', 'アップロード済み')}
                </span>
                <span className="text-xs text-gray-500 mt-1">
                  {t('confirmation.photoRequirements', '縦4cm × 横3cm、背景無地、6ヶ月以内の写真')}
                </span>
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <div className="w-16 h-20 bg-gray-100 border border-gray-300 rounded-md flex items-center justify-center">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <span className="text-sm text-gray-500">
                {t('confirmation.photoNotUploaded', '未アップロード')}
              </span>
            </div>
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
                {t('confirmation.finalCheck', '最終確認')}
              </span>
              <div className="ml-4 h-0.5 bg-gradient-to-r from-green-200 via-green-300 to-blue-200 flex-1 rounded-full"></div>
            </h3>
            <div className="text-sm sm:text-base text-gray-700 space-y-3 leading-relaxed">
              <p>{t('confirmation.finalCheckMessage', '上記の内容で申請書を生成します。間違いがないか再度ご確認ください。')}</p>
              <p className="text-green-700 font-medium">
                {t('confirmation.editMessage', '修正する場合は各セクションの「編集」ボタンをクリックしてください。')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ナビゲーションボタン */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 sm:gap-0 pt-6 sm:pt-8 pb-6 sm:pb-8 border-t border-gray-200">
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
            {t('confirmation.generateApplication', '申請書を生成する')}
          </span>
        </button>
      </div>
    </div>
  );
};

export default ConfirmationView;
