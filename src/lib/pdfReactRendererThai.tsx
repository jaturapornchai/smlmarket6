import { Document, Font, Page, StyleSheet, Text, View, pdf } from '@react-pdf/renderer';
import React from 'react';

// Register Thai fonts with proper TTF sources
Font.register({
    family: 'NotoSansThai',
    fonts: [
        {
            src: 'https://fonts.gstatic.com/s/notosansthai/v20/iJWnBXeUZi_OHPqn4wq6hQ2_hbJ1xyN9wd43SofNWcd1MKVQt_So_9CdU5RtpzF-QRvzzXg.ttf',
            fontWeight: 'normal',
        },
        {
            src: 'https://fonts.gstatic.com/s/notosansthai/v20/iJWnBXeUZi_OHPqn4wq6hQ2_hbJ1xyN9wd43SofNWcd1MKVQt_So_9CdU5RtpzF-QRv5w3g.ttf',
            fontWeight: 'bold',
        },
    ],
});

// Alternative: Sarabun font
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

// Thai text wrapper to fix last character issue
const ThaiText = ({ children, style }: { children: React.ReactNode; style?: any }) => (
    <Text style={style}>{typeof children === 'string' ? children + ' ' : children}</Text>
);

// Styles with Thai font support
const styles = StyleSheet.create({
    page: {
        fontFamily: 'NotoSansThai',
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
        fontFamily: 'NotoSansThai',
    },
    headerSubtitle: {
        fontSize: 14,
        marginBottom: 10,
        fontFamily: 'NotoSansThai',
    },
    companyInfo: {
        fontSize: 9,
        lineHeight: 1.3,
        fontFamily: 'NotoSansThai',
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        marginBottom: 10,
        marginTop: 15,
        fontFamily: 'NotoSansThai',
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
        fontFamily: 'NotoSansThai',
    },
    tableRow: {
        flexDirection: 'row',
        borderBottom: '1px solid #e5e7eb',
        padding: 6,
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
        fontWeight: 'bold',
        fontSize: 9,
        fontFamily: 'NotoSansThai',
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
        fontFamily: 'NotoSansThai',
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

// Quotation PDF Document Component with Thai support
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
                            {data.company.address + '\n' +
                                'โทร: ' + data.company.phone + ' | แฟกซ์: ' + data.company.fax + '\n' +
                                'อีเมล: ' + data.company.email + ' | เว็บไซต์: ' + data.company.website + '\n' +
                                'เลขประจำตัวผู้เสียภาษี: ' + data.company.taxId}
                        </ThaiText>
                    </View>
                </View>
            </View>

            {/* Quotation Info */}
            <View style={styles.row}>
                <View style={styles.column}>
                    <View style={styles.customerBox}>
                        <ThaiText style={[styles.sectionTitle, { marginTop: 0 }]}>ข้อมูลลูกค้า / Customer Information</ThaiText>
                        <ThaiText style={styles.bold}>{data.customer.name}</ThaiText>
                        <ThaiText style={styles.thaiText}>{data.customer.address}</ThaiText>
                        <ThaiText style={styles.thaiText}>{`โทร: ${data.customer.phone}`}</ThaiText>
                        <ThaiText style={styles.thaiText}>{`เลขประจำตัวผู้เสียภาษี: ${data.customer.taxId}`}</ThaiText>
                    </View>
                </View>
                <View style={styles.quotationInfoBox}>
                    <ThaiText style={[styles.sectionTitle, { marginTop: 0 }]}>รายละเอียดใบเสนอราคา</ThaiText>
                    <ThaiText style={styles.thaiText}>{`เลขที่: ${data.quotationNumber}`}</ThaiText>
                    <ThaiText style={styles.thaiText}>{`วันที่: ${data.date}`}</ThaiText>
                    <ThaiText style={styles.thaiText}>{`ใช้ได้ถึง: ${data.validUntil}`}</ThaiText>
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
                        <ThaiText style={styles.col3}>{item.quantity.toString()}</ThaiText>
                        <ThaiText style={styles.col4}>{item.unit}</ThaiText>
                        <ThaiText style={styles.col5}>{item.price.toLocaleString('th-TH')}</ThaiText>
                        <ThaiText style={styles.col6}>{item.total.toLocaleString('th-TH')}</ThaiText>
                    </View>
                ))}
            </View>

            {/* Summary */}
            <View style={styles.table}>
                <View style={[styles.summaryRow, styles.summaryRowSubtotal]}>
                    <ThaiText style={[styles.col1, styles.col2, styles.col3, styles.col4, styles.col5].reduce((a, b) => ({ ...a, ...b }))}>
                        ราคาสินค้ารวม:
                    </ThaiText>
                    <ThaiText style={[styles.col6, styles.right]}>{`${data.summary.subtotal.toLocaleString('th-TH')} บาท`}</ThaiText>
                </View>
                <View style={[styles.summaryRow, styles.summaryRowVat]}>
                    <ThaiText style={[styles.col1, styles.col2, styles.col3, styles.col4, styles.col5].reduce((a, b) => ({ ...a, ...b }))}>
                        ภาษีมูลค่าเพิ่ม 7%:
                    </ThaiText>
                    <ThaiText style={[styles.col6, styles.right]}>{`${data.summary.vat.toLocaleString('th-TH')} บาท`}</ThaiText>
                </View>
                <View style={[styles.summaryRow, styles.summaryRowTotal]}>
                    <ThaiText style={[styles.col1, styles.col2, styles.col3, styles.col4, styles.col5].reduce((a, b) => ({ ...a, ...b }))}>
                        ราคารวมทั้งสิ้น:
                    </ThaiText>
                    <ThaiText style={[styles.col6, styles.right]}>{`${data.summary.total.toLocaleString('th-TH')} บาท`}</ThaiText>
                </View>
            </View>

            {/* Terms and Conditions */}
            <View style={styles.termsBox}>
                <ThaiText style={[styles.sectionTitle, { marginTop: 0 }]}>เงื่อนไขและข้อตกลง / Terms and Conditions</ThaiText>
                {data.terms.map((term, index) => (
                    <ThaiText key={index} style={styles.termItem}>
                        {`${(index + 1).toString()}. ${term}`}
                    </ThaiText>
                ))}
            </View>

            {/* Signature Section */}
            <View style={styles.signatureSection}>
                <View style={styles.signatureBox}>
                    <ThaiText style={styles.bold}>ลายเซ็นลูกค้า</ThaiText>
                    <Text style={styles.bold}>Customer Signature</Text>
                    <View style={styles.signatureLine} />
                    <ThaiText>วันที่: ........................</ThaiText>
                </View>
                <View style={styles.signatureBox}>
                    <ThaiText style={styles.bold}>ลายเซ็นผู้ขาย</ThaiText>
                    <Text style={styles.bold}>Seller Signature</Text>
                    <View style={styles.signatureLine} />
                    <ThaiText>วันที่: ........................</ThaiText>
                </View>
            </View>
        </Page>
    </Document>
);

// Generate and download PDF
export const generateQuotationPDF = async (data: QuotationData) => {
    const doc = <QuotationDocument data={data} />;
    const pdfBuffer = await pdf(doc).toBlob();

    const url = URL.createObjectURL(pdfBuffer);
    const link = document.createElement('a');
    link.href = url;
    link.download = `quotation-${data.quotationNumber}.pdf`;
    link.click();
    URL.revokeObjectURL(url);
};
