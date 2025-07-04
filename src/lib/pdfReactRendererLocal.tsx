import { Document, Font, Page, StyleSheet, Text, View, pdf } from '@react-pdf/renderer';
import React from 'react';

// Register local Thai fonts
Font.register({
    family: 'NotoSansThai',
    fonts: [
        {
            src: '/fonts/NotoSansThai-Regular.ttf',
            fontWeight: 'normal',
        },
        {
            src: '/fonts/NotoSansThai-Regular.ttf', // Use regular font for bold as well for now
            fontWeight: 'bold',
        },
    ],
});

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

// Styles with Thai font support
const styles = StyleSheet.create({
    page: {
        fontFamily: 'NotoSansThai',
        fontSize: 10,
        paddingTop: 15,
        paddingLeft: 20,
        paddingRight: 20,
        paddingBottom: 15,
        lineHeight: 1.4,
    },
    header: {
        backgroundColor: '#3b82f6',
        color: 'white',
        padding: 8,
        marginBottom: 8,
        borderRadius: 5,
    },
    headerTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 2,
        fontFamily: 'NotoSansThai',
    },
    headerSubtitle: {
        fontSize: 12,
        marginBottom: 3,
        fontFamily: 'NotoSansThai',
    },
    companyInfo: {
        fontSize: 8,
        lineHeight: 1.1,
        fontFamily: 'NotoSansThai',
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        marginBottom: 6,
        marginTop: 8,
        fontFamily: 'NotoSansThai',
    },
    row: {
        flexDirection: 'row',
        marginBottom: 6,
    },
    column: {
        flex: 1,
    },
    customerBox: {
        border: '1px solid #e5e7eb',
        padding: 8,
        marginBottom: 6,
        backgroundColor: '#f9fafb',
        borderRadius: 3,
        flex: 1,
        marginRight: 8,
    },
    quotationInfoBox: {
        border: '1px solid #e5e7eb',
        padding: 8,
        marginBottom: 6,
        backgroundColor: '#f3f4f6',
        borderRadius: 3,
        width: '35%',
    },
    table: {
        marginTop: 6,
        marginBottom: 6,
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: '#374151',
        color: 'white',
        padding: 6,
        fontWeight: 'bold',
        fontSize: 9,
        fontFamily: 'NotoSansThai',
    },
    tableRow: {
        flexDirection: 'row',
        borderBottom: '1px solid #e5e7eb',
        padding: 4,
        fontSize: 8,
        fontFamily: 'NotoSansThai',
    },
    tableRowEven: {
        backgroundColor: '#f9fafb',
    },
    col1: { width: '40%' },
    col2: { width: '15%' },
    col3: { width: '10%', textAlign: 'center' },
    col4: { width: '10%', textAlign: 'center' },
    col5: { width: '12.5%', textAlign: 'right' },
    col6: { width: '12.5%', textAlign: 'right' },
    summaryRow: {
        flexDirection: 'row',
        padding: 6,
        fontSize: 10,
        fontFamily: 'NotoSansThai',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    summaryLabel: {
        fontSize: 10,
        fontFamily: 'NotoSansThai',
        flex: 1,
    },
    summaryValue: {
        fontSize: 10,
        fontFamily: 'NotoSansThai',
        textAlign: 'right',
        fontWeight: 'bold',
    },
    summaryRowSubtotal: {
        backgroundColor: '#f3f4f6',
        borderBottom: '1px solid #e5e7eb',
    },
    summaryRowVat: {
        backgroundColor: '#f3f4f6',
        borderBottom: '1px solid #e5e7eb',
    },
    summaryRowTotal: {
        backgroundColor: '#3b82f6',
        color: 'white',
        fontWeight: 'bold',
    },
    termsBox: {
        border: '1px solid #e5e7eb',
        padding: 6,
        marginTop: 6,
        backgroundColor: '#fefefe',
        borderRadius: 3,
    },
    termsTitle: {
        fontSize: 10,
        fontWeight: 'bold',
        marginBottom: 5,
        marginTop: 0,
        fontFamily: 'NotoSansThai',
    },
    termsColumns: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    termsColumn: {
        width: '48%',
    },
    termItem: {
        marginBottom: 2,
        fontSize: 7,
        lineHeight: 1.2,
        fontFamily: 'NotoSansThai',
        fontWeight: 'normal',
    },
    summaryContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 6,
        marginBottom: 6,
    },
    summaryTable: {
        width: '45%',
        border: '1px solid #e5e7eb',
        borderRadius: 3,
    },
    signatureSection: {
        display: 'none',
    },
    signatureBox: {
        width: '40%',
        textAlign: 'center',
    },
    signatureLine: {
        borderBottom: '1px solid #000',
        marginTop: 20,
        marginBottom: 10,
        height: 1,
    },
    bold: {
        fontWeight: 'bold',
        fontFamily: 'NotoSansThai',
    },
    center: {
        textAlign: 'center',
    },
    right: {
        textAlign: 'right',
    },
    thaiText: {
        fontFamily: 'NotoSansThai',
    },
});

