import React from 'react';
import RegistrationForm from '../components/auth/RegistrationForm';

const RegistrationPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="min-h-full flex items-center justify-center px-2 sm:px-4 lg:px-6 py-6 sm:py-8">
        <RegistrationForm />
      </div>
    </div>
  );
};

export default RegistrationPage;
