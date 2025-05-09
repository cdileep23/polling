Frontend

cd client
npm i
npm run dev

backend

cd server
npm i
npm run dev


Features Implemented


1. Tech Stack:
   - React.js (frontend)
   - Node.js (server)
   - Express (web framework)
   - Socket.io (real-time communication)
   - Shadcn (UI components)
   - Tailwind (CSS framework)

2. User Management:
   - User creation with unique names
   - User identification system with IDs
   - Timestamp tracking for user creation

3. Polling System:
   - Create polls
   - Join existing polls
   - Vote on polls
   - Real-time vote updates
   - Poll timer functionality
   - Poll completion notifications

4. Routes:
   - `/name` - Likely for user registration/profile
   - `/` - Main application route
   - `/poll/:id` - Specific poll view

5. API Endpoints:
   - `/create-user` - User registration
   - `/create-poll` - Poll creation
   - `/join-poll` - Joining an existing poll
   - `/poll-data/:id` - Retrieving poll information

6. Socket.io Events:
   - `join-room` - Connect to a specific poll room
   - `post-vote` - Submit a vote
   - `poll-timer` - Real-time timer updates
   - `vote-updated` - Real-time vote count updates
   - `poll-ended` - Notification when poll closes

7. Poll Data Structure:
   - Room ID
   - Question text
   - Multiple options (option1, option2)
   - Status tracking
   - Timer functionality
   - Vote counting for each option
   - Creator identification
  

     In this application, users join a specific poll using the "join-room" event with the poll's roomId. When someone votes, their choice is sent through "post-vote" to the server, which updates the central vote count. The server then broadcasts a "vote-updated" event to everyone in that room with the latest results. During active polls, "poll-timer" events keep countdown displays synchronized, and when time runs out, a "poll-ended" event notifies all room participants that voting has closed.



