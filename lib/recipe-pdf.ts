import type { jsPDF as JsPDF } from "jspdf";
import type { Recipe } from "./recipe-api";

const PAGE = {
  width: 612,
  height: 792,
  margin: 48,
  footerY: 768,
};

const COLORS = {
  bark: [52, 38, 31] as const,
  cream: [250, 247, 241] as const,
  paper: [255, 253, 249] as const,
  terra: [194, 87, 47] as const,
  gold: [214, 166, 79] as const,
  smoke: [104, 94, 86] as const,
  line: [222, 214, 204] as const,
  soft: [244, 238, 229] as const,
};

const TEXT_REPLACEMENTS: Record<string, string> = {
  "¼": "1/4",
  "½": "1/2",
  "¾": "3/4",
  "⅛": "1/8",
  "⅓": "1/3",
  "⅜": "3/8",
  "⅝": "5/8",
  "⅔": "2/3",
  "⅞": "7/8",
  "–": "-",
  "—": "-",
  "‑": "-",
  "“": "\"",
  "”": "\"",
  "‘": "'",
  "’": "'",
  "…": "...",
  "×": "x",
  "°": " degrees ",
};

function safeText(value: unknown): string {
  const input = String(value ?? "");
  const replaced = Array.from(input)
    .map(character => TEXT_REPLACEMENTS[character] ?? character)
    .join("");

  return replaced
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\x20-\x7E]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function fileNameFor(recipe: Recipe) {
  const slug = safeText(recipe.name)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64);

  return `culinaria-${slug || "recipe"}.pdf`;
}

function setTextColor(doc: JsPDF, color: readonly [number, number, number]) {
  doc.setTextColor(color[0], color[1], color[2]);
}

function setFillColor(doc: JsPDF, color: readonly [number, number, number]) {
  doc.setFillColor(color[0], color[1], color[2]);
}

function setDrawColor(doc: JsPDF, color: readonly [number, number, number]) {
  doc.setDrawColor(color[0], color[1], color[2]);
}

