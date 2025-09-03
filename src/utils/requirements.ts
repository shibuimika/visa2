import type { SurveyAnswers, RequirementList, RequirementItem } from '../types';
import { SYSTEM_REQUIREMENTS } from '../constants';
import { getRequirementConfig } from '../constants/requirements';

// 多言語対応のための翻訳データ（一時実装）
// TODO: react-i18next を使用した本格的な多言語対応
const REQUIREMENT_TRANSLATIONS: Record<string, { name: string; description: string }> = {
  'employment-certificate': { name: '在職証明書', description: '現在の雇用状況を証明する書類' },
  'salary-statement': { name: '給与明細', description: '直近3ヶ月分の給与明細' },
  'tax-payment-certificate': { name: '納税証明書', description: '住民税の納税証明書' },
  'education-certificate': { name: '卒業証明書', description: '最終学歴の卒業証明書' },
  'employment-contract': { name: '雇用契約書', description: '新しい雇用先との契約書' },
  'company-info': { name: '勤務先情報', description: '会社の登記簿謄本等' },
  'enrollment-certificate': { name: '在学証明書', description: '現在の在学状況を証明する書類' },
  'academic-transcript': { name: '成績証明書', description: '直近の成績証明書' },
  'tuition-payment-certificate': { name: '学費納入証明書', description: '学費の納入を証明する書類' },
  'relationship-certificate': { name: '関係証明書', description: '結婚証明書または親子関係証明書' },
  'income-certificate': { name: '収入証明書', description: '扶養者の収入証明' },
  'residence-certificate': { name: '住民票', description: '世帯全員の住民票' },
  'attendance-certificate': { name: '出席証明書', description: '出席状況に関する証明書' },
  'graduation-certificate': { name: '卒業証明書', description: '学校からの卒業証明書' }
};

// 条件分岐に基づく必要書類の決定ロジック
export function determineRequirements(survey: SurveyAnswers): RequirementList {
  // システム環境要件（全員共通）
  const systemRequirements: RequirementItem[] = SYSTEM_REQUIREMENTS.map((req) => ({
    id: req.id,
    category: 'system',
    name: req.ja, // TODO: 多言語対応
    description: req.en, // TODO: 現在の言語に応じて切り替え
    required: true,
    checked: false,
  }));

  // 書類要件（設定ベース）
  const documentRequirements: RequirementItem[] = [];

  const { visaType, procedureType, familyRelation } = survey;

  // 設定ファイルから要件を取得
  const requirementConfigs = getRequirementConfig(visaType, procedureType, familyRelation);

  // 設定に基づいて要件アイテムを生成
  requirementConfigs.forEach(config => {
    const translation = REQUIREMENT_TRANSLATIONS[config.id] || { name: config.id, description: '' };

    documentRequirements.push({
      id: config.id,
      category: 'document',
      name: translation.name,
      description: translation.description,
      required: config.required,
      checked: false,
    });
  });

  return {
    systemRequirements,
    documentRequirements,
  };
}

// チェック完了状況の確認
export function areAllRequirementsMet(requirements: RequirementList): boolean {
  const allRequirements = [
    ...requirements.systemRequirements,
    ...requirements.documentRequirements,
  ];

  return allRequirements
    .filter((req) => req.required)
    .every((req) => req.checked);
}