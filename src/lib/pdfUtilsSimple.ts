import jsPDF from 'jspdf';

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

    // Set font that works better with Thai (even if not perfect)
    doc.setFont('helvetica', 'normal');

    // Colors
    const primaryColor = [31, 41, 55]; // Gray-800
    const accentColor = [59, 130, 246]; // Blue-500

    let currentY = margin;

    // Helper function to add text with better Thai support
    function addText(text: string, x: number, y: number, options: {
        fontSize?: number;
        fontStyle?: 'normal' | 'bold';
        color?: number[];
        align?: 'left' | 'center' | 'right';
        maxWidth?: number;
    } = {}) {
        doc.setFontSize(options.fontSize || 10);
        doc.setFont('helvetica', options.fontStyle || 'normal');

        if (options.color) {
            doc.setTextColor(options.color[0], options.color[1], options.color[2]);
        } else {
            doc.setTextColor(0, 0, 0);
        }

        if (options.maxWidth) {
            const lines = doc.splitTextToSize(text, options.maxWidth);
            doc.text(lines, x, y, { align: options.align || 'left' });
            return lines.length * (options.fontSize || 10) * 0.35; // Return height used
        } else {
            doc.text(text, x, y, { align: options.align || 'left' });
            return (options.fontSize || 10) * 0.35; // Return height used
        }
    }

    // Header Section
    function addHeader() {
        // Company header background
        doc.setFillColor(59, 130, 246);
        doc.rect(margin, currentY, usableWidth, 30, 'F');

        // Company name and title
        addText(data.company.name, margin + 5, currentY + 8, {
            fontSize: 16,
            fontStyle: 'bold',
            color: [255, 255, 255]
        });

        addText('QUOTATION / ใบเสนอราคา', pageWidth - margin - 5, currentY + 8, {
            fontSize: 14,
            fontStyle: 'bold',
            color: [255, 255, 255],
            align: 'right'
        });

        // Company details
        addText(data.company.address, margin + 5, currentY + 15, {
            fontSize: 9,
            color: [255, 255, 255],
            maxWidth: usableWidth * 0.6
        });

        addText(`Tel: ${data.company.phone} | Email: ${data.company.email}`, margin + 5, currentY + 22, {
            fontSize: 9,
            color: [255, 255, 255]
        });

        addText(`Tax ID: ${data.company.taxId}`, margin + 5, currentY + 26, {
            fontSize: 9,
            color: [255, 255, 255]
        });

        currentY += 40;
    }

    // Quotation info section
    function addQuotationInfo() {
        // Left side - Customer info
        addText('เรียน (To):', margin, currentY, {
            fontSize: 12,
            fontStyle: 'bold'
        });
        currentY += 7;

        addText(data.customer.name, margin, currentY, {
            fontSize: 10,
            fontStyle: 'bold'
        });
        currentY += 5;

        const addressHeight = addText(data.customer.address, margin, currentY, {
            fontSize: 9,
            maxWidth: usableWidth * 0.5
        });
        currentY += addressHeight + 2;

        addText(`Tel: ${data.customer.phone}`, margin, currentY, {
            fontSize: 9
        });
        currentY += 4;

        addText(`Tax ID: ${data.customer.taxId}`, margin, currentY, {
            fontSize: 9
        });

        // Right side - Quotation details
        const rightX = margin + usableWidth * 0.6;
        let rightY = currentY - 25;

        addText('เลขที่ใบเสนอราคา (Quotation No.):', rightX, rightY, {
            fontSize: 9,
            fontStyle: 'bold'
        });
        addText(data.quotationNumber, rightX, rightY + 4, {
            fontSize: 9
        });

        rightY += 10;
        addText('วันที่ (Date):', rightX, rightY, {
            fontSize: 9,
            fontStyle: 'bold'
        });
        addText(data.date, rightX, rightY + 4, {
            fontSize: 9
        });

        rightY += 10;
        addText('ใบเสนอราคานี้มีอายุถึง (Valid Until):', rightX, rightY, {
            fontSize: 9,
            fontStyle: 'bold'
        });
        addText(data.validUntil, rightX, rightY + 4, {
            fontSize: 9
        });

        currentY += 15;
    }

    // Items table (manual table creation for better Thai support)
    function addItemsTable() {
        const tableStartY = currentY;
        const rowHeight = 8;
        const colWidths = [80, 30, 20, 20, 30, 30]; // Column widths
        let colX = margin;

        // Table header
        doc.setFillColor(31, 41, 55);
        doc.rect(margin, currentY, usableWidth, rowHeight, 'F');

        const headers = ['รายการ (Item)', 'รหัส (Code)', 'จำนวน (Qty)', 'หน่วย (Unit)', 'ราคา (Price)', 'รวม (Total)'];

        colX = margin;
        for (let i = 0; i < headers.length; i++) {
            addText(headers[i], colX + 2, currentY + 5, {
                fontSize: 8,
                fontStyle: 'bold',
                color: [255, 255, 255]
            });
            colX += colWidths[i];
        }

        currentY += rowHeight;

        // Table rows
        data.items.forEach((item, index) => {
            // Alternate row colors
            if (index % 2 === 0) {
                doc.setFillColor(249, 250, 251);
                doc.rect(margin, currentY, usableWidth, rowHeight, 'F');
            }

            // Draw borders
            doc.setDrawColor(229, 231, 235);
            doc.setLineWidth(0.1);
            doc.rect(margin, currentY, usableWidth, rowHeight);

            const rowData = [
                item.name,
                item.code,
                item.quantity.toString(),
                item.unit,
                `฿${item.price.toLocaleString()}`,
                `฿${item.total.toLocaleString()}`
            ];

            colX = margin;
            for (let i = 0; i < rowData.length; i++) {
                const align = (i >= 2 && i <= 3) ? 'center' : (i >= 4) ? 'right' : 'left';
                const textX = align === 'center' ? colX + colWidths[i] / 2 :
                    align === 'right' ? colX + colWidths[i] - 2 : colX + 2;

                addText(rowData[i], textX, currentY + 5, {
                    fontSize: 8,
                    align: align as any
                });
                colX += colWidths[i];
            }

            currentY += rowHeight;
        });

        // Summary section
        const summaryRows = [
            ['', '', '', '', 'ยอดรวม (Subtotal):', `฿${data.summary.subtotal.toLocaleString()}`],
            ['', '', '', '', 'ภาษีมูลค่าเพิ่ม 7% (VAT):', `฿${data.summary.vat.toLocaleString()}`],
            ['', '', '', '', 'ยอดรวมทั้งสิ้น (Total):', `฿${data.summary.total.toLocaleString()}`]
        ];

        summaryRows.forEach((row, index) => {
            if (index === summaryRows.length - 1) {
                doc.setFillColor(59, 130, 246);
                doc.rect(margin, currentY, usableWidth, rowHeight, 'F');
            } else {
                doc.setFillColor(243, 244, 246);
                doc.rect(margin, currentY, usableWidth, rowHeight, 'F');
            }

            colX = margin;
            for (let i = 0; i < row.length; i++) {
                if (i >= 4) { // Only show last two columns
                    const isTotal = index === summaryRows.length - 1;
                    const textColor = isTotal ? [255, 255, 255] : [0, 0, 0];
                    const align = i === 5 ? 'right' : 'left';
                    const textX = align === 'right' ? colX + colWidths[i] - 2 : colX + 2;

                    addText(row[i], textX, currentY + 5, {
                        fontSize: 8,
                        fontStyle: 'bold',
                        color: textColor,
                        align: align as any
                    });
                }
                colX += colWidths[i];
            }

            currentY += rowHeight;
        });

        currentY += 10;
    }

    // Terms and conditions
    function addTerms() {
        addText('เงื่อนไขและข้อตกลง (Terms and Conditions):', margin, currentY, {
            fontSize: 12,
            fontStyle: 'bold'
        });
        currentY += 8;

        data.terms.forEach((term, index) => {
            addText(`${index + 1}. ${term}`, margin + 5, currentY, {
                fontSize: 9,
                maxWidth: usableWidth - 10
            });
            currentY += 6;
        });

        currentY += 10;
    }

    // Signature section
    function addSignature() {
        const signatureY = currentY;

        // Customer signature
        addText('ลายเซ็นลูกค้า (Customer Signature)', margin + 20, signatureY, {
            fontSize: 10,
            fontStyle: 'bold',
            align: 'center'
        });

        doc.setDrawColor(0, 0, 0);
        doc.line(margin, signatureY + 15, margin + 60, signatureY + 15);

        addText('วันที่ (Date): _______________', margin + 5, signatureY + 25, {
            fontSize: 9
        });

        // Company signature
        const companySignX = margin + usableWidth - 80;
        addText('ลายเซ็นผู้เสนอราคา (Quotation by)', companySignX + 20, signatureY, {
            fontSize: 10,
            fontStyle: 'bold',
            align: 'center'
        });

        doc.line(companySignX, signatureY + 15, companySignX + 60, signatureY + 15);

        addText('วันที่ (Date): _______________', companySignX + 5, signatureY + 25, {
            fontSize: 9
        });
    }

    // Generate PDF
    addHeader();
    addQuotationInfo();
    addItemsTable();
    addTerms();
    addSignature();

    // Save the PDF
    doc.save(`quotation-${data.quotationNumber}.pdf`);
}
