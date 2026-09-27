import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import path from "node:path";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const logoData = await readFile(
    path.join(process.cwd(), "docs/brand/logo-crontech.png"),
  );
  const logoSrc = `data:image/png;base64,${logoData.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#183D2B",
          color: "#FAF9E6",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logoSrc} width={160} height={160} alt="" />
        <div style={{ marginTop: 32, fontSize: 72, fontStyle: "italic" }}>
          Cron Tech
        </div>
        <div style={{ marginTop: 16, fontSize: 28, opacity: 0.8 }}>
          Outcome as a Service — preço fechado, resultado entregue
        </div>
      </div>
    ),
    { ...size },
  );
}
