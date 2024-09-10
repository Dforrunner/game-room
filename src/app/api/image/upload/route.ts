import { uploadPlayerImage } from '@/lib/image';
import { PartyType } from '@/types/gameServers';
import { withErrorHandler } from '@/utils/apiErrorHandler';
import { parsedAndValidateData } from '@/utils/zodParser';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

async function uploadImageHandler(req: NextRequest) {
  const formData = await req.formData();

  const schema = z.object({
    file: z.instanceof(File),
    playerId: z.string(),
    roomId: z.string(),
    partyType: z.enum(Object.values(PartyType) as [PartyType, ...PartyType[]]),
    isAvatar: z.string().transform((val) => val.toLocaleLowerCase() === 'true'),
  });

  const rawData = {
    file: formData.get('file'),
    playerId: formData.get('playerId'),
    roomId: formData.get('roomId'),
    partyType: formData.get('partyType'),
    isAvatar: formData.get('isAvatar'),
  };

  const { file, playerId, isAvatar, partyType, roomId } = parsedAndValidateData<
    typeof schema
  >(rawData, schema);

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const imageUrl = await uploadPlayerImage({
    buffer,
    playerId,
    partyType,
    roomId,
    imageType: 'avatar',
    imageSize: 100,
  });

  return NextResponse.json({
    message: 'File uploaded successfully',
    imageUrl,
  });
}

export const POST = withErrorHandler(uploadImageHandler);
