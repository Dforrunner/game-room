import { IconButton } from '@mui/material';
import { Circle } from 'lucide-react';
import Menu from '@mui/material/Menu';
import { useState, MouseEvent } from 'react';

const sizes = [2, 5, 10, 20];
interface Props {
  color: string;
  onSelect: (size: number) => void;
}
export default function PenSizePicker({ color, onSelect }: Props) {
  const [brushSize, setBrushSize] = useState(5);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelect = (size: number) => {
    setBrushSize(size);
    onSelect(size);
    handleClose();
  };
  return (
    <div>
      <IconButton
        onClick={handleClick}
        sx={{
          height: '35px',
          width: '35px',
          border: '1px solid lightgray',
          backgroundColor: 'white',
        }}
      >
        <Circle fill={color} stroke={color} size={brushSize} />
      </IconButton>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <div className='flex flex-col gap-1 p-1'>
          {sizes.map((size) => (
            <IconButton
              key={size + '-pen-size'}
              sx={{
                height: '40px',
                width: '40px',
                border: '1px solid lightgray',
                backgroundColor: brushSize === size ? 'lightblue' : 'white',
              }}
              onClick={() => handleSelect(size)}
            >
              <Circle fill={color} stroke={color} size={size} />
            </IconButton>
          ))}
        </div>
      </Menu>
    </div>
  );
}