export async function downloadRecipePdf(recipe: Recipe): Promise<string> {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({
    unit: "pt",
    format: "letter",
    orientation: "portrait",
    compress: true,
  });

  const contentWidth = PAGE.width - PAGE.margin * 2;
  const pageBottom = PAGE.footerY - 28;
  let y = PAGE.margin;

  const paintPage = () => {
    setFillColor(doc, COLORS.paper);
    doc.rect(0, 0, PAGE.width, PAGE.height, "F");
  };

  const addPage = () => {
    doc.addPage();
    paintPage();
    y = PAGE.margin;

    doc.setFont("times", "bold");
    doc.setFontSize(11);
    setTextColor(doc, COLORS.bark);
    doc.text("CULINARIA", PAGE.margin, y);
    setDrawColor(doc, COLORS.gold);
    doc.setLineWidth(1.2);
    doc.line(PAGE.margin + 78, y - 3, PAGE.width - PAGE.margin, y - 3);
    y += 28;
  };

  const ensureSpace = (height: number) => {
    if (y + height > pageBottom) addPage();
  };

  const sectionHeading = (title: string) => {
    ensureSpace(42);
    setFillColor(doc, COLORS.terra);
    doc.circle(PAGE.margin + 5, y - 4, 4.5, "F");
    doc.setFont("times", "bold");
    doc.setFontSize(18);
    setTextColor(doc, COLORS.bark);
    doc.text(safeText(title), PAGE.margin + 18, y);
    setDrawColor(doc, COLORS.line);
    doc.setLineWidth(0.8);
    doc.line(PAGE.margin, y + 11, PAGE.width - PAGE.margin, y + 11);
    y += 30;
  };

  paintPage();

  const titleLines = doc.splitTextToSize(safeText(recipe.name), contentWidth - 28) as string[];
  const descriptionLines = doc.splitTextToSize(safeText(recipe.description), contentWidth - 28) as string[];
  const headerHeight = Math.max(190, 76 + titleLines.length * 30 + descriptionLines.length * 15);

  setFillColor(doc, COLORS.bark);
  doc.rect(0, 0, PAGE.width, headerHeight, "F");
  setFillColor(doc, COLORS.terra);
  doc.circle(PAGE.width - 28, 26, 82, "F");
  setFillColor(doc, COLORS.gold);
  doc.circle(8, headerHeight + 14, 54, "F");

  doc.setFont("courier", "bold");
  doc.setFontSize(9);
  setTextColor(doc, COLORS.gold);
  doc.text(safeText(recipe.cuisine || "Custom").toUpperCase(), PAGE.margin, 42);

  doc.setFont("times", "normal");
  doc.setFontSize(27);
  setTextColor(doc, COLORS.cream);
  doc.text(titleLines, PAGE.margin, 78, { lineHeightFactor: 1.05 });

  const descriptionY = 88 + titleLines.length * 29;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10.5);
  setTextColor(doc, [224, 216, 207]);
  doc.text(descriptionLines, PAGE.margin, descriptionY, { lineHeightFactor: 1.38 });

  y = headerHeight + 28;

  const metadata = [
    ["TIME", recipe.time],
    ["DIFFICULTY", recipe.difficulty],
    ["SERVINGS", String(recipe.servings)],
    ["CALORIES", `${recipe.nutrition?.calories ?? 0} / serving`],
  ];
  const metaWidth = contentWidth / metadata.length;
  const metaHeight = 54;

  metadata.forEach(([label, value], index) => {
    const x = PAGE.margin + index * metaWidth;
    if (index > 0) {
      setDrawColor(doc, COLORS.line);
      doc.setLineWidth(0.7);
      doc.line(x, y, x, y + 36);
    }
    doc.setFont("courier", "bold");
    doc.setFontSize(7.5);
    setTextColor(doc, COLORS.smoke);
    doc.text(label, x + 10, y + 10);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    setTextColor(doc, COLORS.bark);
    const valueLines = doc.splitTextToSize(safeText(value), metaWidth - 20) as string[];
    doc.text(valueLines.slice(0, 2), x + 10, y + 28, { lineHeightFactor: 1.2 });
  });
  y += metaHeight;

  sectionHeading("Ingredients");
  const amountWidth = 132;
  const nameX = PAGE.margin + amountWidth;
  const nameWidth = contentWidth - amountWidth;

  recipe.ingredients.forEach(ingredient => {
    doc.setFont("courier", "bold");
    doc.setFontSize(9);
    const amountLines = doc.splitTextToSize(safeText(ingredient.amount), amountWidth - 18) as string[];
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10.5);
    const nameLines = doc.splitTextToSize(safeText(ingredient.name), nameWidth) as string[];
    const rowHeight = Math.max(amountLines.length * 12, nameLines.length * 14) + 13;

    ensureSpace(rowHeight);
    doc.setFont("courier", "bold");
    doc.setFontSize(9);
    setTextColor(doc, COLORS.terra);
    doc.text(amountLines, PAGE.margin, y, { lineHeightFactor: 1.25 });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10.5);
    setTextColor(doc, COLORS.bark);
    doc.text(nameLines, nameX, y, { lineHeightFactor: 1.3 });
    y += rowHeight - 5;
    setDrawColor(doc, COLORS.line);
    doc.setLineWidth(0.5);
    doc.line(PAGE.margin, y, PAGE.width - PAGE.margin, y);
    y += 8;
  });

  y += 16;
  sectionHeading("Directions");

  recipe.steps.forEach((step, index) => {
    const textX = PAGE.margin + 40;
    const textWidth = contentWidth - 40;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10.5);
    const lines = doc.splitTextToSize(safeText(step), textWidth) as string[];
    const lineHeight = 14.5;
    let lineIndex = 0;
    let firstChunk = true;

    while (lineIndex < lines.length) {
      if (pageBottom - y < lineHeight * 2) addPage();
      const availableLines = Math.max(1, Math.floor((pageBottom - y) / lineHeight));
      const chunk = lines.slice(lineIndex, lineIndex + availableLines);

      if (firstChunk) {
        setFillColor(doc, COLORS.bark);
        doc.circle(PAGE.margin + 12, y - 4, 12, "F");
        doc.setFont("courier", "bold");
        doc.setFontSize(9);
        setTextColor(doc, COLORS.cream);
        doc.text(String(index + 1), PAGE.margin + 12, y - 1, { align: "center" });
      }

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10.5);
      setTextColor(doc, COLORS.bark);
      doc.text(chunk, textX, y, { lineHeightFactor: 1.38 });
      y += chunk.length * lineHeight;
      lineIndex += chunk.length;
      firstChunk = false;

      if (lineIndex < lines.length) addPage();
    }

    y += 13;
  });

  if (recipe.nutrition) {
    ensureSpace(104);
    y += 8;
    sectionHeading("Nutrition per serving");
    const nutrition = [
      ["Calories", `${recipe.nutrition.calories} kcal`],
      ["Protein", `${recipe.nutrition.protein} g`],
      ["Carbs", `${recipe.nutrition.carbs} g`],
      ["Fat", `${recipe.nutrition.fat} g`],
    ];
    const cellWidth = contentWidth / nutrition.length;
    setFillColor(doc, COLORS.soft);
    doc.roundedRect(PAGE.margin, y - 10, contentWidth, 58, 8, 8, "F");

    nutrition.forEach(([label, value], index) => {
      const x = PAGE.margin + index * cellWidth + cellWidth / 2;
      doc.setFont("times", "bold");
      doc.setFontSize(15);
      setTextColor(doc, COLORS.bark);
      doc.text(safeText(value), x, y + 10, { align: "center" });
      doc.setFont("courier", "normal");
      doc.setFontSize(7);
      setTextColor(doc, COLORS.smoke);
      doc.text(label.toUpperCase(), x, y + 28, { align: "center" });
    });
    y += 68;
  }

  if (recipe.tips) {
    y += 10;
    sectionHeading("Cook's note");
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    const tipLines = doc.splitTextToSize(safeText(recipe.tips), contentWidth - 28) as string[];
    const lineHeight = 13.5;
    let lineIndex = 0;

    while (lineIndex < tipLines.length) {
      if (pageBottom - y < lineHeight * 2) addPage();
      const availableLines = Math.max(1, Math.floor((pageBottom - y - 12) / lineHeight));
      const chunk = tipLines.slice(lineIndex, lineIndex + availableLines);
      const boxHeight = chunk.length * lineHeight + 22;
      setFillColor(doc, COLORS.soft);
      doc.roundedRect(PAGE.margin, y - 10, contentWidth, boxHeight, 8, 8, "F");
      setTextColor(doc, COLORS.smoke);
      doc.text(chunk, PAGE.margin + 14, y + 5, { lineHeightFactor: 1.4 });
      y += boxHeight + 6;
      lineIndex += chunk.length;
      if (lineIndex < tipLines.length) addPage();
    }
  }

  const pageCount = doc.getNumberOfPages();
  for (let pageNumber = 1; pageNumber <= pageCount; pageNumber += 1) {
    doc.setPage(pageNumber);
    setDrawColor(doc, COLORS.line);
    doc.setLineWidth(0.6);
    doc.line(PAGE.margin, PAGE.footerY - 15, PAGE.width - PAGE.margin, PAGE.footerY - 15);
    doc.setFont("courier", "normal");
    doc.setFontSize(7.5);
    setTextColor(doc, COLORS.smoke);
    doc.text("CULINARIA  |  MADE FOR YOUR TABLE", PAGE.margin, PAGE.footerY);
    doc.text(`${pageNumber} / ${pageCount}`, PAGE.width - PAGE.margin, PAGE.footerY, { align: "right" });
  }

  const filename = fileNameFor(recipe);
  doc.save(filename);
  return filename;
}
