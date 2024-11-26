import {
  ReportSeverity,
  ReportStatus,
  ReportType,
} from "@/constants/enums/ReportType";

export const parseReportType = (type: string) => {
  switch (type) {
    case ReportType.PAYMENT_ISSUE:
      return "Payment Issue";
    case ReportType.RESIDENCE_ISSUE:
      return "Residence Issue";
    case ReportType.HOST_ISSUE:
      return "Host Issue";
    case ReportType.OTHER:
      return "Other";
    default:
      return "Unknown";
  }
};

export const parseReportStatus = (status: string) => {
  switch (status) {
    case ReportStatus.PENDING:
      return "Pending";
    case ReportStatus.INVESTIGATING:
      return "Investigating";
    case ReportStatus.RESOLVED:
      return "Resolved";
    case ReportStatus.CLOSE:
      return "Close";
    default:
      return "Unknown";
  }
};
export const parseReportSeverity = (severity: string) => {
  switch (severity) {
    case ReportSeverity.LOW:
      return "Low";
    case ReportSeverity.MEDIUM:
      return "Medium";
    case ReportSeverity.HIGH:
      return "High";
    case ReportSeverity.URGENT:
      return "Urgent";
    default:
      return "Unknown";
  }
};
