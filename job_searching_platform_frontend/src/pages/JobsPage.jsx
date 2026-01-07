import React from "react";
import { Link } from "react-router-dom";

/**
 * PUBLIC_INTERFACE
 * JobsPage placeholder: search/list view.
 */
export default function JobsPage() {
  return (
    <div className="container">
      <div className="card">
        <div className="card-body" style={{ display: "grid", gap: 10 }}>
          <h1 className="h1">Jobs</h1>
          <div className="muted">
            Placeholder for job search, filters, and listing. Will call{" "}
            <code>GET /jobs</code>.
          </div>

          <div className="card">
            <div className="card-body">
              <div className="h2">Example navigation</div>
              <div className="muted" style={{ marginTop: 6 }}>
                Job detail route is scaffolded at <code>/jobs/:id</code>.
              </div>
              <div style={{ marginTop: 10 }}>
                <Link className="btn btn-secondary" to="/jobs/placeholder-id">
                  Go to a placeholder Job Detail
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
