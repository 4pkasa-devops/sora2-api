# Sora 2 Studio

A comprehensive video generation UI for OpenAI's Sora 2 API, built with Next.js 15, TypeScript, Tailwind CSS, and shadcn/ui.

![Sora 2 Studio](https://img.shields.io/badge/Sora-2-purple?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)

## Features

### 🎬 Video Generation
- **Text-to-Video**: Create videos from natural language prompts
- **Model Selection**: Choose between Sora 2 (fast) or Sora 2 Pro (high quality)
- **Flexible Settings**: 
  - Multiple resolution options (480x480 to 1920x1080)
  - Duration control (4s to 16s)
  - Input reference images for guided generation
- **Real-time Progress**: Live progress tracking with status updates
- **Multi-format Downloads**: Download video, thumbnail, and spritesheet
- **Dark Mode UI**: Beautiful dark theme by default

### 📚 Video Library
- **Comprehensive Management**: View all your generated videos
- **Status Tracking**: Monitor queued, in-progress, and completed videos
- **Quick Actions**: Preview, download, or delete videos
- **Metadata Display**: View model, resolution, duration, and creation date
- **Auto-refresh**: Keep your library up-to-date

### 🎨 Video Remix
- **Targeted Editing**: Make specific changes while preserving video structure
- **Side-by-side Comparison**: View original and remixed videos together
- **Iterative Refinement**: Build on successful generations
- **Preserve Quality**: Maintain continuity and composition

## Prerequisites

- Node.js 18+ 
- An OpenAI API key with Sora 2 access
- npm or yarn package manager

## Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd sora2-api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Copy the example environment file:
   ```bash
   cp .env.local.example .env.local
   ```
   
   Edit `.env.local` and add your OpenAI API key:
   ```env
   OPENAI_API_KEY=sk-proj-...your_key_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## Usage

### Creating a Video

1. Navigate to the **Generate** tab
2. Enter a detailed prompt describing your desired video:
   - Include shot type (wide shot, close-up, etc.)
   - Describe the subject and action
   - Specify the setting and lighting
   - Example: *"Wide shot of a child flying a red kite in a grassy park, golden hour sunlight, camera slowly pans upward"*
3. Select your preferred:
   - **Model**: Sora 2 (faster) or Sora 2 Pro (higher quality)
   - **Resolution**: From 480x480 to 1920x1080
   - **Duration**: 4 to 16 seconds
4. (Optional) Upload a reference image to guide the first frame
5. Click **Generate Video**
6. Monitor the progress in real-time
7. Once complete, preview and download your video

### Managing Your Library

1. Navigate to the **Library** tab
2. View all your generated videos with status badges
3. Click on any video to:
   - **Preview**: Watch the video in a modal
   - **Download**: Save the MP4 file locally
   - **Delete**: Remove from OpenAI's storage
4. Select a completed video to load it in the Remix tab

### Remixing a Video

1. Navigate to the **Remix** tab
2. Enter the Video ID of a completed video (or select from Library)
3. Click **Load** to fetch the original video
4. Enter a remix prompt describing the specific change:
   - Keep it focused on one clear adjustment
   - Example: *"Change the color of the monster to orange"*
   - Example: *"Shift the color palette to teal, sand, and rust"*
5. Click **Remix Video**
6. Compare the original and remixed videos side-by-side
7. Download your remixed video when ready

## API Routes

The application includes the following API endpoints:

- `POST /api/videos/create` - Start a new video generation
- `GET /api/videos/retrieve` - Get status of a video
- `GET /api/videos/list` - List all videos with pagination
- `DELETE /api/videos/delete` - Delete a video
- `GET /api/videos/download` - Download video content
- `POST /api/videos/remix` - Create a remix of an existing video

## Technology Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **UI Components**: shadcn/ui
- **API Client**: OpenAI SDK
- **Icons**: Lucide React

## Project Structure

```
sora2-api/
├── app/
│   ├── api/
│   │   └── videos/        # API route handlers
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main application page
├── components/
│   ├── ui/                # shadcn/ui components
│   ├── video-generator.tsx
│   ├── video-library.tsx
│   └── video-remix.tsx
├── lib/
│   ├── types.ts           # TypeScript interfaces
│   └── utils.ts           # Utility functions
├── .env.local.example     # Environment variables template
└── README.md
```

## Sora 2 Models

### Sora 2
- **Best for**: Rapid iteration, concepting, prototypes
- **Speed**: Fast generation times
- **Quality**: Good quality, suitable for social media
- **Cost**: More economical

### Sora 2 Pro
- **Best for**: Production-quality content, marketing assets
- **Speed**: Longer render times
- **Quality**: Higher fidelity, cinematic output
- **Cost**: Premium pricing

## Tips for Best Results

1. **Be Specific**: Include details about camera angle, lighting, setting, and motion
2. **One Change at a Time**: When remixing, make focused adjustments for better results
3. **Match Resolutions**: Input reference images should match your target video resolution
4. **Respect Guardrails**: 
   - Content must be suitable for under-18 audiences
   - No copyrighted characters or music
   - No real people or faces in input images

## Troubleshooting

### API Key Issues
- Ensure your API key is correctly set in `.env.local`
- Verify you have access to the Sora 2 API (may require waitlist approval)
- Check that your API key has sufficient credits

### Video Generation Fails
- Review content policy restrictions
- Simplify your prompt if it's too complex
- Try a different model or resolution
- Check the error message in the UI

### Slow Generation
- Use Sora 2 instead of Sora 2 Pro for faster results
- Reduce video duration
- Lower the resolution
- Check OpenAI's API status for any service issues

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `OPENAI_API_KEY` | Yes | Your OpenAI API key |
| `NEXT_PUBLIC_HAS_API_KEY` | No | Set to "true" to hide setup warning |

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.

## Acknowledgments

- Built with [OpenAI Sora 2 API](https://platform.openai.com/docs/api-reference/videos)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Powered by [Next.js](https://nextjs.org/)

## Support

For issues and questions:
- Check the [OpenAI API Documentation](https://platform.openai.com/docs/api-reference/videos)
- Review the troubleshooting section above
- Open an issue on GitHub

---

**Note**: This project requires access to OpenAI's Sora 2 API, which may be in limited availability or require special access as of 2025.
