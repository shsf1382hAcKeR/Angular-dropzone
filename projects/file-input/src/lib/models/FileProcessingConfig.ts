export interface FileProcessingConfig {
  maxFiles?: number | 'noRule';
  allowedFileTypes?: string[] | 'noRule';
  maxSize?: number | 'noRule';
  defaultImage?: string | undefined;
}
