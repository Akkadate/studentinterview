# คำแนะนำรูปแบบไฟล์ CSV สำหรับระบบสัมภาษณ์นักศึกษา

ระบบสัมภาษณ์นักศึกษารับข้อมูลเริ่มต้นจากไฟล์ CSV 3 ไฟล์ ได้แก่ `interviewer.csv`, `student.csv` และ `question.csv` โปรดตรวจสอบให้แน่ใจว่าไฟล์ CSV ของคุณมีรูปแบบที่ถูกต้องและเข้ารหัสเป็น UTF-8 เพื่อให้รองรับภาษาไทย

## 1. ไฟล์ interviewer.csv

ไฟล์นี้เก็บข้อมูลผู้สัมภาษณ์ (อาจารย์หรือเจ้าหน้าที่)

### โครงสร้างไฟล์:
```
staff_id,staff_name,staff_faculty
```

### ตัวอย่างข้อมูล:
```
staff_id,staff_name,staff_faculty
1001,อาจารย์ ดร.สมศักดิ์ ใจดี,วิทยาศาสตร์
1002,อาจารย์ ดร.มานี ดีใจ,วิศวกรรมศาสตร์
1003,ผศ.ดร.วิชัย วิชาดี,ศึกษาศาสตร์
```

### คำอธิบายฟิลด์:
- `staff_id`: รหัสอาจารย์หรือเจ้าหน้าที่ (เป็นค่าคีย์หลัก)
- `staff_name`: ชื่อ-นามสกุลของอาจารย์หรือเจ้าหน้าที่
- `staff_faculty`: คณะที่สังกัด

## 2. ไฟล์ student.csv

ไฟล์นี้เก็บข้อมูลนักศึกษาที่จะสัมภาษณ์

### โครงสร้างไฟล์:
```
รหัสนักศึกษา,ชื่อนักศึกษา,หลักสูตร,คณะ,วิทยาเขต,ระดับ,เบอร์โทร,ทุนการศึึกษา,โรงเรียนที่จบ,ภูมิลำเนา
```

### ตัวอย่างข้อมูล:
```
รหัสนักศึกษา,ชื่อนักศึกษา,หลักสูตร,คณะ,วิทยาเขต,ระดับ,เบอร์โทร,ทุนการศึึกษา,โรงเรียนที่จบ,ภูมิลำเนา
6512345678,นายสมชาย ใจกล้า,วิทยาการคอมพิวเตอร์,วิทยาศาสตร์,หาดใหญ่,ปริญญาตรี,0812345678,ทุนเรียนดี,โรงเรียนมัธยมศึกษา,สงขลา
6512345679,นางสาวมานี ดีใจ,วิทยาการคอมพิวเตอร์,วิทยาศาสตร์,หาดใหญ่,ปริญญาตรี,0823456789,ไม่มี,โรงเรียนมัธยมวิทยา,สงขลา
6512345680,นายสมหมาย ใจกล้า,วิศวกรรมคอมพิวเตอร์,วิศวกรรมศาสตร์,หาดใหญ่,ปริญญาตรี,0834567890,ทุนขาดแคลน,โรงเรียนวิทยาศาสตร์,สงขลา
```

### คำอธิบายฟิลด์:
- `รหัสนักศึกษา`: รหัสประจำตัวนักศึกษา (เป็นค่าคีย์หลัก)
- `ชื่อนักศึกษา`: ชื่อ-นามสกุลของนักศึกษา
- `หลักสูตร`: หลักสูตรที่นักศึกษากำลังศึกษา
- `คณะ`: คณะที่นักศึกษาสังกัด
- `วิทยาเขต`: วิทยาเขตที่นักศึกษาศึกษาอยู่
- `ระดับ`: ระดับการศึกษา (เช่น ปริญญาตรี)
- `เบอร์โทร`: หมายเลขโทรศัพท์ติดต่อ
- `ทุนการศึึกษา`: ข้อมูลทุนการศึกษาที่นักศึกษาได้รับ (ถ้ามี)
- `โรงเรียนที่จบ`: โรงเรียนที่นักศึกษาจบการศึกษาก่อนเข้ามหาวิทยาลัย
- `ภูมิลำเนา`: จังหวัดที่เป็นภูมิลำเนาของนักศึกษา

