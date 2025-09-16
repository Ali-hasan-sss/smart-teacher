import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

import cairoFont from "../fonts.json";

pdfMake.vfs = { ...pdfFonts.pdfMake.vfs, ...cairoFont };

const fonts = {
  Cairo: {
    normal: "Cairo-Black.ttf",
    bold: "Cairo-Black.ttf",
    italics: "Cairo-Black.ttf",
    bolditalics: "Cairo-Black.ttf",
  },
};

const docDefinition = {
  content: [{ text: "مرحبا بالعالم", font: "Cairo" }],
};

pdfMake.createPdf(docDefinition).download("example.pdf");
