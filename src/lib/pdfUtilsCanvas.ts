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

// Helper function to render text to canvas and add to PDF
function addTextWithCanvas(
    doc: jsPDF,
    text: string,
    x: number,
    y: number,
    options: {
        fontSize?: number;
        fontWeight?: string;
        color?: string;
        maxWidth?: number;
        align?: 'left' | 'center' | 'right';
    } = {}
): number {
    // Create a temporary canvas to render Thai text
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return 0;

    const fontSize = options.fontSize || 12;
    const fontWeight = options.fontWeight || 'normal';
    const color = options.color || '#000000';

    // Set canvas size based on text
    canvas.width = options.maxWidth || 400;
    canvas.height = fontSize * 2;

    // Set font properties
    ctx.font = `${fontWeight} ${fontSize}px 'Sarabun', 'Noto Sans Thai', Arial, sans-serif`;
    ctx.fillStyle = color;
    ctx.textAlign = options.align || 'left';
    ctx.textBaseline = 'middle';

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Handle text wrapping if maxWidth is specified
    if (options.maxWidth) {
        const words = text.split(' ');
        const lines: string[] = [];
        let currentLine = '';

        for (const word of words) {
            const testLine = currentLine + (currentLine ? ' ' : '') + word;
            const metrics = ctx.measureText(testLine);

            if (metrics.width > options.maxWidth && currentLine) {
                lines.push(currentLine);
                currentLine = word;
            } else {
                currentLine = testLine;
            }
        }
        if (currentLine) {
            lines.push(currentLine);
        }

        // Adjust canvas height for multiple lines
        canvas.height = lines.length * fontSize * 1.5;
        ctx.font = `${fontWeight} ${fontSize}px 'Sarabun', 'Noto Sans Thai', Arial, sans-serif`;
        ctx.fillStyle = color;
        ctx.textAlign = options.align || 'left';

        // Draw each line
        lines.forEach((line, index) => {
            const lineY = (index + 0.5) * fontSize * 1.5;
            const lineX = options.align === 'center' ? canvas.width / 2 :
                options.align === 'right' ? canvas.width : 0;
            ctx.fillText(line, lineX, lineY);
        });

        // Convert canvas to image and add to PDF
        const imgData = canvas.toDataURL('image/png');
        const imgWidth = (canvas.width * 0.264583); // Convert pixels to mm
        const imgHeight = (canvas.height * 0.264583);

        doc.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight);

        return imgHeight; // Return height used
    } else {
        // Single line text
        const lineY = fontSize;
        const lineX = options.align === 'center' ? canvas.width / 2 :
            options.align === 'right' ? canvas.width : 0;
        ctx.fillText(text, lineX, lineY);

        const imgData = canvas.toDataURL('image/png');
        const imgWidth = (canvas.width * 0.264583);
        const imgHeight = (canvas.height * 0.264583);

        doc.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight);

        return imgHeight;
    }
}

