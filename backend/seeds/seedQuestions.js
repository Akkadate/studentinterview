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
    console.log("Cleared existing question data");

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
      let rowCount = 0;

      fs.createReadStream(csvPath)
        .pipe(
          csv({
            trim: true,
            skipLines: 0,
            headers: true,
          })
        )
        .on("data", (data) => {
          rowCount++;
          console.log(`Processing row ${rowCount}:`, data);

          // Debug: Log column names from first row
          if (results.length === 0) {
            console.log("CSV columns:", Object.keys(data));
          }

          // Check for Thai column names
          // Try both "รูปปบบคำถาม" and "รูปแบบคำถาม" to handle potential typo
          const questionType = data["รูปปบบคำถาม"] || data["รูปแบบคำถาม"];

          // Debug: Log parsed row with more details
          console.log(`Row details:
            - ข้อ: ${data["ข้อ"]}
            - คำถาม: ${data["คำถาม"]?.substring(0, 30)}...
            - รูปแบบคำถาม: ${questionType}
          `);

          // Validate row data with improved checking
          if (data["ข้อ"] && data["คำถาม"] && questionType) {
            results.push({
              ...data,
              "รูปปบบคำถาม": questionType, // Ensure we use the found value
            });
            console.log(`Row ${rowCount} is valid`);
          } else {
            console.warn(`Row ${rowCount} is invalid, missing required fields:`, {
              "ข้อ": !!data["ข้อ"],
              "คำถาม": !!data["คำถาม"],
              "รูปปบบคำถาม/รูปแบบคำถาม": !!questionType,
            });
          }
        })
        .on("end", async () => {
          try {
            console.log(`Total rows in CSV: ${rowCount}`);
            console.log(`Valid rows for insert: ${results.length}`);

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

              // Get question type (handle potential typo)
              const questionType = row["รูปปบบคำถาม"] || row["รูปแบบคำถาม"];

              console.log(
                `Inserting question: ${questionId}, ${row["คำถาม"]?.substring(
                  0,
                  30
                )}...`
              );

              try {
                // Start a transaction
                await db.query('BEGIN');

                // Insert with more detailed error logging
                await db.query(
                  `INSERT INTO question 
                    (question_id, question_text, question_type, answer_options, condition_logic, condition_display) 
                  VALUES ($1, $2, $3, $4, $5, $6)`,
                  [
                    questionId,
                    row["คำถาม"],
                    questionType,
                    row["ตัวเลือกคำตอบ"],
                    row["เงื่อนไขเชื่อมโยง"],
                    row["แสดงคำถามเพิ่มตามเงื่อนไข"],
                  ]
                );

                // Commit the transaction
                await db.query('COMMIT');
                console.log(`Inserted question ID ${questionId} successfully`);
              } catch (insertError) {
                // Rollback on error
                await db.query('ROLLBACK');
                console.error(`Error inserting question ID ${questionId}:`, insertError);
                throw insertError;
              }
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