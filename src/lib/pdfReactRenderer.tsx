import { Document, Font, Page, StyleSheet, Text, View, pdf } from '@react-pdf/renderer';
import React from 'react';

// Try to register Thai fonts, with fallback to built-in fonts
try {
    Font.register({
        family: 'Sarabun',
        fonts: [
            {
                src: 'https://fonts.gstatic.com/s/sarabun/v13/DtVjJx26TKEqsc-lWJRp7HfUpSo.ttf',
                fontWeight: 'normal',
            },
            {
                src: 'https://fonts.gstatic.com/s/sarabun/v13/DtVhJx26TKEqsc-lWJRRQzveRCq7TAg.ttf',
                fontWeight: 'bold',
            },
        ],
    });
} catch (error) {
    console.warn('Failed to load Sarabun font:', error);
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

// Styles
const styles = StyleSheet.create({
    page: {
        fontFamily: 'Helvetica',
        fontSize: 10,
        paddingTop: 20,
        paddingLeft: 20,
        paddingRight: 20,
        paddingBottom: 20,
        lineHeight: 1.5,
    },
    header: {
        backgroundColor: '#3b82f6',
        color: 'white',
        padding: 15,
        marginBottom: 20,
        borderRadius: 5,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    headerSubtitle: {
        fontSize: 14,
        marginBottom: 10,
    },
    companyInfo: {
        fontSize: 9,
        lineHeight: 1.3,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        marginBottom: 10,
        marginTop: 15,
    },
    row: {
        flexDirection: 'row',
        marginBottom: 10,
    },
    column: {
        flex: 1,
    },
    customerBox: {
        border: '1px solid #e5e7eb',
        padding: 10,
        marginBottom: 15,
        backgroundColor: '#f9fafb',
        borderRadius: 3,
    },
    quotationInfoBox: {
        border: '1px solid #e5e7eb',
        padding: 10,
        marginBottom: 15,
        backgroundColor: '#f3f4f6',
        borderRadius: 3,
        width: '40%',
    },
    table: {
        marginTop: 15,
        marginBottom: 15,
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: '#374151',
        color: 'white',
        padding: 8,
        fontWeight: 'bold',
        fontSize: 9,
    },
    tableRow: {
        flexDirection: 'row',
        borderBottom: '1px solid #e5e7eb',
        padding: 6,
        fontSize: 8,
    },
    tableRowEven: {
        backgroundColor: '#f9fafb',
    },
    col1: { width: '40%' }, // Item name
    col2: { width: '15%' }, // Code
    col3: { width: '10%', textAlign: 'center' }, // Qty
    col4: { width: '10%', textAlign: 'center' }, // Unit
    col5: { width: '12.5%', textAlign: 'right' }, // Price
    col6: { width: '12.5%', textAlign: 'right' }, // Total
    summaryRow: {
        flexDirection: 'row',
        padding: 6,
        fontWeight: 'bold',
        fontSize: 9,
    },
    summaryRowSubtotal: {
        backgroundColor: '#f3f4f6',
    },
    summaryRowVat: {
        backgroundColor: '#f3f4f6',
    },
    summaryRowTotal: {
        backgroundColor: '#3b82f6',
        color: 'white',
    },
    termsBox: {
        border: '1px solid #e5e7eb',
        padding: 10,
        marginTop: 15,
        backgroundColor: '#fefefe',
        borderRadius: 3,
    },
    termItem: {
        marginBottom: 4,
        fontSize: 9,
        lineHeight: 1.4,
    },
    signatureSection: {
        flexDirection: 'row',
        marginTop: 30,
        justifyContent: 'space-between',
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
    },
    center: {
        textAlign: 'center',
    },
    right: {
        textAlign: 'right',
    },
});

// Quotation PDF Document Component
export const QuotationDocument: React.FC<{ data: QuotationData }> = ({ data }) => (
    <Document>
        <Page size="A4" style={styles.page}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.row}>
                    <View style={styles.column}>
                        <Text style={styles.headerTitle}>{data.company.name}</Text>
                        <Text style={styles.companyInfo}>{data.company.address}</Text>
                        <Text style={styles.companyInfo}>
                            โทร: {data.company.phone} | แฟกซ์: {data.company.fax}
                        </Text>
                        <Text style={styles.companyInfo}>
                            อีเมล: {data.company.email} | เว็บไซต์: {data.company.website}
                        </Text>
                        <Text style={styles.companyInfo}>
                            เลขประจำตัวผู้เสียภาษี: {data.company.taxId}
                        </Text>
                    </View>
                    <View style={[styles.column, { alignItems: 'flex-end' }]}>
                        <Text style={styles.headerTitle}>ใบเสนอราคา</Text>
                        <Text style={styles.headerSubtitle}>QUOTATION</Text>
                    </View>
                </View>
            </View>

            {/* Customer and Quotation Info */}
            <View style={styles.row}>
                <View style={[styles.column, { marginRight: 10 }]}>
                    <Text style={styles.sectionTitle}>เรียน (To):</Text>
                    <View style={styles.customerBox}>
                        <Text style={[styles.bold, { marginBottom: 5 }]}>{data.customer.name}</Text>
                        <Text style={{ marginBottom: 3 }}>{data.customer.address}</Text>
                        <Text style={{ marginBottom: 3 }}>โทร: {data.customer.phone}</Text>
                        <Text>เลขประจำตัวผู้เสียภาษี: {data.customer.taxId}</Text>
                    </View>
                </View>

                <View style={styles.quotationInfoBox}>
                    <View style={{ marginBottom: 8 }}>
                        <Text style={styles.bold}>เลขที่ใบเสนอราคา:</Text>
                        <Text>{data.quotationNumber}</Text>
                    </View>
                    <View style={{ marginBottom: 8 }}>
                        <Text style={styles.bold}>วันที่:</Text>
                        <Text>{data.date}</Text>
                    </View>
                    <View>
                        <Text style={styles.bold}>ใบเสนอราคานี้มีอายุถึง:</Text>
                        <Text>{data.validUntil}</Text>
                    </View>
                </View>
            </View>

            {/* Items Table */}
            <View style={styles.table}>
                {/* Table Header */}
                <View style={styles.tableHeader}>
                    <Text style={styles.col1}>รายการ (Item)</Text>
                    <Text style={styles.col2}>รหัส (Code)</Text>
                    <Text style={styles.col3}>จำนวน (Qty)</Text>
                    <Text style={styles.col4}>หน่วย (Unit)</Text>
                    <Text style={styles.col5}>ราคา (Price)</Text>
                    <Text style={styles.col6}>รวม (Total)</Text>
                </View>

                {/* Table Rows */}
                {data.items.map((item, index) => (
                    <View
                        key={index}
                        style={[
                            styles.tableRow,
                            index % 2 === 0 ? styles.tableRowEven : {}
                        ]}
                    >
                        <Text style={styles.col1}>{item.name}</Text>
                        <Text style={styles.col2}>{item.code}</Text>
                        <Text style={styles.col3}>{item.quantity}</Text>
                        <Text style={styles.col4}>{item.unit}</Text>
                        <Text style={styles.col5}>฿{item.price.toLocaleString()}</Text>
                        <Text style={styles.col6}>฿{item.total.toLocaleString()}</Text>
                    </View>
                ))}

                {/* Summary Rows */}
                <View style={[styles.summaryRow, styles.summaryRowSubtotal]}>
                    <Text style={[styles.col1, styles.col2, styles.col3, styles.col4].reduce((a, b) => ({ ...a, ...b }), {})}>
                    </Text>
                    <Text style={styles.col5}>ยอดรวม (Subtotal):</Text>
                    <Text style={styles.col6}>฿{data.summary.subtotal.toLocaleString()}</Text>
                </View>

                <View style={[styles.summaryRow, styles.summaryRowVat]}>
                    <Text style={[styles.col1, styles.col2, styles.col3, styles.col4].reduce((a, b) => ({ ...a, ...b }), {})}>
                    </Text>
                    <Text style={styles.col5}>ภาษีมูลค่าเพิ่ม 7% (VAT):</Text>
                    <Text style={styles.col6}>฿{data.summary.vat.toLocaleString()}</Text>
                </View>

                <View style={[styles.summaryRow, styles.summaryRowTotal]}>
                    <Text style={[styles.col1, styles.col2, styles.col3, styles.col4].reduce((a, b) => ({ ...a, ...b }), {})}>
                    </Text>
                    <Text style={styles.col5}>ยอดรวมทั้งสิ้น (Total):</Text>
                    <Text style={styles.col6}>฿{data.summary.total.toLocaleString()}</Text>
                </View>
            </View>

            {/* Terms and Conditions */}
            <Text style={styles.sectionTitle}>เงื่อนไขและข้อตกลง (Terms and Conditions):</Text>
            <View style={styles.termsBox}>
                {data.terms.map((term, index) => (
                    <Text key={index} style={styles.termItem}>
                        {index + 1}. {term}
                    </Text>
                ))}
            </View>

            {/* Signature Section */}
            <View style={styles.signatureSection}>
                <View style={styles.signatureBox}>
                    <Text style={styles.bold}>ลายเซ็นลูกค้า</Text>
                    <Text>(Customer Signature)</Text>
                    <View style={styles.signatureLine}></View>
                    <Text>วันที่ (Date): _______________</Text>
                </View>

                <View style={styles.signatureBox}>
                    <Text style={styles.bold}>ลายเซ็นผู้เสนอราคา</Text>
                    <Text>(Authorized Signature)</Text>
                    <View style={styles.signatureLine}></View>
                    <Text>วันที่ (Date): _______________</Text>
                </View>
            </View>
        </Page>
    </Document>
);

// Function to generate and download PDF
export async function generateQuotationPDF(data: QuotationData): Promise<void> {
    try {
        const blob = await pdf(<QuotationDocument data={data} />).toBlob();
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `quotation-${data.quotationNumber}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Error generating PDF:', error);
        alert('เกิดข้อผิดพลาดในการสร้าง PDF กรุณาลองใหม่อีกครั้ง');
    }
}
