declare module "arabic-reshaper" {
  export function convertArabic(text: string): string;
  const ArabicReshaper: { convertArabic: (text: string) => string };
  export default ArabicReshaper;
}

declare module "bidi-js" {
  const content: any;
  export default content;
}
declare module "pdfmake/build/pdfmake";
declare module "pdfmake/build/vfs_fonts";
