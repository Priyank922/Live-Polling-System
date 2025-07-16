import React from 'react';
import { Users, Clock, Eye } from 'lucide-react';

const StudentDashboard = ({ 
  studentName, 
  currentQuestion, 
  hasAnswered, 
  selectedAnswer, 
  results, 
  showResults, 
  timeLeft, 
  onAnswerSubmit 
}) => {
  const totalVotes = Object.values(results).reduce((sum, votes) => sum + votes, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-teal-600 to-green-600 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-blue-500 to-teal-500 rounded-full w-12 h-12 flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Welcome, {studentName}!</h1>
                <p className="text-gray-600">Student Dashboard</p>
              </div>
            </div>
            
            {currentQuestion && !hasAnswered && (
              <div className="flex items-center gap-2 text-orange-600">
                <Clock className="w-5 h-5" />
                <span className="font-semibold">{timeLeft}s</span>
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        {currentQuestion ? (
          <div className="bg-white rounded-2xl shadow-xl p-6">
            {!showResults ? (
              <div>
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">Current Question</h2>
                  <div className="bg-blue-50 rounded-xl p-4 mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">{currentQuestion.question}</h3>
                  </div>
                  
                  {/* Timer Bar */}
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                    <div 
                      className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full transition-all duration-1000"
                      style={{ width: `${(timeLeft / currentQuestion.timeLimit) * 100}%` }}
                    />
                  </div>
                </div>

                {!hasAnswered && (
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Choose your answer:</h3>
                    {currentQuestion.options.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => onAnswerSubmit(option)}
                        className="w-full text-left p-4 bg-gray-50 hover:bg-blue-50 rounded-xl border-2 border-transparent hover:border-blue-300 transition-all duration-200 transform hover:scale-105"
                      >
                        <span className="font-medium text-gray-800">{option}</span>
                      </button>
                    ))}
                  </div>
                )}

                {hasAnswered && (
                  <div className="text-center py-8">
                    <div className="bg-green-100 text-green-800 px-6 py-3 rounded-xl inline-block">
                      <span className="font-semibold">Answer submitted: {selectedAnswer}</span>
                    </div>
                    <p className="text-gray-600 mt-2">Waiting for results...</p>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-800">Live Results</h2>
                  <div className="flex items-center gap-2 text-blue-600">
                    <Eye className="w-5 h-5" />
                    <span className="font-semibold">{totalVotes} total votes</span>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4 mb-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">{currentQuestion.question}</h3>
                  
                  <div className="space-y-4">
                    {currentQuestion.options.map((option, index) => {
                      const votes = results[option] || 0;
                      const percentage = totalVotes > 0 ? (votes / totalVotes) * 100 : 0;
                      const isSelected = selectedAnswer === option;
                      
                      return (
                        <div key={index} className={`p-4 rounded-xl border-2 ${
                          isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white'
                        }`}>
                          <div className="flex justify-between items-center mb-2">
                            <span className={`font-medium ${isSelected ? 'text-blue-800' : 'text-gray-700'}`}>
                              {option} {isSelected && '✓'}
                            </span>
                            <span className="text-sm text-gray-500">
                              {votes} votes ({percentage.toFixed(1)}%)
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <div 
                              className={`h-3 rounded-full transition-all duration-500 ${
                                isSelected 
                                  ? 'bg-gradient-to-r from-blue-500 to-blue-600' 
                                  : 'bg-gradient-to-r from-gray-400 to-gray-500'
                              }`}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-xl p-6 text-center">
            <div className="py-12">
              <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-gray-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">No Active Poll</h2>
              <p className="text-gray-600">Waiting for your teacher to start a new poll...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;