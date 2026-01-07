import React from "react";
import { useParams } from "react-router-dom";

/**
 * PUBLIC_INTERFACE
 * JobDetailsPage placeholder.
 */
export default function JobDetailsPage() {
  const { id } = useParams();

  return (
    <div className="container">
      <div className="card">
        <div className="card-body" style={{ display: "grid", gap: 10 }}>
          <h1 className="h1">Job Details</h1>
          <div className="muted">
            Placeholder for job details. Will call <code>GET /jobs/:id</code>.
          </div>
          <div className="muted">
            Current route id: <code>{id}</code>
          </div>
        </div>
      </div>
    </div>
  );
}
