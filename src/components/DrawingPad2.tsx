'use client';

import { useRef, useState, useEffect } from 'react';
import { HexColorPicker } from 'react-colorful';
import EmojiPicker from 'emoji-picker-react';
import { Paintbrush, Square, SprayCan, Eraser } from 'lucide-react';
import { Button } from '@mui/material';

const BrushOptions = ({ setBrushType, setBrushSize }: any) => {
  const sizes = [2, 5, 10, 20];
  const types = [
    { name: 'Round', icon: <Paintbrush className="w-4 h-4" /> },
    { name: 'Square', icon: <Square className="w-4 h-4" /> },
    { name: 'Spray', icon: <SprayCan className="w-4 h-4" /> },
  ];

  return (
    <div className="flex flex-col space-y-2 mb-4">
      <div className="flex space-x-2">
        {types.map((type) => (
          <Button
            key={type.name}
            onClick={() => setBrushType(type.name.toLowerCase())}
            variant="outlined"
          >
            {type.icon}
          </Button>
        ))}
      </div>
      <div className="flex space-x-2">
        {sizes.map((size) => (
          <Button
            key={size}
            onClick={() => setBrushSize(size)}
            variant="outlined"
          >
            {size}px
          </Button>
        ))}
      </div>
    </div>
  );
};

export default function DrawingPad2() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(5);
  const [brushType, setBrushType] = useState('round');
  const [isEraser, setIsEraser] = useState(false);
  const [emojis, setEmojis] = useState<any[]>([]);
  const [selectedEmoji, setSelectedEmoji] = useState(null);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    if (!context) return;
    context.lineCap = 'round';
    context.lineJoin = 'round';
  }, []);

  const startDrawing = (e: any) => {
    if (!canvasRef.current) return;
    const { offsetX, offsetY } = e.nativeEvent as any;
    const context = canvasRef.current.getContext('2d');
    setIsDrawing(true);

    if (brushType === 'spray') {
      spray(context, offsetX, offsetY);
    } else {
      context!.beginPath();
      context!.moveTo(offsetX, offsetY);
    }
  };

  const draw = (e: any) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = e.nativeEvent;
    const context = canvasRef.current?.getContext('2d');

    if (!context) return;
    if (brushType === 'spray') {
      spray(context, offsetX, offsetY);
    } else {
      context.lineTo(offsetX, offsetY);
      context.strokeStyle = isEraser ? '#FFFFFF' : color;
      context.lineWidth = brushSize;
      context.lineCap = brushType === 'square' ? 'butt' : 'round';
      context.stroke();
    }
  };

  const spray = (context: any, x: any, y: any) => {
    const density = brushSize * 2;
    context.fillStyle = isEraser ? '#FFFFFF' : color;

    for (let i = 0; i < density; i++) {
      const offsetX = getRandomInt(-brushSize, brushSize);
      const offsetY = getRandomInt(-brushSize, brushSize);
      context.fillRect(x + offsetX, y + offsetY, 1, 1);
    }
  };

  const getRandomInt = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const handleSubmit = () => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) return;
    // Draw emojis on the canvas
    emojis.forEach((emoji: any) => {
      context.font = `${emoji.size}px Arial`;
      context.fillText(emoji.emoji, emoji.x, emoji.y);
    });

    const imageDataUrl = canvas.toDataURL('image/png');
    console.log('Image data URL:', imageDataUrl);
    alert('Drawing submitted! Check console for the image data URL.');
  };

  const addEmoji = (emojiObject: any) => {
    if (!canvasRef.current) return;
    const newEmoji = {
      id: Date.now(),
      emoji: emojiObject.emoji,
      x: canvasRef.current.width / 2,
      y: canvasRef.current.height / 2,
      size: 30,
    };
    setEmojis([...emojis, newEmoji]);
    setShowEmojiPicker(false);
  };

  const handleCanvasClick = (e: any) => {
    const { offsetX, offsetY } = e.nativeEvent;
    const clickedEmoji = emojis.find(
      (emoji) =>
        offsetX > emoji.x &&
        offsetX < emoji.x + emoji.size &&
        offsetY > emoji.y - emoji.size &&
        offsetY < emoji.y
    );
    setSelectedEmoji(clickedEmoji || null);
  };

  const moveEmoji = (e: any) => {
    if (selectedEmoji) {
      const { offsetX, offsetY } = e.nativeEvent;
      setEmojis(
        emojis.map((emoji) =>
          emoji.id === selectedEmoji.id
            ? { ...emoji, x: offsetX, y: offsetY }
            : emoji
        )
      );
    }
  };

  const resizeEmoji = (increase) => {
    if (selectedEmoji) {
      setEmojis(
        emojis.map((emoji) =>
          emoji.id === selectedEmoji.id
            ? { ...emoji, size: emoji.size + (increase ? 5 : -5) }
            : emoji
        )
      );
    }
  };

  const deleteEmoji = () => {
    if (selectedEmoji) {
      setEmojis(emojis.filter((emoji) => emoji.id !== selectedEmoji.id));
      setSelectedEmoji(null);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    const drawCanvas = () => {
      context.clearRect(0, 0, canvas.width, canvas.height);
      emojis.forEach((emoji) => {
        context.font = `${emoji.size}px Arial`;
        context.fillText(emoji.emoji, emoji.x, emoji.y);
      });
    };

    drawCanvas();
  }, [emojis]);

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Enhanced Drawing App</h1>
      <div className="flex space-x-4 mb-4">
        <Button onClick={() => setShowColorPicker(!showColorPicker)}>
          {showColorPicker ? 'Hide' : 'Show'} Color Picker
        </Button>
        <Button onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
          {showEmojiPicker ? 'Hide' : 'Show'} Emoji Picker
        </Button>
      </div>
      {showColorPicker && (
        <div className="mb-4">
          <HexColorPicker color={color} onChange={setColor} />
        </div>
      )}
      {showEmojiPicker && (
        <div className="mb-4">
          <EmojiPicker onEmojiClick={addEmoji} />
        </div>
      )}
      <BrushOptions setBrushType={setBrushType} setBrushSize={setBrushSize} />
      <div className="flex space-x-2 mb-4">
        <Button
          onClick={() => setIsEraser(false)}
          variant={isEraser ? 'outlined' : 'contained'}
        >
          Pen
        </Button>
        <Button
          onClick={() => setIsEraser(true)}
          variant={isEraser ? 'contained' : 'outlined'}
        >
          <Eraser className="w-4 h-4" />
        </Button>
      </div>
      <canvas
        ref={canvasRef}
        width={600}
        height={400}
        onMouseDown={startDrawing}
        onMouseMove={(e) => {
          draw(e);
          moveEmoji(e);
        }}
        onMouseUp={stopDrawing}
        onMouseOut={stopDrawing}
        onClick={handleCanvasClick}
        className="border border-gray-300 rounded"
      />
      <div className="mt-4 space-x-2">
        <Button onClick={() => resizeEmoji(true)}>Increase Emoji Size</Button>
        <Button onClick={() => resizeEmoji(false)}>Decrease Emoji Size</Button>
        <Button onClick={deleteEmoji}>Delete Selected Emoji</Button>
      </div>
      <Button onClick={handleSubmit} className="mt-4">
        Submit Drawing
      </Button>
    </div>
  );
}
