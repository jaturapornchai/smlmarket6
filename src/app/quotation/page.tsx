'use client';

import { useAuth } from '@/lib/authContext';
import { useCart } from '@/lib/firebaseHooks';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

// Sample customer data for random selection
const sampleCustomers = [
    {
        name: 'บริษัท โตโยต้าเซอร์วิส จำกัด',
        address: '123/45 ถนนรามคำแหง แขวงหัวหมาก เขตบางกะปิ กรุงเทพฯ 10240',
        phone: '02-123-4567',
        taxId: '0105537123456'
    },
    {
        name: 'ห้างหุ้นส่วนจำกัด ฮอนด้าออโต้พาร์ท',
        address: '456/78 ถนนลาดพร้าว แขวงจตุจักร เขตจตุจักร กรุงเทพฯ 10900',
        phone: '02-234-5678',
        taxId: '0105537234567'
    },
    {
        name: 'บริษัท นิสสันมอเตอร์ไทยแลนด์ จำกัด',
        address: '789/12 ถนนสุขุมวิท แขวงคลองตัน เขตคลองเตย กรุงเทพฯ 10110',
        phone: '02-345-6789',
        taxId: '0105537345678'
    },
    {
        name: 'บริษัท บีเอ็มดับเบิลยู ไทยแลนด์ จำกัด',
        address: '321/54 ถนนพระราม 4 แขวงคลองเตย เขตคลองเตย กรุงเทพฯ 10110',
        phone: '02-456-7890',
        taxId: '0105537456789'
    },
    {
        name: 'ห้างหุ้นส่วนจำกัด เมอร์เซเดส-เบนซ์ออโต้พาร์ท',
        address: '654/87 ถนนวิทยุ แขวงลุมพินี เขตปทุมวัน กรุงเทพฯ 10330',
        phone: '02-567-8901',
        taxId: '0105537567890'
    }
];

// Company information
const companyInfo = {
    name: 'บริษัท เอสเอ็มแอล ออโต้พาร์ท จำกัด',
    address: '123/456 ถนนงามวงศ์วาน แขวงทุ่งสองห้อง เขตหลักสี่ กรุงเทพฯ 10210',
    phone: '02-123-4567',
    fax: '02-123-4568',
    email: 'info@smlautopart.com',
    taxId: '0105537000123',
    website: 'www.smlautopart.com'
};

interface QuotationItem {
    no: number;
    description: string;
    quantity: number;
    unit: string;
    unitPrice: number;
    amount: number;
}

