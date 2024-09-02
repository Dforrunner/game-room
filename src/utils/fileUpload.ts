'use client';

import { apiRoute } from '@/routes';
import { FileUploadResponse } from '@/types';
import { PartyType } from '@/types/gameServers';

interface FileUploadProps {
  file: File;
  playerId: string;
  roomId: string;
  party: PartyType;
  isAvater?: boolean;
}
export async function imageUpload({
  file,
  playerId,
  roomId,
  party,
  isAvater = false,
}: FileUploadProps): Promise<FileUploadResponse> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('playerId', playerId);
  formData.append('roomId', roomId);
  formData.append('party', party);
  formData.append('isAvater', isAvater ? 'true' : 'false');

  const res = await fetch(apiRoute.image.upload(), {
    method: 'POST',
    body: formData,
  });

  const data = (await res.json()) as FileUploadResponse;

  if (!res.ok) {
    throw data;
  }

  return data;
}
