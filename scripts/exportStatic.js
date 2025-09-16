const fs = require("fs");
const path = require("path");
const fse = require("fs-extra");

// مجلد البناء
const NEXT_BUILD_DIR = path.join(__dirname, "..", ".next");

// مجلد النسخة الستاتيكية
const OUT_DIR = path.join(__dirname, "..", "out");

// مسح مجلد out إذا موجود
if (fs.existsSync(OUT_DIR)) {
  fse.removeSync(OUT_DIR);
}
fse.mkdirSync(OUT_DIR);

// نسخ صفحات HTML من app
const APP_DIR = path.join(NEXT_BUILD_DIR, "server", "app");
if (fs.existsSync(APP_DIR)) {
  fse.copySync(APP_DIR, OUT_DIR);
}

// نسخ ملفات JS/CSS
const NEXT_STATIC_DIR = path.join(NEXT_BUILD_DIR, "static");
if (fs.existsSync(NEXT_STATIC_DIR)) {
  fse.copySync(NEXT_STATIC_DIR, path.join(OUT_DIR, "_next", "static"));
}

console.log("✅ Static export ready in ./out");