## 3. ไฟล์ question.csv

ไฟล์นี้เก็บข้อมูลคำถามสำหรับการสัมภาษณ์

### โครงสร้างไฟล์:
```
ข้อ,คำถาม,รูปปบบคำถาม,ตัวเลือกคำตอบ,เงื่อนไขเชื่อมโยง,แสดงคำถามเพิ่มตามเงื่อนไข
```

### ตัวอย่างข้อมูล:
```
ข้อ,คำถาม,รูปปบบคำถาม,ตัวเลือกคำตอบ,เงื่อนไขเชื่อมโยง,แสดงคำถามเพิ่มตามเงื่อนไข
1,นักศึกษามีปัญหาด้านการเรียนหรือไม่?,radio,มี,ไม่มี,,
2,ปัญหาเกี่ยวกับวิชาอะไร?,text,,,1:eq:มี,โปรดระบุเมื่อมีปัญหาด้านการเรียน
3,นักศึกษามีปัญหาด้านการเงินหรือไม่?,radio,มี,ไม่มี,,
4,รายได้ครอบครัวต่อเดือนประมาณเท่าไร?,select,น้อยกว่า 10000,10000-20000,20001-30000,มากกว่า 30000,3:eq:มี,โปรดระบุเมื่อมีปัญหาด้านการเงิน
5,นักศึกษามีปัญหาด้านที่พักอาศัยหรือไม่?,radio,มี,ไม่มี,,
```

### คำอธิบายฟิลด์:
- `ข้อ`: ลำดับข้อคำถาม (เป็นค่าคีย์หลัก)
- `คำถาม`: ข้อความคำถาม
- `รูปปบบคำถาม`: รูปแบบการตอบคำถาม สามารถเป็นได้ดังนี้:
  - `text`: ข้อความสั้นๆ
  - `textarea`: ข้อความยาว
  - `radio`: เลือกได้ข้อเดียว
  - `checkbox`: เลือกได้หลายข้อ
  - `select`: เลือกจากรายการแบบเลื่อนลง
  - `number`: ตัวเลข
- `ตัวเลือกคำตอบ`: ตัวเลือกสำหรับคำถามแบบ radio, checkbox, และ select (คั่นด้วยเครื่องหมายคอมม่า)
- `เงื่อนไขเชื่อมโยง`: เงื่อนไขที่ทำให้คำถามนี้แสดง รูปแบบ "ข้อ:operator:คำตอบ" เช่น "1:eq:มี" หมายถึง ถ้าคำตอบของข้อ 1 เท่ากับ "มี"
  - Operators: eq (equals), neq (not equals), contains (มีข้อความนี้), gt (greater than), lt (less than)
- `แสดงคำถามเพิ่มตามเงื่อนไข`: คำอธิบายเพิ่มเติมเกี่ยวกับเงื่อนไขการแสดงคำถาม

## ข้อแนะนำในการเตรียมไฟล์ CSV

1. **ใช้การเข้ารหัส UTF-8**: เพื่อรองรับภาษาไทย
2. **ตรวจสอบชื่อคอลัมน์**: ต้องตรงกับที่ระบบกำหนด
3. **ข้อมูลที่มีเครื่องหมายคอมม่า**: ควรครอบด้วยเครื่องหมายคำพูด (") เพื่อหลีกเลี่ยงปัญหา
4. **ไม่ควรมีเครื่องหมายพิเศษ**: ในค่าคีย์หลัก (staff_id, รหัสนักศึกษา, ข้อ)
5. **ตรวจสอบความสมบูรณ์**: ข้อมูลในฟิลด์บังคับต้องไม่เป็นค่าว่าง

## วิธีการนำเข้าข้อมูล

1. เตรียมไฟล์ CSV ทั้ง 3 ไฟล์ตามรูปแบบที่กำหนด
2. วางไฟล์ในโฟลเดอร์ `data/` ภายในโปรเจค
3. รันคำสั่ง `npm run seed` ในโฟลเดอร์ `backend/` เพื่อนำเข้าข้อมูล
4. ตรวจสอบว่าข้อมูลถูกนำเข้าอย่างถูกต้องโดยเข้าสู่ระบบและดูข้อมูล
