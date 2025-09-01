// ユーザー情報の型定義
export interface UserInfo {
  id: string;
  email: string;
  language: 'ja' | 'en' | 'zh';
  createdAt: Date;
}

// 在留資格の型
export type VisaType = 'engineer' | 'specific-1' | 'specific-2' | 'student' | 'family';

// 手続き種類の型
export type ProcedureType = 'renewal' | 'change' | 'acquisition';

// 家族滞在の関係性
export type FamilyRelation = 'spouse' | 'child' | 'other';

// アンケートの回答
export interface SurveyAnswers {
  visaType: VisaType;
  procedureType: ProcedureType;
  familyRelation?: FamilyRelation; // 家族滞在の場合のみ
  workStatus?: string; // 任意項目
}

// 必要準備物のアイテム
export interface RequirementItem {
  id: string;
  category: 'system' | 'document';
  name: string;
  description: string;
  required: boolean;
  checked: boolean;
}

// 準備物リスト
export interface RequirementList {
  systemRequirements: RequirementItem[];
  documentRequirements: RequirementItem[];
}

// フォームデータの基本情報
export interface BasicInfo {
  nameEn: string;
  nameJa: string;
  nationality: string;
  birthDate: string;
  address: string;
  phone: string;
  email: string;
}

// パスポート情報
export interface PassportInfo {
  passportNumber: string;
  issueDate: string;
  expiryDate: string;
  issueCountry: string;
}

// 在留カード情報
export interface ResidenceCardInfo {
  cardNumber: string;
  expiryDate: string;
  currentVisa: string; // フォームからの入力を受け入れるためstringに変更
}

// 犯罪歴情報
export interface CriminalHistory {
  hasCriminalHistory: string;
  criminalDetails?: string;
  hasViolationHistory: string;
  violationDetails?: string;
  hasDeportationHistory: string;
  deportationDetails?: string;
}

// 親族・同居者情報
export interface FamilyMember {
  name: string;
  relationship: string;
  nationality: string;
  birthDate?: string;
  occupation?: string;
  visaStatus?: string;
}

export interface FamilyInfo {
  hasFamily: string;
  familyMembers?: FamilyMember[];
}

// 証明写真アップロード
export interface PhotoUpload {
  photoFile?: File;
  photoDataUrl?: string;
}

// 条件付きフォーム - 技人国
export interface EngineerHumanitiesInfo {
  // 更新時
  employmentCertificate?: string; // 在職証明書
  salarySlip?: string; // 給与明細
  taxCertificate?: string; // 納税証明書
  
  // 変更時
  educationHistory?: string; // 学歴
  workHistory?: string; // 職歴
  graduationCertificate?: string; // 卒業証明書
  employmentContract?: string; // 雇用契約書
  companyInfo?: string; // 勤務先情報
  
  // 取得時
  acquisitionReason?: string; // 取得理由
  residenceReason?: string; // 在留理由
  guarantorInfo?: string; // 身元保証人情報
}

// 条件付きフォーム - 特定技能1号
export interface SpecificSkill1Info {
  // 更新時
  employmentCertificate?: string; // 在職証明書
  salarySlip?: string; // 給与明細
  supportReport?: string; // 支援状況報告書
  taxCertificate?: string; // 納税証明書
  
  // 変更・取得時
  skillTestCertificate?: string; // 評価試験合格証
  supportPlan?: string; // 支援計画書
  employmentContract?: string; // 雇用契約書
  
  // 取得時
  guarantorInfo?: string; // 身元保証人情報
}

// 条件付きフォーム - 特定技能2号
export interface SpecificSkill2Info {
  // 更新時
  employmentCertificate?: string; // 在職証明書
  salarySlip?: string; // 給与明細
  taxCertificate?: string; // 納税証明書
  
  // 変更・取得時
  workExperienceCertificate?: string; // 実務経験証明
  skillTestCertificate?: string; // 技能試験合格証
  employmentContract?: string; // 雇用契約書
  organizationInfo?: string; // 所属機関情報
  
  // 取得時
  guarantorInfo?: string; // 身元保証人情報
}

// 条件付きフォーム - 留学
export interface StudentInfo {
  // 更新時
  enrollmentCertificate?: string; // 在学証明書
  transcript?: string; // 成績証明書
  attendanceCertificate?: string; // 出席証明書
  tuitionPaymentCertificate?: string; // 学費納入証明書
  
  // 変更時
  graduationCertificate?: string; // 卒業証明書
  employmentContract?: string; // 雇用契約書
  companyInfo?: string; // 勤務先情報
  
  // 取得時
  admissionPermit?: string; // 入学許可書
  tuitionPaymentOrBalance?: string; // 学費納入証明書または残高証明書
  guarantorInfo?: string; // 身元保証人情報
}

// 条件付きフォーム - 家族滞在
export interface FamilyStayInfo {
  // 更新時（配偶者・子・その他）
  relationshipCertificate?: string; // 関係証明書
  incomeCertificate?: string; // 収入証明書
  residenceRecord?: string; // 住民票
  
  // 変更時
  currentVisaInfo?: string; // 現資格情報
  
  // 取得時
  dependentInfo?: string; // 扶養者情報
  guarantorInfo?: string; // 身元保証人情報
}

// フォームデータ全体
export interface FormData {
  basicInfo: Partial<BasicInfo>;
  passportInfo: Partial<PassportInfo>;
  residenceCardInfo: Partial<ResidenceCardInfo>;
  criminalHistory: Partial<CriminalHistory>;
  familyInfo: Partial<FamilyInfo>;
  photoUpload: Partial<PhotoUpload>;
  // 条件付きカテゴリ
  engineerHumanitiesInfo: Partial<EngineerHumanitiesInfo>;
  specificSkill1Info: Partial<SpecificSkill1Info>;
  specificSkill2Info: Partial<SpecificSkill2Info>;
  studentInfo: Partial<StudentInfo>;
  familyStayInfo: Partial<FamilyStayInfo>;
}

// UI状態
export interface UIState {
  currentStep: number;
  loading: boolean;
  errors: Record<string, string>;
}

// アプリケーション全体の状態
export interface AppState {
  user: UserInfo | null;
  survey: SurveyAnswers | null;
  requirements: RequirementList | null;
  formData: FormData;
  ui: UIState;
}
