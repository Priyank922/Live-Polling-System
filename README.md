# Live Polling System 📊

A real-time interactive polling application built with React that enables teachers to create polls and students to participate in real-time. Perfect for classroom engagement, training sessions, and interactive presentations.

## 🚀 Live Demo

**[Try the Live Demo](https://live-polling-system-bice.vercel.app/)**

## ✨ Features

### For Teachers
- **User Authentication**: Secure login/registration system
- **Real-time Poll Creation**: Create polls with multiple options and time limits
- **Live Results**: View real-time responses as students vote
- **Student Management**: Track connected students and their participation
- **Poll History**: Access and manage previous polls
- **Student Controls**: Remove or kick students from sessions
- **Dashboard Analytics**: View comprehensive student data and engagement metrics

### For Students
- **Easy Registration**: Simple sign-up process with email verification
- **Real-time Participation**: Vote on active polls instantly
- **Live Results**: See poll results update in real-time
- **Poll History**: Review previous polls and results
- **Responsive Design**: Works seamlessly on desktop and mobile devices

### Technical Features
- **Real-time Communication**: Instant updates using custom polling mechanism
- **Local Storage**: Persistent data storage for offline capability
- **Responsive UI**: Modern, mobile-friendly interface with Tailwind CSS
- **Session Management**: Secure user sessions with authentication
- **Cross-tab Synchronization**: Multi-tab support with synchronized data

## 🛠️ Tech Stack

- **Frontend**: React 18+ with Hooks
- **Styling**: Tailwind CSS
- **State Management**: React useState and useEffect
- **Real-time Updates**: Custom polling system with localStorage and StorageEvent API
- **Authentication**: Custom hash-based authentication system
- **Data Persistence**: Browser localStorage
- **Deployment**: Vercel
- **Build Tool**: Create React App

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Modern web browser

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/priyank922/live-polling-system.git
   cd live-polling-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**
   ```bash
   npm start
   # or
   yarn start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## 🎯 Usage

### Getting Started

1. **Registration**
   - Visit the application
   - Choose "Register" and select your role (Teacher/Student)
   - Fill in your details and create an account

2. **For Teachers**
   - Log in with your credentials
   - Create polls with custom questions and options
   - Set time limits for responses
   - Monitor student participation in real-time
   - View and manage poll history

3. **For Students**
   - Log in with your credentials
   - Wait for teacher to start a poll
   - Participate by selecting your answer
   - View real-time results after voting

### Key Workflows

#### Creating a Poll (Teacher)
1. Select "Teacher" role and register/login
2. Access the Teacher Dashboard
3. Click "Create New Poll"
4. Enter your question
5. Add multiple choice options
6. Set time limit (10-300 seconds)
7. Click "Start Poll"

#### Participating in a Poll (Student)
1. Select "Student" role and register/login
2. Access the Student Dashboard
3. Wait for active poll notification
4. Read the question carefully
5. Select your answer
6. View live results

## 🏗️ Project Structure

```
live-polling-system/
├── public/
│   ├── favicon.ico           # App favicon
│   └── index.html            # HTML template
├── src/
│   ├── components/
│   │   ├── RoleSelection.js      # Role selection component
│   │   ├── StudentDashboard.js   # Student interface
│   │   ├── StudentNameInput.js   # Student name input
│   │   └── TeacherDashboard.js   # Teacher interface
│   ├── App.js                # Main app with LoginForm and routing
│   ├── index.js              # Application entry point
│   └── index.css             # Global styles
├── package.json              # Dependencies and scripts
├── package-lock.json         # Dependency lock file
└── README.md                 # Project documentation
```

## 🔐 Security Features

- **Password Hashing**: Secure password storage with custom hashing
- **Session Management**: Secure user session handling
- **Input Validation**: Comprehensive form validation
- **XSS Protection**: Sanitized user inputs
- **Authentication Guards**: Role-based access control

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones
- Various screen sizes and orientations

## 🎨 UI/UX Features

- **Modern Design**: Clean, professional interface
- **Dark/Light Themes**: Adaptive color schemes
- **Smooth Animations**: Engaging transitions and hover effects
- **Accessibility**: Screen reader friendly with proper ARIA labels
- **Loading States**: Visual feedback for user actions

## 🔧 Configuration

### Environment Variables
No environment variables required for basic functionality. The app uses localStorage for data persistence.

### Customization
- Modify styling in `src/index.css` and component files
- Update time limits and poll options in `App.js`
- Customize authentication flow in the authManager within `App.js`
- Modify component behavior in individual component files

## 🚀 Deployment

### Deploy to Vercel
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically with each push

### Deploy to Netlify
1. Build the project: `npm run build`
2. Upload the `build` folder to Netlify
3. Configure redirects for SPA routing

## 🐛 Troubleshooting

### Common Issues

**Students can't see polls**
- Ensure teacher is online and has created a poll
- Check browser localStorage is enabled
- Refresh the page to sync data

**Real-time updates not working**
- Verify localStorage permissions
- Check if multiple tabs are open
- Clear browser cache and try again

**Authentication issues**
- Clear localStorage data
- Re-register with a new account
- Check email format is valid

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow React best practices
- Use Tailwind CSS for styling
- Write descriptive commit messages
- Test on multiple devices
- Update documentation for new features

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- React team for the amazing framework
- Tailwind CSS for beautiful styling
- Vercel for seamless deployment
- Open source community for inspiration

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/yourusername/live-polling-system/issues) page
2. Create a new issue with detailed description
3. Join our community discussions

## 🔄 Updates & Roadmap

### Recent Updates
- ✅ Real-time polling system
- ✅ Student management features
- ✅ Poll history and analytics
- ✅ Responsive design improvements

### Upcoming Features
- 🔄 Database integration
- 🔄 Advanced analytics dashboard
- 🔄 Export poll results
- 🔄 Multi-language support
- 🔄 Integration with LMS platforms

---

Made with ❤️ by Priyank922
