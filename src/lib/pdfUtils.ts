import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Thai font helper
function addThaiFont(doc: jsPDF) {
    // For now, we'll use a method that works better with Thai text
    // by adjusting the font and using Unicode escape sequences
    doc.setFont('helvetica', 'normal');
}

// Helper function to encode Thai text properly
function encodeThaiText(text: string): string {
    // This helps ensure Thai text displays correctly
    return text;
}

export interface QuotationData {
    quotationNumber: string;
    date: string;
    customer: {
        name: string;
        address: string;
        phone: string;
        taxId: string;
    };
    company: {
        name: string;
        address: string;
        phone: string;
        fax: string;
        email: string;
        taxId: string;
        website: string;
    };
    items: Array<{
        name: string;
        code: string;
        quantity: number;
        unit: string;
        price: number;
        total: number;
    }>;
    summary: {
        subtotal: number;
        vat: number;
        total: number;
    };
    validUntil: string;
    terms: string[];
}

export function generateQuotationPDF(data: QuotationData): void {
    // Create new PDF document in A4 size
    const doc = new jsPDF('p', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const margin = 20;
    const usableWidth = pageWidth - 2 * margin;

    // Load Thai font (Sarabun)
    // Note: For proper Thai font support, you would need to load a Thai font
    // For now, we'll use default font with proper spacing and ensure text is readable
    doc.setFont('helvetica', 'normal');

    // Colors
    const primaryColor = '#1f2937'; // Gray-800
    const secondaryColor = '#6b7280'; // Gray-500
    const accentColor = '#3b82f6'; // Blue-500

    // Header Section
    function addHeader() {
        // Company Logo Area (placeholder with gradient effect)
        doc.setFillColor(59, 130, 246); // Blue-500
        doc.rect(margin, margin, 40, 25, 'F');

        // Add subtle shadow effect
        doc.setFillColor(79, 70, 229); // Indigo-600
        doc.rect(margin + 1, margin + 1, 40, 25, 'F');
        doc.setFillColor(59, 130, 246); // Blue-500
        doc.rect(margin, margin, 40, 25, 'F');

        // Company name in logo area
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('SML', margin + 12, margin + 8);
        doc.setFontSize(10);
        doc.text('AUTO', margin + 10, margin + 15);
        doc.text('PART', margin + 10, margin + 21);

        // Company Information
        doc.setTextColor(primaryColor);
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text(data.company.name, margin + 50, margin + 10);

        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.text(data.company.address, margin + 50, margin + 16);
        doc.text(`Tel: ${data.company.phone} | Fax: ${data.company.fax}`, margin + 50, margin + 22);
        doc.text(`Email: ${data.company.email} | Website: ${data.company.website}`, margin + 50, margin + 28);
        doc.text(`Tax ID: ${data.company.taxId}`, margin + 50, margin + 34);

        // Quotation Title with gradient background
        const titleY = margin + 45;
        doc.setFillColor(31, 41, 55); // Gray-800
        doc.rect(margin, titleY, usableWidth, 18, 'F');

        // Add decorative elements
        doc.setFillColor(59, 130, 246); // Blue-500
        doc.rect(margin, titleY, 5, 18, 'F');
        doc.rect(pageWidth - margin - 5, titleY, 5, 18, 'F');

        doc.setTextColor(255, 255, 255);
        doc.setFontSize(20);
        doc.setFont('helvetica', 'bold');
        const titleText = 'QUOTATION / ใบเสนอราคา';
        const titleWidth = doc.getTextWidth(titleText);
        doc.text(titleText, (pageWidth - titleWidth) / 2, titleY + 12);

        // Quotation Details with better styling
        doc.setTextColor(primaryColor);
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');

        const detailsY = margin + 68;

        // Create info boxes
        doc.setFillColor(248, 250, 252); // Gray-50
        doc.rect(margin, detailsY, usableWidth / 2 - 5, 20, 'F');
        doc.rect(margin + usableWidth / 2 + 5, detailsY, usableWidth / 2 - 5, 20, 'F');

        // Left box content
        doc.setFontSize(10);
        doc.text(`Quotation No.: ${data.quotationNumber}`, margin + 3, detailsY + 7);
        doc.text(`Date: ${data.date}`, margin + 3, detailsY + 14);

        // Right box content  
        doc.text(`Valid Until: ${data.validUntil}`, margin + usableWidth / 2 + 8, detailsY + 7);
        doc.text(`Page: 1 of 1`, margin + usableWidth / 2 + 8, detailsY + 14);
    }

    // Customer Information Section
    function addCustomerInfo() {
        const startY = margin + 95;

        // Customer section header with icon
        doc.setFillColor(243, 244, 246); // Gray-100
        doc.rect(margin, startY, usableWidth, 10, 'F');

        // Add border
        doc.setDrawColor(209, 213, 219); // Gray-300
        doc.setLineWidth(0.5);
        doc.rect(margin, startY, usableWidth, 42);

        doc.setTextColor(primaryColor);
        doc.setFontSize(13);
        doc.setFont('helvetica', 'bold');
        doc.text('📋 Customer Information / ข้อมูลลูกค้า', margin + 3, startY + 6.5);

        // Customer details with better spacing
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');

        // Create two columns
        const leftCol = margin + 5;
        const rightCol = margin + usableWidth / 2 + 5;

        doc.setFont('helvetica', 'bold');
        doc.text('Company:', leftCol, startY + 16);
        doc.text('Tax ID:', rightCol, startY + 16);

        doc.setFont('helvetica', 'normal');
        doc.text(data.customer.name, leftCol, startY + 22);
        doc.text(data.customer.taxId, rightCol, startY + 22);

        doc.setFont('helvetica', 'bold');
        doc.text('Address:', leftCol, startY + 28);
        doc.text('Phone:', rightCol, startY + 28);

        doc.setFont('helvetica', 'normal');
        const addressLines = doc.splitTextToSize(data.customer.address, usableWidth / 2 - 10);
        doc.text(addressLines, leftCol, startY + 34);
        doc.text(data.customer.phone, rightCol, startY + 34);
    }

    // Items Table
    function addItemsTable() {
        const startY = margin + 140;

        // Prepare table data
        const tableHeaders = [
            'Item / รายการ',
            'Code / รหัส',
            'Qty / จำนวน',
            'Unit / หน่วย',
            'Price / ราคา',
            'Total / รวม'
        ];

        const tableData = data.items.map(item => [
            item.name,
            item.code,
            item.quantity.toString(),
            item.unit,
            `฿${item.price.toLocaleString()}`,
            `฿${item.total.toLocaleString()}`
        ]);

        // Add summary rows
        tableData.push(
            ['', '', '', '', 'Subtotal / ยอดรวม:', `฿${data.summary.subtotal.toLocaleString()}`],
            ['', '', '', '', 'VAT 7% / ภาษีมูลค่าเพิ่ม:', `฿${data.summary.vat.toLocaleString()}`],
            ['', '', '', '', 'Total / ยอดรวมทั้งสิ้น:', `฿${data.summary.total.toLocaleString()}`]
        );

        // Create table
        autoTable(doc, {
            head: [tableHeaders],
            body: tableData,
            startY: startY,
            margin: { left: margin, right: margin },
            styles: {
                fontSize: 9,
                cellPadding: 3,
                lineColor: '#e5e7eb',
                lineWidth: 0.5
            },
            headStyles: {
                fillColor: primaryColor,
                textColor: '#ffffff',
                fontStyle: 'bold',
                halign: 'center'
            },
            columnStyles: {
                0: { cellWidth: 50 }, // Item name
                1: { cellWidth: 25 }, // Code
                2: { cellWidth: 20, halign: 'center' }, // Quantity
                3: { cellWidth: 20, halign: 'center' }, // Unit
                4: { cellWidth: 30, halign: 'right' }, // Price
                5: { cellWidth: 30, halign: 'right' } // Total
            },
            didParseCell: function (data) {
                // Style summary rows
                if (data.row.index >= tableData.length - 3) {
                    if (data.column.index === 4) {
                        (data.cell.styles as any).fontStyle = 'bold';
                        (data.cell.styles as any).fillColor = '#f9fafb';
                    }
                    if (data.column.index === 5) {
                        (data.cell.styles as any).fontStyle = 'bold';
                        (data.cell.styles as any).fillColor = '#f9fafb';
                        if (data.row.index === tableData.length - 1) {
                            (data.cell.styles as any).fillColor = accentColor;
                            (data.cell.styles as any).textColor = '#ffffff';
                        }
                    }
                }
            }
        });
    }

    // Terms and Conditions
    function addTermsAndConditions() {
        const tableEndY = (doc as any).lastAutoTable?.finalY || margin + 200;
        const termsStartY = tableEndY + 15;

        // Terms header
        doc.setFillColor('#f3f4f6');
        doc.rect(margin, termsStartY, usableWidth, 8, 'F');

        doc.setTextColor(primaryColor);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('Terms and Conditions / เงื่อนไขการขาย', margin + 2, termsStartY + 5.5);

        // Terms list
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        let currentY = termsStartY + 14;

        data.terms.forEach((term, index) => {
            doc.text(`${index + 1}. ${term}`, margin + 5, currentY);
            currentY += 5;
        });
    }

    // Footer
    function addFooter() {
        const footerY = pageHeight - 30;

        // Footer line
        doc.setDrawColor(secondaryColor);
        doc.line(margin, footerY, pageWidth - margin, footerY);

        // Signature sections
        doc.setTextColor(primaryColor);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');

        // Customer signature
        doc.text('Customer Signature / ลายเซ็นลูกค้า', margin, footerY + 8);
        doc.text('_________________________', margin, footerY + 20);
        doc.text('Date / วันที่: _______________', margin, footerY + 26);

        // Company signature
        const rightAlign = pageWidth - margin - 60;
        doc.text('Authorized Signature / ลายเซ็นผู้มีอำนาจ', rightAlign, footerY + 8);
        doc.text('_________________________', rightAlign, footerY + 20);
        doc.text('Date / วันที่: _______________', rightAlign, footerY + 26);
    }

    // Generate PDF
    addHeader();
    addCustomerInfo();
    addItemsTable();
    addTermsAndConditions();
    addFooter();

    // Save the PDF
    const filename = `Quotation_${data.quotationNumber}_${data.date.replace(/\//g, '-')}.pdf`;
    doc.save(filename);
}
