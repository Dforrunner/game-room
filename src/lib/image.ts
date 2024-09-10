import { PartyType } from '@/types/gameServers';
import OpenAIClient from './openAiClient';
import { access, mkdir, writeFile } from 'fs-extra';
import { join } from 'path';
import sharp from 'sharp';
import { internalServerError } from '@/utils/apiErrorHandler';
import { randomId } from '@/utils/random';

const openai = OpenAIClient.getInstance();

interface generateImageFromDalle {
  prompt: string;
  playerId: string;
  partyType: PartyType;
  roomId: string;
}
export async function generateImageFromDalle({
  prompt,
  playerId,
  partyType,
  roomId,
}: generateImageFromDalle) {
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

  // Fetch the image from the URL using fetch
  const imageResponse = await fetch(imageUrl);

  // Check if the image was successfully retrieved
  if (!imageResponse.ok) {
    return internalServerError(
      `Failed to fetch image: ${imageResponse.statusText}`
    );
  }

  // Save the image using fs-extra
  const bytes = await imageResponse.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const publicImageUrl = await uploadPlayerImage({
    playerId,
    buffer,
    imageSize: 512,
    imageType: 'meme',
    partyType,
    roomId,
    trim: false,
  });

  return publicImageUrl;
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
  const fileName = `${playerId + '_' + randomId()}.webp`;
  let optimizedImage = sharp(buffer);

  if (trim) {
    optimizedImage = optimizedImage.trim();
  }

  const imageBuffer = await optimizedImage
    .resize(imageSize, imageSize, { fit: 'inside', withoutEnlargement: true })
    .webp()
    .toBuffer();

  const relativeDir = join('uploads', partyType, roomId, imageType);
  const uploadDir = join(process.cwd(), 'public', relativeDir);
  const publicImageUrl = join('/', relativeDir, fileName);

  // Check if the upload directory exists
  try {
    await access(uploadDir);
  } catch (error) {
    // If the directory doesn't exist, create it
    await mkdir(uploadDir, { recursive: true });
  }

  await writeFile(join(uploadDir, fileName), imageBuffer);

  return publicImageUrl.replace(/\\/g, '/');
}
