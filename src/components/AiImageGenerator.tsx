'use client';

import { GenerateImageResponse } from '@/types/API';
import { LoadingButton } from '@mui/lab';
import { TextField } from '@mui/material';
import { Images } from 'lucide-react';
import React, { useContext, useMemo, useState } from 'react';
import ImageLoader from './ImageLoader';
import { MemeAlchemyContext } from '@/providers/MemeAlchemyProvider';
import { PartyType } from '@/types/gameServers';
import { cn } from '@/utils/cn';
import CaptionCard from './CaptionCard';

const MAX_PROMPT_LENGTH = 4000;
interface Props {
  onImageGenerated: (imageUrl: string) => void;
}
export default function AiImageGenerator({ onImageGenerated }: Props) {
  const { playerId, roomId } = useContext(MemeAlchemyContext);
  const [prompt, setPrompt] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const textAreaRows = useMemo(
    () => Math.floor(window.innerHeight / 34),
    [window.innerHeight]
  );

  const handleGenerateImage = async () => {
    if (prompt.trim().length < 10) {
      setError('Prompt must be at least 10 characters.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/image/generate', {
        method: 'POST',
        body: JSON.stringify({
          prompt,
          playerId,
          roomId,
          partyType: PartyType.MemeAlchemy,
        }),
      });

      if (!res.ok) {
        throw new Error();
      }

      const data = (await res.json()) as GenerateImageResponse;
      setImageUrl(data.imageUrl);
      onImageGenerated(data.imageUrl);
    } catch {
      setError(
        "Failed to generate the image. Ensure you promt doesn't contain any explicit content."
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePromptChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (error) setError(null);
    let val = e.target.value;
    if (val.length > MAX_PROMPT_LENGTH) {
      setError(`Prompt cannot exceed ${MAX_PROMPT_LENGTH} characters.`);
      return;
    }

    if (prompt.endsWith(' ') && val.endsWith(' ')) {
      return;
    }

    setPrompt(val);
  };

  return (
    <div className='container mx-auto flex flex-col items-center gap-2 h-3/4 text-white'>
      {!loading && !imageUrl && (
        <>
          <div className=' bg-white/20 size-full rounded'>
            <TextField
              slotProps={{
                input: {
                  style: {
                    color: 'white',
                  },
                },
              }}
              placeholder={`Enter your prompt. Be as descriptive as possible. (Max ${MAX_PROMPT_LENGTH} characters)`}
              fullWidth
              multiline
              rows={textAreaRows}
              value={prompt}
              onChange={handlePromptChange}
              error={Boolean(error)}
            />
          </div>
          <div className='text-xs text-gray-500 flex w-full justify-between lg:px-2'>
            <div>{error && <div className='text-red-700 '>{error}</div>}</div>
            <div
              className={cn('text-xs text-gray-500', {
                'text-red-700': prompt.length > MAX_PROMPT_LENGTH,
              })}
            >
              {prompt.length}/{MAX_PROMPT_LENGTH}
            </div>
          </div>
          <LoadingButton
            fullWidth
            onClick={handleGenerateImage}
            loading={loading}
            loadingPosition='start'
            startIcon={<Images />}
            variant='contained'
          >
            {loading ? 'Generating...' : 'Generate Image'}
          </LoadingButton>
        </>
      )}

      {(loading || imageUrl) && (
        <>
          <CaptionCard>
            <ImageLoader src={imageUrl} alt={''} width={512} height={512} />
          </CaptionCard>
          {imageUrl && (
            <div className='bg-green-600 text-white rounded p-2'>
              Your meme has been submitted! Sit tight while others submit
              theirs.
            </div>
          )}
        </>
      )}
    </div>
  );
}
