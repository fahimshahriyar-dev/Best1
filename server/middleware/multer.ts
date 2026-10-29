import multer from "multer";
import ErrorHandler from "../utils/errorHandler";

// Configure multer to use memory storage
const storage = multer.memoryStorage();

// File filter function
const fileFilter = (req: any, file: any, cb: any) => {
  // Check file type
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new ErrorHandler("Please upload only image files.", 400), false);
  }
};

// Create multer upload instance
export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: fileFilter,
});

// Error handling middleware for multer
export const handleMulterError = (error: any, req: any, res: any, next: any) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return next(new ErrorHandler("File size too large. Maximum size allowed is 5MB.", 400));
    }
    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      return next(new ErrorHandler("Too many files uploaded.", 400));
    }
    return next(new ErrorHandler(error.message, 400));
  }
  next(error);
};