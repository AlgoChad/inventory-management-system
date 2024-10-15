import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";

export interface paginationMetadata {
  section?: string;
  pageNumber: number;
  pageLength: number;
  orderBy: string;
  orderDir: "asc" | "desc";
}

export interface notificationPaginationMetadata {
  section?: string;
  notificationPageNumber: number;
  notificationPageLength: number;
  notificationOrderBy: string;
  notificationOrderDir: "asc" | "desc";
}

export interface attendancePaginationMetadata {
  section?: string;
  attendancePageNumber: number;
  attendancePageLength: number;
  attendanceOrderBy: string;
  attendanceOrderDir: "asc" | "desc";
}

export interface departmentOfficePaginationMetadata {
  section?: string;
  departmentOfficePageNumber: number;
  departmentOfficePageLength: number;
  departmentOfficeOrderBy: string;
  departmentOfficeOrderDir: "asc" | "desc";
}

interface ArrowProps {
  direction: any;
}
export const ArrowDirection = ({ direction }: ArrowProps) => {
  if (direction === false) {
    return "";
  }
  if (direction === "asc") {
    return <ArrowDown className="ml-2 h-4 w-4" />;
  } else {
    return <ArrowUp className="ml-2 h-4 w-4" />;
  }
};
