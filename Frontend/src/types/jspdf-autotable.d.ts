declare module "jspdf-autotable" {
  import jsPDF from "jspdf";
  export interface AutoTableOptions {
    startY?: number;
    head?: any[][];
    body?: any[][];
    styles?: any;
    headStyles?: any;
    theme?: string;
    margin?: any;
  }
  export default function autoTable(doc: jsPDF, options: AutoTableOptions): void;
}

declare module "jspdf" {
  interface jsPDF {
    lastAutoTable?: { finalY: number };
  }
}
