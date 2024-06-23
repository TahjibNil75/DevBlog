import { createLogger, format, transports, addColors } from 'winston';
const { combine, timestamp, json, colorize, printf } = format;

// Define custom colors
const colors = {
    error: 'red',
    warn: 'yellow',
    info: 'blue',
    http: 'magenta',
    debug: 'white',
  };
  
  // Tell Winston to use the custom colors
  addColors(colors);

// Custom format for console logging with colors
// Custom format for console logging with colors and custom timestamp
const consoleLogFormat = combine(
    colorize({ all: true }),
    timestamp({ format: "DD MMM, YYYY - HH:mm:ss:ms" }),
    printf(({ level, message, timestamp }) => {
      return `${timestamp} ${level}: ${message}`;
    })
  );

// Create a Winston logger
const logger = createLogger({
  level: 'info',
  format: combine(
    colorize({all: true}),
    timestamp({ format: "DD MMM, YYYY - HH:mm:ss:ms" }),
    json()
  ),
  transports: [
    new transports.Console({
      format: consoleLogFormat
    }),
    new transports.File({ filename: 'app.log' })
  ],
});

export default logger;