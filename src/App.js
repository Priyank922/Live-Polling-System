import React, { useState, useEffect } from 'react';

// Real-time communication using localStorage
const createRealTimeConnection = () => {
  return {
    emit: (event, data) => {
      localStorage.setItem(`polling_${event}`, JSON.stringify({
        ...data,
        timestamp: Date.now()
      }));
      // Trigger storage event for other tabs
      window.dispatchEvent(new StorageEvent('storage', {
        key: `polling_${event}`,
        newValue: JSON.stringify(data)
      }));
    },
    
    on: (event, callback) => {
      const handler = (e) => {
        if (e.key === `polling_${event}`) {
          try {
            callback(JSON.parse(e.newValue));
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
    }
  };
};

// Replace mock socket with real implementation
const socket = createRealTimeConnection();

// Mock components (you'll need to create these)
const RoleSelection = ({ onRoleSelect }) => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
    <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Live Polling System</h1>
      <div className="space-y-4">
        <button
          onClick={() => onRoleSelect('teacher')}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200"
        >
          I'm a Teacher
        </button>
        <button
          onClick={() => onRoleSelect('student')}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200"
        >
          I'm a Student
        </button>
      </div>
    </div>
  </div>
);

const StudentNameInput = ({ studentName, setStudentName, onSubmit }) => (
  <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-100 flex items-center justify-center p-4">
    <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Enter Your Name</h2>
      <div className="space-y-4">
        <input
          type="text"
          value={studentName}
          onChange={(e) => setStudentName(e.target.value)}
          placeholder="Your name"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          onKeyPress={(e) => e.key === 'Enter' && onSubmit()}
        />
        <button
          onClick={onSubmit}
          disabled={!studentName.trim()}
          className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white font-semibold py-3 px-6 rounded-lg transition duration-200"
        >
          Join Session
        </button>
      </div>
    </div>
  </div>
);

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
  const [pollData, setPollData] = useState({
    question: '',
    options: ['', ''],
    timeLimit: 60
  });

  const handleCreatePoll = () => {
    if (pollData.question.trim() && pollData.options.every(opt => opt.trim())) {
      onCreatePoll(pollData);
      setPollData({ question: '', options: ['', ''], timeLimit: 60 });
    }
  };

  const addOption = () => {
    setPollData(prev => ({ ...prev, options: [...prev.options, ''] }));
  };

  const updateOption = (index, value) => {
    setPollData(prev => ({
      ...prev,
      options: prev.options.map((opt, i) => i === index ? value : opt)
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Teacher Dashboard</h1>
        
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
                <input
                  key={index}
                  type="text"
                  value={option}
                  onChange={(e) => updateOption(index, e.target.value)}
                  placeholder={`Option ${index + 1}`}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
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

        {currentQuestion && (
          <div className="bg-white rounded-lg shadow-xl p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Active Poll</h2>
            <p className="text-lg mb-4">{currentQuestion.question}</p>
            
            <div className="space-y-2 mb-4">
              {currentQuestion.options.map((option, index) => (
                <div key={index} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                  <span>{option}</span>
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                    {results[option] || 0} votes
                  </span>
                </div>
              ))}
            </div>
            
            <button
              onClick={onEndPoll}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition duration-200"
            >
              End Poll
            </button>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-xl p-6">
          <h2 className="text-xl font-bold mb-4">Connected Students ({connectedStudents.length})</h2>
          <div className="space-y-2">
            {connectedStudents.map((student) => (
              <div key={student.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                <span>{student.name}</span>
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
  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Welcome, {studentName}!</h2>
          <p className="text-gray-600">Waiting for the teacher to start a poll...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-100 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Hello, {studentName}!</h2>
            <div className="text-lg font-semibold text-red-600">
              {timeLeft > 0 ? `${timeLeft}s` : 'Time Up!'}
            </div>
          </div>
          
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
          
          {showResults && (
            <div className="mt-6">
              <h4 className="text-lg font-semibold mb-3">Results:</h4>
              <div className="space-y-2">
                {currentQuestion.options.map((option, index) => (
                  <div key={index} className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className={selectedAnswer === option ? 'font-bold' : ''}>{option}</span>
                      <span className="text-sm text-gray-600">{results[option] || 0} votes</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const App = () => {
  const [role, setRole] = useState('');
  const [studentName, setStudentName] = useState('');
  const [nameSubmitted, setNameSubmitted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [results, setResults] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [connectedStudents, setConnectedStudents] = useState([]);
  const [pastPolls, setPastPolls] = useState([]);
  const [isCreatingPoll, setIsCreatingPoll] = useState(false);

  // Real-time event listeners
  useEffect(() => {
    if (role === 'student') {
      const questionHandler = socket.on('create-poll', (pollData) => {
        setCurrentQuestion(pollData);
        setTimeLeft(pollData.timeLimit);
        setHasAnswered(false);
        setShowResults(false);
        setSelectedAnswer('');
        setResults({});
      });
      
      const endHandler = socket.on('end-poll', () => {
        setCurrentQuestion(null);
        setShowResults(false);
        setHasAnswered(false);
        setSelectedAnswer('');
        setResults({});
      });
      
      return () => {
        socket.off('create-poll', questionHandler);
        socket.off('end-poll', endHandler);
      };
    }
  }, [role]);

  // Teacher listeners for student answers
  useEffect(() => {
    if (role === 'teacher') {
      const answerHandler = socket.on('submit-answer', (answerData) => {
        setResults(prev => ({
          ...prev,
          [answerData.answer]: (prev[answerData.answer] || 0) + 1
        }));
        
        // Update student status
        setConnectedStudents(prev => 
          prev.map(student => 
            student.name === answerData.studentName 
              ? { ...student, answered: true }
              : student
          )
        );
      });
      
      const joinHandler = socket.on('student-join', (studentData) => {
        setConnectedStudents(prev => [
          ...prev.filter(s => s.name !== studentData.name),
          { id: Date.now().toString(), name: studentData.name, answered: false }
        ]);
      });
      
      return () => {
        socket.off('submit-answer', answerHandler);
        socket.off('student-join', joinHandler);
      };
    }
  }, [role]);

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

  const handleRoleSelection = (selectedRole) => {
    setRole(selectedRole);
  };

  const handleStudentNameSubmit = () => {
    if (studentName.trim()) {
      setNameSubmitted(true);
      // Actually send join notification to teacher
      socket.emit('student-join', { name: studentName });
    }
  };

  const handleAnswerSubmit = (answer) => {
    setSelectedAnswer(answer);
    setHasAnswered(true);
    setShowResults(true);
    
    // Actually send answer to teacher
    socket.emit('submit-answer', { 
      questionId: currentQuestion.id, 
      answer,
      studentName 
    });
  };

  const handleCreatePoll = (pollData) => {
    const newPoll = {
      id: Date.now().toString(),
      question: pollData.question,
      options: pollData.options,
      timeLimit: pollData.timeLimit,
      active: true
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
    
    // Actually send to students
    socket.emit('create-poll', newPoll);
  };

  const handleEndPoll = () => {
    if (currentQuestion) {
      setPastPolls(prev => [...prev, { ...currentQuestion, results }]);
      setCurrentQuestion(null);
      setShowResults(false);
      setHasAnswered(false);
      setResults({});
      
      // Actually send end notification to students
      socket.emit('end-poll', { questionId: currentQuestion.id });
    }
  };

  if (!role) {
    return <RoleSelection onRoleSelect={handleRoleSelection} />;
  }

  if (role === 'student' && !nameSubmitted) {
    return (
      <StudentNameInput 
        studentName={studentName}
        setStudentName={setStudentName}
        onSubmit={handleStudentNameSubmit}
      />
    );
  }

  if (role === 'teacher') {
    return (
      <TeacherDashboard 
        currentQuestion={currentQuestion}
        connectedStudents={connectedStudents}
        results={results}
        pastPolls={pastPolls}
        isCreatingPoll={isCreatingPoll}
        setIsCreatingPoll={setIsCreatingPoll}
        onCreatePoll={handleCreatePoll}
        onEndPoll={handleEndPoll}
      />
    );
  }

  return (
    <StudentDashboard 
      studentName={studentName}
      currentQuestion={currentQuestion}
      hasAnswered={hasAnswered}
      selectedAnswer={selectedAnswer}
      results={results}
      showResults={showResults}
      timeLeft={timeLeft}
      onAnswerSubmit={handleAnswerSubmit}
    />
  );
};

export default App;