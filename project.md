# Project Overview
Generate a full-stack web dashboard in Node.js and TypeScript that lets me track Fortnite player stats by Epic, Xbox, or PSN username. The UI should look similar to the attached Fortnite.gg screenshot and display for each player:
- Chapter & Season
- Level
- Wins
- Win Rate (%)
- Matches Played
- K/D
- Kills per Match
- Total Kills
- Total Play Time
- Average Match Time

# Tech Stack
- Backend: Node.js + TypeScript + Express
- Fortnite API wrapper: fnapicom (https://github.com/Fortnite-API/nodejs-wrapper)
- Frontend: React + TypeScript (create-react-app with TypeScript template)
- Styling: your choice (e.g. Tailwind or plain CSS modules)
- Data fetching: REST endpoints on Express that call fnapicom for each platform/user combo
- Environment: store your Fortnite API key in an `.env` file as `FNAPI_KEY`, and define season dates via `SEASON_NAME`, `SEASON_START_DATE`, and `SEASON_END_DATE`.
- API KEY: Your API key: abff7900-5d96-43e5-84be-45e99386a46d HTTP Header: Authorization

# Features
1. **Add/Remove Players**  
   - A simple form to enter an Epic, Xbox, or PSN username and choose the platform from a dropdown.
   - Persist list of tracked players in memory (or a JSON file) on the server.

2. **Fetch & Cache Stats**  
   - On the backend, use fnapicom to fetch each player’s `lookup` and `stats` (Battle Royale) data.
   - Cache results for 5 minutes to avoid rate-limit issues.

3. **API Endpoints**  
   - `GET /api/players` → returns an array of tracked players + latest stats.
   - `POST /api/players` → add a new player by `{ username, platform }`.
   - `DELETE /api/players/:id` → remove a player.

4. **Frontend Dashboard**  
   - Display each player’s stats in a card with the same metrics as the screenshot.
   - Show a loading spinner while fetching.
   - Auto-refresh stats every 5 minutes.

# Deliverables
- `server/` folder with `index.ts`, controllers, and fnapicom integration.
- `client/` folder bootstrapped via CRA TypeScript, with React components for:
  - PlayerList
  - PlayerCard
  - AddPlayerForm
- Clear README with setup instructions:
-  1. `npm install`
-  2. Create `.env` with `FNAPI_KEY=your_key_here`, `SEASON_NAME`, `SEASON_START_DATE`, and `SEASON_END_DATE`
-  3. `npm run dev` (runs both server & client)

