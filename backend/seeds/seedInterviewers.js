// backend/seeds/seedInterviewers.js
const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');
const db = require('../config/db');

async function seedInterviewers() {
  try {
    console.log('Starting to seed interviewer data...');
    
    // Clear existing data
    await db.query('DELETE FROM interviewer');
    
    // Reset sequence if needed
    // await db.query('ALTER SEQUENCE interviewer_id_seq RESTART WITH 1');
    
    // Path to the CSV file
    const csvPath = path.join(__dirname, '../../data/interviewer.csv');
    
    // Create a promise to track when all rows are processed
    return new Promise((resolve, reject) => {
      const results = [];
      
      fs.createReadStream(csvPath)
        .pipe(csv())
        .on('data', (data) => {
          results.push(data);
        })
        .on('end', async () => {
          try {
            // Insert each interviewer
            for (const row of results) {
              await db.query(
                'INSERT INTO interviewer (staff_id, staff_name, staff_faculty) VALUES ($1, $2, $3)',
                [row.staff_id, row.staff_name, row.staff_faculty]
              );
            }
            
            console.log(`Seeded ${results.length} interviewers successfully`);
            resolve(results.length);
          } catch (err) {
            console.error('Error inserting interviewer data:', err);
            reject(err);
          }
        })
        .on('error', (err) => {
          console.error('Error reading CSV:', err);
          reject(err);
        });
    });
  } catch (error) {
    console.error('Error in seedInterviewers:', error);
    throw error;
  }
}

module.exports = seedInterviewers;


// backend/seeds/seedStudents.js
const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');
const db = require('../config/db');

async function seedStudents() {
  try {
    console.log('Starting to seed student data...');
    
    // Clear existing data
    await db.query('DELETE FROM student');
    
    // Reset sequence if needed
    // await db.query('ALTER SEQUENCE student_id_seq RESTART WITH 1');
    
    // Path to the CSV file
    const csvPath = path.join(__dirname, '../../data/student.csv');
    
    // Create a promise to track when all rows are processed
    return new Promise((resolve, reject) => {
      const results = [];
      
      fs.createReadStream(csvPath)
        .pipe(csv())
        .on('data', (data) => {
          results.push(data);
        })
        .on('end', async () => {
          try {
            // Insert each student
            for (const row of results) {
              await db.query(
                `INSERT INTO student 
                  (student_id, student_name, program, faculty, campus, level, phone, scholarship, graduated_school, hometown) 
                 VALUES 
                  ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
                [
                  row['รหัสนักศึกษา'],
                  row['ชื่อนักศึกษา'],
                  row['หลักสูตร'],
                  row['คณะ'],
                  row['วิทยาเขต'],
                  row['ระดับ'],
                  row['เบอร์โทร'],
                  row['ทุนการศึึกษา'],
                  row['โรงเรียนที่จบ'],
                  row['ภูมิลำเนา']
                ]
              );
            }
            
            console.log(`Seeded ${results.length} students successfully`);
            resolve(results.length);
          } catch (err) {
            console.error('Error inserting student data:', err);
            reject(err);
          }
        })
        .on('error', (err) => {
          console.error('Error reading CSV:', err);
          reject(err);
        });
    });
  } catch (error) {
    console.error('Error in seedStudents:', error);
    throw error;
  }
}

module.exports = seedStudents;


// backend/seeds/seedQuestions.js
const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');
const db = require('../config/db');

async function seedQuestions() {
  try {
    console.log('Starting to seed question data...');
    
    // Clear existing data
    await db.query('DELETE FROM question');
    
    // Reset sequence if needed
    // await db.query('ALTER SEQUENCE question_id_seq RESTART WITH 1');
    
    // Path to the CSV file
    const csvPath = path.join(__dirname, '../../data/question.csv');
    
    // Create a promise to track when all rows are processed
    return new Promise((resolve, reject) => {
      const results = [];
      
      fs.createReadStream(csvPath)
        .pipe(csv())
        .on('data', (data) => {
          results.push(data);
        })
        .on('end', async () => {
          try {
            // Insert each question
            for (const row of results) {
              await db.query(
                `INSERT INTO question 
                  (question_id, question_text, question_type, answer_options, condition_logic, condition_display) 
                 VALUES 
                  ($1, $2, $3, $4, $5, $6)`,
                [
                  row['ข้อ'],
                  row['คำถาม'],
                  row['รูปปบบคำถาม'],
                  row['ตัวเลือกคำตอบ'],
                  row['เงื่อนไขเชื่อมโยง'],
                  row['แสดงคำถามเพิ่มตามเงื่อนไข']
                ]
              );
            }
            
            console.log(`Seeded ${results.length} questions successfully`);
            resolve(results.length);
          } catch (err) {
            console.error('Error inserting question data:', err);
            reject(err);
          }
        })
        .on('error', (err) => {
          console.error('Error reading CSV:', err);
          reject(err);
        });
    });
  } catch (error) {
    console.error('Error in seedQuestions:', error);
    throw error;
  }
}

module.exports = seedQuestions;


// backend/seeds/runSeeds.js
const seedInterviewers = require('./seedInterviewers');
const seedStudents = require('./seedStudents');
const seedQuestions = require('./seedQuestions');
const db = require('../config/db');

async function runSeeds() {
  try {
    console.log('Starting database seeding...');
    
    // Run seeds in sequence
    await seedInterviewers();
    await seedStudents();
    await seedQuestions();
    
    console.log('All seeds completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

// Run the seeding
runSeeds();
