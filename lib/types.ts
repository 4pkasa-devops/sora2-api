export interface Video {
  id: string;
  object: string;
  created_at: number;
  status: 'queued' | 'in_progress' | 'completed' | 'failed';
  model: string;
  progress?: number;
  seconds: string;
  size: string;
  prompt?: string;
  error?: {
    code: string;
    message: string;
  };
}

export interface VideoListResponse {
  object: string;
  data: Video[];
  has_more: boolean;
  first_id?: string;
  last_id?: string;
}

export type VideoModel = 'sora-2' | 'sora-2-pro';
export type VideoSize = '480x480' | '1280x720' | '1920x1080' | '720x1280' | '1080x1920';
export type VideoSeconds = '4' | '8' | '12' | '16';

