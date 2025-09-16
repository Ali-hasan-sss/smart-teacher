// utils/pdfConversation.ts

type ConvMessage = {
  id: number;
  messageType: "Question" | "Answer";
  content?: string;
};

let _pdfMake: any | null = null;

async function getPdfMake() {
  if (_pdfMake) return _pdfMake;

  const pdfMakeMod = await import("pdfmake/build/pdfmake");
  const pdfMake = (pdfMakeMod as any).default || pdfMakeMod;

  const vfsFontsMod = await import("pdfmake/build/vfs_fonts");
  const baseVfs =
    (vfsFontsMod as any).pdfMake?.vfs ||
    (vfsFontsMod as any).vfs ||
    (vfsFontsMod as any).default?.pdfMake?.vfs ||
    {};

  const cairoVfsMod = await import("../fonts.json");
  const cairoVfs = (cairoVfsMod as any).default || cairoVfsMod;

  pdfMake.vfs = { ...baseVfs, ...cairoVfs };

  pdfMake.fonts = {
    Cairo: {
      normal: "Cairo-Black.ttf",
      bold: "Cairo-Black.ttf",
      italics: "Cairo-Black.ttf",
      bolditalics: "Cairo-Black.ttf",
    },
    Roboto: {
      normal: "Roboto-Regular.ttf",
      bold: "Roboto-Medium.ttf",
      italics: "Roboto-Italic.ttf",
      bolditalics: "Roboto-MediumItalic.ttf",
    },
  };

  _pdfMake = pdfMake;
  return pdfMake;
}

function buildConversationDoc(messages: ConvMessage[]) {
  const content: any[] = [];

  // عنوان المحادثة
  content.push({
    text: "💬 محادثة ذكية",
    alignment: "center",
    fontSize: 20,
    bold: true,
    color: "#ffffff",
    fillColor: "#4682B4",
    margin: [0, 0, 0, 10],
  });

  for (let i = 0; i < messages.length; i++) {
    const msg = messages[i];
    if (msg.messageType !== "Question") continue;

    const ans =
      messages[i + 1]?.messageType === "Answer" ? messages[i + 1] : null;

    const stack: any[] = [];

    // ✅ معالجة النص بنفس منطق الصندوق
    const processText = (raw: string | null) => {
      if (!raw) return "";

      return raw
        .replace(/\\\[/g, "")
        .replace(/\\\]/g, "")
        .split("\n")
        .map((line) => {
          if (line.includes("\\times")) {
            return {
              text: line
                .replace(/\\times/g, "×")
                .replace(/\\[\d]/g, "")
                .trim(),
              style: { font: "Cairo", fontSize: 12, bold: true },
              margin: [0, 2, 0, 2],
            };
          }

          if (line.trim() === "") {
            return { text: " ", margin: [0, 5, 0, 5] };
          }

          return { text: line.trim(), margin: [0, 1, 0, 1] };
        });
    };

    stack.push({
      stack: processText(msg.content ?? null),
      alignment: "right",
      color: "white",
      fillColor: "#007bff",
      margin: [0, 4, 0, 4],
      rtl: true,
    });

    if (ans) {
      stack.push({
        stack: processText(ans.content ?? null),
        alignment: "left",
        color: "#333",
        fillColor: "#f1f1f1",
        margin: [0, 4, 0, 10],
        rtl: true,
      });
      i++;
    }

    content.push({ stack });
  }

  const docDefinition = {
    pageSize: "A4",
    pageMargins: [15, 15, 15, 15],
    defaultStyle: { font: "Cairo", fontSize: 13 },
    content,
  };

  return docDefinition;
}

/** دالة جاهزة للتنزيل */
export async function downloadConversationPDF(messages: ConvMessage[]) {
  if (!messages || messages.length === 0) return;

  const pdfMake = await getPdfMake();
  const docDefinition = buildConversationDoc(messages);
  pdfMake.createPdf(docDefinition).download("محادثة_ذكية.pdf");
}
