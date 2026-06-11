"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="id">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#FAF3E0",
          color: "#1A1A1A",
          fontFamily: "Georgia, serif",
        }}
      >
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <p
            style={{
              textTransform: "uppercase",
              letterSpacing: "0.3em",
              fontSize: "10px",
              color: "#1E3A5F",
              marginBottom: "2rem",
            }}
          >
            Critical Error
          </p>
          <h1
            style={{
              fontSize: "4rem",
              fontStyle: "italic",
              letterSpacing: "-0.02em",
              margin: "0 0 1.5rem",
            }}
          >
            Error
          </h1>
          <p style={{ color: "#1E3A5F", maxWidth: "400px", lineHeight: 1.6 }}>
            A critical error occurred. Please try refreshing the page.
          </p>
          <div
            style={{
              width: "48px",
              height: "1px",
              backgroundColor: "#C0392B",
              margin: "2rem auto",
            }}
          ></div>
          <button
            onClick={reset}
            style={{
              border: "1px solid #1A1A1A",
              background: "transparent",
              padding: "1rem 2.5rem",
              textTransform: "uppercase",
              letterSpacing: "0.2em",
              fontSize: "12px",
              cursor: "pointer",
              fontFamily: "Georgia, serif",
            }}
          >
            Try Again
          </button>
        </div>
      </body>
    </html>
  );
}
