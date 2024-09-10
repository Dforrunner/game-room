'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Box, Typography } from '@mui/material';
import { Grid } from 'react-loader-spinner';
interface ImageLoaderProps {
  src?: string;
  alt: string;
  width: number;
  height: number;
}
export default function ImageLoader({
  src,
  alt,
  width,
  height,
}: ImageLoaderProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const handleImageError = () => {
    setIsLoading(false);
    setError('Failed to load image');
  };

  return (
    <Box
      position='relative'
      width={width}
      height={height}
      display='flex'
      justifyContent='center'
      alignItems='center'
      bgcolor='grey.100'
      overflow='hidden'
    >
      {isLoading && (
        <Box
          position='absolute'
          display='flex'
          flexDirection='column'
          alignItems='center'
        >
          <Grid visible={true} height='100' width='100' color='#39a7f1' />
          <Typography variant='body2' color='text.secondary' mt={2}>
            Generating image...
          </Typography>
        </Box>
      )}
      {error && (
        <Typography variant='body2' color='error'>
          {error}
        </Typography>
      )}
      {src && (
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          onLoad={handleImageLoad}
          onError={handleImageError}
          style={{
            objectFit: 'cover',
            opacity: isLoading ? 0 : 1,
            transition: 'opacity 0.3s ease-in-out',
          }}
        />
      )}
    </Box>
  );
}
