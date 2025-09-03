import type { VisaType, ProcedureType, FamilyRelation } from '../types';

// 在留資格の定義
export const VISA_TYPES: Record<VisaType, { ja: string; en: string; zh: string }> = {
  engineer: {
    ja: '技術・人文知識・国際業務',
    en: 'Engineer/Specialist in Humanities/International Services',
    zh: '技术·人文知识·国际业务',
  },
  'specific-1': {
    ja: '特定技能1号',
    en: 'Specified Skilled Worker (i)',
    zh: '特定技能1号',
  },
  'specific-2': {
    ja: '特定技能2号',
    en: 'Specified Skilled Worker (ii)',
    zh: '特定技能2号',
  },
  student: {
    ja: '留学',
    en: 'Student',
    zh: '留学',
  },
  family: {
    ja: '家族滞在',
    en: 'Dependent',
    zh: '家族滞在',
  },
};

// 手続き種類の定義
export const PROCEDURE_TYPES: Record<ProcedureType, { ja: string; en: string; zh: string }> = {
  renewal: {
    ja: '更新',
    en: 'Renewal',
    zh: '更新',
  },
  change: {
    ja: '変更',
    en: 'Change',
    zh: '变更',
  },
};

// 家族滞在の関係性
export const FAMILY_RELATIONS: Record<FamilyRelation, { ja: string; en: string; zh: string }> = {
  spouse: {
    ja: '配偶者',
    en: 'Spouse',
    zh: '配偶者',
  },
  child: {
    ja: '子ども',
    en: 'Child',
    zh: '子女',
  },
  other: {
    ja: 'その他',
    en: 'Other',
    zh: '其他',
  },
};

// システム環境要件
export const SYSTEM_REQUIREMENTS = [
  {
    id: 'mynumber-card',
    ja: 'マイナンバーカード（電子証明書付き）',
    en: 'My Number Card (with electronic certificate)',
    zh: '我的号码卡（附电子证书）',
  },
  {
    id: 'residence-card',
    ja: '在留カード',
    en: 'Residence Card',
    zh: '在留卡',
  },
  {
    id: 'ic-card-reader',
    ja: 'ICカードリーダ／対応スマホ',
    en: 'IC Card Reader / Compatible Smartphone',
    zh: 'IC卡读卡器/兼容智能手机',
  },
  {
    id: 'jpki-client',
    ja: 'JPKIクライアントソフト導入済PC',
    en: 'PC with JPKI Client Software installed',
    zh: '已安装JPKI客户端软件的PC',
  },
  {
    id: 'stable-internet',
    ja: '国内からの安定ネット環境',
    en: 'Stable internet connection from within Japan',
    zh: '来自日本国内的稳定网络环境',
  },
  {
    id: 'valid-email',
    ja: '有効なメールアドレス',
    en: 'Valid email address',
    zh: '有效的电子邮件地址',
  },
];

// アプリケーションのステップ
export const APP_STEPS = {
  REGISTRATION: 0,
  SURVEY: 1,
  REQUIREMENTS_CHECK: 2,
  FORM_INPUT: 3,
  CONFIRMATION: 4,
  COMPLETION: 5,
} as const;
