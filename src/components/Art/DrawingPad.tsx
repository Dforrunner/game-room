'use client';

import { Button, IconButton } from '@mui/material';
import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Redo, RotateCcw, Undo } from 'lucide-react';
import ColorPicker from './ColorPicker';
import PenSizePicker from './PenSizePicker';

function getEventPosition(nativeEvent: any, canvas: any) {
  if (nativeEvent.touches) {
    // Touch event
    const touch = nativeEvent.touches[0];
    const rect = canvas.getBoundingClientRect();
    return {
      offsetX: touch.clientX - rect.left,
      offsetY: touch.clientY - rect.top,
    };
  }

  return {
    offsetX: nativeEvent.offsetX,
    offsetY: nativeEvent.offsetY,
  };
}

function drawPath(pathParams: PathParams, context: CanvasRenderingContext2D) {
  context.strokeStyle = pathParams.color;
  context.lineWidth = pathParams.brushSize;

  const path = pathParams.points;

  if (path.length > 1) {
    context.moveTo(path[0].x, path[0].y);
    context.beginPath();
    for (let i = 1; i < path.length - 2; i++) {
      const midPointX = (path[i].x + path[i + 1].x) / 2;
      const midPointY = (path[i].y + path[i + 1].y) / 2;
      context.quadraticCurveTo(path[i].x, path[i].y, midPointX, midPointY);
    }
    context.quadraticCurveTo(
      path[path.length - 2].x,
      path[path.length - 2].y,
      path[path.length - 1].x,
      path[path.length - 1].y
    );
    context.stroke();
  }
}

interface PathParams {
  points: Array<{ x: number; y: number }>;
  color: string;
  brushSize: number;
}
interface Props {
  onSubmit: (file: File) => void;
}
export default function DrawingPad({ onSubmit }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<any>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#FFFFFF');
  const [brushSize, setBrushSize] = useState(5);
  const [paths, setPaths] = useState<PathParams[]>([]);
  const undoClearStack = useRef<PathParams[]>([]);
  const undoStack = useRef<PathParams[]>([]);
  const redraw = useRef(false);
  const [points, setPoints] = useState<Array<{ x: number; y: number }>>([]);

  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerWidth * (9 / 16),
  });

  const startDrawing = (e: any) => {
    e.preventDefault();
    const { offsetX, offsetY } = getEventPosition(
      e.nativeEvent,
      canvasRef.current
    );
    setPoints([{ x: offsetX, y: offsetY }]);
    setIsDrawing(true);
  };

  const draw = useCallback(() => {
    const context = canvasRef.current?.getContext('2d');
    if (!context) return;

    //clear the canvas
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);

    // Redraw all saved paths
    paths.forEach((path) => {
      drawPath(path, context);
    });

    if (isDrawing && points.length > 1) {
      //Draw the current path
      drawPath(
        {
          points,
          color,
          brushSize,
        },
        context
      );
    }

    // Continue the drawing loop
    requestRef.current = requestAnimationFrame(draw);
  }, [isDrawing, points, paths]);

  const stopDrawing = () => {
    redraw.current = false;
    const context = canvasRef.current!.getContext('2d');
    context!.closePath();

    if (points.length > 1) {
      const pathParams: PathParams = {
        points,
        color,
        brushSize,
      };
      setPaths((prev) => [...prev, pathParams]);
    }
    setIsDrawing(false);
    setPoints([]);
    cancelAnimationFrame(requestRef.current);
  };

  const handleMove = (e: any) => {
    if (!isDrawing) return;
    e.preventDefault();

    const { offsetX, offsetY } = getEventPosition(
      e.nativeEvent,
      canvasRef.current
    );
    setPoints((prevPoints) => [...prevPoints, { x: offsetX, y: offsetY }]);
  };

  const clearCanvas = () => {
    if (!paths.length) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    if (!context) return;
    context.clearRect(0, 0, canvas.width, canvas.height);
    undoStack.current = [];
    undoClearStack.current = [...paths];
    setPaths([]);
    setPoints([]);
  };

  const handleSubmit = () => {
    const canvas = canvasRef.current;
    if (!canvas || !paths.length) return;
    canvas.toBlob((blob) => {
      if (!blob) return;
      const file = new File([blob], 'canvas-image.png', { type: 'image/png' });
      onSubmit(file);
    }, 'image/png');
  };

  const undo = () => {
    if (!paths.length && !!undoClearStack.current.length) {
      redraw.current = true;
      setPaths(undoClearStack.current);
      undoClearStack.current = [];
      return;
    }

    if (paths.length === 0) return;
    redraw.current = true;
    undoStack.current.push(paths[paths.length - 1]);
    setPaths((prevPaths) => [...prevPaths.slice(0, -1)]); // Remove the last path
  };

  const redo = () => {
    if (undoStack.current?.length === 0) return;
    redraw.current = true;
    const lastUndonPath = undoStack.current.pop();
    if (lastUndonPath) setPaths((prevPaths) => [...prevPaths, lastUndonPath]); // Remove the last path
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');

    if (context) {
      context.lineCap = 'round';
      context.lineJoin = 'round';
    }

    const handleResize = () => {
      const width = window.innerWidth - 80;
      const height = width * (11 / 9);

      if (width > 500) {
        setDimensions({ width: 500, height: 500 * (11 / 9) });
        return;
      }
      setDimensions({ width, height });
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Set initial size

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (isDrawing || redraw.current) {
      requestRef.current = requestAnimationFrame(draw);
      redraw.current = false;
    }
    return () => {
      cancelAnimationFrame(requestRef.current);
    };
  }, [isDrawing, draw, paths]);

  return (
    <div
      className='max-w-xl mx-auto '
      style={{
        width: dimensions.width,
        height: dimensions.height,
      }}
    >
      <div className='flex justify-between  pb-1'>
        <div className='flex gap-2'>
          <ColorPicker onSelect={setColor} />
          <PenSizePicker color={color} onSelect={setBrushSize} />
        </div>

        <div className='flex gap-2'>
          <IconButton
            onClick={undo}
            size='small'
            sx={{
              backgroundColor: 'white',
              '&:hover': {
                backgroundColor: 'white',
              },
            }}
          >
            <Undo />
          </IconButton>

          <IconButton
            onClick={redo}
            size='small'
            sx={{
              backgroundColor: 'white',
              '&:hover': {
                backgroundColor: 'white',
              },
            }}
          >
            <Redo />
          </IconButton>

          <IconButton
            onClick={clearCanvas}
            size='small'
            sx={{
              backgroundColor: 'white',
              '&:hover': {
                backgroundColor: 'white',
              },
            }}
          >
            <RotateCcw fill={'white'} stroke='gray' />
          </IconButton>
        </div>
      </div>

      <canvas
        ref={canvasRef}
        width={dimensions.width}
        height={dimensions.height}
        onMouseDown={startDrawing}
        onMouseMove={handleMove}
        onMouseUp={stopDrawing}
        onMouseOut={stopDrawing}
        onTouchStart={startDrawing}
        onTouchEnd={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchMove={handleMove}
        className='border border-gray-300 rounded bg-black/50'
      />

      <div className='pt-3'>
        <Button onClick={handleSubmit} variant='contained' fullWidth>
          Submit Drawing
        </Button>
      </div>
    </div>
  );
}
