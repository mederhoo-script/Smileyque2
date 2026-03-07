import { Component, type ErrorInfo, type ReactNode } from "react";
import { firebaseConfigured } from "@/lib/firebase";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Top-level error boundary.
 *
 * Catches runtime errors (e.g., Firebase operations failing because
 * environment variables are not configured) and renders a helpful setup
 * message instead of leaving the screen completely blank.
 */
export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("[ErrorBoundary] Uncaught error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      // Firebase isn't configured if the init flag is false (missing/invalid env vars)
      // or if the error message mentions Firebase-specific tokens.
      const isFirebaseError =
        !firebaseConfigured ||
        this.state.error?.message?.toLowerCase().includes("firebase") ||
        this.state.error?.message?.toLowerCase().includes("vite_firebase") ||
        this.state.error?.message?.toLowerCase().includes("app/no-app");

      return (
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "sans-serif",
            padding: "2rem",
            backgroundColor: "#fafafa",
          }}
        >
          <div
            style={{
              maxWidth: "520px",
              textAlign: "center",
              border: "1px solid #e5e7eb",
              borderRadius: 12,
              padding: "2.5rem 2rem",
              backgroundColor: "#fff",
              boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
            }}
          >
            <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>⚙️</div>
            <h1 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "0.75rem" }}>
              {isFirebaseError ? "Firebase not configured" : "Something went wrong"}
            </h1>
            {isFirebaseError ? (
              <>
                <p style={{ color: "#6b7280", marginBottom: "1.25rem", lineHeight: 1.6 }}>
                  The app could not connect to Firebase. Make sure your{" "}
                  <code
                    style={{
                      background: "#f3f4f6",
                      borderRadius: 4,
                      padding: "0 4px",
                      fontSize: "0.9em",
                    }}
                  >
                    .env
                  </code>{" "}
                  file exists and contains all required variables.
                </p>
                <ol
                  style={{
                    textAlign: "left",
                    color: "#374151",
                    lineHeight: 1.8,
                    paddingLeft: "1.25rem",
                    marginBottom: "1.25rem",
                  }}
                >
                  <li>
                    Copy{" "}
                    <code style={{ background: "#f3f4f6", borderRadius: 4, padding: "0 4px" }}>
                      example.env
                    </code>{" "}
                    →{" "}
                    <code style={{ background: "#f3f4f6", borderRadius: 4, padding: "0 4px" }}>
                      .env
                    </code>
                  </li>
                  <li>Fill in your Firebase project values</li>
                  <li>Restart the dev server</li>
                </ol>
                <p style={{ color: "#9ca3af", fontSize: "0.85rem" }}>
                  Find your config in the{" "}
                  <a
                    href="https://console.firebase.google.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "#6366f1" }}
                  >
                    Firebase console
                  </a>{" "}
                  → Project Settings → SDK setup.
                </p>
              </>
            ) : (
              <p style={{ color: "#6b7280", marginBottom: "1.25rem", lineHeight: 1.6 }}>
                {this.state.error?.message ?? "An unexpected error occurred."}
              </p>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
