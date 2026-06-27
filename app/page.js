import fs from "node:fs";
import path from "node:path";
import Script from "next/script";

function getLegacyMarkup() {
  const html = fs.readFileSync(path.join(process.cwd(), "public", "index.html"), "utf8");
  const body = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i)?.[1] ?? "";
  return body.replace(/<script\b[^>]*\bsrc=["']\/app\.js[^>]*><\/script>/i, "");
}

export default function Home() {
  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: getLegacyMarkup() }} />
      <Script src="/app.js?v=16" strategy="afterInteractive" />
    </>
  );
}
