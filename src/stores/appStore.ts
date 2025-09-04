import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AppState, SurveyAnswers, RequirementList, FormData, UserInfo } from '../types';

interface AppStore extends AppState {
  // Actions
  setUser: (user: UserInfo) => void;
  setSurveyAnswers: (answers: SurveyAnswers) => void;
  setRequirements: (requirements: RequirementList) => void;
  updateFormData: (data: Partial<FormData>) => void;
  setLoading: (loading: boolean) => void;
  setError: (field: string, error: string) => void;
  clearError: (field: string) => void;
  reset: () => void;
}

const initialState: AppState = {
  user: null,
  survey: null,
  requirements: null,
      formData: {
      basicInfo: {},
      passportInfo: {},
      residenceCardInfo: {},
      criminalHistory: {},
      familyInfo: {},
      photoUpload: {},
      // 条件付きカテゴリ
      engineerHumanitiesInfo: {},
      specificSkill1Info: {},
      specificSkill2Info: {},
      studentInfo: {},
      familyStayInfo: {},
    },
  ui: {
    currentStep: 0,
    loading: false,
    errors: {},
  },
};

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      setUser: (user) =>
        set((state) => ({
          ...state,
          user,
        })),

      setSurveyAnswers: (survey) =>
        set((state) => ({
          ...state,
          survey,
        })),

      setRequirements: (requirements) =>
        set((state) => ({
          ...state,
          requirements,
        })),

      updateFormData: (data) =>
        set((state) => ({
          ...state,
          formData: {
            ...state.formData,
            ...data,
          },
        })),

      setLoading: (loading) =>
        set((state) => ({
          ...state,
          ui: {
            ...state.ui,
            loading,
          },
        })),

      setError: (field, error) =>
        set((state) => ({
          ...state,
          ui: {
            ...state.ui,
            errors: {
              ...state.ui.errors,
              [field]: error,
            },
          },
        })),

      clearError: (field) => {
        set((state) => {
          const newErrors = { ...state.ui.errors };
          delete newErrors[field];
          return {
            ...state,
            ui: {
              ...state.ui,
              errors: newErrors,
            },
          };
        });
      },

      reset: () => set(() => initialState),
    }),
    {
      name: 'visa-app-store',
      partialize: (state) => {
        // ファイルデータを除外するヘルパー関数
        const excludeFileData = (obj: any) => {
          if (!obj || typeof obj !== 'object') return obj;

          const result = { ...obj };
          Object.keys(result).forEach(key => {
            if (result[key] instanceof File ||
                (typeof result[key] === 'string' && result[key].startsWith('data:'))) {
              result[key] = undefined;
            } else if (typeof result[key] === 'object' && result[key] !== null) {
              result[key] = excludeFileData(result[key]);
            }
          });
          return result;
        };

        return {
          user: state.user,
          survey: state.survey,
          requirements: state.requirements,
          formData: excludeFileData(state.formData),
        };
      },
    }
  )
);
