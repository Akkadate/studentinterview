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

    // Path to the CSV file
    const csvPath = path.join(__dirname, "../../data/question.csv");

    console.log(`Reading CSV file from: ${csvPath}`);

    // Check if file exists
    if (!fs.existsSync(csvPath)) {
      throw new Error(`File not found: ${csvPath}`);
    }

    // Create a promise to track when all rows are processed
    return new Promise((resolve, reject) => {
      const results = [];

      fs.createReadStream(csvPath)
        .pipe(
          csv({
            trim: true, // ตัดช่องว่างออก
            skipLines: 0, // ไม่ข้ามบรรทัดไหน
            headers: true, // บรรทัดแรกเป็นหัวคอลัมน์
          })
        )
        .on("data", (data) => {
          // Debug: Log column names from first row
          if (results.length === 0) {
            console.log("CSV columns:", Object.keys(data));
          }

          // Debug: Log parsed row
          console.log(
            `Read row: question_id=${data["ข้อ"]}, question_text=${data[
              "คำถาม"
            ]?.substring(0, 30)}...`
          );

          // Validate row data
          if (data["ข้อ"] && data["คำถาม"] && data["รูปปบบคำถาม"]) {
            results.push(data);
          } else {
            console.warn("Invalid row, missing required fields:", data);
          }
        })
        .on("end", async () => {
          try {
            console.log(`Read ${results.length} valid rows from CSV`);

            // No valid data found
            if (results.length === 0) {
              reject(new Error("No valid data found in CSV file"));
              return;
            }

            // Insert each question
            for (const row of results) {
              // Convert to proper integer if it's a string
              const questionId = parseInt(row["ข้อ"], 10);

              if (isNaN(questionId)) {
                console.warn(
                  `Invalid question_id: ${row["ข้อ"]}, skipping row`
                );
                continue;
              }

              console.log(
                `Inserting question: ${questionId}, ${row["คำถาม"]?.substring(
                  0,
                  30
                )}...`
              );

              await db.query(
                `INSERT INTO question 
                  (question_id, question_text, question_type, answer_options, condition_logic, condition_display) 
                VALUES ($1, $2, $3, $4, $5, $6)`,
                [
                  questionId,
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
