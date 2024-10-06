import OpenAIClient from './openAiClient';
import sharp from 'sharp';
import { internalServerError } from '@/utils/apiErrorHandler';
import { del, list, put } from '@vercel/blob';
import { v4 as uuidv4 } from 'uuid';
import { PartyType } from '@/types/gameServers';

const openai = OpenAIClient.getInstance();

export async function generateImageFromDalle(prompt: string) {
  // Call the OpenAI API to generate the image
  // const response = await openai.images.generate({
  //   model: 'dall-e-3',
  //   prompt: prompt,
  //   n: 1,
  //   size: '1024x1024',
  // });

  const response = await openai.images.generate({
    model: 'dall-e-2',
    prompt: prompt,
    n: 1,
    size: '512x512',
  });

  // Extract image URL from the API response
  // Extract the image URL from the response
  const imageUrl = response.data[0].url;

  if (!imageUrl) {
    return internalServerError('No image URL returned from OpenAI');
  }
  return imageUrl;
}

interface UploadPlayerImageProps {
  buffer: Buffer;
  playerId: string;
  imageSize: number;
  imageType: 'avatar' | 'meme';
  partyType: PartyType;
  roomId: string;
  trim?: boolean;
}
export async function uploadPlayerImage({
  playerId,
  buffer,
  imageSize,
  imageType,
  partyType,
  roomId,
  trim = true,
}: UploadPlayerImageProps) {
  const fileName = `${uuidv4()}.webp`;
  let optimizedImage = sharp(buffer);

  if (trim) {
    optimizedImage = optimizedImage.trim();
  }

  const imageBuffer = await optimizedImage
    .resize(imageSize, imageSize, { fit: 'inside', withoutEnlargement: true })
    .webp()
    .toBuffer();

  const imgPath = [partyType, roomId, imageType, playerId, fileName].join('/');
  const { url } = await put(imgPath, imageBuffer, {
    access: 'public',
    contentType: 'image/webp',
  });
  return url;
}

export async function deleteImage(deletePath: string) {
  try {
    await del(deletePath);
    return true;
  } catch (error) {
    console.error('Failed to delete file from Vercel Blob', error);
    throw new Error('Failed to delete images');
  }
}

export async function deleteFolder(folderName: string) {
  try {
    // List all files in the folder
    const { blobs } = await list({ prefix: folderName });

    // Delete each file
    for (const blob of blobs) {
      await del(blob.url);
    }

    return true;
  } catch (error) {
    console.error('Error deleting folder from Vercel Blob:', error);
    throw new Error('Failed to delete folder');
  }
}