export function generateQuotationPDF(data: QuotationData): void {
    // Create new PDF document
    const doc = new jsPDF('p', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.width;
    const margin = 20;
    const usableWidth = pageWidth - 2 * margin;

    let currentY = margin;

    // Header Section
    function addHeader() {
        // Background for header
        doc.setFillColor(59, 130, 246);
        doc.rect(margin, currentY, usableWidth, 25, 'F');

        // Company name (using regular PDF text for English)
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text(data.company.name, margin + 5, currentY + 8);

        // Title
        doc.setFontSize(14);
        doc.text('QUOTATION', pageWidth - margin - 5, currentY + 8, { align: 'right' });

        // Add Thai subtitle using canvas
        addTextWithCanvas(doc, 'ใบเสนอราคา', pageWidth - margin - 40, currentY + 12, {
            fontSize: 12,
            color: '#ffffff',
            align: 'right'
        });

        // Company details in English
        doc.setFontSize(9);
        doc.text(data.company.address, margin + 5, currentY + 15);
        doc.text(`Tel: ${data.company.phone} | Email: ${data.company.email}`, margin + 5, currentY + 19);
        doc.text(`Tax ID: ${data.company.taxId}`, margin + 5, currentY + 22);

        currentY += 35;
    }

    // Customer Info Section
    function addCustomerInfo() {
        // "To" label with Thai
        addTextWithCanvas(doc, 'เรียน (To):', margin, currentY, {
            fontSize: 12,
            fontWeight: 'bold'
        });
        currentY += 8;

        // Customer name with Thai support
        addTextWithCanvas(doc, data.customer.name, margin, currentY, {
            fontSize: 11,
            fontWeight: 'bold'
        });
        currentY += 6;

        // Address with Thai support
        const addressHeight = addTextWithCanvas(doc, data.customer.address, margin, currentY, {
            fontSize: 10,
            maxWidth: usableWidth * 0.5 * 3.779527 // Convert mm to pixels
        });
        currentY += addressHeight + 3;

        // Phone and Tax ID
        addTextWithCanvas(doc, `โทร: ${data.customer.phone}`, margin, currentY, {
            fontSize: 10
        });
        currentY += 6;

        addTextWithCanvas(doc, `เลขประจำตัวผู้เสียภาษี: ${data.customer.taxId}`, margin, currentY, {
            fontSize: 10
        });

        // Right side - Quotation details
        const rightX = margin + usableWidth * 0.6;
        let rightY = currentY - 25;

        addTextWithCanvas(doc, 'เลขที่ใบเสนอราคา:', rightX, rightY, {
            fontSize: 10,
            fontWeight: 'bold'
        });

        doc.setTextColor(0, 0, 0);
        doc.setFontSize(10);
        doc.text(data.quotationNumber, rightX, rightY + 5);

        rightY += 10;
        addTextWithCanvas(doc, 'วันที่:', rightX, rightY, {
            fontSize: 10,
            fontWeight: 'bold'
        });
        doc.text(data.date, rightX, rightY + 5);

        rightY += 10;
        addTextWithCanvas(doc, 'ใบเสนอราคานี้มีอายุถึง:', rightX, rightY, {
            fontSize: 10,
            fontWeight: 'bold'
        });
        doc.text(data.validUntil, rightX, rightY + 5);

        currentY += 15;
    }

    // Simple table without autoTable
    function addItemsTable() {
        const rowHeight = 8;
        const headerHeight = 10;

        // Table header background
        doc.setFillColor(31, 41, 55);
        doc.rect(margin, currentY, usableWidth, headerHeight, 'F');

        // Headers with Thai support
        const headers = [
            { text: 'รายการ', x: margin + 2, width: 60 },
            { text: 'รหัส', x: margin + 62, width: 25 },
            { text: 'จำนวน', x: margin + 87, width: 20 },
            { text: 'หน่วย', x: margin + 107, width: 20 },
            { text: 'ราคา', x: margin + 127, width: 30 },
            { text: 'รวม', x: margin + 157, width: 30 }
        ];

        headers.forEach(header => {
            addTextWithCanvas(doc, header.text, header.x, currentY + 2, {
                fontSize: 9,
                fontWeight: 'bold',
                color: '#ffffff'
            });
        });

        currentY += headerHeight;

        // Table rows
        data.items.forEach((item, index) => {
            // Alternate row colors
            if (index % 2 === 0) {
                doc.setFillColor(249, 250, 251);
                doc.rect(margin, currentY, usableWidth, rowHeight, 'F');
            }

            // Draw row border
            doc.setDrawColor(229, 231, 235);
            doc.setLineWidth(0.1);
            doc.rect(margin, currentY, usableWidth, rowHeight);

            // Row data with Thai support
            addTextWithCanvas(doc, item.name, margin + 2, currentY + 2, {
                fontSize: 8,
                maxWidth: 55 * 3.779527 // Convert to pixels
            });

            // English/numeric data
            doc.setTextColor(0, 0, 0);
            doc.setFontSize(8);
            doc.text(item.code, margin + 62, currentY + 5);
            doc.text(item.quantity.toString(), margin + 97, currentY + 5, { align: 'center' });

            addTextWithCanvas(doc, item.unit, margin + 107, currentY + 2, {
                fontSize: 8
            });

            doc.text(`฿${item.price.toLocaleString()}`, margin + 152, currentY + 5, { align: 'right' });
            doc.text(`฿${item.total.toLocaleString()}`, margin + 182, currentY + 5, { align: 'right' });

            currentY += rowHeight;
        });

        // Summary rows
        const summaryData = [
            { label: 'ยอดรวม:', value: data.summary.subtotal },
            { label: 'ภาษีมูลค่าเพิ่ม 7%:', value: data.summary.vat },
            { label: 'ยอดรวมทั้งสิ้น:', value: data.summary.total }
        ];

        summaryData.forEach((row, index) => {
            const isTotal = index === summaryData.length - 1;

            if (isTotal) {
                doc.setFillColor(59, 130, 246);
            } else {
                doc.setFillColor(243, 244, 246);
            }
            doc.rect(margin, currentY, usableWidth, rowHeight, 'F');

            const textColor = isTotal ? '#ffffff' : '#000000';

            addTextWithCanvas(doc, row.label, margin + 127, currentY + 2, {
                fontSize: 8,
                fontWeight: 'bold',
                color: textColor
            });

            if (isTotal) {
                doc.setTextColor(255, 255, 255);
            } else {
                doc.setTextColor(0, 0, 0);
            }
            doc.setFontSize(8);
            doc.setFont('helvetica', 'bold');
            doc.text(`฿${row.value.toLocaleString()}`, margin + 182, currentY + 5, { align: 'right' });

            currentY += rowHeight;
        });

        currentY += 10;
    }

    // Terms section
    function addTerms() {
        addTextWithCanvas(doc, 'เงื่อนไขและข้อตกลง:', margin, currentY, {
            fontSize: 12,
            fontWeight: 'bold'
        });
        currentY += 10;

        data.terms.forEach((term, index) => {
            const termHeight = addTextWithCanvas(doc, `${index + 1}. ${term}`, margin + 5, currentY, {
                fontSize: 9,
                maxWidth: (usableWidth - 10) * 3.779527
            });
            currentY += termHeight + 2;
        });

        currentY += 10;
    }

    // Signature section
    function addSignature() {
        addTextWithCanvas(doc, 'ลายเซ็นลูกค้า', margin + 30, currentY, {
            fontSize: 10,
            fontWeight: 'bold',
            align: 'center'
        });

        addTextWithCanvas(doc, 'ลายเซ็นผู้เสนอราคา', margin + usableWidth - 50, currentY, {
            fontSize: 10,
            fontWeight: 'bold',
            align: 'center'
        });

        // Signature lines
        doc.setDrawColor(0, 0, 0);
        doc.line(margin + 10, currentY + 15, margin + 70, currentY + 15);
        doc.line(margin + usableWidth - 70, currentY + 15, margin + usableWidth - 10, currentY + 15);

        // Date fields
        addTextWithCanvas(doc, 'วันที่: _______________', margin + 15, currentY + 25, {
            fontSize: 9
        });

        addTextWithCanvas(doc, 'วันที่: _______________', margin + usableWidth - 65, currentY + 25, {
            fontSize: 9
        });
    }

    // Generate the PDF
    try {
        addHeader();
        addCustomerInfo();
        addItemsTable();
        addTerms();
        addSignature();

        // Save the PDF
        doc.save(`quotation-${data.quotationNumber}.pdf`);
    } catch (error) {
        console.error('Error generating PDF:', error);
        alert('เกิดข้อผิดพลาดในการสร้าง PDF กรุณาลองใหม่อีกครั้ง');
    }
}
