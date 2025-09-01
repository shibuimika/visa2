import type { SurveyAnswers, RequirementList, RequirementItem } from '../types';
import { SYSTEM_REQUIREMENTS } from '../constants';

// 条件分岐に基づく必要書類の決定ロジック
export function determineRequirements(survey: SurveyAnswers): RequirementList {
  // システム環境要件（全員共通）
  const systemRequirements: RequirementItem[] = SYSTEM_REQUIREMENTS.map((req) => ({
    id: req.id,
    category: 'system',
    name: req.ja, // 後で多言語対応
    description: '',
    required: true,
    checked: false,
  }));

  // 書類要件（条件分岐）
  const documentRequirements: RequirementItem[] = [];

  const { visaType, procedureType, familyRelation } = survey;

  // 技術・人文知識・国際業務
  if (visaType === 'engineer') {
    if (procedureType === 'renewal') {
      documentRequirements.push(
        {
          id: 'employment-certificate',
          category: 'document',
          name: '在職証明書',
          description: '現在の雇用状況を証明する書類',
          required: true,
          checked: false,
        },
        {
          id: 'salary-statement',
          category: 'document',
          name: '給与明細',
          description: '直近3ヶ月分の給与明細',
          required: true,
          checked: false,
        },
        {
          id: 'tax-payment-certificate',
          category: 'document',
          name: '納税証明書',
          description: '住民税の納税証明書',
          required: true,
          checked: false,
        }
      );
    } else if (procedureType === 'change') {
      documentRequirements.push(
        {
          id: 'education-certificate',
          category: 'document',
          name: '卒業証明書',
          description: '最終学歴の卒業証明書',
          required: true,
          checked: false,
        },
        {
          id: 'employment-contract',
          category: 'document',
          name: '雇用契約書',
          description: '新しい雇用先との契約書',
          required: true,
          checked: false,
        },
        {
          id: 'company-info',
          category: 'document',
          name: '勤務先情報',
          description: '会社の登記簿謄本等',
          required: true,
          checked: false,
        }
      );
    } else if (procedureType === 'acquisition') {
      documentRequirements.push(
        {
          id: 'guarantor-info',
          category: 'document',
          name: '身元保証人情報',
          description: '身元保証人の関連書類',
          required: true,
          checked: false,
        }
      );
    }
  }

  // 留学
  if (visaType === 'student') {
    if (procedureType === 'renewal') {
      documentRequirements.push(
        {
          id: 'enrollment-certificate',
          category: 'document',
          name: '在学証明書',
          description: '現在の在学状況を証明する書類',
          required: true,
          checked: false,
        },
        {
          id: 'academic-transcript',
          category: 'document',
          name: '成績証明書',
          description: '直近の成績証明書',
          required: true,
          checked: false,
        },
        {
          id: 'tuition-payment-certificate',
          category: 'document',
          name: '学費納入証明書',
          description: '学費の納入を証明する書類',
          required: true,
          checked: false,
        }
      );
    }
  }

  // 家族滞在
  if (visaType === 'family') {
    if (procedureType === 'renewal') {
      documentRequirements.push(
        {
          id: 'relationship-certificate',
          category: 'document',
          name: '関係証明書',
          description: familyRelation === 'spouse' ? '結婚証明書' : '親子関係証明書',
          required: true,
          checked: false,
        },
        {
          id: 'income-certificate',
          category: 'document',
          name: '収入証明書',
          description: '扶養者の収入証明',
          required: true,
          checked: false,
        },
        {
          id: 'residence-certificate',
          category: 'document',
          name: '住民票',
          description: '世帯全員の住民票',
          required: true,
          checked: false,
        }
      );
    }
  }

  // 特定技能（基本的な要件のみ実装、詳細は後で追加）
  if (visaType === 'specific-1' || visaType === 'specific-2') {
    if (procedureType === 'renewal') {
      documentRequirements.push(
        {
          id: 'employment-certificate',
          category: 'document',
          name: '在職証明書',
          description: '現在の雇用状況を証明する書類',
          required: true,
          checked: false,
        }
      );
    }
  }

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
