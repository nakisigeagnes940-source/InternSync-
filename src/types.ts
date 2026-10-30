export interface UploadedLogbookImage {
  id: string;
  name: string;
  mimeType: string;
  base64: string;
  size: number;
}

export interface LogbookTableRow {
  sn: number;
  taskDone: string;
  skillsAcquired: string;
  challengesFaced: string;
}

export interface PhysicalLogbookData {
  dayAndDate: string;
  department: string;
  section: string;
  traineeName: string;
  table: LogbookTableRow[];
  supervisorRemarks: string;
  supervisorName: string;
  date?: string;
}

export interface AppSession {
  id: string;
  title: string;
  prompt: string;
  generatedOutput?: string;
  logbookData?: PhysicalLogbookData;
  timestamp: string;
  date: number;
  department?: string;
  section?: string;
  dayAndDate?: string;
  images?: UploadedLogbookImage[];
  category?: 'Front Office' | 'Food Production' | 'Barista' | 'Tour Guide' | 'Hospitality' | 'Service' | 'Housekeeping' | 'Laundry' | 'General' | string;
}
