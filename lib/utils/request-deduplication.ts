/**
 * Request Deduplication and Race Condition Prevention
 * Prevents multiple identical requests from being made simultaneously
 */

interface PendingRequest {
  promise: Promise<any>;
  timestamp: number;
  abortController: AbortController;
}

const pendingRequests = new Map<string, PendingRequest>();
const REQUEST_TIMEOUT = 30000; // 30 seconds

/**
 * Creates a unique key for a request based on method, URL and payload
 */
function createRequestKey(
  method: string, 
  url: string, 
  payload?: any
): string {
  const payloadStr = payload ? JSON.stringify(payload) : '';
  return `${method}:${url}:${payloadStr}`;
}

/**
 * Cleans up expired pending requests
 */
function cleanupExpiredRequests() {
  const now = Date.now();
  const entries = Array.from(pendingRequests.entries());
  for (const [key, request] of entries) {
    if (now - request.timestamp > REQUEST_TIMEOUT) {
      request.abortController.abort();
      pendingRequests.delete(key);
      console.warn('🧹 Cleaned up expired request:', key);
    }
  }
}

/**
 * Deduplicates requests by returning existing promise for identical requests
 */
export async function deduplicateRequest<T>(
  method: string,
  url: string,
  requestFn: (abortSignal: AbortSignal) => Promise<T>,
  payload?: any
): Promise<T> {
  const requestKey = createRequestKey(method, url, payload);
  
  // Clean up expired requests periodically
  cleanupExpiredRequests();
  
  // Check if identical request is already pending
  const existingRequest = pendingRequests.get(requestKey);
  if (existingRequest) {
    console.log('🔄 Reusing pending request:', requestKey);
    return existingRequest.promise;
  }
  
  // Create new request with abort controller
  const abortController = new AbortController();
  const promise = requestFn(abortController.signal);
  
  // Store pending request
  pendingRequests.set(requestKey, {
    promise,
    timestamp: Date.now(),
    abortController
  });
  
  console.log('🚀 Starting new request:', requestKey);
  
  try {
    const result = await promise;
    pendingRequests.delete(requestKey);
    return result;
  } catch (error) {
    pendingRequests.delete(requestKey);
    throw error;
  }
}

/**
 * Aborts all pending requests (useful for cleanup on logout)
 */
export function abortAllPendingRequests() {
  console.log('🛑 Aborting all pending requests:', pendingRequests.size);
  
  const entries = Array.from(pendingRequests.entries());
  for (const [key, request] of entries) {
    request.abortController.abort();
  }
  
  pendingRequests.clear();
}

/**
 * Gets information about current pending requests
 */
export function getPendingRequestsInfo() {
  cleanupExpiredRequests();
  
  return {
    count: pendingRequests.size,
    requests: Array.from(pendingRequests.keys()),
    oldestTimestamp: pendingRequests.size > 0 
      ? Math.min(...Array.from(pendingRequests.values()).map(r => r.timestamp))
      : null
  };
}

/**
 * Cancellable delay utility for implementing retry with backoff
 */
export function cancellableDelay(
  ms: number, 
  abortSignal?: AbortSignal
): Promise<void> {
  return new Promise((resolve, reject) => {
    if (abortSignal?.aborted) {
      reject(new Error('Cancelled'));
      return;
    }
    
    const timeout = setTimeout(resolve, ms);
    
    abortSignal?.addEventListener('abort', () => {
      clearTimeout(timeout);
      reject(new Error('Cancelled'));
    });
  });
}

/**
 * Retry with exponential backoff and cancellation support
 */
export async function retryWithBackoff<T>(
  fn: (abortSignal: AbortSignal) => Promise<T>,
  {
    maxAttempts = 3,
    baseDelayMs = 1000,
    maxDelayMs = 10000,
    backoffFactor = 2,
    abortSignal,
    onRetry
  }: {
    maxAttempts?: number;
    baseDelayMs?: number;
    maxDelayMs?: number;
    backoffFactor?: number;
    abortSignal?: AbortSignal;
    onRetry?: (attempt: number, error: Error) => void;
  } = {}
): Promise<T> {
  let lastError: Error = new Error('Unknown error');
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    if (abortSignal?.aborted) {
      throw new Error('Request cancelled');
    }
    
    try {
      return await fn(abortSignal || new AbortController().signal);
    } catch (error) {
      lastError = error as Error;
      
      if (attempt === maxAttempts) {
        break;
      }
      
      // Calculate delay with exponential backoff
      const delay = Math.min(
        baseDelayMs * Math.pow(backoffFactor, attempt - 1),
        maxDelayMs
      );
      
      onRetry?.(attempt, lastError);
      console.warn(`🔄 Request failed (attempt ${attempt}/${maxAttempts}), retrying in ${delay}ms:`, lastError.message);
      
      try {
        await cancellableDelay(delay, abortSignal);
      } catch (cancelError) {
        throw new Error('Request cancelled during retry delay');
      }
    }
  }
  
  throw lastError;
}