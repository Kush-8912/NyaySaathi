export type ContractType =
  | 'Employment'
  | 'Freelance'
  | 'Rental'
  | 'Privacy Policy'
  | 'Terms of Service'
  | 'Vendor Agreement'
  | 'NDA'
  | 'Insurance'
  | 'Subscription'
  | 'Service Agreement'
  | 'Other';

export type UserPerspective =
  | 'Employee'
  | 'Freelancer'
  | 'Tenant'
  | 'Customer'
  | 'Startup Founder'
  | 'Vendor'
  | 'Individual User';

export type DocumentStatus =
  | 'Uploaded'
  | 'Extracted'
  | 'AI Analyzed'
  | 'Report Ready'
  | 'Reviewed'
  | 'Archived';

export type FileType = 'pdf' | 'docx' | 'txt' | 'text';

export interface ContractDocument {
  id?: string;
  fileName: string;
  fileURL?: string;
  fileType: FileType;
  storagePath?: string;
  extractedTextPreview?: string;
  contractType: ContractType;
  perspective: UserPerspective;
  status: DocumentStatus;
  createdAt: Date | string;
  updatedAt: Date | string;
}
