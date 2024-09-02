'use client';
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { PartyType } from '@/types/gameServers';
import { useRef, useState } from 'react';
import { LoadingButton } from '@mui/lab';
import { imageUpload } from '@/utils/fileUpload';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

interface Props {
  onUpload: (imgUrl: string) => void;
  playerId: string;
  roomId: string;
  party: PartyType;
}
export default function ImageUpload({
  onUpload,
  playerId,
  roomId,
  party,
}: Props) {
  const [isUploading, setIsUploading] = useState(false);
  const hasUploadedOnce = useRef(false);
  const [error, setError] = useState<string>('');

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || isUploading) return;
    setError('');
    setIsUploading(true);
    try {
      const res = await imageUpload({ file, playerId, roomId, party });
      hasUploadedOnce.current = true;
      onUpload(res.imageUrl);
    } catch (error) {
      setError((error as any).message);
    }

    setIsUploading(false);
  };

  return (
    <div>
      <LoadingButton
        loading={isUploading}
        disabled={isUploading || hasUploadedOnce.current}
        loadingPosition="start"
        component="label"
        role={undefined}
        variant="contained"
        tabIndex={-1}
        startIcon={<CloudUploadIcon />}
      >
        {isUploading ? 'Uploading...' : 'Upload Meme'}
        <VisuallyHiddenInput
          type="file"
          accept="image/*"
          onChange={handleUpload}
          multiple={false}
        />
      </LoadingButton>
      {error && <div className="text-xs text-red-700">{error}</div>}
    </div>
  );
}
