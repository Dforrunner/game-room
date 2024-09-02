import { enqueueSnackbar } from 'notistack';

export function errorSnackBar(err: any) {
  let msg = err;

  if (typeof err === 'object' || err instanceof Error) {
    msg = err.message || err.error;
  }

  return enqueueSnackbar(msg, { variant: 'error' });
}

export function successSnackBar(msg: string) {
  return enqueueSnackbar(msg, { variant: 'success' });
}