export default function QuotationPage() {
    const { user } = useAuth();
    const { cartItems, cartTotal } = useCart(user?.email || '');
    const router = useRouter();
    const [customer, setCustomer] = useState(sampleCustomers[0]);
    const [quotationNumber, setQuotationNumber] = useState('');
    const [quotationDate, setQuotationDate] = useState('');
    const [quotationItems, setQuotationItems] = useState<QuotationItem[]>([]);

    useEffect(() => {
        // Generate quotation number and date
        const now = new Date();
        const quotationNo = `QT${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}-${Math.random().toString().slice(2, 6)}`;
        const quotationDateStr = now.toLocaleDateString('th-TH', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        setQuotationNumber(quotationNo);
        setQuotationDate(quotationDateStr);

        // Select random customer
        const randomCustomer = sampleCustomers[Math.floor(Math.random() * sampleCustomers.length)];
        setCustomer(randomCustomer);

        // Convert cart items to quotation items
        const items: QuotationItem[] = cartItems.map((item, index) => ({
            no: index + 1,
            description: item.name,
            quantity: item.quantity,
            unit: item.unit,
            unitPrice: item.price,
            amount: item.price * item.quantity
        }));

        setQuotationItems(items);
    }, [cartItems]);

    const handlePrint = () => {
        window.print();
    };

    const handleBack = () => {
        router.back();
    };

    const vatAmount = cartTotal * 0.07; // 7% VAT
    const totalWithVat = cartTotal + vatAmount;

    return (
        <div className="min-h-screen bg-white">
            {/* Print styles */}
            <style jsx>{`
                @media print {
                    .no-print {
                        display: none !important;
                    }
                    .print-page {
                        width: 210mm;
                        min-height: 297mm;
                        margin: 0;
                        padding: 20mm;
                        box-shadow: none;
                    }
                    body {
                        margin: 0;
                        padding: 0;
                        background: white;
                    }
                    .print-text {
                        color: #000 !important;
                        font-weight: bold !important;
                        -webkit-print-color-adjust: exact !important;
                    }
                    .print-border {
                        border-color: #000 !important;
                        border-width: 2px !important;
                    }
                    .desktop-table {
                        display: table !important;
                    }
                    .mobile-card {
                        display: none !important;
                    }
                }
                
                /* Desktop: Show table, hide cards */
                @media (min-width: 769px) {
                    .desktop-table {
                        display: table !important;
                        width: 100% !important;
                    }
                    .desktop-table table {
                        width: 100% !important;
                        table-layout: fixed !important;
                    }
                    .mobile-card {
                        display: none !important;
                    }
                }
                
                /* Mobile: Hide table, show cards */
                @media (max-width: 768px) {
                    .desktop-table {
                        display: none !important;
                    }
                    .mobile-card {
                        display: block !important;
                    }
                    .quotation-header-mobile {
                        flex-direction: column !important;
                        text-align: center !important;
                    }
                    .quotation-info-mobile {
                        grid-template-columns: 1fr !important;
                        gap: 1rem !important;
                    }
                }
                
                .quotation-text {
                    color: #000 !important;
                    font-weight: 600 !important;
                    font-family: 'Sarabun', sans-serif !important;
                }
                .quotation-header {
                    color: #000 !important;
                    font-weight: 800 !important;
                    font-family: 'Sarabun', sans-serif !important;
                }
                .quotation-border {
                    border-color: #000 !important;
                    border-width: 2px !important;
                }
            `}</style>

            {/* Action buttons */}
            <div className="no-print bg-gray-50 p-4 border-b">
                <div className="max-w-4xl mx-auto flex justify-between items-center">
                    <button
                        onClick={handleBack}
                        className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                        </svg>
                        <span>กลับ</span>
                    </button>

                    <button
                        onClick={handlePrint}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                        </svg>
                        <span>พิมพ์</span>
                    </button>
                </div>
            </div>

            {/* Quotation Document */}
            <div className="max-w-4xl mx-auto bg-white print-page">
                <div className="p-4 md:p-8">
                    {/* Header */}
                    <div className="border-b-2 border-blue-600 pb-6 mb-6">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center quotation-header-mobile">
                            <div className="mb-4 md:mb-0">
                                <h1 className="text-2xl md:text-3xl font-bold text-blue-600 mb-2">{companyInfo.name}</h1>
                                <div className="text-xs md:text-sm text-black font-medium space-y-1">
                                    <p>{companyInfo.address}</p>
                                    <p>โทร: {companyInfo.phone} แฟกซ์: {companyInfo.fax}</p>
                                    <p>อีเมล: {companyInfo.email}</p>
                                    <p>เลขประจำตัวผู้เสียภาษี: {companyInfo.taxId}</p>
                                </div>
                            </div>
                            <div className="text-center md:text-right">
                                <h2 className="text-xl md:text-2xl font-bold text-black mb-2">ใบเสนอราคา</h2>
                                <p className="text-base md:text-lg font-bold text-black">QUOTATION</p>
                            </div>
                        </div>
                    </div>

                    {/* Quotation Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 mb-6 quotation-info-mobile">
                        <div>
                            <h3 className="font-bold text-black mb-2">เรียน (To):</h3>
                            <div className="text-sm text-black space-y-1">
                                <p className="font-bold">{customer.name}</p>
                                <p>{customer.address}</p>
                                <p>โทร: {customer.phone}</p>
                                <p>เลขประจำตัวผู้เสียภาษี: {customer.taxId}</p>
                            </div>
                        </div>
                        <div>
                            <div className="space-y-2 text-sm text-black">
                                <div className="flex justify-between">
                                    <span className="font-bold">เลขที่ใบเสนอราคา:</span>
                                    <span className="font-medium">{quotationNumber}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-bold">วันที่:</span>
                                    <span className="font-medium">{quotationDate}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-bold">ยืนราคา:</span>
                                    <span className="font-medium">30 วัน</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-bold">เงื่อนไขการชำระ:</span>
                                    <span className="font-medium">เงินสด</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Items Table - Desktop */}
                    <div className="mb-6 desktop-table">
                        <table className="w-full border-2 border-black">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="border border-black p-2 text-center text-sm font-bold text-black w-16">ลำดับ</th>
                                    <th className="border border-black p-2 text-left text-sm font-bold text-black w-auto">รายการ</th>
                                    <th className="border border-black p-2 text-center text-sm font-bold text-black w-20">จำนวน</th>
                                    <th className="border border-black p-2 text-center text-sm font-bold text-black w-16">หน่วย</th>
                                    <th className="border border-black p-2 text-right text-sm font-bold text-black w-28">ราคาต่อหน่วย</th>
                                    <th className="border border-black p-2 text-right text-sm font-bold text-black w-28">จำนวนเงิน</th>
                                </tr>
                            </thead>
                            <tbody>
                                {quotationItems.map((item) => (
                                    <tr key={item.no}>
                                        <td className="border border-black p-2 text-center text-sm font-medium text-black">{item.no}</td>
                                        <td className="border border-black p-2 text-sm font-medium text-black">{item.description}</td>
                                        <td className="border border-black p-2 text-center text-sm font-medium text-black">{item.quantity.toLocaleString()}</td>
                                        <td className="border border-black p-2 text-center text-sm font-medium text-black">{item.unit}</td>
                                        <td className="border border-black p-2 text-right text-sm font-medium text-black">฿{item.unitPrice.toLocaleString()}</td>
                                        <td className="border border-black p-2 text-right text-sm font-medium text-black">฿{item.amount.toLocaleString()}</td>
                                    </tr>
                                ))}
                                {/* Empty rows to fill space */}
                                {Array.from({ length: Math.max(5 - quotationItems.length, 0) }).map((_, index) => (
                                    <tr key={`empty-${index}`}>
                                        <td className="border border-black p-2 text-center text-sm">&nbsp;</td>
                                        <td className="border border-black p-2 text-sm">&nbsp;</td>
                                        <td className="border border-black p-2 text-center text-sm">&nbsp;</td>
                                        <td className="border border-black p-2 text-center text-sm">&nbsp;</td>
                                        <td className="border border-black p-2 text-right text-sm">&nbsp;</td>
                                        <td className="border border-black p-2 text-right text-sm">&nbsp;</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Items Cards - Mobile */}
                    <div className="mb-6 mobile-card">
                        <div className="space-y-4">
                            {quotationItems.map((item) => (
                                <div key={item.no} className="border-2 border-black rounded-lg p-4 bg-white">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex items-center space-x-2">
                                            <span className="bg-gray-100 text-black font-bold text-sm px-2 py-1 rounded">
                                                {item.no}
                                            </span>
                                            <span className="text-sm font-bold text-black">รายการ</span>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-lg font-bold text-black">฿{item.amount.toLocaleString()}</div>
                                            <div className="text-xs text-black font-medium">จำนวนเงิน</div>
                                        </div>
                                    </div>
                                    <div className="text-sm font-medium text-black mb-3">
                                        {item.description}
                                    </div>
                                    <div className="grid grid-cols-3 gap-2 text-xs">
                                        <div>
                                            <div className="text-black font-bold">จำนวน</div>
                                            <div className="text-black font-medium">{item.quantity.toLocaleString()}</div>
                                        </div>
                                        <div>
                                            <div className="text-black font-bold">หน่วย</div>
                                            <div className="text-black font-medium">{item.unit}</div>
                                        </div>
                                        <div>
                                            <div className="text-black font-bold">ราคาต่อหน่วย</div>
                                            <div className="text-black font-medium">฿{item.unitPrice.toLocaleString()}</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Summary */}
                    <div className="flex justify-center md:justify-end mb-8">
                        <div className="w-full max-w-sm md:w-80">
                            <table className="w-full border-2 border-black">
                                <tbody>
                                    <tr>
                                        <td className="border border-black p-2 text-right font-bold text-black">รวมเป็นเงิน</td>
                                        <td className="border border-black p-2 text-right font-bold text-black">฿{cartTotal.toLocaleString()}</td>
                                    </tr>
                                    <tr>
                                        <td className="border border-black p-2 text-right font-bold text-black">ภาษีมูลค่าเพิ่ม 7%</td>
                                        <td className="border border-black p-2 text-right font-bold text-black">฿{vatAmount.toLocaleString()}</td>
                                    </tr>
                                    <tr className="bg-gray-100">
                                        <td className="border border-black p-2 text-right font-bold text-black">รวมทั้งสิ้น</td>
                                        <td className="border border-black p-2 text-right font-bold text-black">฿{totalWithVat.toLocaleString()}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Terms and Conditions */}
                    <div className="mb-8">
                        <h4 className="font-bold text-black mb-2">ข้อตกลงและเงื่อนไข:</h4>
                        <ul className="text-sm text-black font-medium space-y-1 list-disc list-inside">
                            <li>ราคานี้ยืนราคา 30 วัน นับจากวันที่ออกใบเสนอราคา</li>
                            <li>การชำระเงิน: เงินสด หรือโอนเงิน</li>
                            <li>การส่งมอบสินค้า: ภายใน 3-7 วันทำการ หลังจากได้รับการยืนยันคำสั่งซื้อ</li>
                            <li>สินค้าทุกชิ้นมีการรับประกันตามมาตรฐานของผู้ผลิต</li>
                            <li>ราคาไม่รวมค่าขนส่ง (ค่าขนส่งคิดตามระยะทางจริง)</li>
                        </ul>
                    </div>

                    {/* Signatures */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
                        <div className="text-center">
                            <div className="border-b-2 border-black mb-2 pb-8"></div>
                            <p className="text-sm font-bold text-black">ลงชื่อ ผู้เสนอราคา</p>
                            <p className="text-xs md:text-sm text-black font-medium mt-1">({companyInfo.name})</p>
                        </div>
                        <div className="text-center">
                            <div className="border-b-2 border-black mb-2 pb-8"></div>
                            <p className="text-sm font-bold text-black">ลงชื่อ ผู้รับใบเสนอราคา</p>
                            <p className="text-xs md:text-sm text-black font-medium mt-1">({customer.name})</p>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-8 pt-4 border-t-2 border-black text-center text-xs text-black font-medium">
                        <p>ใบเสนอราคานี้สร้างโดยระบบ {companyInfo.name}</p>
                        <p>{companyInfo.website} | {companyInfo.email}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
