import React from 'react';
import { Users, BookOpen, BarChart3 } from 'lucide-react';

const RoleSelection = ({ onRoleSelect }) => (
  <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-teal-600 flex items-center justify-center p-4">
    <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full transform hover:scale-105 transition-transform duration-300">
      <div className="text-center mb-8">
        <div className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
          <BarChart3 className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Live Polling System</h1>
        <p className="text-gray-600">Choose your role to get started</p>
      </div>
      
      <div className="space-y-4">
        <button
          onClick={() => onRoleSelect('teacher')}
          className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white py-4 px-6 rounded-xl font-semibold flex items-center justify-center gap-3 hover:from-purple-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
        >
          <BookOpen className="w-5 h-5" />
          I'm a Teacher
        </button>
        
        <button
          onClick={() => onRoleSelect('student')}
          className="w-full bg-gradient-to-r from-blue-500 to-teal-500 text-white py-4 px-6 rounded-xl font-semibold flex items-center justify-center gap-3 hover:from-blue-600 hover:to-teal-600 transform hover:scale-105 transition-all duration-200 shadow-lg"
        >
          <Users className="w-5 h-5" />
          I'm a Student
        </button>
      </div>
    </div>
  </div>
);

export default RoleSelection;