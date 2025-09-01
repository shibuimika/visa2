import type { VisaType, ProcedureType, FamilyRelation } from '../types';

// 安全な型変換ユーティリティ
export const safeVisaTypeConversion = (value: string): VisaType | undefined => {
  const validVisaTypes: VisaType[] = ['engineer', 'specific-1', 'specific-2', 'student', 'family'];
  return validVisaTypes.includes(value as VisaType) ? (value as VisaType) : undefined;
};

export const safeProcedureTypeConversion = (value: string): ProcedureType | undefined => {
  const validProcedureTypes: ProcedureType[] = ['renewal', 'change', 'acquisition'];
  return validProcedureTypes.includes(value as ProcedureType) ? (value as ProcedureType) : undefined;
};

export const safeFamilyRelationConversion = (value: string): FamilyRelation | undefined => {
  const validFamilyRelations: FamilyRelation[] = ['spouse', 'child', 'other'];
  return validFamilyRelations.includes(value as FamilyRelation) ? (value as FamilyRelation) : undefined;
};

export const safeLanguageConversion = (value: string): 'ja' | 'en' | 'zh' | undefined => {
  const validLanguages = ['ja', 'en', 'zh'];
  return validLanguages.includes(value) ? (value as 'ja' | 'en' | 'zh') : undefined;
};

// フォームバリデーション関数
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhoneNumber = (phone: string): boolean => {
  // 日本の電話番号形式をチェック（簡易版）
  const phoneRegex = /^[\d\-+() \s]+$/;
  return phoneRegex.test(phone) && phone.length >= 10;
};

export const validatePassportNumber = (passportNumber: string): boolean => {
  // パスポート番号の基本チェック（英数字、6-9文字）
  const passportRegex = /^[A-Z0-9]{6,9}$/;
  return passportRegex.test(passportNumber.toUpperCase());
};

export const validateResidenceCardNumber = (cardNumber: string): boolean => {
  // 在留カード番号の基本チェック（12桁の英数字）
  const cardRegex = /^[A-Z0-9]{12}$/;
  return cardRegex.test(cardNumber.toUpperCase());
};
