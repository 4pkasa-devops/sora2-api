'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Loader2, 
  Trash2, 
  Download, 
  RefreshCw, 
  Video as VideoIcon,
  Eye
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Video, VideoListResponse } from '@/lib/types';

export function VideoLibrary({ onSelectVideo }: { onSelectVideo?: (video: Video) => void }) {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [showDialog, setShowDialog] = useState(false);

  const fetchVideos = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/videos/list?limit=50');
      if (!response.ok) {
        throw new Error('Failed to fetch videos');
      }
      const data: VideoListResponse = await response.json();
      setVideos(data.data);
    } catch (err: any) {
      setError(err.message || 'Failed to load videos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const handleDelete = async (videoId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!confirm('Are you sure you want to delete this video?')) {
      return;
    }

    try {
      const response = await fetch(`/api/videos/delete?id=${videoId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete video');
      }

      setVideos(videos.filter(v => v.id !== videoId));
    } catch (err: any) {
      setError(err.message || 'Failed to delete video');
    }
  };

  const handleView = async (video: Video, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (video.status !== 'completed') {
      setError('Video is not ready yet');
      return;
    }

    setSelectedVideo(video);
    setShowDialog(true);

    try {
      const response = await fetch(`/api/videos/download?id=${video.id}&variant=video`);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setVideoUrl(url);
    } catch (err: any) {
      setError('Failed to load video');
    }
  };

  const handleDownload = async (videoId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    try {
      const response = await fetch(`/api/videos/download?id=${videoId}&variant=video`);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `${videoId}.mp4`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err: any) {
      setError('Failed to download video');
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <VideoIcon className="h-6 w-6" />
                Video Library
              </CardTitle>
              <CardDescription>
                Manage and view your generated videos
              </CardDescription>
            </div>
            <Button onClick={fetchVideos} variant="outline" size="sm">
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : videos.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <VideoIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No videos found. Create your first video!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {videos.map((video) => (
                <div
                  key={video.id}
                  className="border rounded-lg p-4 hover:bg-accent/50 transition-colors cursor-pointer"
                  onClick={() => onSelectVideo?.(video)}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <Badge variant={
                        video.status === 'completed' ? 'default' :
                        video.status === 'failed' ? 'destructive' :
                        'secondary'
                      }>
                        {video.status}
                      </Badge>
                      <div className="flex gap-1">
                        {video.status === 'completed' && (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => handleView(video, e)}
                              className="h-8 w-8 p-0"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => handleDownload(video.id, e)}
                              className="h-8 w-8 p-0"
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => handleDelete(video.id, e)}
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="text-sm font-medium">
                        {video.id.slice(0, 24)}...
                      </div>
                      {video.prompt && (
                        <div className="text-xs text-muted-foreground line-clamp-2">
                          {video.prompt}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{video.model}</span>
                      <span>{video.size}</span>
                      <span>{video.seconds}s</span>
                    </div>

                    <div className="text-xs text-muted-foreground">
                      {formatDate(video.created_at)}
                    </div>

                    {video.progress !== undefined && video.status === 'in_progress' && (
                      <div className="text-xs text-muted-foreground">
                        Progress: {video.progress}%
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Video Preview</DialogTitle>
            <DialogDescription>
              {selectedVideo?.id}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {videoUrl ? (
              <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                <video
                  src={videoUrl}
                  controls
                  autoPlay
                  className="w-full h-full"
                >
                  Your browser does not support the video tag.
                </video>
              </div>
            ) : (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            )}
            {selectedVideo && (
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Model:</span> {selectedVideo.model}
                </div>
                <div>
                  <span className="text-muted-foreground">Resolution:</span> {selectedVideo.size}
                </div>
                <div>
                  <span className="text-muted-foreground">Duration:</span> {selectedVideo.seconds}s
                </div>
                <div>
                  <span className="text-muted-foreground">Created:</span> {formatDate(selectedVideo.created_at)}
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

