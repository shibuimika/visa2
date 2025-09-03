import React from 'react';
import RegistrationForm from '../components/auth/RegistrationForm';

const RegistrationPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="min-h-full flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <RegistrationForm />
      </div>
    </div>
  );
};

export default RegistrationPage;
