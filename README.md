 # Fortnite Dashboard
 
 A full-stack web dashboard to track Fortnite player stats by Epic, Xbox, or PSN username.
 
 ## Tech Stack
 
 - Backend: Node.js, TypeScript, Express
 - Frontend: React, TypeScript (Create React App)
 - API Wrapper: fnapicom
 
 ## Features
 
 1. Add/Remove players by username & platform
 2. Fetch & cache stats (5 min TTL)
 3. Display stats: Level, Wins, Win Rate, Matches, K/D, Kills/Match, Total Kills, Play Time, Avg Match Time
 4. Auto-refresh stats every 5 minutes
 
 ## Setup
 
 ```bash
 # Install root dependencies
 npm install
 
 # Install server & client dependencies
 npm install --prefix server
 npm install --prefix client
 
 # Create .env for server
 # Replace with your own API key and season dates
 cat << EOF > server/.env
 FNAPI_KEY=<KEY>
 SEASON_NAME="Chapter 6 Season 2"
 SEASON_START_DATE="2024-02-10T16:00:00.000Z"
 SEASON_END_DATE="2024-05-04T23:00:00.000Z"
 EOF
 
 # Run both servers
 npm run dev
 ```
 
 Server runs at http://localhost:3001
 Client runs at http://localhost:3000
 
 ## API Endpoints
 
 - GET /api/players: List players with stats
 - POST /api/players: Add a player { username, platform }
 - DELETE /api/players/:id: Remove a player
 
 ## License
 
 MIT

## Docker Setup

Make sure you have Docker and Docker Compose installed, then from the project root:

```bash
# Ensure your server environment variables are set in server/.env
docker-compose up -d --build
```
Your frontend will be available at http://localhost:4200 (or host IP:4200), and the API at http://localhost:4201.

To stop and remove containers:

```bash
docker-compose down
```