import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/common/Layout';
import { useAppStore } from './stores/appStore';
import './utils/i18n'; // i18n初期化

// Pages
import RegistrationPage from './pages/RegistrationPage';
import SurveyPage from './pages/SurveyPage';
import RequirementsPage from './pages/RequirementsPage';
import FormPage from './pages/FormPage';
import ConfirmationPage from './pages/ConfirmationPage';
import CompletionPage from './pages/CompletionPage';

function App() {
  const { user } = useAppStore();

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* 未認証の場合は登録ページにリダイレクト */}
          <Route 
            path="/" 
            element={
              user ? 
                <Navigate to="/survey" replace /> : 
                <Navigate to="/register" replace />
            } 
          />
          
          <Route 
            path="/register" 
            element={
              <Layout showHeader={true} showProgress={false}>
                <RegistrationPage />
              </Layout>
            } 
          />
          
          <Route 
            path="/survey" 
            element={
              <Layout showHeader={true} showProgress={true} currentStep={1} totalSteps={6}>
                <SurveyPage />
              </Layout>
            } 
          />
          
          <Route 
            path="/requirements" 
            element={
              <Layout showHeader={true} showProgress={true} currentStep={2} totalSteps={6}>
                <RequirementsPage />
              </Layout>
            } 
          />
          
          <Route 
            path="/form" 
            element={
              <Layout showHeader={true} showProgress={true} currentStep={3} totalSteps={6}>
                <FormPage />
              </Layout>
            } 
          />
          
          <Route 
            path="/confirmation" 
            element={
              <Layout showHeader={true} showProgress={true} currentStep={4} totalSteps={6}>
                <ConfirmationPage />
              </Layout>
            } 
          />
          
          <Route 
            path="/completion" 
            element={
              <Layout showHeader={true} showProgress={true} currentStep={5} totalSteps={6}>
                <CompletionPage />
              </Layout>
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;