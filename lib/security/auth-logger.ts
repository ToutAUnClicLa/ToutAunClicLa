// Enhanced logging system for authentication events
import { headers } from 'next/headers';

export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
  SECURITY = 'security'
}

export enum AuthEvent {
  REGISTRATION_ATTEMPT = 'registration_attempt',
  REGISTRATION_SUCCESS = 'registration_success',
  REGISTRATION_FAILED = 'registration_failed',
  LOGIN_ATTEMPT = 'login_attempt',
  LOGIN_SUCCESS = 'login_success',
  LOGIN_FAILED = 'login_failed',
  PASSWORD_RESET_REQUEST = 'password_reset_request',
  PASSWORD_RESET_SUCCESS = 'password_reset_success',
  EMAIL_VERIFICATION_ATTEMPT = 'email_verification_attempt',
  EMAIL_VERIFICATION_SUCCESS = 'email_verification_success',
  EMAIL_VERIFICATION_FAILED = 'email_verification_failed',
  RATE_LIMIT_EXCEEDED = 'rate_limit_exceeded',
  INVALID_TOKEN = 'invalid_token',
  SUSPICIOUS_ACTIVITY = 'suspicious_activity'
}

interface LogContext {
  userId?: string;
  email?: string;
  ip?: string;
  userAgent?: string;
  endpoint?: string;
  error?: string;
  metadata?: Record<string, any>;
}

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  event: AuthEvent;
  message: string;
  context: LogContext;
  sessionId?: string;
}

class AuthLogger {
  private getClientInfo(): { ip: string; userAgent: string } {
    const headersList = headers();
    const forwarded = headersList.get('x-forwarded-for');
    const realIp = headersList.get('x-real-ip');
    const userAgent = headersList.get('user-agent') || 'unknown';
    
    const ip = forwarded?.split(',')[0] || realIp || 'unknown';
    
    return { ip, userAgent };
  }

  private createLogEntry(
    level: LogLevel,
    event: AuthEvent,
    message: string,
    context: LogContext = {}
  ): LogEntry {
    try {
      const clientInfo = this.getClientInfo();
      
      return {
        timestamp: new Date().toISOString(),
        level,
        event,
        message,
        context: {
          ...context,
          ip: context.ip || clientInfo.ip,
          userAgent: context.userAgent || clientInfo.userAgent
        },
        sessionId: Math.random().toString(36).substring(2, 15)
      };
    } catch (error) {
      // Fallback if headers() fails (e.g., in non-request context)
      return {
        timestamp: new Date().toISOString(),
        level,
        event,
        message,
        context,
        sessionId: Math.random().toString(36).substring(2, 15)
      };
    }
  }

  private outputLog(entry: LogEntry): void {
    const logMessage = {
      ...entry,
      environment: process.env.NODE_ENV || 'development'
    };

    // In development, use console
    if (process.env.NODE_ENV === 'development') {
      switch (entry.level) {
        case LogLevel.ERROR:
        case LogLevel.SECURITY:
          console.error('🚨 [AUTH]', JSON.stringify(logMessage, null, 2));
          break;
        case LogLevel.WARN:
          console.warn('⚠️ [AUTH]', JSON.stringify(logMessage, null, 2));
          break;
        case LogLevel.INFO:
          console.info('ℹ️ [AUTH]', JSON.stringify(logMessage, null, 2));
          break;
        case LogLevel.DEBUG:
          console.debug('🐛 [AUTH]', JSON.stringify(logMessage, null, 2));
          break;
        default:
          console.log('📝 [AUTH]', JSON.stringify(logMessage, null, 2));
      }
    } else {
      // In production, you would send to your logging service
      // Examples: DataDog, CloudWatch, LogRocket, etc.
      console.log(JSON.stringify(logMessage));
    }
  }

  // Public logging methods
  info(event: AuthEvent, message: string, context: LogContext = {}): void {
    const entry = this.createLogEntry(LogLevel.INFO, event, message, context);
    this.outputLog(entry);
  }

  warn(event: AuthEvent, message: string, context: LogContext = {}): void {
    const entry = this.createLogEntry(LogLevel.WARN, event, message, context);
    this.outputLog(entry);
  }

