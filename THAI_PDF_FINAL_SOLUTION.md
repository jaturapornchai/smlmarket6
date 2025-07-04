# การแก้ปัญหา PDF ภาษาไทยใน Next.js - เวอร์ชันสุดท้าย

## ปัญหาที่พบ

1. **ปุ่ม "ดู PDF" ไม่ทำงาน** - PDFViewer ไม่แสดงผล
2. **ภาษาไทยไม่แสดงใน PDF** - ต้องใช้ฟอนต์ที่รองรับภาษาไทย
3. **ข้อผิดพลาดการโหลดฟอนต์** - ฟอนต์จากภายนอกไม่เสถียร

## วิธีแก้ไขขั้นสุดท้าย

### 1. ดาวน์โหลดฟอนต์มาเก็บในโปรเจกต์

```bash
# สร้างโฟลเดอร์ fonts
mkdir public/fonts

# ดาวน์โหลดฟอนต์ Noto Sans Thai
curl -o public/fonts/NotoSansThai-Regular.ttf "https://fonts.gstatic.com/s/notosansthai/v20/..."
```

### 2. สร้าง PDF Renderer ใหม่ที่ใช้ฟอนต์ท้องถิ่น

**ไฟล์**: `/src/lib/pdfReactRendererLocal.tsx`

```typescript
// ลงทะเบียนฟอนต์ท้องถิ่น
Font.register({
    family: 'NotoSansThai',
    fonts: [
        {
            src: '/fonts/NotoSansThai-Regular.ttf',
            fontWeight: 'normal',
        }
    ],
});

// ใช้ฟอนต์ในทุก component
const styles = StyleSheet.create({
    page: {
        fontFamily: 'NotoSansThai',
        // ...
    }
});
```

### 3. อัปเดต Components ให้ใช้ฟอนต์ท้องถิ่น

**อัปเดตไฟล์**:
- `/src/app/quotation/page.tsx`
- `/src/components/PDFPreview.tsx`

เปลี่ยนจาก:
```typescript
import { ... } from '@/lib/pdfReactRendererSimple';
```

เป็น:
```typescript
import { ... } from '@/lib/pdfReactRendererLocal';
```

### 4. เพิ่ม Error Handling

```typescript
const [error, setError] = useState<string | null>(null);

const handleError = (err: any) => {
    console.error('PDF Preview Error:', err);
    setError('เกิดข้อผิดพลาดในการแสดง PDF');
};
```

## ไฟล์ที่เปลี่ยนแปลง

✅ **ไฟล์ใหม่**:
- `/public/fonts/NotoSansThai-Regular.ttf` - ฟอนต์ไทยท้องถิ่น
- `/src/lib/pdfReactRendererLocal.tsx` - PDF renderer ที่ใช้ฟอนต์ท้องถิ่น

✅ **ไฟล์ที่แก้ไข**:
- `/src/app/quotation/page.tsx` - เปลี่ยนมาใช้ฟอนต์ท้องถิ่น
- `/src/components/PDFPreview.tsx` - เพิ่ม error handling

## ฟีเจอร์ที่ได้

✅ **PDF แสดงภาษาไทยได้อย่างถูกต้อง**
✅ **ปุ่ม "ดู PDF" ทำงานได้**
✅ **ปุ่ม "ดาวน์โหลด PDF" ทำงานได้**
✅ **ไม่มีข้อผิดพลาดการโหลดฟอนต์**
✅ **Error handling ที่ดีขึ้น**

## การทดสอบ

🌐 **เซิร์ฟเวอร์**: http://localhost:3009
📄 **หน้าทดสอบ**: /quotation

### วิธีทดสอบ:
1. เข้าไปที่หน้า /quotation
2. กดปุ่ม **"ดู PDF"** - ควรเปิด modal พรีวิว PDF
3. กดปุ่ม **"ดาวน์โหลด PDF"** - ควรดาวน์โหลดไฟล์ PDF
4. ตรวจสอบว่าข้อความภาษาไทยแสดงถูกต้องใน PDF

## การบำรุงรักษา

- ฟอนต์เก็บไว้ใน `/public/fonts/` ทำให้ไม่ต้องพึ่งการเชื่อมต่ออินเทอร์เน็ต
- สามารถเพิ่มฟอนต์น้ำหนักอื่นๆ ได้ตามต้องการ
- Error handling ช่วยให้แก้ไขปัญหาได้ง่ายขึ้น
