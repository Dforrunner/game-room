import { HexColorPicker } from 'react-colorful';
import { Backdrop, IconButton, Popover } from '@mui/material';
import { useState, MouseEvent } from 'react';
import { PaintBucket } from 'lucide-react';
import { getContrastingColor } from '@/utils/color';

interface Props {
  onSelect?: (color: string) => void;
}
export default function ColorPicker({ onSelect }: Props) {
  const [color, setColor] = useState('#000000');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  let open = Boolean(anchorEl);
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);

    if (open) {
      handleClose();
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelect = (newColor: string) => {
    setColor(newColor);
    onSelect?.(newColor);
  };

  return (
    <div>
      <IconButton
        sx={(theme) => ({
          backgroundColor: color,
          width: '35px',
          height: '35px',
          border: '1px solid white',
          zIndex: theme.zIndex.drawer + 2,
        })}
        onClick={handleClick}
      >
        <PaintBucket stroke={getContrastingColor(color)} />
      </IconButton>
      <Backdrop
        open={open}
        onClick={handleClose}
        sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
      >
        <Popover
          anchorEl={anchorEl}
          open={open}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
        >
          <div className="p-3" onClick={(e) => e.stopPropagation()}>
            <HexColorPicker onChange={handleSelect} />
          </div>
        </Popover>
      </Backdrop>
    </div>
  );
}
