import React from 'react';
import { Send, UserCheck } from 'lucide-react';

const StudentNameInput = ({ studentName, setStudentName, onSubmit }) => (
  <div className="min-h-screen bg-gradient-to-br from-blue-600 via-teal-600 to-green-600 flex items-center justify-center p-4">
    <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full">
      <div className="text-center mb-8">
        <div className="bg-gradient-to-r from-blue-500 to-teal-500 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
          <UserCheck className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome Student!</h2>
        <p className="text-gray-600">Enter your name to join the session</p>
      </div>
      
      <div className="space-y-4">
        <input
          type="text"
          value={studentName}
          onChange={(e) => setStudentName(e.target.value)}
          placeholder="Your full name"
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none text-lg"
          onKeyPress={(e) => e.key === 'Enter' && onSubmit()}
        />
        
        <button
          onClick={onSubmit}
          disabled={!studentName.trim()}
          className="w-full bg-gradient-to-r from-blue-500 to-teal-500 text-white py-3 px-6 rounded-xl font-semibold flex items-center justify-center gap-3 hover:from-blue-600 hover:to-teal-600 transform hover:scale-105 transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          <Send className="w-5 h-5" />
          Join Session
        </button>
      </div>
    </div>
  </div>
);

export default StudentNameInput;