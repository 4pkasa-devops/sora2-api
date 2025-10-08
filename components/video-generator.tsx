'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Loader2, Sparkles, Download, Image as ImageIcon } from 'lucide-react';
import { Video, VideoModel, VideoSize, VideoSeconds } from '@/lib/types';

export function VideoGenerator() {
  const [prompt, setPrompt] = useState('');
  const [model, setModel] = useState<VideoModel>('sora-2');
  const [size, setSize] = useState<VideoSize>('1280x720');
  const [seconds, setSeconds] = useState<VideoSeconds>('8');
  const [inputReference, setInputReference] = useState<File | null>(null);
  const [video, setVideo] = useState<Video | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [polling, setPolling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Validate file type
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        setError('Please upload a JPEG, PNG, or WebP image');
        return;
      }
      setInputReference(file);
    }
  };

  const pollVideoStatus = async (videoId: string) => {
    setPolling(true);
    let attempts = 0;
    const maxAttempts = 120; // 10 minutes max (5s intervals)

    const poll = async () => {
      try {
        const response = await fetch(`/api/videos/retrieve?id=${videoId}`);
        const data: Video = await response.json();
        
        setVideo(data);

        if (data.status === 'completed') {
          // Download the video content
          const videoResponse = await fetch(`/api/videos/download?id=${videoId}&variant=video`);
          const videoBlob = await videoResponse.blob();
          const url = URL.createObjectURL(videoBlob);
          setVideoUrl(url);

          // Download thumbnail
          try {
            const thumbnailResponse = await fetch(`/api/videos/download?id=${videoId}&variant=thumbnail`);
            const thumbnailBlob = await thumbnailResponse.blob();
            const thumbUrl = URL.createObjectURL(thumbnailBlob);
            setThumbnailUrl(thumbUrl);
          } catch (e) {
            console.log('Thumbnail not available');
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
          setTimeout(poll, 5000); // Poll every 5 seconds
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

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt');
      return;
    }

    setLoading(true);
    setError(null);
    setVideo(null);
    setVideoUrl(null);
    setThumbnailUrl(null);

    try {
      const formData = new FormData();
      formData.append('prompt', prompt);
      formData.append('model', model);
      formData.append('size', size);
      formData.append('seconds', seconds);
      
      if (inputReference) {
        formData.append('input_reference', inputReference);
      }

      const response = await fetch('/api/videos/create', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create video');
      }

      const data: Video = await response.json();
      setVideo(data);

      // Start polling for status
      pollVideoStatus(data.id);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      setLoading(false);
    }
  };

  const handleDownload = async (variant: 'video' | 'thumbnail' | 'spritesheet') => {
    if (!video) return;

    try {
      const response = await fetch(`/api/videos/download?id=${video.id}&variant=${variant}`);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `${video.id}_${variant}.${variant === 'video' ? 'mp4' : variant === 'thumbnail' ? 'webp' : 'jpg'}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err: any) {
      setError(`Failed to download ${variant}`);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-6 w-6" />
          Create Video
        </CardTitle>
        <CardDescription>
          Generate stunning videos from text prompts using Sora 2
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="prompt">Prompt *</Label>
          <Textarea
            id="prompt"
            placeholder="Describe the video you want to create... e.g., 'Wide shot of a child flying a red kite in a grassy park, golden hour sunlight, camera slowly pans upward.'"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={4}
            disabled={loading}
          />
          <p className="text-xs text-muted-foreground">
            Be specific: describe shot type, subject, action, setting, and lighting for best results
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="model">Model</Label>
            <Select value={model} onValueChange={(value) => setModel(value as VideoModel)} disabled={loading}>
              <SelectTrigger id="model">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sora-2">
                  <div className="flex flex-col items-start">
                    <span className="font-medium">Sora 2</span>
                    <span className="text-xs text-muted-foreground">Fast & flexible</span>
                  </div>
                </SelectItem>
                <SelectItem value="sora-2-pro">
                  <div className="flex flex-col items-start">
                    <span className="font-medium">Sora 2 Pro</span>
                    <span className="text-xs text-muted-foreground">Higher quality</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="size">Resolution</Label>
            <Select value={size} onValueChange={(value) => setSize(value as VideoSize)} disabled={loading}>
              <SelectTrigger id="size">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="480x480">480x480 (Square)</SelectItem>
                <SelectItem value="1280x720">1280x720 (HD)</SelectItem>
                <SelectItem value="1920x1080">1920x1080 (Full HD)</SelectItem>
                <SelectItem value="720x1280">720x1280 (Vertical)</SelectItem>
                <SelectItem value="1080x1920">1080x1920 (Full Vertical)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="seconds">Duration</Label>
            <Select value={seconds} onValueChange={(value) => setSeconds(value as VideoSeconds)} disabled={loading}>
              <SelectTrigger id="seconds">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="4">4 seconds</SelectItem>
                <SelectItem value="8">8 seconds</SelectItem>
                <SelectItem value="12">12 seconds</SelectItem>
                <SelectItem value="16">16 seconds</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="input-reference">Input Reference Image (Optional)</Label>
          <div className="flex items-center gap-2">
            <Input
              id="input-reference"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileChange}
              disabled={loading}
            />
            {inputReference && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <ImageIcon className="h-3 w-3" />
                {inputReference.name}
              </Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            Upload an image to use as the first frame. Must match the target resolution.
          </p>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {video && (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Status:</span>
                  <Badge variant={
                    video.status === 'completed' ? 'default' :
                    video.status === 'failed' ? 'destructive' :
                    'secondary'
                  }>
                    {video.status}
                  </Badge>
                </div>
                {video.progress !== undefined && video.status === 'in_progress' && (
                  <div className="space-y-1">
                    <div className="text-xs text-muted-foreground">
                      Progress: {video.progress}%
                    </div>
                    <Progress value={video.progress} className="w-[200px]" />
                  </div>
                )}
              </div>
              <div className="text-xs text-muted-foreground">
                ID: {video.id.slice(0, 20)}...
              </div>
            </div>

            {videoUrl && (
              <div className="space-y-4">
                <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                  <video
                    src={videoUrl}
                    controls
                    className="w-full h-full"
                    preload="metadata"
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>

                <div className="flex gap-2">
                  <Button onClick={() => handleDownload('video')} variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Download Video
                  </Button>
                  {thumbnailUrl && (
                    <Button onClick={() => handleDownload('thumbnail')} variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Download Thumbnail
                    </Button>
                  )}
                  <Button onClick={() => handleDownload('spritesheet')} variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Download Spritesheet
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        <Button
          onClick={handleGenerate}
          disabled={loading}
          className="w-full"
          size="lg"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {polling ? 'Generating video...' : 'Starting generation...'}
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Generate Video
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}

