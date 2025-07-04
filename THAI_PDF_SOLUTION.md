# การแก้ปัญหา PDF แสดงภาษาไทยใน Next.js

## สรุปปัญหาที่พบ

1. **ปัญหาการโหลดฟอนต์**: @react-pdf/renderer มีปัญหาเมื่อโหลดฟอนต์จาก Google Fonts URLs
2. **ตัวอักษรไทยหาย**: มีบั๊กที่ทำให้ตัวอักษรตัวสุดท้ายในข้อความภาษาไทยหายไป
3. **รองรับฟอนต์เฉพาะ**: รองรับเฉพาะไฟล์ฟอนต์ TTF และ WOFF เท่านั้น

## วิธีแก้ไขที่ใช้

### 1. การลงทะเบียนฟอนต์ไทย
```typescript
Font.register({
    family: 'NotoSansThai',
    fonts: [
        {
            src: 'https://fonts.gstatic.com/s/notosansthai/v20/iJWnBXeUZi_OHPqn4wq6hQ2_hbJ1xyN9wd43SofNWcd1MKVQt_So_9CdU5RtpzF-QRvzzXg.ttf',
            fontWeight: 'normal',
        },
        {
            src: 'https://fonts.gstatic.com/s/sarabun/v13/DtVjJx26TKEqsc-lWJRp7HfUpSo.ttf',
            fontWeight: 'normal',
        },
    ],
});
```

### 2. แก้ปัญหาตัวอักษรตัวสุดท้ายหาย
สร้าง component `ThaiText` ที่เพิ่มช่องว่างหลังข้อความ:
```typescript
const ThaiText = ({ children, style }: { children: React.ReactNode; style?: any }) => (
    <Text style={style}>{typeof children === 'string' ? children + ' ' : children}</Text>
);
```

### 3. การใช้ฟอนต์ในทุก component
กำหนด `fontFamily: 'NotoSansThai'` ในทุก style ที่มีข้อความภาษาไทย

## ไฟล์ที่สร้างขึ้น

- `/src/lib/pdfReactRendererThai.tsx` - PDF renderer ที่รองรับภาษาไทย
- อัปเดต `/src/app/quotation/page.tsx` และ `/src/components/PDFPreview.tsx`

## ฟีเจอร์ที่ได้

✅ **แสดงภาษาไทยใน PDF ได้อย่างถูกต้อง**
✅ **ฟอนต์ Noto Sans Thai และ Sarabun**
✅ **แก้ปัญหาตัวอักษรตัวสุดท้ายหาย**
✅ **รองรับการดาวน์โหลดและพรีวิว PDF**
✅ **เลย์เอาต์มืออาชีพสำหรับธุรกิจไทย**

## การใช้งาน

1. เปิดเว็บไซต์ที่ `http://localhost:3007`
2. ไปที่หน้า `/quotation`
3. กดปุ่ม "ดู PDF" เพื่อพรีวิว
4. กดปุ่ม "ดาวน์โหลด PDF" เพื่อดาวน์โหลด

## แหล่งข้อมูลที่ใช้อ้างอิง

- React PDF Documentation: https://react-pdf.org/fonts
- GitHub Issues: 
  - https://github.com/diegomura/react-pdf/issues/633 (Thai characters support)
  - https://github.com/diegomura/react-pdf/issues/1982 (Last character not render)
- Google Fonts TTF sources for Thai fonts
