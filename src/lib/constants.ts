import type { ContractType, UserPerspective } from '@/types/contract';

export const APP_NAME = 'NyaySaathi';
export const APP_TAGLINE = 'Read before you sign. Know before you agree.';
export const APP_PITCH =
  'NyaySaathi is a multi-agent AI platform that reads your contracts, detects harmful clauses, scores legal risk, and gives you negotiation-ready recommendations — so you never sign blind again.';

export const CONTRACT_TYPES: ContractType[] = [
  'Employment',
  'Freelance',
  'Rental',
  'Privacy Policy',
  'Terms of Service',
  'Vendor Agreement',
  'NDA',
  'Insurance',
  'Subscription',
  'Service Agreement',
  'Other',
];

export const USER_PERSPECTIVES: UserPerspective[] = [
  'Employee',
  'Freelancer',
  'Tenant',
  'Customer',
  'Startup Founder',
  'Vendor',
  'Individual User',
];

export const PREFERRED_LANGUAGES = ['English', 'Simple English'];

export const USER_TYPES = [
  'Student',
  'Employee',
  'Freelancer',
  'Founder',
  'Tenant',
  'Business Owner',
  'Other',
];

export const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi', 'Jammu & Kashmir', 'Ladakh', 'Puducherry',
];

export const MAX_FILE_SIZE_MB = 10;
export const MAX_TEXT_CHARS = 15000;
export const SUPPORTED_FILE_TYPES = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];

export const DEMO_CONTRACT_TEXT = `The employee agrees not to work with any competing business in India or abroad for a period of 24 months after termination. The company shall own all intellectual property created by the employee during and outside working hours. Any dispute shall be resolved only through arbitration chosen by the company. The employee's salary may be revised at the sole discretion of the management without prior notice. The company reserves the right to terminate this agreement without cause with immediate effect, forfeiting all pending dues. The employee shall not disclose any company information to any third party for a period of 5 years after employment. The employee consents to monitoring of all communications on company devices and networks.`;

export const AGENT_STEPS = [
  { key: 'extract', label: 'Extracting Clauses', description: 'Identifying key legal provisions...' },
  { key: 'classify', label: 'Classifying Risk Categories', description: 'Mapping clauses to risk dimensions...' },
  { key: 'adversarial', label: 'Adversarial Reasoning', description: 'Simulating worst-case scenarios...' },
  { key: 'explain', label: 'Generating Explanations', description: 'Creating plain English summaries...' },
  { key: 'negotiate', label: 'Building Negotiation Plan', description: 'Crafting recommended changes...' },
  { key: 'report', label: 'Compiling Report', description: 'Assembling structured risk intelligence...' },
];
