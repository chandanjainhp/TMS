import React, { useState } from 'react';
import MainComponent from '../components/branch/MainComponent';
import Header from '../components/common/Header';
const BranchPage = () => {
  return (
    <div className="flex-1 overflow-auto relative z-10 bg-[#34495E]">
      {/* Background color: Slate Gray */}
      <Header/>
      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8 text-[#FFFFFF]">
        {/* Text color: White */}
        <div className="mt-6 p-6 bg-[#2C3E50] rounded-lg shadow-lg">
          <div style={{ backgroundColor: '#34495E', color: '#FFFFFF', minHeight: '100vh', padding: '24px' }} className="flex flex-col items-center">

           <MainComponent />
          </div>
        </div>
      </main>
    </div>
  );
};

export default BranchPage;