  error(event: AuthEvent, message: string, context: LogContext = {}): void {
    const entry = this.createLogEntry(LogLevel.ERROR, event, message, context);
    this.outputLog(entry);
  }

  security(event: AuthEvent, message: string, context: LogContext = {}): void {
    const entry = this.createLogEntry(LogLevel.SECURITY, event, message, context);
    this.outputLog(entry);
  }

  debug(event: AuthEvent, message: string, context: LogContext = {}): void {
    const entry = this.createLogEntry(LogLevel.DEBUG, event, message, context);
    this.outputLog(entry);
  }

  // Convenience methods for common auth events
  logRegistrationAttempt(email: string, context: LogContext = {}): void {
    this.info(AuthEvent.REGISTRATION_ATTEMPT, `Registration attempt for email: ${email}`, {
      ...context,
      email
    });
  }

  logRegistrationSuccess(userId: string, email: string, context: LogContext = {}): void {
    this.info(AuthEvent.REGISTRATION_SUCCESS, `User registered successfully: ${email}`, {
      ...context,
      userId,
      email
    });
  }

  logRegistrationFailed(email: string, error: string, context: LogContext = {}): void {
    this.error(AuthEvent.REGISTRATION_FAILED, `Registration failed for ${email}: ${error}`, {
      ...context,
      email,
      error
    });
  }

  logLoginAttempt(email: string, context: LogContext = {}): void {
    this.info(AuthEvent.LOGIN_ATTEMPT, `Login attempt for email: ${email}`, {
      ...context,
      email
    });
  }

  logLoginSuccess(userId: string, email: string, context: LogContext = {}): void {
    this.info(AuthEvent.LOGIN_SUCCESS, `User logged in successfully: ${email}`, {
      ...context,
      userId,
      email
    });
  }

  logLoginFailed(email: string, error: string, context: LogContext = {}): void {
    this.warn(AuthEvent.LOGIN_FAILED, `Login failed for ${email}: ${error}`, {
      ...context,
      email,
      error
    });
  }

  logPasswordResetRequest(email: string, context: LogContext = {}): void {
    this.info(AuthEvent.PASSWORD_RESET_REQUEST, `Password reset requested for: ${email}`, {
      ...context,
      email
    });
  }

  logPasswordResetSuccess(userId: string, email: string, context: LogContext = {}): void {
    this.info(AuthEvent.PASSWORD_RESET_SUCCESS, `Password reset successful for: ${email}`, {
      ...context,
      userId,
      email
    });
  }

  logEmailVerificationAttempt(email: string, context: LogContext = {}): void {
    this.info(AuthEvent.EMAIL_VERIFICATION_ATTEMPT, `Email verification attempt for: ${email}`, {
      ...context,
      email
    });
  }

  logEmailVerificationSuccess(userId: string, email: string, context: LogContext = {}): void {
    this.info(AuthEvent.EMAIL_VERIFICATION_SUCCESS, `Email verified successfully for: ${email}`, {
      ...context,
      userId,
      email
    });
  }

  logEmailVerificationFailed(email: string, error: string, context: LogContext = {}): void {
    this.error(AuthEvent.EMAIL_VERIFICATION_FAILED, `Email verification failed for ${email}: ${error}`, {
      ...context,
      email,
      error
    });
  }

  logRateLimitExceeded(endpoint: string, context: LogContext = {}): void {
    this.security(AuthEvent.RATE_LIMIT_EXCEEDED, `Rate limit exceeded for endpoint: ${endpoint}`, {
      ...context,
      endpoint
    });
  }

  logInvalidToken(context: LogContext = {}): void {
    this.security(AuthEvent.INVALID_TOKEN, 'Invalid token detected', context);
  }

  logSuspiciousActivity(description: string, context: LogContext = {}): void {
    this.security(AuthEvent.SUSPICIOUS_ACTIVITY, `Suspicious activity detected: ${description}`, context);
  }
}

// Export singleton instance
export const authLogger = new AuthLogger();

// Export types for external use
export type { LogContext, LogEntry };
