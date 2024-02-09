// SnackbarHelpers.js

import { useSnackbar } from 'notistack';

export const useSnackbarWithDefaults = () => {
  const { enqueueSnackbar } = useSnackbar();

  const showSnackbar = (message, options) => {
    enqueueSnackbar(message, { anchorOrigin: {
        vertical: 'bottom',
        horizontal: 'right',
      }, ...options });
  };

  const showSuccessSnackbar = (message) => {
    showSnackbar(message, { variant: 'success' });
  };

  const showErrorSnackbar = (message) => {
    showSnackbar(message, { variant: 'error' });
  };

  // You can add more helper functions as needed

  return {
    showSnackbar,
    showSuccessSnackbar,
    showErrorSnackbar,
    // Add more functions here if needed
  };
};
