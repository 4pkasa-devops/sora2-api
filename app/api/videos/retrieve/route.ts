import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const videoId = searchParams.get('id');

    if (!videoId) {
      return NextResponse.json(
        { error: 'Video ID is required' },
        { status: 400 }
      );
    }

    const video = await openai.videos.retrieve(videoId);

    return NextResponse.json(video);
  } catch (error: any) {
    console.error('Error retrieving video:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to retrieve video' },
      { status: 500 }
    );
  }
}

