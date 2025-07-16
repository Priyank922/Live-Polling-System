# Live Polling System

A real-time polling system built with React that allows teachers to create polls and students to participate in live voting sessions.

## Features

### For Teachers
- Create and manage live polls with multiple choice questions
- Set custom time limits for polls (30-300 seconds)
- View real-time results and student participation
- Monitor connected students
- View past poll results
- End polls manually
- Access comprehensive dashboard

### For Students
- Join polling sessions with their name
- Answer questions in real-time
- View live results after submitting answers
- See countdown timer for active polls
- Visual feedback for submitted answers

## Tech Stack

- **Frontend:** React 18 with Hooks
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **State Management:** React useState and useEffect
- **Real-time Communication:** Socket.IO (mock implementation included)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/Priyank922/Live-Polling-System.git
cd Live-Polling-System
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open your browser and navigate to `http://localhost:3000`

## Usage

### Getting Started
1. **Role Selection:** Choose whether you're a teacher or student
2. **For Students:** Enter your name to join the session
3. **For Teachers:** Access the dashboard to create and manage polls

### Creating a Poll (Teacher)
1. Click "Create Poll" button
2. Enter your question
3. Add multiple choice options (minimum 2)
4. Set time limit (30-300 seconds)
5. Click "Start Poll"

### Participating in a Poll (Student)
1. Wait for teacher to start a poll
2. Read the question and available options
3. Click on your chosen answer
4. View real-time results after submission

## Project Structure

```
live-polling-system/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── RoleSelection.js      # Role selection component
│   │   ├── StudentNameInput.js   # Student name input form
│   │   ├── TeacherDashboard.js   # Teacher interface
│   │   └── StudentDashboard.js   # Student interface
│   ├── App.js                    # Main app component
│   ├── index.js                  # React entry point
│   └── index.css                 # Global styles
├── package.json
└── README.md
```

## Component Details

### App.js
Main application component that manages:
- Role selection
- Student name collection
- Current question state
- Timer functionality
- Mock Socket.IO integration

### RoleSelection.js
Initial screen for choosing user role (teacher or student)

### StudentNameInput.js
Form for students to enter their name before joining

### TeacherDashboard.js
Teacher interface featuring:
- Poll creation form
- Live results display
- Connected students list
- Past polls history

### StudentDashboard.js
Student interface featuring:
- Question display
- Answer selection
- Live results viewing
- Timer countdown

## Mock Data

The application includes mock data for demonstration:
- Sample questions and options
- Simulated student connections
- Mock voting results
- Fake Socket.IO events

## Real-time Implementation

The current implementation includes mock Socket.IO functionality. To implement real-time features, you would need to:

1. Set up a Node.js server with Socket.IO
2. Replace mock socket events with actual socket connections
3. Implement real-time data synchronization
4. Add proper error handling and reconnection logic

## Styling

The application uses Tailwind CSS for styling with:
- Responsive design
- Gradient backgrounds
- Smooth animations and transitions
- Modern card-based layouts
- Interactive hover effects

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add some amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Submit a pull request

## License

This project is licensed under the MIT License.

## Future Enhancements

- Real Socket.IO integration
- Database persistence
- User authentication
- Poll analytics
- Export results functionality
- Mobile app version
- Multiple question types (true/false, rating scales)
- Real-time chat during polls

## Live Preview

Check out the live demo: [LIVE-PREVIEW](https://live-polling-system-tawny.vercel.app/)

## Support

If you have any questions or need help with setup, please open an issue in the repository.

---

Built with ❤️ by [Priyank922](https://github.com/Priyank922)
