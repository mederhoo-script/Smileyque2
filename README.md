# smileyque

## Environment Setup

This project uses Firebase. To run it locally you need to create a `.env` file in the project root with your Firebase project credentials.

1. Copy `example.env` to `.env`:
   ```bash
   cp example.env .env
   ```

2. Open `.env` and replace each placeholder with the real values from your Firebase project.  
   You can find them in the [Firebase console](https://console.firebase.google.com/) under:  
   **Project Settings → General → Your apps → SDK setup and configuration**

   ```env
   VITE_FIREBASE_API_KEY=your_api_key_here
   VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project_id.firebasestorage.app
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
   ```

3. The `.env` file is listed in `.gitignore` and will **not** be committed to the repository.

## Development

```bash
npm install
npm run dev
```