# **Backend Server** for Brown Climbing Website

## Available Scripts

In the server directory, you can run:

### `npm install`

Installs all the dependencies

### `npm run watch`

Transpiles the .ts files into .js files and outputs in the dist directory. Automatically transpiles on save.

### `npm run dev`

Detects all changes on save and automatically refreshes the server.

### `npm run start`

Starts the server

## Environment Variables

Create a file named '.env' inside /server
Put all environment variables in .env file.
Environment Variables:

### `PORT=` (port to host the backend on - optional)

### `HOST=` (host to host the backend on - optional)

### `GOOGLE_CLIENT_ID=` (client safe)

### `GOOGLE_CLIENT_SECRET=` (not client safe)

### `MONGODB_URI=` (not client safe)

### `CLIENT_URL=` (frontend URL)

### `SESSION_SECRET=` (not client safe)

### `SMTP_USERNAME=` (email address to send confirmation emails from)

### `SMTP_PASSWORD=` (not client safe)

### `SMTP_HOSTNAME=` (SMTP server for sending emails)
