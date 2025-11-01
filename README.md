# Jarvis VibeAI App

A local Next.js demo app (JARVIS-themed) with voice interaction, memory storage, and a hologram UI.

This repository was prepared from a local workspace and pushed to https://github.com/Chinmaysl29/jarvis

## Quick start

1. Install dependencies

```powershell
npm install
```

2. Run the development server

```powershell
npm run dev
```

3. Open the app

- Local: http://localhost:3000 (Next will try ports 3000, 3001, 3002 if ports are in use)

## Notes & troubleshooting

- Tailwind CSS directives (e.g. `@tailwind base;`) may show warnings in some editors if the Tailwind extension or PostCSS config isn't recognized; these are editor warnings, not runtime errors. Ensure `tailwindcss`, `postcss`, and `autoprefixer` are installed.

- If Next.js reports the port is in use, either stop the other process or let Next pick the next available port (it will print the URL it uses).

- The app includes browser features (SpeechRecognition, SpeechSynthesis) that require a modern browser (Chrome/Edge/Safari) and microphone permissions for full functionality.

## GitHub

This project was pushed to:

https://github.com/Chinmaysl29/jarvis

## License

MIT
