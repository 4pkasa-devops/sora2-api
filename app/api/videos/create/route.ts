import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    const prompt = formData.get('prompt') as string;
    const model = formData.get('model') as string || 'sora-2';
    const size = formData.get('size') as string || '1280x720';
    const seconds = formData.get('seconds') as string || '8';
    const inputReference = formData.get('input_reference') as File | null;

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    const videoParams: any = {
      model,
      prompt,
      size,
      seconds,
    };

    // If there's an input reference image, include it
    if (inputReference) {
      videoParams.input_reference = inputReference;
    }

    const video = await openai.videos.create(videoParams);

    return NextResponse.json(video);
  } catch (error: any) {
    console.error('Error creating video:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create video' },
      { status: 500 }
    );
  }
}

