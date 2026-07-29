import { Download, FileText } from "lucide-react";

function DashboardHeader({ onExportCSV, onExportPDF }) {
    return (
        <div className="dashboard-header">
            <div>
                <h1>Dashboard</h1>
                <p>Overview of all product launches</p>
            </div>
            <div className="dashboard-export-group">
                <button className="export-btn" onClick={onExportCSV} aria-label="Export dashboard to CSV">
                    <Download size={16} />
                    CSV
                </button>
                <button className="export-btn" onClick={onExportPDF} aria-label="Export dashboard to PDF">
                    <FileText size={16} />
                    PDF
                </button>
            </div>
        </div>
    );
}

export default DashboardHeader;