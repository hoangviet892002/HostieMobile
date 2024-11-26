export interface ReportRequest {
  bookingId: number;
  residenceId: number;
  reportType: string;
  severity: string;
  title: string;
  description: string;
}
