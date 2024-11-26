export interface ReportType {
  id: number;
  bookingId: number;
  residenceId: number;
  residenceName: string;
  reporterName: string;
  hostName: string;
  reportType: string;
  severity: string;
  title: string;
  description: string;
  status: string;
  adminNote: string;
  resolvedAt: string;
  createdAt: string;
  updatedAt: string;
}
