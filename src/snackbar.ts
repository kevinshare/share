import { enqueueSnackbar, OptionsObject } from "notistack";

export const snackWarning = (message: string, options?: Partial<OptionsObject<"warning">>) => {
    return enqueueSnackbar(message, {
        variant: 'warning',
        autoHideDuration: 3000,
        anchorOrigin: {
            vertical: 'top',
            horizontal: 'center'
        },
        ...options
    });
}

export const snackInfo = (message: string, options?: Partial<OptionsObject<"info">>) => {
    return enqueueSnackbar(message, {
        variant: 'info',
        autoHideDuration: 3000,
        anchorOrigin: {
            vertical: 'top',
            horizontal: 'center'
        },
        ...options
    });
}

export const snackSuccess = (message: string, options?: Partial<OptionsObject<"success">>) => {
    return enqueueSnackbar(message, {
        variant: 'success',
        autoHideDuration: 3000,
        anchorOrigin: {
            vertical: 'top',
            horizontal: 'center'
        },
        ...options
    });
}

export const snackError = (message: string, options?: Partial<OptionsObject<"error">>) => {
    return enqueueSnackbar(message, {
        variant: 'error',
        autoHideDuration: 3000,
        anchorOrigin: {
            vertical: 'top',
            horizontal: 'center'
        },
        ...options
    });
}