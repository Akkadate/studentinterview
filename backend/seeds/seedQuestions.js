// backend/seeds/seedQuestions.js
const fs = require("fs");
const csv = require("csv-parser");
const path = require("path");
const db = require("../config/db");

async function seedQuestions() {
  try {
    console.log("Starting to seed question data...");

    // Clear existing data
    await db.query("DELETE FROM question");

    // Reset sequence if needed
    // await db.query('ALTER SEQUENCE question_id_seq RESTART WITH 1');

    // Path to the CSV file
    const csvPath = path.join(__dirname, "../../data/question.csv");

    // Create a promise to track when all rows are processed
    return new Promise((resolve, reject) => {
      const results = [];

      fs.createReadStream(csvPath)
        .pipe(csv())
        .on("data", (data) => {
          results.push(data);
        })
        .on("end", async () => {
          try {
            // Insert each question
            for (const row of results) {
              await db.query(
                `INSERT INTO question 
                  (question_id, question_text, question_type, answer_options, condition_logic, condition_display) 
                 VALUES 
                  ($1, $2, $3, $4, $5, $6)`,
                [
                  row["ข้อ"],
                  row["คำถาม"],
                  row["รูปปบบคำถาม"],
                  row["ตัวเลือกคำตอบ"],
                  row["เงื่อนไขเชื่อมโยง"],
                  row["แสดงคำถามเพิ่มตามเงื่อนไข"],
                ]
              );
            }

            console.log(`Seeded ${results.length} questions successfully`);
            resolve(results.length);
          } catch (err) {
            console.error("Error inserting question data:", err);
            reject(err);
          }
        })
        .on("error", (err) => {
          console.error("Error reading CSV:", err);
          reject(err);
        });
    });
  } catch (error) {
    console.error("Error in seedQuestions:", error);
    throw error;
  }
}

module.exports = seedQuestions;