// Helper function to format numbers
const formatNumber = (value: number, decimals: number = 2): string => {
    return value.toLocaleString('th-TH', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    });
};

// Helper function to format quantity (no decimals, but with commas)
const formatQuantity = (value: number): string => {
    return value.toLocaleString('th-TH');
};

// Thai text wrapper
const ThaiText = ({ children, style }: { children: React.ReactNode; style?: any }) => (
    <Text style={style ? [styles.thaiText, style] : styles.thaiText}>{children}</Text>
);

// Quotation PDF Document Component with local Thai fonts
export const QuotationDocument: React.FC<{ data: QuotationData }> = ({ data }) => (
    <Document>
        <Page size="A4" style={styles.page}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.row}>
                    <View style={styles.column}>
                        <ThaiText style={styles.headerTitle}>ใบเสนอราคา / QUOTATION</ThaiText>
                        <ThaiText style={styles.headerSubtitle}>{data.company.name}</ThaiText>
                        <ThaiText style={styles.companyInfo}>
                            {`${data.company.address}\nโทร: ${data.company.phone} | แฟกซ์: ${data.company.fax}\nอีเมล: ${data.company.email} | เว็บไซต์: ${data.company.website}\nเลขประจำตัวผู้เสียภาษี: ${data.company.taxId}`}
                        </ThaiText>
                    </View>
                </View>
            </View>

            {/* Customer and Quotation Info */}
            <View style={styles.row}>
                <View style={styles.customerBox}>
                    <ThaiText style={[styles.sectionTitle, { marginTop: 0 }]}>ข้อมูลลูกค้า / Customer Information</ThaiText>
                    <ThaiText style={styles.bold}>{data.customer.name}</ThaiText>
                    <ThaiText>{data.customer.address}</ThaiText>
                    <ThaiText>โทร: {data.customer.phone}</ThaiText>
                    <ThaiText>เลขประจำตัวผู้เสียภาษี: {data.customer.taxId}</ThaiText>
                </View>
                <View style={styles.quotationInfoBox}>
                    <ThaiText style={[styles.sectionTitle, { marginTop: 0 }]}>รายละเอียดใบเสนอราคา</ThaiText>
                    <ThaiText>เลขที่: {data.quotationNumber}</ThaiText>
                    <ThaiText>วันที่: {data.date}</ThaiText>
                    <ThaiText>ใช้ได้ถึง: {data.validUntil}</ThaiText>
                </View>
            </View>

            {/* Items Table */}
            <View style={styles.table}>
                <View style={styles.tableHeader}>
                    <ThaiText style={styles.col1}>รายการสินค้า</ThaiText>
                    <ThaiText style={styles.col2}>รหัสสินค้า</ThaiText>
                    <ThaiText style={styles.col3}>จำนวน</ThaiText>
                    <ThaiText style={styles.col4}>หน่วย</ThaiText>
                    <ThaiText style={styles.col5}>ราคาต่อหน่วย</ThaiText>
                    <ThaiText style={styles.col6}>ราคารวม</ThaiText>
                </View>
                {data.items.map((item, index) => (
                    <View key={index} style={[styles.tableRow, index % 2 === 0 ? styles.tableRowEven : {}]}>
                        <ThaiText style={styles.col1}>{item.name}</ThaiText>
                        <ThaiText style={styles.col2}>{item.code}</ThaiText>
                        <ThaiText style={styles.col3}>{formatQuantity(item.quantity)}</ThaiText>
                        <ThaiText style={styles.col4}>{item.unit}</ThaiText>
                        <ThaiText style={styles.col5}>{formatNumber(item.price)}</ThaiText>
                        <ThaiText style={styles.col6}>{formatNumber(item.total)}</ThaiText>
                    </View>
                ))}
            </View>

            {/* Summary */}
            <View style={styles.summaryContainer}>
                <View style={styles.summaryTable}>
                    <View style={[styles.summaryRow, styles.summaryRowSubtotal]}>
                        <ThaiText style={styles.summaryLabel}>ราคาสินค้ารวม:</ThaiText>
                        <ThaiText style={styles.summaryValue}>{formatNumber(data.summary.subtotal)} บาท</ThaiText>
                    </View>
                    <View style={[styles.summaryRow, styles.summaryRowVat]}>
                        <ThaiText style={styles.summaryLabel}>ภาษีมูลค่าเพิ่ม 7%:</ThaiText>
                        <ThaiText style={styles.summaryValue}>{formatNumber(data.summary.vat)} บาท</ThaiText>
                    </View>
                    <View style={[styles.summaryRow, styles.summaryRowTotal]}>
                        <ThaiText style={[styles.summaryLabel, { color: 'white' }]}>ราคารวมทั้งสิ้น:</ThaiText>
                        <ThaiText style={[styles.summaryValue, { color: 'white' }]}>{formatNumber(data.summary.total)} บาท</ThaiText>
                    </View>
                </View>
            </View>

            {/* Terms and Conditions */}
            <View style={styles.termsBox}>
                <ThaiText style={styles.termsTitle}>เงื่อนไขและข้อตกลง</ThaiText>
                <View style={styles.termsColumns}>
                    <View style={styles.termsColumn}>
                        {data.terms.slice(0, Math.ceil(data.terms.length / 2)).map((term, index) => (
                            <ThaiText key={index} style={styles.termItem}>
                                {(index + 1).toString()}. {term}
                            </ThaiText>
                        ))}
                    </View>
                    <View style={styles.termsColumn}>
                        {data.terms.slice(Math.ceil(data.terms.length / 2)).map((term, index) => (
                            <ThaiText key={index} style={styles.termItem}>
                                {(Math.ceil(data.terms.length / 2) + index + 1).toString()}. {term}
                            </ThaiText>
                        ))}
                    </View>
                </View>
            </View>
        </Page>
    </Document>
);

