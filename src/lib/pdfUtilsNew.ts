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

// Manual Thai text support using character mapping
const thaiCharMap: { [key: string]: string } = {
    'ก': 'g', 'ข': 'k', 'ค': 'K', 'ง': 'G', 'จ': 'j', 'ฉ': 'c', 'ช': 'C', 'ซ': 's',
    'ญ': 'y', 'ด': 'd', 'ต': 't', 'ถ': 'T', 'ท': 'th', 'ธ': 'TH', 'น': 'n', 'บ': 'b',
    'ป': 'p', 'ผ': 'ph', 'ฝ': 'f', 'พ': 'P', 'ฟ': 'F', 'ภ': 'PH', 'ม': 'm', 'ย': 'Y',
    'ร': 'r', 'ล': 'l', 'ว': 'w', 'ศ': 'sh', 'ษ': 'SH', 'ส': 'S', 'ห': 'h', 'ฬ': 'lh',
    'อ': 'x', 'ฮ': 'H', 'ะ': 'a', 'า': 'aa', 'ิ': 'i', 'ี': 'ii', 'ึ': 'ue', 'ื': 'uue',
    'ุ': 'u', 'ู': 'uu', 'เ': 'e', 'แ': 'ae', 'โ': 'o', 'ใ': 'ai', 'ไ': 'ay', '่': '1',
    '้': '2', '๊': '3', '๋': '4', 'ํ': '6', '็': '7', '๏': '9', '๎': '0',
    'ๆ': 'R', '฿': 'B', 'ฯ': 'Z'
};

function convertThaiToRoman(thaiText: string): string {
    let romanText = '';
    for (let i = 0; i < thaiText.length; i++) {
        const char = thaiText[i];
        if (thaiCharMap[char]) {
            romanText += thaiCharMap[char];
        } else if (char >= 'A' && char <= 'Z' || char >= 'a' && char <= 'z' || char >= '0' && char <= '9') {
            romanText += char;
        } else {
            romanText += char; // Keep punctuation and spaces
        }
    }
    return romanText;
}

