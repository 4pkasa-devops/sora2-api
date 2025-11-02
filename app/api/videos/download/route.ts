import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const videoId = searchParams.get('id');
    const variant = searchParams.get('variant') as 'video' | 'thumbnail' | 'spritesheet' || 'video';

    if (!videoId) {
      return NextResponse.json(
        { error: 'Video ID is required' },
        { status: 400 }
      );
    }

    // Get the video content using the correct method
    const response = await openai.videos.downloadContent(videoId, { variant });
    
    // Convert to array buffer
    const arrayBuffer = await response.arrayBuffer();
    
    // Determine content type based on variant
    let contentType = 'video/mp4';
    let extension = 'mp4';
    
    if (variant === 'thumbnail') {
      contentType = 'image/webp';
      extension = 'webp';
    } else if (variant === 'spritesheet') {
      contentType = 'image/jpeg';
      extension = 'jpg';
    }

    // Return the content with appropriate headers
    return new NextResponse(arrayBuffer, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${videoId}.${extension}"`,
      },
    });
  } catch (error: any) {
    console.error('Error downloading video:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to download video' },
      { status: 500 }
    );
  }
}

