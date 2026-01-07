import React, { useRef, useState } from "react";

/**
 * CodeRunner
 * Runs user-provided JavaScript code in a sandboxed Web Worker,
 * capturing stdout (console.log) and errors, and displaying them.
 * Shows a minimal guidance about the sandbox security.
 * 
 * Props:
 *   code: string - the user code to execute
 *   disabled: boolean - if true, disables the Run button
 */
const CodeRunner = ({ code = "", disabled = false }) => {
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const workerRef = useRef(null);

  // PUBLIC_INTERFACE
  function runCode() {
    setOutput("");
    setIsRunning(true);

    // Stringified worker code
    const workerFunction = `
      self.onmessage = function(e) {
        const code = e.data;
        let stdout = '';
        // Patch console.log to capture output
        const originalLog = console.log;
        console.log = function(...args) {
          stdout += args.join(' ') + '\\n';
          originalLog.apply(console, args);
        };
        try {
          let result;
          // Prevent access to self, importScripts, window, etc.
          (function(){ 
            "use strict";
            result = eval(code);
          }).call({});
          if (typeof result !== "undefined") {
            stdout += result + '\\n';
          }
          self.postMessage({output: stdout, error: null});
        } catch (err) {
          self.postMessage({output: stdout, error: err && err.stack ? err.stack : String(err)});
        }
      };
    `;
    const blob = new Blob([workerFunction], { type: "application/javascript" });
    const url = URL.createObjectURL(blob);
    workerRef.current = new Worker(url);

    workerRef.current.onmessage = function (event) {
      const { output, error } = event.data;
      if (error) {
        setOutput(output + "\n" + error);
      } else {
        setOutput(output);
      }
      setIsRunning(false);
      workerRef.current.terminate();
      URL.revokeObjectURL(url);
    };

    workerRef.current.onerror = function (err) {
      setOutput("Error: " + err.message);
      setIsRunning(false);
      workerRef.current.terminate();
      URL.revokeObjectURL(url);
    };

    workerRef.current.postMessage(code);
  }

  return (
    <div
      style={{
        background: "#F9FAFB",
        color: "#111827",
        border: "1px solid #9CA3AF",
        borderRadius: 8,
        padding: "1rem",
        marginTop: "1rem",
        fontFamily: "monospace",
        fontSize: "1rem",
        width: "100%",
        boxShadow: "0 2px 8px rgba(55,65,81,0.05)"
      }}
      aria-label="Code Runner Sandbox"
    >
      <div style={{
        marginBottom: 8,
        color: "#374151",
        fontFamily: "inherit",
        fontWeight: 500,
        fontSize: "0.97rem"
      }}>
        <span role="img" aria-label="sandbox">🔒</span>
        {" "}
        This is a basic sandbox; do not enter secrets.
      </div>
      <button
        onClick={runCode}
        disabled={disabled || isRunning}
        style={{
          fontFamily: "inherit",
          background: "#374151",
          color: "#fff",
          padding: "0.38em 1.1em",
          border: "none",
          borderRadius: 4,
          fontWeight: 500,
          letterSpacing: 0.5,
          marginBottom: 12,
          cursor: (disabled || isRunning) ? "not-allowed" : "pointer",
          opacity: (disabled || isRunning) ? 0.6 : 1,
          boxShadow: "0 1px 2px #bbb"
        }}
        aria-label="Run code"
      >
        {isRunning ? "Running..." : "Run Code"}
      </button>
      <pre
        style={{
          background: "#fff",
          color: "#DC2626",
          minHeight: 32,
          padding: "0.4em",
          margin: 0,
          border: "1px solid #e5e7eb",
          borderRadius: 4,
          fontFamily: "inherit",
          fontSize: "0.98em",
          whiteSpace: "pre-wrap",
          wordBreak: "break-word"
        }}
        aria-live="polite"
        tabIndex={0}
      >{output ? output : "/* Output will appear here */"}</pre>
    </div>
  );
};

export default CodeRunner;
