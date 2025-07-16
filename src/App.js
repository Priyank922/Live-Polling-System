import React, { useState, useEffect } from 'react';

// Enhanced real-time communication using localStorage
const createRealTimeConnection = () => {
  return {
    emit: (event, data) => {
      const eventData = {
        ...data,
        timestamp: Date.now()
      };
      localStorage.setItem(`polling_${event}`, JSON.stringify(eventData));
      // Trigger storage event for other tabs
      window.dispatchEvent(new StorageEvent('storage', {
        key: `polling_${event}`,
        newValue: JSON.stringify(eventData)
      }));
    },
    
    on: (event, callback) => {
      const handler = (e) => {
        if (e.key === `polling_${event}`) {
          try {
            const data = JSON.parse(e.newValue);
            callback(data);
          } catch (error) {
            console.error('Error parsing storage event:', error);
          }
        }
      };
      window.addEventListener('storage', handler);
      return handler;
    },
    
    off: (event, handler) => {
      window.removeEventListener('storage', handler);
    },

    // Get current data from localStorage
    getCurrentData: (event) => {
      try {
        const data = localStorage.getItem(`polling_${event}`);
        return data ? JSON.parse(data) : null;
      } catch (error) {
        console.error('Error reading storage:', error);
        return null;
      }
    }
  };
};

// Data management utilities
const dataManager = {
  saveUser: (userData) => {
    const users = JSON.parse(localStorage.getItem('polling_users') || '[]');
    const existingIndex = users.findIndex(u => u.email === userData.email);
    
    if (existingIndex >= 0) {
      users[existingIndex] = { ...users[existingIndex], ...userData };
    } else {
      users.push({ ...userData, id: Date.now().toString() });
    }
    
    localStorage.setItem('polling_users', JSON.stringify(users));
    return userData;
  },

  getUser: (email) => {
    const users = JSON.parse(localStorage.getItem('polling_users') || '[]');
    return users.find(u => u.email === email);
  },

  getAllUsers: () => {
    return JSON.parse(localStorage.getItem('polling_users') || '[]');
  },

  saveStudentData: (studentData) => {
    const students = JSON.parse(localStorage.getItem('polling_student_data') || '[]');
    const existingIndex = students.findIndex(s => s.email === studentData.email);
    
    if (existingIndex >= 0) {
      students[existingIndex] = { ...students[existingIndex], ...studentData };
    } else {
      students.push({ ...studentData, joinedAt: Date.now() });
    }
    
    localStorage.setItem('polling_student_data', JSON.stringify(students));
  },

  getStudentData: (email) => {
    const students = JSON.parse(localStorage.getItem('polling_student_data') || '[]');
    return students.find(s => s.email === email);
  },

  getAllStudentData: () => {
    return JSON.parse(localStorage.getItem('polling_student_data') || '[]');
  },

  savePollResult: (pollResult) => {
    const results = JSON.parse(localStorage.getItem('polling_results') || '[]');
    results.push({ ...pollResult, id: Date.now().toString(), timestamp: Date.now() });
    localStorage.setItem('polling_results', JSON.stringify(results));
  },

  getPollResults: () => {
    return JSON.parse(localStorage.getItem('polling_results') || '[]');
  }
};

const socket = createRealTimeConnection();

