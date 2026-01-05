import puppeteer from "puppeteer";
import Post from "../models/PhostsModel";
import {Request,Response} from "express"

export const downloadPostPDF = async (req:Request, res:Response) => {
  const id = req.query.id;
  const post = await Post.findById(id);

  const browser = await puppeteer.launch();
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
  res.setHeader(
  "Content-Disposition",
  `attachment; filename="${encodeURIComponent(post.title)}.pdf"`
);

  res.send(pdfBuffer);
};
