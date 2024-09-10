import { CircularProgress } from '@mui/material';

export default function Loading() {
  return (
    <div className="flex items-center justify-center h-screen gap-3 text-blue-500">
      <CircularProgress />
      Loading...
    </div>
  );
}
