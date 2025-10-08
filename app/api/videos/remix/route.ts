import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { videoId, prompt } = body;

    if (!videoId || !prompt) {
      return NextResponse.json(
        { error: 'Video ID and prompt are required' },
        { status: 400 }
      );
    }

    // Create a remix of the video
    const remixedVideo = await openai.videos.create({
      remix_video_id: videoId,
      prompt,
    });

    return NextResponse.json(remixedVideo);
  } catch (error: any) {
    console.error('Error remixing video:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to remix video' },
      { status: 500 }
    );
  }
}

