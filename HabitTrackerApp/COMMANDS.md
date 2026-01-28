# 🚀 HabitTrackerApp - Web Version Commands Reference

## Quick Commands

### Development (Hot Reload)
```bash
npm run web
```
- Opens at `http://localhost:19006`
- Auto-reloads on file changes
- Best for development

### Build for Production
```bash
# Windows
build-web.bat

# Mac/Linux
./build-web.sh
```
- Creates optimized `dist` folder
- Ready for hosting
- ~2-3 minutes to build

### Serve Built Version
```bash
# Windows
serve-web.bat

# Mac/Linux
./serve-web.sh
```
- Opens at `http://localhost:3000`
- Serves the production build
- Perfect for testing before deploy

---

## Directory Structure
```
HabitTrackerApp/
├── src/                    ← Your app code
├── app/                    ← Expo Router pages
├── components/             ← React components
├── public/                 ← Static files (responsive.css)
├── dist/                   ← Build output (created by build-web.bat)
├── build-web.bat           ← Build script (Windows)
├── build-web.sh            ← Build script (Mac/Linux)
├── serve-web.bat           ← Serve script (Windows)
├── serve-web.sh            ← Serve script (Mac/Linux)
├── vercel.json             ← Vercel config
├── netlify.toml            ← Netlify config
├── firebase.json           ← Firebase config
├── Dockerfile              ← Docker config
└── WEB_DEPLOYMENT.md       ← Full deployment guide
```

---

## Deployment URLs

| Platform | Setup Time | Cost | Command |
|----------|-----------|------|---------|
| **Vercel** | 2 min | Free | `vercel` |
| **Netlify** | 2 min | Free | `netlify deploy --prod --dir dist` |
| **Firebase** | 5 min | Free tier | `firebase deploy` |
| **Docker** | 10 min | ~$5/mo | Push to any cloud |

---

## Testing on Phone

1. Start: `npm run web`
2. Get your IP: `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
3. On phone: `http://YOUR_IP:19006`
4. QR code appears - scan to test

---

## Performance Tips

- ✅ Built files are minified automatically
- ✅ Code-splitting happens automatically
- ✅ Images should be optimized before using
- ✅ Use CDN for serving static files

---

## Files Created for Web

| File | Purpose |
|------|---------|
| `build-web.bat/sh` | Builds optimized web version |
| `serve-web.bat/sh` | Serves build locally |
| `public/styles/responsive.css` | Mobile-responsive styles |
| `vercel.json` | Vercel deployment config |
| `netlify.toml` | Netlify deployment config |
| `firebase.json` | Firebase hosting config |
| `Dockerfile` | Docker containerization |
| `.github/workflows/web-deploy.yml` | CI/CD automation |
| `WEB_DEPLOYMENT.md` | Complete deployment guide |
| `WEB_QUICKSTART.md` | Quick start guide |

---

## Environment Variables

Set before build:
```bash
set EXPO_PUBLIC_API_URL=https://api.example.com
set EXPO_PUBLIC_ENV=production
```

Use in code:
```javascript
const API_URL = process.env.EXPO_PUBLIC_API_URL;
```

---

## Browser Compatibility

✅ Chrome/Edge (v90+)
✅ Firefox (v88+)
✅ Safari (v14+)
✅ Mobile browsers (all modern)

---

## Troubleshooting

| Error | Solution |
|-------|----------|
| Metro bundler taking too time | Wait 2-3 min, normal for first build |
| "Cannot find module" | Run `npm install` |
| Port already in use | Use different: `npx http-server dist -p 8080` |
| Build hangs | Kill process (Ctrl+C), run again |

---

## Your Setup is Ready! ✅

- ✅ Responsive web version
- ✅ Mobile-optimized styles
- ✅ Development server
- ✅ Production build script
- ✅ Multiple hosting configs
- ✅ CI/CD workflow
- ✅ Docker support

**Next:** Run `npm run web` to see it live!
