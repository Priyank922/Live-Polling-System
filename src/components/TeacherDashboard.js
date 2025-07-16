import React, { useState } from 'react';
import { BookOpen, Plus } from 'lucide-react';

const TeacherDashboard = ({ 
  currentQuestion, 
  connectedStudents, 
  results, 
  pastPolls, 
  isCreatingPoll, 
  setIsCreatingPoll, 
  onCreatePoll, 
  onEndPoll 
}) => {
  const [newPoll, setNewPoll] = useState({
    question: '',
    options: ['', ''],
    timeLimit: 60
  });

  const handleAddOption = () => {
    setNewPoll(prev => ({
      ...prev,
      options: [...prev.options, '']
    }));
  };

  const handleOptionChange = (index, value) => {
    setNewPoll(prev => ({
      ...prev,
      options: prev.options.map((opt, i) => i === index ? value : opt)
    }));
  };

  const handleSubmitPoll = () => {
    if (newPoll.question.trim() && newPoll.options.filter(opt => opt.trim()).length >= 2) {
      onCreatePoll({
        ...newPoll,
        options: newPoll.options.filter(opt => opt.trim())
      });
      setNewPoll({ question: '', options: ['', ''], timeLimit: 60 });
    }
  };

  const totalVotes = Object.values(results).reduce((sum, votes) => sum + votes, 0);
  const answeredStudents = connectedStudents.filter(s => s.answered).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full w-12 h-12 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Teacher Dashboard</h1>
                <p className="text-gray-600">{connectedStudents.length} students connected</p>
              </div>
            </div>
            
            <div className="flex gap-3">
              {!currentQuestion && (
                <button
                  onClick={() => setIsCreatingPoll(true)}
                  className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 hover:from-green-600 hover:to-green-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
                >
                  <Plus className="w-5 h-5" />
                  Create Poll
                </button>
              )}
              
              {currentQuestion && (
                <button
                  onClick={onEndPoll}
                  className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-red-600 hover:to-red-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
                >
                  End Poll
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Create Poll Modal */}
            {isCreatingPoll && (
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Create New Poll</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Question</label>
                    <input
                      type="text"
                      value={newPoll.question}
                      onChange={(e) => setNewPoll(prev => ({ ...prev, question: e.target.value }))}
                      placeholder="Enter your question"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Options</label>
                    {newPoll.options.map((option, index) => (
                      <input
                        key={index}
                        type="text"
                        value={option}
                        onChange={(e) => handleOptionChange(index, e.target.value)}
                        placeholder={`Option ${index + 1}`}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none mb-2"
                      />
                    ))}
                    
                    <button
                      onClick={handleAddOption}
                      className="text-purple-600 hover:text-purple-800 font-medium flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Add Option
                    </button>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Time Limit (seconds)</label>
                    <input
                      type="number"
                      value={newPoll.timeLimit}
                      onChange={(e) => setNewPoll(prev => ({ ...prev, timeLimit: parseInt(e.target.value) }))}
                      min="30"
                      max="300"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none"
                    />
                  </div>
                  
                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={handleSubmitPoll}
                      className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
                    >
                      Start Poll
                    </button>
                    <button
                      onClick={() => setIsCreatingPoll(false)}
                      className="bg-gray-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-600 transform hover:scale-105 transition-all duration-200 shadow-lg"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Current Poll */}
            {currentQuestion && (
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-800">Active Poll</h2>
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    {answeredStudents}/{connectedStudents.length} answered
                  </span>
                </div>
                
                <div className="bg-gray-50 rounded-xl p-4 mb-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">{currentQuestion.question}</h3>
                  
                  <div className="space-y-3">
                    {currentQuestion.options.map((option, index) => {
                      const votes = results[option] || 0;
                      const percentage = totalVotes > 0 ? (votes / totalVotes) * 100 : 0;
                      
                      return (
                        <div key={index} className="flex items-center gap-3">
                          <div className="flex-1">
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-sm font-medium text-gray-700">{option}</span>
                              <span className="text-sm text-gray-500">{votes} votes ({percentage.toFixed(1)}%)</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Past Polls */}
            {pastPolls.length > 0 && (
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Past Polls</h2>
                <div className="space-y-4">
                  {pastPolls.map((poll, index) => (
                    <div key={index} className="bg-gray-50 rounded-xl p-4">
                      <h3 className="font-semibold text-gray-800 mb-2">{poll.question}</h3>
                      <p className="text-sm text-gray-600">
                        Total votes: {Object.values(poll.results || {}).reduce((sum, votes) => sum + votes, 0)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Students Panel */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Connected Students</h2>
            <div className="space-y-3">
              {connectedStudents.map((student) => (
                <div key={student.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${student.answered ? 'bg-green-500' : 'bg-gray-300'}`} />
                    <span className="text-sm font-medium text-gray-700">{student.name}</span>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    student.answered ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {student.answered ? 'Answered' : 'Waiting'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;