// Generate and download PDF
export const generateQuotationPDF = async (data: QuotationData) => {
    try {
        const doc = <QuotationDocument data={data} />;
        const pdfBuffer = await pdf(doc).toBlob();

        const url = URL.createObjectURL(pdfBuffer);
        const link = document.createElement('a');
        link.href = url;
        link.download = `quotation-${data.quotationNumber}.pdf`;
        link.click();
        URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Error generating PDF:', error);
        alert('เกิดข้อผิดพลาดในการสร้าง PDF');
    }
};

// Generate and display PDF in new tab
export const previewQuotationPDF = async (data: QuotationData) => {
    try {
        const doc = <QuotationDocument data={data} />;
        const pdfBuffer = await pdf(doc).toBlob();

        const url = URL.createObjectURL(pdfBuffer);
        const newWindow = window.open(url, '_blank');

        if (newWindow) {
            newWindow.onload = () => {
                URL.revokeObjectURL(url);
            };
        } else {
            // Fallback if popup blocked
            const link = document.createElement('a');
            link.href = url;
            link.target = '_blank';
            link.click();
            URL.revokeObjectURL(url);
        }
    } catch (error) {
        console.error('Error previewing PDF:', error);
        alert('เกิดข้อผิดพลาดในการแสดง PDF');
    }
};
