import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 20;
    const after = searchParams.get('after') || undefined;
    const order = searchParams.get('order') as 'asc' | 'desc' || 'desc';

    const videos = await openai.videos.list({
      limit,
      after,
      order,
    });

    return NextResponse.json(videos);
  } catch (error: any) {
    console.error('Error listing videos:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to list videos' },
      { status: 500 }
    );
  }
}