// Login Component
const LoginForm = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: ''
  });
  const [isLogin, setIsLogin] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name.trim() && formData.email.trim() && formData.role) {
      const userData = dataManager.saveUser(formData);
      onLogin(userData);
    }
  };

  const handleQuickLogin = () => {
    const existingUser = dataManager.getUser(formData.email);
    if (existingUser) {
      onLogin(existingUser);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Live Polling System</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            >
              <option value="">Select Role</option>
              <option value="teacher">Teacher</option>
              <option value="student">Student</option>
            </select>
          </div>
          
          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200"
          >
            {isLogin ? 'Login' : 'Register'} & Continue
          </button>
        </form>
        
        {formData.email && (
          <div className="mt-4">
            <button
              onClick={handleQuickLogin}
              className="w-full bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
            >
              Quick Login (if account exists)
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Enhanced Teacher Dashboard
const TeacherDashboard = ({ 
  user,
  currentQuestion, 
  connectedStudents, 
  results, 
  pastPolls, 
  isCreatingPoll, 
  setIsCreatingPoll, 
  onCreatePoll, 
  onEndPoll,
  onLogout
}) => {
  const [pollData, setPollData] = useState({
    question: '',
    options: ['', ''],
    timeLimit: 60
  });
  const [showStudentData, setShowStudentData] = useState(false);
  const [showPollHistory, setShowPollHistory] = useState(false);

  const handleCreatePoll = () => {
    if (pollData.question.trim() && pollData.options.every(opt => opt.trim())) {
      onCreatePoll(pollData);
      setPollData({ question: '', options: ['', ''], timeLimit: 60 });
    }
  };

  const addOption = () => {
    setPollData(prev => ({ ...prev, options: [...prev.options, ''] }));
  };

  const removeOption = (index) => {
    if (pollData.options.length > 2) {
      setPollData(prev => ({
        ...prev,
        options: prev.options.filter((_, i) => i !== index)
      }));
    }
  };

  const updateOption = (index, value) => {
    setPollData(prev => ({
      ...prev,
      options: prev.options.map((opt, i) => i === index ? value : opt)
    }));
  };

  const allStudentData = dataManager.getAllStudentData();
  const pollHistory = dataManager.getPollResults();

  // Signal teacher presence
  useEffect(() => {
    socket.emit('teacher-presence', { teacherName: user.name, status: 'online' });
    
    return () => {
      socket.emit('teacher-presence', { teacherName: user.name, status: 'offline' });
    };
  }, [user.name]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-xl p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Teacher Dashboard</h1>
              <p className="text-gray-600">Welcome, {user.name}!</p>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => setShowStudentData(!showStudentData)}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition duration-200"
              >
                {showStudentData ? 'Hide' : 'Show'} Student Data
              </button>
              <button
                onClick={() => setShowPollHistory(!showPollHistory)}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition duration-200"
              >
                Poll History
              </button>
              <button
                onClick={onLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition duration-200"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Student Data Display */}
        {showStudentData && (
          <div className="bg-white rounded-lg shadow-xl p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">All Student Data ({allStudentData.length})</h2>
            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-2 text-left">Name</th>
                    <th className="px-4 py-2 text-left">Email</th>
                    <th className="px-4 py-2 text-left">Joined</th>
                    <th className="px-4 py-2 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {allStudentData.map((student, index) => (
                    <tr key={index} className="border-b">
                      <td className="px-4 py-2">{student.name}</td>
                      <td className="px-4 py-2">{student.email}</td>
                      <td className="px-4 py-2">{new Date(student.joinedAt).toLocaleString()}</td>
                      <td className="px-4 py-2">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          connectedStudents.find(s => s.email === student.email)
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {connectedStudents.find(s => s.email === student.email) ? 'Online' : 'Offline'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Poll History */}
        {showPollHistory && (
          <div className="bg-white rounded-lg shadow-xl p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Poll History ({pollHistory.length})</h2>
            <div className="space-y-4">
              {pollHistory.map((poll, index) => (
                <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
                  <h3 className="font-semibold">{poll.question}</h3>
                  <p className="text-sm text-gray-600">{new Date(poll.timestamp).toLocaleString()}</p>
                  <div className="mt-2 space-y-1">
                    {Object.entries(poll.results).map(([option, votes]) => (
                      <div key={option} className="flex justify-between text-sm">
                        <span>{option}</span>
                        <span className="font-medium">{votes} votes</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Create Poll Button */}
        {!currentQuestion && !isCreatingPoll && (
          <div className="bg-white rounded-lg shadow-xl p-6 mb-6">
            <button
              onClick={() => setIsCreatingPoll(true)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200"
            >
              Create New Poll
            </button>
          </div>
        )}

        {/* Create Poll Form */}
        {isCreatingPoll && (
          <div className="bg-white rounded-lg shadow-xl p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Create New Poll</h2>
            <div className="space-y-4">
              <input
                type="text"
                value={pollData.question}
                onChange={(e) => setPollData(prev => ({ ...prev, question: e.target.value }))}
                placeholder="Enter your question"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              
              {pollData.options.map((option, index) => (
                <div key={index} className="flex space-x-2">
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => updateOption(index, e.target.value)}
                    placeholder={`Option ${index + 1}`}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {pollData.options.length > 2 && (
                    <button
                      onClick={() => removeOption(index)}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition duration-200"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              
              <button
                onClick={addOption}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition duration-200"
              >
                Add Option
              </button>
              
              <div className="flex items-center space-x-4">
                <label className="text-gray-700">Time Limit (seconds):</label>
                <input
                  type="number"
                  value={pollData.timeLimit}
                  onChange={(e) => setPollData(prev => ({ ...prev, timeLimit: parseInt(e.target.value) }))}
                  min="10"
                  max="300"
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="flex space-x-4">
                <button
                  onClick={handleCreatePoll}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition duration-200"
                >
                  Start Poll
                </button>
                <button
                  onClick={() => setIsCreatingPoll(false)}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition duration-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Active Poll */}
        {currentQuestion && (
          <div className="bg-white rounded-lg shadow-xl p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Active Poll</h2>
            <p className="text-lg mb-4">{currentQuestion.question}</p>
            
            <div className="space-y-2 mb-4">
              {currentQuestion.options.map((option, index) => {
                const votes = results[option] || 0;
                const totalVotes = Object.values(results).reduce((sum, v) => sum + v, 0);
                const percentage = totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0;
                
                return (
                  <div key={index} className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex justify-between items-center mb-1">
                      <span>{option}</span>
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                        {votes} votes ({percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <button
              onClick={onEndPoll}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition duration-200"
            >
              End Poll
            </button>
          </div>
        )}

        {/* Connected Students */}
        <div className="bg-white rounded-lg shadow-xl p-6">
          <h2 className="text-xl font-bold mb-4">Connected Students ({connectedStudents.length})</h2>
          <div className="space-y-2">
            {connectedStudents.map((student) => (
              <div key={student.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                <div>
                  <span className="font-medium">{student.name}</span>
                  <span className="text-sm text-gray-600 ml-2">({student.email})</span>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  student.answered ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {student.answered ? 'Answered' : 'Waiting'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Enhanced Student Dashboard
const StudentDashboard = ({ 
  user,
  currentQuestion, 
  hasAnswered, 
  selectedAnswer, 
  results, 
  showResults, 
  timeLeft, 
  onAnswerSubmit,
  onLogout,
  teacherOnline
}) => {
  const [pollHistory, setPollHistory] = useState([]);

  useEffect(() => {
    setPollHistory(dataManager.getPollResults());
  }, [showResults]);

  if (!teacherOnline) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4">⏳</div>
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Teacher Will Join Soon</h2>
          <p className="text-gray-600 mb-6">Please wait while the teacher joins the session...</p>
          <button
            onClick={onLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition duration-200"
          >
            Logout
          </button>
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-100 p-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-xl p-6 mb-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Welcome, {user.name}!</h2>
                <p className="text-gray-600">{user.email}</p>
              </div>
              <button
                onClick={onLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition duration-200"
              >
                Logout
              </button>
            </div>
          </div>

          {/* Waiting Message */}
          <div className="bg-white rounded-lg shadow-xl p-8 text-center mb-6">
            <div className="text-4xl mb-4">📊</div>
            <p className="text-gray-600">Waiting for the teacher to start a poll...</p>
          </div>

          {/* Poll History */}
          {pollHistory.length > 0 && (
            <div className="bg-white rounded-lg shadow-xl p-6">
              <h3 className="text-xl font-bold mb-4">Previous Polls</h3>
              <div className="space-y-4">
                {pollHistory.slice(-5).map((poll, index) => (
                  <div key={index} className="border-l-4 border-green-500 pl-4 py-2">
                    <h4 className="font-semibold">{poll.question}</h4>
                    <p className="text-sm text-gray-600">{new Date(poll.timestamp).toLocaleString()}</p>
                    <div className="mt-2 space-y-1">
                      {Object.entries(poll.results).map(([option, votes]) => (
                        <div key={option} className="flex justify-between text-sm">
                          <span>{option}</span>
                          <span className="font-medium">{votes} votes</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-100 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-xl p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold">Hello, {user.name}!</h2>
              <p className="text-gray-600">{user.email}</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-lg font-semibold text-red-600">
                {timeLeft > 0 ? `${timeLeft}s` : 'Time Up!'}
              </div>
              <button
                onClick={onLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition duration-200"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Poll Question */}
        <div className="bg-white rounded-lg shadow-xl p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">{currentQuestion.question}</h3>
          
          {!hasAnswered && timeLeft > 0 && (
            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => onAnswerSubmit(option)}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 text-left"
                >
                  {option}
                </button>
              ))}
            </div>
          )}
          
          {hasAnswered && (
            <div className="text-center">
              <p className="text-lg mb-4">You selected: <strong>{selectedAnswer}</strong></p>
              <p className="text-green-600">✓ Your answer has been submitted!</p>
            </div>
          )}
        </div>

        {/* Results Display */}
        {showResults && (
          <div className="bg-white rounded-lg shadow-xl p-6">
            <h4 className="text-lg font-semibold mb-3">Live Results:</h4>
            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => {
                const votes = results[option] || 0;
                const totalVotes = Object.values(results).reduce((sum, v) => sum + v, 0);
                const percentage = totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0;
                
                return (
                  <div key={index} className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex justify-between items-center mb-1">
                      <span className={selectedAnswer === option ? 'font-bold text-green-600' : ''}>
                        {option}
                      </span>
                      <span className="text-sm text-gray-600">
                        {votes} votes ({percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          selectedAnswer === option ? 'bg-green-500' : 'bg-blue-500'
                        }`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 text-center text-gray-600">
              Total responses: {Object.values(results).reduce((sum, v) => sum + v, 0)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Main App Component
const App = () => {
  const [user, setUser] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [results, setResults] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [connectedStudents, setConnectedStudents] = useState([]);
  const [isCreatingPoll, setIsCreatingPoll] = useState(false);
  const [teacherOnline, setTeacherOnline] = useState(false);

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('polling_current_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // Real-time event listeners
  useEffect(() => {
    if (user?.role === 'student') {
      // Save student data
      dataManager.saveStudentData(user);
      
      // Listen for teacher presence
      const presenceHandler = socket.on('teacher-presence', (data) => {
        setTeacherOnline(data.status === 'online');
      });

      // Listen for new polls
      const questionHandler = socket.on('create-poll', (pollData) => {
        setCurrentQuestion(pollData);
        setTimeLeft(pollData.timeLimit);
        setHasAnswered(false);
        setShowResults(false);
        setSelectedAnswer('');
        setResults({});
      });
      
      // Listen for poll end
      const endHandler = socket.on('end-poll', () => {
        setCurrentQuestion(null);
        setShowResults(false);
        setHasAnswered(false);
        setSelectedAnswer('');
        setResults({});
      });

      // Listen for real-time results
      const resultsHandler = socket.on('poll-results', (resultData) => {
        setResults(resultData);
        setShowResults(true);
      });

      // Notify teacher of student join
      socket.emit('student-join', { 
        name: user.name,
        email: user.email,
        id: user.id || Date.now().toString()
      });
      
      return () => {
        socket.off('teacher-presence', presenceHandler);
        socket.off('create-poll', questionHandler);
        socket.off('end-poll', endHandler);
        socket.off('poll-results', resultsHandler);
      };
    }
  }, [user]);

  // Teacher listeners for student answers
  useEffect(() => {
    if (user?.role === 'teacher') {
      const answerHandler = socket.on('submit-answer', (answerData) => {
        setResults(prev => {
          const newResults = {
            ...prev,
            [answerData.answer]: (prev[answerData.answer] || 0) + 1
          };
          
          // Broadcast updated results to all students
          socket.emit('poll-results', newResults);
          
          return newResults;
        });
        
        // Update student status
        setConnectedStudents(prev => 
          prev.map(student => 
            student.email === answerData.studentEmail 
              ? { ...student, answered: true }
              : student
          )
        );
      });
      
      const joinHandler = socket.on('student-join', (studentData) => {
        setConnectedStudents(prev => [
          ...prev.filter(s => s.email !== studentData.email),
          { 
            id: studentData.id, 
            name: studentData.name, 
            email: studentData.email,
            answered: false 
          }
        ]);
      });
      
      return () => {
        socket.off('submit-answer', answerHandler);
        socket.off('student-join', joinHandler);
      };
    }
  }, [user]);

  // Timer effect
  useEffect(() => {
    let timer;
    if (currentQuestion && timeLeft > 0 && !hasAnswered) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setShowResults(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [currentQuestion, timeLeft, hasAnswered]);

  // Check for existing teacher on student login
  useEffect(() => {
    if (user?.role === 'student') {
      const teacherPresence = socket.getCurrentData('teacher-presence');
      if (teacherPresence) {
        setTeacherOnline(teacherPresence.status === 'online');
      }
    }
  }, [user]);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('polling_current_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    if (user?.role === 'teacher') {
      socket.emit('teacher-presence', { teacherName: user.name, status: 'offline' });
    }
    
    setUser(null);
    localStorage.removeItem('polling_current_user');
    
    // Reset all states
    setCurrentQuestion(null);
    setHasAnswered(false);
    setSelectedAnswer('');
    setResults({});
    setShowResults(false);
    setTimeLeft(60);
    setConnectedStudents([]);
    setIsCreatingPoll(false);
    setTeacherOnline(false);
  };

  const handleAnswerSubmit = (answer) => {
    setSelectedAnswer(answer);
    setHasAnswered(true);
    setShowResults(true);
    
    // Send answer to teacher
    socket.emit('submit-answer', { 
      questionId: currentQuestion.id, 
      answer,
      studentName: user.name,
      studentEmail: user.email
    });
  };

  const handleCreatePoll = (pollData) => {
    const newPoll = {
      id: Date.now().toString(),
      question: pollData.question,
      options: pollData.options,
      timeLimit: pollData.timeLimit,
      active: true,
      createdBy: user.name,
      createdAt: Date.now()
    };
    
    setCurrentQuestion(newPoll);
    setTimeLeft(pollData.timeLimit);
    setHasAnswered(false);
    setShowResults(false);
    setIsCreatingPoll(false);
    setResults({});
    
    // Reset student answered status
    setConnectedStudents(prev => 
      prev.map(student => ({ ...student, answered: false }))
    );
    
    // Send to students
    socket.emit('create-poll', newPoll);
  };

  const handleEndPoll = () => {
    if (currentQuestion) {
      // Save poll results
      const pollResult = {
        question: currentQuestion.question,
        options: currentQuestion.options,
        results: results,
        totalResponses: Object.values(results).reduce((sum, v) => sum + v, 0),
        createdBy: user.name,
        endedAt: Date.now()
      };
      
      dataManager.savePollResult(pollResult);
      
      // Reset states
      setCurrentQuestion(null);
      setShowResults(false);
      setHasAnswered(false);
      setResults({});
      
      // Notify students
      socket.emit('end-poll', { questionId: currentQuestion.id });
    }
  };

  if (!user) {
    return <LoginForm onLogin={handleLogin} />;
  }

  if (user.role === 'teacher') {
    return (
      <TeacherDashboard 
        user={user}
        currentQuestion={currentQuestion}
        connectedStudents={connectedStudents}
        results={results}
        pastPolls={dataManager.getPollResults()}
        isCreatingPoll={isCreatingPoll}
        setIsCreatingPoll={setIsCreatingPoll}
        onCreatePoll={handleCreatePoll}
        onEndPoll={handleEndPoll}
        onLogout={handleLogout}
      />
    );
  }

  return (
    <StudentDashboard 
      user={user}
      currentQuestion={currentQuestion}
      hasAnswered={hasAnswered}
      selectedAnswer={selectedAnswer}
      results={results}
      showResults={showResults}
      timeLeft={timeLeft}
      onAnswerSubmit={handleAnswerSubmit}
      onLogout={handleLogout}
      teacherOnline={teacherOnline}
    />
  );
};

export default App;