// Simple approach: Create a clean, structured PDF using only ASCII-safe text
export function generateQuotationPDF(data: QuotationData): void {
    const doc = new jsPDF('p', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const margin = 20;
    const usableWidth = pageWidth - 2 * margin;

    let currentY = margin;

    // Colors
    const primaryBlue = [59, 130, 246];
    const darkGray = [55, 65, 81];
    const lightGray = [243, 244, 246];

    // Helper functions
    function setColor(color: number[]) {
        doc.setTextColor(color[0], color[1], color[2]);
    }

    function setFillColor(color: number[]) {
        doc.setFillColor(color[0], color[1], color[2]);
    }

    function drawBox(x: number, y: number, width: number, height: number, fillColor?: number[], borderColor?: number[]) {
        if (fillColor) {
            setFillColor(fillColor);
            doc.rect(x, y, width, height, 'F');
        }
        if (borderColor) {
            doc.setDrawColor(borderColor[0], borderColor[1], borderColor[2]);
            doc.setLineWidth(0.5);
            doc.rect(x, y, width, height);
        }
    }

    function addText(text: string, x: number, y: number, options: {
        size?: number;
        style?: 'normal' | 'bold';
        align?: 'left' | 'center' | 'right';
        color?: number[];
        maxWidth?: number;
    } = {}) {
        doc.setFontSize(options.size || 10);
        doc.setFont('helvetica', options.style || 'normal');

        if (options.color) {
            setColor(options.color);
        } else {
            setColor([0, 0, 0]);
        }

        if (options.maxWidth) {
            const lines = doc.splitTextToSize(text, options.maxWidth);
            doc.text(lines, x, y, { align: options.align || 'left' });
            return lines.length * (options.size || 10) * 0.35;
        } else {
            doc.text(text, x, y, { align: options.align || 'left' });
            return (options.size || 10) * 0.35;
        }
    }

    // Header Section
    function addHeader() {
        // Header background
        drawBox(margin, currentY, usableWidth, 25, primaryBlue);

        // Company name
        addText(data.company.name, margin + 5, currentY + 8, {
            size: 16,
            style: 'bold',
            color: [255, 255, 255]
        });

        // Title
        addText('QUOTATION', pageWidth - margin - 5, currentY + 8, {
            size: 14,
            style: 'bold',
            color: [255, 255, 255],
            align: 'right'
        });

        addText('Bai Sanea Rakha', pageWidth - margin - 5, currentY + 14, {
            size: 10,
            color: [255, 255, 255],
            align: 'right'
        });

        // Company details
        addText(data.company.address, margin + 5, currentY + 16, {
            size: 9,
            color: [255, 255, 255]
        });

        addText(`Tel: ${data.company.phone} | Email: ${data.company.email}`, margin + 5, currentY + 20, {
            size: 9,
            color: [255, 255, 255]
        });

        currentY += 30;
    }

    // Document info section
    function addDocumentInfo() {
        currentY += 5;

        // Left side - Customer info
        addText('TO / Riian:', margin, currentY, {
            size: 12,
            style: 'bold'
        });
        currentY += 7;

        // Customer info box
        drawBox(margin, currentY, usableWidth * 0.65, 35, lightGray, [200, 200, 200]);

        addText(data.customer.name, margin + 3, currentY + 6, {
            size: 11,
            style: 'bold'
        });

        addText(data.customer.address, margin + 3, currentY + 12, {
            size: 9,
            maxWidth: usableWidth * 0.6
        });

        addText(`Phone / Torasap: ${data.customer.phone}`, margin + 3, currentY + 22, {
            size: 9
        });

        addText(`Tax ID / Lek Prajam Tua Phu Siia Phasi: ${data.customer.taxId}`, margin + 3, currentY + 28, {
            size: 9
        });

        // Right side - Quotation details
        const rightX = margin + usableWidth * 0.7;
        const rightWidth = usableWidth * 0.3;

        drawBox(rightX, currentY, rightWidth, 35, [250, 250, 250], [200, 200, 200]);

        addText('Quotation No. / Lek Thi:', rightX + 3, currentY + 6, {
            size: 9,
            style: 'bold'
        });
        addText(data.quotationNumber, rightX + 3, currentY + 11, {
            size: 9
        });

        addText('Date / Wan Thi:', rightX + 3, currentY + 18, {
            size: 9,
            style: 'bold'
        });
        addText(data.date, rightX + 3, currentY + 23, {
            size: 9
        });

        addText('Valid Until / Mi Ayu Theung:', rightX + 3, currentY + 30, {
            size: 8,
            style: 'bold'
        });
        addText(data.validUntil, rightX + 3, currentY + 35, {
            size: 8
        });

        currentY += 45;
    }

    // Items table
    function addItemsTable() {
        const tableStartY = currentY;
        const rowHeight = 7;
        const headerHeight = 9;

        // Column definitions
        const columns = [
            { title: 'Item / Raiikan', width: 70, align: 'left' },
            { title: 'Code / Rahat', width: 25, align: 'center' },
            { title: 'Qty / Jamnuan', width: 20, align: 'center' },
            { title: 'Unit / Hnuai', width: 20, align: 'center' },
            { title: 'Price / Rakha', width: 25, align: 'right' },
            { title: 'Total / Ruam', width: 25, align: 'right' }
        ];

        let colX = margin;

        // Table header
        drawBox(margin, currentY, usableWidth, headerHeight, darkGray);

        columns.forEach(col => {
            addText(col.title, colX + (col.align === 'center' ? col.width / 2 : col.align === 'right' ? col.width - 2 : 2), currentY + 6, {
                size: 8,
                style: 'bold',
                color: [255, 255, 255],
                align: col.align as any
            });
            colX += col.width;
        });

        currentY += headerHeight;

        // Table rows
        data.items.forEach((item, index) => {
            // Alternate row colors
            if (index % 2 === 0) {
                drawBox(margin, currentY, usableWidth, rowHeight, [249, 250, 251]);
            }

            // Row border
            drawBox(margin, currentY, usableWidth, rowHeight, undefined, [220, 220, 220]);

            colX = margin;
            const rowData = [
                item.name,
                item.code,
                item.quantity.toString(),
                item.unit,
                `${item.price.toLocaleString()}`,
                `${item.total.toLocaleString()}`
            ];

            columns.forEach((col, colIndex) => {
                const textX = colX + (col.align === 'center' ? col.width / 2 : col.align === 'right' ? col.width - 2 : 2);
                addText(rowData[colIndex], textX, currentY + 5, {
                    size: 8,
                    align: col.align as any
                });
                colX += col.width;
            });

            currentY += rowHeight;
        });

        // Summary section
        const summaryRows = [
            { label: 'Subtotal / Yot Ruam:', value: data.summary.subtotal, bgColor: lightGray },
            { label: 'VAT 7% / Phasi Mun Kha Phoem:', value: data.summary.vat, bgColor: lightGray },
            { label: 'Total / Yot Ruam Thang Sin:', value: data.summary.total, bgColor: primaryBlue }
        ];

        summaryRows.forEach((row, index) => {
            const isTotal = index === summaryRows.length - 1;
            drawBox(margin, currentY, usableWidth, rowHeight, row.bgColor);

            const labelX = margin + usableWidth - 50;
            const valueX = margin + usableWidth - 2;

            addText(row.label, labelX, currentY + 5, {
                size: 9,
                style: 'bold',
                color: isTotal ? [255, 255, 255] : [0, 0, 0]
            });

            addText(`${row.value.toLocaleString()}`, valueX, currentY + 5, {
                size: 9,
                style: 'bold',
                color: isTotal ? [255, 255, 255] : [0, 0, 0],
                align: 'right'
            });

            currentY += rowHeight;
        });

        currentY += 10;
    }

    // Terms and conditions
    function addTerms() {
        addText('Terms and Conditions / Ngeuankhai Lae Kho Toklong:', margin, currentY, {
            size: 12,
            style: 'bold'
        });
        currentY += 8;

        // Terms box
        const termsHeight = data.terms.length * 5 + 10;
        drawBox(margin, currentY, usableWidth, termsHeight, [252, 252, 252], [200, 200, 200]);

        data.terms.forEach((term, index) => {
            addText(`${index + 1}. ${term}`, margin + 3, currentY + 6 + (index * 5), {
                size: 8,
                maxWidth: usableWidth - 6
            });
        });

        currentY += termsHeight + 10;
    }

    // Signature section
    function addSignature() {
        const signatureY = currentY;

        // Customer signature
        addText('Customer Signature', margin + 30, signatureY, {
            size: 10,
            style: 'bold',
            align: 'center'
        });
        addText('Lai Sen Luk Kha', margin + 30, signatureY + 5, {
            size: 8,
            align: 'center'
        });

        // Signature line
        doc.setDrawColor(0, 0, 0);
        doc.setLineWidth(0.5);
        doc.line(margin + 5, signatureY + 20, margin + 55, signatureY + 20);

        addText('Date / Wan Thi: ________________', margin, signatureY + 30, {
            size: 8
        });

        // Company signature
        const companyX = margin + usableWidth - 60;
        addText('Authorized Signature', companyX + 30, signatureY, {
            size: 10,
            style: 'bold',
            align: 'center'
        });
        addText('Lai Sen Phu Mi Amnat', companyX + 30, signatureY + 5, {
            size: 8,
            align: 'center'
        });

        doc.line(companyX + 5, signatureY + 20, companyX + 55, signatureY + 20);

        addText('Date / Wan Thi: ________________', companyX, signatureY + 30, {
            size: 8
        });
    }

    // Generate PDF
    try {
        addHeader();
        addDocumentInfo();
        addItemsTable();
        addTerms();
        addSignature();

        // Save the PDF
        doc.save(`quotation-${data.quotationNumber}.pdf`);

    } catch (error) {
        console.error('Error generating PDF:', error);
        alert('Error generating PDF. Please try again.');
    }
}
