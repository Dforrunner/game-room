import { NextRequest, NextResponse } from 'next/server';
import { ZodError } from 'zod';

// Define custom error types
export class APIError extends Error {
  constructor(
    public message: string,
    public statusCode: number,
    public code: string
  ) {
    super(message);
    this.name = 'APIError';
  }
}

// Base function for creating error responses
function createErrorResponse(
  statusCode: number,
  message: string,
  code: string
): NextResponse {
  console.error(`API Error: ${code} - ${message}`);
  return NextResponse.json(
    {
      error: {
        message,
        code,
      },
    },
    { status: statusCode }
  );
}

// Error functions for each type
export function badRequest(customMessage?: string): NextResponse {
  const message =
    customMessage ||
    'Bad Request: The server cannot process the request due to a client error';
  return createErrorResponse(400, message, 'BAD_REQUEST');
}

export function unauthorized(customMessage?: string): NextResponse {
  const message =
    customMessage ||
    'Unauthorized: Authentication is required and has failed or has not been provided';
  return createErrorResponse(401, message, 'UNAUTHORIZED');
}

export function forbidden(customMessage?: string): NextResponse {
  const message =
    customMessage ||
    'Forbidden: The server understood the request but refuses to authorize it';
  return createErrorResponse(403, message, 'FORBIDDEN');
}

export function notFound(customMessage?: string): NextResponse {
  const message =
    customMessage || 'Not Found: The requested resource could not be found';
  return createErrorResponse(404, message, 'NOT_FOUND');
}

export function methodNotAllowed(customMessage?: string): NextResponse {
  const message =
    customMessage ||
    'Method Not Allowed: The method specified in the request is not allowed';
  return createErrorResponse(405, message, 'METHOD_NOT_ALLOWED');
}

export function conflict(customMessage?: string): NextResponse {
  const message =
    customMessage ||
    'Conflict: The request could not be completed due to a conflict with the current state of the target resource';
  return createErrorResponse(409, message, 'CONFLICT');
}

export function internalServerError(customMessage?: string): NextResponse {
  const message =
    customMessage ||
    'Internal Server Error: The server has encountered a situation it does not know how to handle';
  return createErrorResponse(500, message, 'INTERNAL_SERVER_ERROR');
}

// Function to handle unexpected errors
export function handleUnexpectedError(error: unknown): NextResponse {
  console.error('Unexpected error:', error);

  if (error instanceof APIError) {
    return createErrorResponse(error.statusCode, error.message, error.code);
  }

  return internalServerError();
}

type ErrorResponse = {
  error: {
    message: string;
    code: string;
  };
};
// Function to handle all types of errors
export function handleApiError(error: unknown): NextResponse<ErrorResponse> {
  console.error('Error caught:', error);

  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        error: {
          message: 'Validation error',
          code: 'VALIDATION_ERROR',
          details: error.errors,
        },
      },
      { status: 400 }
    );
  } else if (error instanceof APIError) {
    // Handle custom API errors
    return NextResponse.json(
      {
        error: {
          message: error.message,
          code: error.code,
        },
      },
      { status: error.statusCode }
    );
  } else if (error instanceof Error) {
    // Handle standard JavaScript errors
    return NextResponse.json(
      {
        error: {
          message: error.message,
          code: 'INTERNAL_SERVER_ERROR',
        },
      },
      { status: 500 }
    );
  } else if (typeof error === 'string') {
    // Handle string errors
    return NextResponse.json(
      {
        error: {
          message: error,
          code: 'INTERNAL_SERVER_ERROR',
        },
      },
      { status: 500 }
    );
  } else {
    // Handle any other type of error
    return NextResponse.json(
      {
        error: {
          message: 'An unexpected error occurred',
          code: 'INTERNAL_SERVER_ERROR',
        },
      },
      { status: 500 }
    );
  }
}

// Function to wrap API routes with error handling
export function withErrorHandler(handler: (...args: any) => any) {
  return async (req: NextRequest, res: NextResponse) => {
    try {
      return await handler(req, res);
    } catch (error) {
      return handleApiError(error);
    }
  };
}
