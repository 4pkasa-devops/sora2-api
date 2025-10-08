# Quick Setup Guide

## 1. Install Dependencies

The dependencies are already installed, but if you need to reinstall:

```bash
npm install
```

## 2. Configure Your OpenAI API Key

### Option A: Create .env.local file (Recommended)

Create a new file named `.env.local` in the root directory:

```bash
# On Windows PowerShell
New-Item -Path .env.local -ItemType File
```

Add your OpenAI API key to `.env.local`:

```env
OPENAI_API_KEY=sk-proj-your_actual_api_key_here
```

### Option B: Copy from example

```bash
# On Windows PowerShell
Copy-Item .env.local.example .env.local
```

Then edit `.env.local` and replace `your_openai_api_key_here` with your actual API key.

## 3. Get Your OpenAI API Key

1. Go to [OpenAI API Keys](https://platform.openai.com/api-keys)
2. Sign in to your OpenAI account
3. Click "Create new secret key"
4. Copy the key (it starts with `sk-proj-...`)
5. Paste it in your `.env.local` file

**Important**: Make sure you have access to the Sora 2 API. This may require:
- Joining a waitlist
- Special API access approval
- Sufficient API credits

## 4. Start the Development Server

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

## 5. Verify Setup

1. Open your browser to [http://localhost:3000](http://localhost:3000)
2. If you see an orange warning about the API key, check your `.env.local` file
3. Try generating a test video with a simple prompt like: "A red ball bouncing on grass, sunny day"

## Troubleshooting

### "Failed to create video" error
- Verify your API key is correct in `.env.local`
- Ensure you have Sora 2 API access
- Check your OpenAI account has sufficient credits

### Orange API key warning persists
- Make sure `.env.local` file exists in the root directory
- Verify the file contains: `OPENAI_API_KEY=sk-proj-...`
- Restart the development server after creating/editing `.env.local`
- The file name should be exactly `.env.local` (with the dot at the start)

### Port already in use
- Next.js will automatically use the next available port (3001, 3002, etc.)
- Or stop the existing process using port 3000

## Next Steps

Once setup is complete:

1. **Generate your first video**: Go to the Generate tab and create a video
2. **Explore the library**: View all your generated videos in the Library tab
3. **Try remixing**: Select a completed video and remix it with changes

## File Structure Check

Make sure you have these key files:
```
sora2-api/
├── .env.local              # Your API key (create this)
├── .env.local.example      # Template (already exists)
├── app/
│   ├── api/videos/         # API routes
│   └── page.tsx            # Main UI
├── components/
│   ├── video-generator.tsx
│   ├── video-library.tsx
│   └── video-remix.tsx
└── package.json
```

## Support

If you encounter issues:
1. Check the main [README.md](./README.md) for detailed documentation
2. Review [OpenAI's Sora documentation](https://platform.openai.com/docs/api-reference/videos)
3. Verify your API key has the necessary permissions

