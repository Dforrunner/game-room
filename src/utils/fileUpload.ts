'use client';

import { apiRoute } from '@/routes';
import { FileUploadResponse } from '@/types';
import { PartyType } from '@/types/gameServers';

interface FileUploadProps {
  file: File;
  playerId: string;
  roomId: string;
  partyType: PartyType;
  isAvatar?: boolean;
}
export async function imageUpload({
  file,
  playerId,
  roomId,
  partyType,
  isAvatar = false,
}: FileUploadProps): Promise<FileUploadResponse> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('playerId', playerId);
  formData.append('roomId', roomId);
  formData.append('partyType', partyType);
  formData.append('isAvatar', isAvatar ? 'true' : 'false');

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
