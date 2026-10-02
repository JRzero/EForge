export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogEntry {
  level: LogLevel;
  message: string;
  context?: Record<string, unknown>;
}

export interface LoggerSink {
  write(entry: LogEntry): void;
}

const consoleSink: LoggerSink = {
  write(entry) {
    const method = entry.level === 'debug' ? 'debug' : entry.level;
    console[method](`[EForge] ${entry.message}`, entry.context ?? '');
  },
};

export function createLogger(sink: LoggerSink = consoleSink) {
  const log = (level: LogLevel, message: string, context?: Record<string, unknown>) =>
    sink.write(context ? {level, message, context} : {level, message});
  return {
    debug: (message: string, context?: Record<string, unknown>) => log('debug', message, context),
    info: (message: string, context?: Record<string, unknown>) => log('info', message, context),
    warn: (message: string, context?: Record<string, unknown>) => log('warn', message, context),
    error: (message: string, context?: Record<string, unknown>) => log('error', message, context),
  };
}
