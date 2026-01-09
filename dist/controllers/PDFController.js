"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.downloadPostPDF = void 0;
const puppeteer_1 = __importDefault(require("puppeteer"));
const PhostsModel_1 = __importDefault(require("../models/PhostsModel"));
const downloadPostPDF = async (req, res) => {
    const id = req.query.id;
    const post = await PhostsModel_1.default.findById(id);
    const browser = await puppeteer_1.default.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });
    const page = await browser.newPage();
    if (!post) {
        return res.status(404).json({ message: "Post not found" });
    }
    const bodyHTML = post.body
        .map((block) => {
        switch (block.type) {
            case "TEXT":
                return `<p>${block.value}</p>`;
            case "IMG":
                return `<img src="${block.value}" style="max-width:100%" />`;
            case "CODE":
                return `
          <pre>
            <code>${block.value}</code>
          </pre>
        `;
            case "VIDEO":
                return `<p>[Video content]</p>`;
            default:
                return "";
        }
    })
        .join("");
    const html = `
    <html>
      <head>
        <style>
          body { font-family: Arial; padding: 40px; }
          h1 { color: #333; }
          .date { color: gray; }
        </style>
      </head>
      <body>
        <h1>${post.title}</h1>
        <p class="date">${post.createdAt}</p>
        <hr />
        ${bodyHTML}
      </body>
    </html>
  `;
    await page.setContent(html);
    const pdfBuffer = await page.pdf({ format: "A4" });
    await browser.close();
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${encodeURIComponent(post.title)}.pdf"`);
    res.send(pdfBuffer);
};
exports.downloadPostPDF = downloadPostPDF;
