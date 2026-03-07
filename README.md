# smileyque

## Environment Setup

This project uses Firebase (Firestore + Auth) and Cloudinary (image storage). To run it locally you need to create a `.env` file in the project root.

1. Copy `example.env` to `.env`:
   ```bash
   cp example.env .env
   ```

2. Open `.env` and fill in your **Firebase** credentials.  
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

3. Fill in your **Cloudinary** credentials.  
   Product images are uploaded directly to Cloudinary from the browser; only the resulting URL is stored in Firestore.

   | Step | Where to look |
   |------|---------------|
   | **Cloud name** | [Cloudinary dashboard](https://console.cloudinary.com/) – shown at the top of the page |
   | **Upload preset** | **Settings → Upload → Upload presets → Add upload preset** – set *Signing Mode* to **Unsigned** and save |

   ```env
   VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
   VITE_CLOUDINARY_UPLOAD_PRESET=your_unsigned_upload_preset
   ```

   > **Note:** Never put your Cloudinary API Secret in a `VITE_` variable — it would be bundled into the public JavaScript. Unsigned upload presets let the browser upload images without exposing any secret.

4. The `.env` file is listed in `.gitignore` and will **not** be committed to the repository.

## Development

```bash
npm install
npm run dev
```