import type { VisaType, ProcedureType } from '../types';

// 要件設定の型定義
export interface RequirementConfig {
  id: string;
  required: boolean;
}

export interface VisaProcedureConfig {
  [key: string]: RequirementConfig[];
}

export interface VisaTypeConfig {
  renewal?: RequirementConfig[];
  change?: RequirementConfig[];
}

// 各ビザタイプの手続き別要件設定
export const REQUIREMENT_CONFIGS: Record<VisaType, VisaTypeConfig> = {
  'engineer': {
    renewal: [
      { id: 'employment-certificate', required: true },
      { id: 'salary-statement', required: true },
      { id: 'tax-payment-certificate', required: true }
    ],
    change: [
      { id: 'education-certificate', required: true },
      { id: 'employment-contract', required: true },
      { id: 'company-info', required: true }
    ]
  },
  'student': {
    renewal: [
      { id: 'enrollment-certificate', required: true },
      { id: 'academic-transcript', required: true },
      { id: 'attendance-certificate', required: true },
      { id: 'tuition-payment-certificate', required: true }
    ],
    change: [
      { id: 'graduation-certificate', required: true },
      { id: 'employment-contract', required: true },
      { id: 'company-info', required: true }
    ]
  },
  'family': {
    renewal: [
      { id: 'relationship-certificate', required: true },
      { id: 'income-certificate', required: true },
      { id: 'residence-certificate', required: true }
    ]
  },
  'specific-1': {
    renewal: [
      { id: 'employment-certificate', required: true }
    ]
  },
  'specific-2': {
    renewal: [
      { id: 'employment-certificate', required: true }
    ]
  }
};

// 家族滞在の関係性に応じた要件設定
export const FAMILY_REQUIREMENT_CONFIGS: Record<string, RequirementConfig[]> = {
  spouse: [
    { id: 'relationship-certificate', required: true },
    { id: 'income-certificate', required: true },
    { id: 'residence-certificate', required: true }
  ],
  child: [
    { id: 'relationship-certificate', required: true },
    { id: 'income-certificate', required: true },
    { id: 'residence-certificate', required: true }
  ],
  other: [
    { id: 'relationship-certificate', required: true },
    { id: 'income-certificate', required: true },
    { id: 'residence-certificate', required: true }
  ]
};

// 要件IDから設定を取得するヘルパー関数
export function getRequirementConfig(
  visaType: VisaType,
  procedureType: ProcedureType,
  familyRelation?: string
): RequirementConfig[] {
  const config = REQUIREMENT_CONFIGS[visaType];

  if (visaType === 'family' && familyRelation) {
    return FAMILY_REQUIREMENT_CONFIGS[familyRelation] || config.renewal || [];
  }

  return config[procedureType] || [];
}
