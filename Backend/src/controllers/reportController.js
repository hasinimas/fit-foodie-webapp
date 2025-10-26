// backend/src/controllers/reportController.js
import PDFDocument from "pdfkit";
import { db } from "../config/firebase.js";
import dayjs from "dayjs";

const drawTableHeader = (doc, x, y, colWidths, headerHeight) => {
  // header background
  doc.save();
  doc.rect(x, y, colWidths.reduce((a, b) => a + b, 0), headerHeight).fill("#059669");
  doc.fillColor("white").fontSize(11);
  const headers = ["Meal", "Description", "Calories", "Protein"];
  let cx = x;
  headers.forEach((h, i) => {
    doc.text(h, cx + 6, y + 6, { width: colWidths[i] - 12, align: "left" });
    cx += colWidths[i];
  });
  doc.restore();
};

const ensurePageForHeight = (doc, needed, margin) => {
  const bottomLimit = doc.page.height - margin;
  if (doc.y + needed > bottomLimit) {
    doc.addPage();
    return true;
  }
  return false;
};

export const generateMealPlanReport = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) return res.status(400).json({ message: "User ID required" });

    const docRef = db
      .collection("users")
      .doc(userId)
      .collection("mealData")
      .doc("mealPlan");

    const snap = await docRef.get();
    if (!snap.exists) {
      return res.status(404).json({ message: "No meal plan found" });
    }

    const { days = [] } = snap.data();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=MealPlan-${userId}.pdf`);

    const doc = new PDFDocument({ margin: 48, size: "A4" });
    doc.pipe(res);

    // Header
    doc.font("Helvetica-Bold").fontSize(20).fillColor("#047857").text("FitFoodie 7-Day Meal Plan", { align: "center" });
    doc.moveDown(0.2);
    doc.font("Helvetica").fontSize(10).fillColor("gray").text(`Generated: ${dayjs().format("YYYY-MM-DD HH:mm")}`, { align: "center" });
    doc.moveDown(0.6);

    // Layout vars
    const margin = 48;
    const pageWidth = doc.page.width;
    const usableWidth = pageWidth - margin * 2;
    // column widths: 15% | 55% | 15% | 15% (sums to 100)
    const colWidths = [
      Math.round(usableWidth * 0.15),
      Math.round(usableWidth * 0.55),
      Math.round(usableWidth * 0.15),
      Math.round(usableWidth * 0.15),
    ];
    const headerHeight = 26;
    const minRowHeight = 28;
    const rowPadding = 6;
    const cellTextOptions = (w) => ({ width: w - rowPadding * 2, align: "left" });

    // For each day, draw a titled section + table
    for (let i = 0; i < days.length; i++) {
      const d = days[i];
      const dayLabel = d.day || `Day ${i + 1}`;

      // Title 
      doc.moveDown(0.4);
      // If not enough room for title + header row, add page
      ensurePageForHeight(doc, 40, margin);
      doc.font("Helvetica-Bold").fontSize(14).fillColor("#111827").text(dayLabel, { continued: false });
      doc.moveDown(0.25);

      const startX = margin;
      let startY = doc.y;

      // Draw header
      ensurePageForHeight(doc, headerHeight + 8, margin);
      drawTableHeader(doc, startX, startY, colWidths, headerHeight);
      startY += headerHeight + 12;
      startY += 10;


      const meals = (d.meals && Object.entries(d.meals)) || [];
      // If no meals, show empty message
      if (meals.length === 0) {
        // small note
        ensurePageForHeight(doc, minRowHeight + 8, margin);
        doc.font("Helvetica-Oblique").fontSize(10).fillColor("#6b7280").text("No meals for this day.", startX + 6, startY);
        doc.moveDown(1);
        continue;
      }

      // For each meal row, compute row height based on description text
      for (let r = 0; r < meals.length; r++) {
        const [mealTime, mealObj] = meals[r];
        if (mealTime.toUpperCase() === "BREAKFAST") {
          doc.moveDown(0.8);  // add extra space before breakfast loading
      }
        const title = mealObj?.title || "-";
        const desc = mealObj?.description || "";
        const calories = mealObj?.calories !== undefined ? String(mealObj.calories) : "-";
        const protein = mealObj?.protein !== undefined ? String(mealObj.protein) : "-";

        // Measure description height
        const descHeight = doc.heightOfString(desc || title, { width: colWidths[1] - rowPadding * 2, align: "left" });
        const titleHeight = doc.heightOfString(title, { width: colWidths[1] - rowPadding * 2, align: "left" });
        const neededRowHeight = Math.max(minRowHeight, Math.ceil(Math.max(descHeight, titleHeight)) + rowPadding * 2);

        // Page break if not enough room
        if (doc.y + neededRowHeight + 16 > doc.page.height - margin) {
          doc.addPage();
          // re-draw header on new page
          startY = doc.y;
          drawTableHeader(doc, startX, startY, colWidths, headerHeight);
          doc.y = startY + headerHeight + 8;
        }

        const rowY = doc.y;

        // Draw row border (light)
        doc.save();
        doc.lineWidth(0.3).strokeColor("#d1d5db");
        doc.rect(startX, rowY - 4, colWidths.reduce((a, b) => a + b, 0), neededRowHeight + 4).stroke();
        doc.restore();

        // Write cells
        // Meal type cell
        doc.font("Helvetica-Bold").fontSize(10).fillColor("#065f46").text(mealTime.toUpperCase(), startX + 6, rowY, { width: colWidths[0] - 12, align: "left" });

        // Title + description cell
        const descX = startX + colWidths[0];
        doc.font("Helvetica-Bold").fontSize(10).fillColor("#111827").text(title, descX + 6, rowY, { width: colWidths[1] - 12, align: "left" });
        if (desc) {
          doc.font("Helvetica").fontSize(9).fillColor("#6b7280").text(desc, descX + 6, rowY + 14, { width: colWidths[1] - 12, align: "left" });
        }

        // Calories cell
        const calX = descX + colWidths[1];
        doc.font("Helvetica").fontSize(10).fillColor("#111827").text(calories, calX + 6, rowY, { width: colWidths[2] - 12, align: "left" });

        // Protein cell
        const protX = calX + colWidths[2];
        doc.font("Helvetica").fontSize(10).fillColor("#111827").text(protein, protX + 6, rowY, { width: colWidths[3] - 12, align: "left" });

        // advance y
        doc.moveDown(neededRowHeight / 10); // small move to advance cursor; actual Y updated by doc.text writes
        // Make sure doc.y is at least rowY + neededRowHeight
        if (doc.y < rowY + neededRowHeight) doc.y = rowY + neededRowHeight;
        doc.moveDown(0.2);
      } // end meals loop

      doc.moveDown(0.6);
    } // end days loop

    // Footer
    doc.moveDown(1);
    doc.font("Helvetica-Oblique").fontSize(10).fillColor("gray").text("Generated by FitFoodie AI", { align: "center" });

    doc.end();
  } catch (err) {
    console.error("Report error:", err);
    // If the response is already started, just end
    try {
      res.status(500).json({ message: "Failed to generate report" });
    } catch (e) {
      // ignore
    }
  }
};
