'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { VideoGenerator } from '@/components/video-generator';
import { VideoLibrary } from '@/components/video-library';
import { VideoRemix } from '@/components/video-remix';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info, Sparkles, Library, Wand2 } from 'lucide-react';
import { Video } from '@/lib/types';

export default function Home() {
  const [selectedTab, setSelectedTab] = useState('generate');
  const [selectedVideoId, setSelectedVideoId] = useState('');

  const handleSelectVideo = (video: Video) => {
    if (video.status === 'completed') {
      setSelectedVideoId(video.id);
      setSelectedTab('remix');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8 text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-3 rounded-2xl">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Sora 2 Studio
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Create, remix, and manage stunning AI-generated videos with OpenAI's Sora 2
          </p>
        </div>

        {/* API Key Warning */}
        {!process.env.NEXT_PUBLIC_HAS_API_KEY && (
          <Alert className="mb-6 border-amber-500/50 bg-amber-950/20">
            <Info className="h-4 w-4 text-amber-400" />
            <AlertDescription className="text-amber-200">
              <strong>Setup Required:</strong> Add your OpenAI API key to the <code className="bg-amber-900 px-1.5 py-0.5 rounded text-xs">.env.local</code> file. 
              See the README for instructions.
            </AlertDescription>
          </Alert>
        )}

        {/* Main Content */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-8">
            <TabsTrigger value="generate" className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              <span className="hidden sm:inline">Generate</span>
            </TabsTrigger>
            <TabsTrigger value="library" className="flex items-center gap-2">
              <Library className="h-4 w-4" />
              <span className="hidden sm:inline">Library</span>
            </TabsTrigger>
            <TabsTrigger value="remix" className="flex items-center gap-2">
              <Wand2 className="h-4 w-4" />
              <span className="hidden sm:inline">Remix</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="generate" className="mt-0">
            <VideoGenerator />
          </TabsContent>

          <TabsContent value="library" className="mt-0">
            <VideoLibrary onSelectVideo={handleSelectVideo} />
          </TabsContent>

          <TabsContent value="remix" className="mt-0">
            <VideoRemix />
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-muted-foreground">
          <p>
            Powered by{' '}
            <a
              href="https://openai.com/sora"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-400 hover:underline font-medium"
            >
              OpenAI Sora 2
            </a>
          </p>
          <p className="mt-2">
            Built with Next.js 15, Tailwind CSS, and shadcn/ui
          </p>
        </div>
      </div>
    </div>
  );
}
