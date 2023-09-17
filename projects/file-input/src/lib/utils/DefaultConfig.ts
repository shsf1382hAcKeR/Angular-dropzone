import { FileProcessingConfig } from '../models/FileProcessingConfig';

export const defaultConfig: FileProcessingConfig = {
  maxFiles: 10,
  allowedFileTypes: undefined,
  maxSize: 2,
  defaultImage: undefined,
};
