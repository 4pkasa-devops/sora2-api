'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Loader2, Wand2, Download } from 'lucide-react';
import { Video } from '@/lib/types';

export function VideoRemix() {
  const [videoId, setVideoId] = useState('');
  const [remixPrompt, setRemixPrompt] = useState('');
  const [originalVideo, setOriginalVideo] = useState<Video | null>(null);
  const [remixedVideo, setRemixedVideo] = useState<Video | null>(null);
  const [originalVideoUrl, setOriginalVideoUrl] = useState<string | null>(null);
  const [remixedVideoUrl, setRemixedVideoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [polling, setPolling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pollVideoStatus = async (videoId: string, isOriginal = false) => {
    setPolling(true);
    let attempts = 0;
    const maxAttempts = 120;

    const poll = async () => {
      try {
        const response = await fetch(`/api/videos/retrieve?id=${videoId}`);
        const data: Video = await response.json();
        
        if (isOriginal) {
          setOriginalVideo(data);
        } else {
          setRemixedVideo(data);
        }

        if (data.status === 'completed') {
          const videoResponse = await fetch(`/api/videos/download?id=${videoId}&variant=video`);
          const videoBlob = await videoResponse.blob();
          const url = URL.createObjectURL(videoBlob);
          
          if (isOriginal) {
            setOriginalVideoUrl(url);
          } else {
            setRemixedVideoUrl(url);
          }

          setPolling(false);
          setLoading(false);
          return;
        } else if (data.status === 'failed') {
          setError(data.error?.message || 'Video generation failed');
          setPolling(false);
          setLoading(false);
          return;
        }

        attempts++;
        if (attempts < maxAttempts) {
          setTimeout(poll, 5000);
        } else {
          setError('Video generation timed out');
          setPolling(false);
          setLoading(false);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to check video status');
        setPolling(false);
        setLoading(false);
      }
    };

    poll();
  };

  const handleLoadOriginal = async () => {
    if (!videoId.trim()) {
      setError('Please enter a video ID');
      return;
    }

    setLoading(true);
    setError(null);
    setOriginalVideo(null);
    setOriginalVideoUrl(null);

    try {
      const response = await fetch(`/api/videos/retrieve?id=${videoId}`);
      
      if (!response.ok) {
        throw new Error('Video not found');
      }

      const data: Video = await response.json();
      setOriginalVideo(data);

      if (data.status === 'completed') {
        const videoResponse = await fetch(`/api/videos/download?id=${videoId}&variant=video`);
        const videoBlob = await videoResponse.blob();
        const url = URL.createObjectURL(videoBlob);
        setOriginalVideoUrl(url);
        setLoading(false);
      } else if (data.status === 'in_progress' || data.status === 'queued') {
        pollVideoStatus(videoId, true);
      } else {
        setError('Video is not available for remix');
        setLoading(false);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load video');
      setLoading(false);
    }
  };

  const handleRemix = async () => {
    if (!videoId.trim() || !remixPrompt.trim()) {
      setError('Please provide both video ID and remix prompt');
      return;
    }

    if (!originalVideo || originalVideo.status !== 'completed') {
      setError('Please load a completed video first');
      return;
    }

    setLoading(true);
    setError(null);
    setRemixedVideo(null);
    setRemixedVideoUrl(null);

    try {
      const response = await fetch('/api/videos/remix', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          videoId: videoId,
          prompt: remixPrompt,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to remix video');
      }

      const data: Video = await response.json();
      setRemixedVideo(data);

      pollVideoStatus(data.id, false);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      setLoading(false);
    }
  };

  const handleDownload = async (id: string, isOriginal: boolean) => {
    try {
      const response = await fetch(`/api/videos/download?id=${id}&variant=video`);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `${id}_${isOriginal ? 'original' : 'remix'}.mp4`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err: any) {
      setError('Failed to download video');
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wand2 className="h-6 w-6" />
          Remix Video
        </CardTitle>
        <CardDescription>
          Make targeted adjustments to an existing video while preserving its structure
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="video-id">Original Video ID *</Label>
          <div className="flex gap-2">
            <Input
              id="video-id"
              placeholder="video_abc123..."
              value={videoId}
              onChange={(e) => setVideoId(e.target.value)}
              disabled={loading}
              className="flex-1"
            />
            <Button
              onClick={handleLoadOriginal}
              disabled={loading || !videoId.trim()}
              variant="outline"
            >
              {loading && !remixedVideo ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Load'
              )}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Enter the ID of a completed video from your library
          </p>
        </div>

        {originalVideo && (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Original Video:</span>
                  <Badge variant={originalVideo.status === 'completed' ? 'default' : 'secondary'}>
                    {originalVideo.status}
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground">
                  {originalVideo.model} • {originalVideo.size} • {originalVideo.seconds}s
                </div>
              </div>
            </div>

            {originalVideoUrl && (
              <div className="space-y-2">
                <Label>Original Video</Label>
                <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                  <video
                    src={originalVideoUrl}
                    controls
                    className="w-full h-full"
                    preload="metadata"
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>
                <Button 
                  onClick={() => handleDownload(videoId, true)} 
                  variant="outline" 
                  size="sm"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Original
                </Button>
              </div>
            )}
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="remix-prompt">Remix Prompt *</Label>
          <Textarea
            id="remix-prompt"
            placeholder="Describe the specific change you want to make... e.g., 'Change the color of the monster to orange' or 'Shift the color palette to teal, sand, and rust'"
            value={remixPrompt}
            onChange={(e) => setRemixPrompt(e.target.value)}
            rows={4}
            disabled={loading || !originalVideo || originalVideo.status !== 'completed'}
          />
          <p className="text-xs text-muted-foreground">
            Make one clear adjustment at a time for best results
          </p>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {remixedVideo && (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Remixed Video:</span>
                  <Badge variant={
                    remixedVideo.status === 'completed' ? 'default' :
                    remixedVideo.status === 'failed' ? 'destructive' :
                    'secondary'
                  }>
                    {remixedVideo.status}
                  </Badge>
                </div>
                {remixedVideo.progress !== undefined && remixedVideo.status === 'in_progress' && (
                  <div className="space-y-1">
                    <div className="text-xs text-muted-foreground">
                      Progress: {remixedVideo.progress}%
                    </div>
                    <Progress value={remixedVideo.progress} className="w-[200px]" />
                  </div>
                )}
              </div>
              <div className="text-xs text-muted-foreground">
                ID: {remixedVideo.id.slice(0, 20)}...
              </div>
            </div>

            {remixedVideoUrl && (
              <div className="space-y-2">
                <Label>Remixed Video</Label>
                <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                  <video
                    src={remixedVideoUrl}
                    controls
                    className="w-full h-full"
                    preload="metadata"
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>
                <Button 
                  onClick={() => handleDownload(remixedVideo.id, false)} 
                  variant="outline" 
                  size="sm"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Remix
                </Button>
              </div>
            )}
          </div>
        )}

        <Button
          onClick={handleRemix}
          disabled={loading || !originalVideo || originalVideo.status !== 'completed' || !remixPrompt.trim()}
          className="w-full"
          size="lg"
        >
          {loading && remixedVideo ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {polling ? 'Remixing video...' : 'Starting remix...'}
            </>
          ) : (
            <>
              <Wand2 className="mr-2 h-4 w-4" />
              Remix Video
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}

