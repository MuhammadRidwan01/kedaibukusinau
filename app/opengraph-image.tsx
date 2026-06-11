import { ImageResponse } from "next/og";

export const alt = "Kedai Sinau — Curated Digital Bookstore";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#FAF3E0",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        {/* Decorative corners */}
        <div
          style={{
            position: "absolute",
            top: 40,
            left: 40,
            width: 60,
            height: 60,
            borderTop: "3px solid #1E3A5F",
            borderLeft: "3px solid #1E3A5F",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 40,
            right: 40,
            width: 60,
            height: 60,
            borderBottom: "3px solid #1E3A5F",
            borderRight: "3px solid #1E3A5F",
            display: "flex",
          }}
        />

        {/* Content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 16,
          }}
        >
          <div
            style={{
              fontSize: 14,
              letterSpacing: "0.3em",
              color: "#1E3A5F",
              textTransform: "uppercase",
              fontFamily: "Georgia",
            }}
          >
            Curated Digital Bookstore
          </div>
          <div
            style={{
              fontSize: 80,
              fontWeight: 700,
              color: "#1A1A1A",
              fontFamily: "Georgia",
              letterSpacing: "-0.02em",
            }}
          >
            Kedai Sinau.
          </div>
          <div
            style={{
              width: 48,
              height: 2,
              backgroundColor: "#C0392B",
              display: "flex",
            }}
          />
          <div
            style={{
              fontSize: 20,
              color: "#1E3A5F",
              fontFamily: "Georgia",
              fontStyle: "italic",
              marginTop: 8,
            }}
          >
            Books that challenge the mind and soothe the soul.
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
