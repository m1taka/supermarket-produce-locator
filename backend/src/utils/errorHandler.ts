export const getErrorMessage = (error: unknown): string => {
    if (error instanceof Error) {
        return error.message;
    }
    if (typeof error === 'string') {
        return error;
    }
    return 'Unknown error occurred';
};

export const handleControllerError = (res: any, error: unknown, defaultMessage: string) => {
    console.error(defaultMessage, error);
    res.status(500).json({
        message: defaultMessage,
        error: getErrorMessage(error)
    });
};

export const createErrorResponse = (error: unknown, defaultMessage: string) => {
    console.error(defaultMessage, error);
    return {
        message: defaultMessage,
        error: getErrorMessage(error)
    };
};