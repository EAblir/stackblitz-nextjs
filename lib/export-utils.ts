// Utility functions for client-side export functionality

export const downloadExcel = async (type: string, filters?: any) => {
  try {
    const response = await fetch('/api/export', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type,
        format: 'excel',
        filters
      }),
    });

    if (!response.ok) {
      throw new Error('Export failed');
    }

    const { data, filename } = await response.json();
    
    // Create CSV content (simplified Excel export)
    const headers = Object.keys(data[0] || {});
    const csvContent = [
      headers.join(','),
      ...data.map((row: any) => 
        headers.map(header => {
          const value = row[header];
          // Escape commas and quotes in CSV
          if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value;
        }).join(',')
      )
    ].join('\n');

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename.replace('.xlsx', '.csv'));
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    return true;
  } catch (error) {
    console.error('Error downloading Excel:', error);
    throw error;
  }
};

export const downloadPDF = async (type: string, filters?: any) => {
  try {
    const response = await fetch('/api/export', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type,
        format: 'pdf',
        filters
      }),
    });

    if (!response.ok) {
      throw new Error('Export failed');
    }

    const { data, filename, title, headers, generatedAt } = await response.json();
    
    // Create simple HTML content for PDF (this would typically use a PDF library like jsPDF)
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${title}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: #333; border-bottom: 2px solid #333; padding-bottom: 10px; }
            .meta { color: #666; margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f5f5f5; font-weight: bold; }
            tr:nth-child(even) { background-color: #f9f9f9; }
            .footer { margin-top: 30px; text-align: center; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <h1>${title}</h1>
          <div class="meta">Generated on: ${new Date(generatedAt).toLocaleString()}</div>
          <div class="meta">Total records: ${data.length}</div>
          
          <table>
            <thead>
              <tr>
                ${headers.map((header: string) => `<th>${header}</th>`).join('')}
              </tr>
            </thead>
            <tbody>
              ${data.map((item: any) => {
                const row = getRowData(item, type);
                return `<tr>${row.map((cell: any) => `<td>${cell || 'N/A'}</td>`).join('')}</tr>`;
              }).join('')}
            </tbody>
          </table>
          
          <div class="footer">
            This report was generated automatically by the system.
          </div>
        </body>
      </html>
    `;

    // Open in new window for printing/saving as PDF
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      printWindow.focus();
      
      // Trigger print dialog after content loads
      setTimeout(() => {
        printWindow.print();
      }, 500);
    }
    
    return true;
  } catch (error) {
    console.error('Error downloading PDF:', error);
    throw error;
  }
};

const getRowData = (item: any, type: string): any[] => {
  switch (type) {
    case 'administrations':
      return [
        item.id,
        item.accountingOffice,
        item.administrationName,
        item.company?.name || 'N/A',
        item.schedule,
        Array.isArray(item.days) ? item.days.join(', ') : item.days,
        item.status,
        new Date(item.created).toLocaleDateString(),
        new Date(item.lastModified).toLocaleDateString()
      ];
    case 'instructions':
      return [
        item.id,
        item.content,
        item.administration?.administrationName || 'General',
        item.status,
        new Date(item.createdAt).toLocaleDateString()
      ];
    case 'messages':
      return [
        item.id,
        item.type,
        item.status,
        item.administration?.administrationName || 'N/A',
        item.invoiceNumber || 'N/A',
        item.fields || 'N/A',
        item.message,
        item.assignee || 'Unassigned',
        item.user?.name || 'N/A',
        new Date(item.created).toLocaleDateString()
      ];
    case 'workflows':
      return [
        item.id,
        item.name,
        item.description,
        item.company?.name || 'N/A',
        item.trigger,
        item.schedule || 'N/A',
        item.status,
        item.lastRun ? new Date(item.lastRun).toLocaleDateString() : 'Never',
        item.executions,
        item._count?.steps || 0,
        item.user?.name || 'N/A',
        new Date(item.created).toLocaleDateString()
      ];
    case 'companies':
      return [
        item.id,
        item.name,
        item.industry,
        item.size,
        item.country,
        item.website || 'N/A',
        item.description || 'N/A',
        item.status,
        item._count?.administrations || 0,
        item._count?.workflows || 0,
        new Date(item.created).toLocaleDateString()
      ];
    default:
      return Object.values(item);
  }
};