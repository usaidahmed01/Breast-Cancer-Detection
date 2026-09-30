"use client";

import { useState } from "react";
import ConnectionPanel from "./ConnectionPanel";
import Icon from "./Icon";

const views = [
  {
    key: "L-CC",
    name: "Left · CC",
    side: "Left breast",
    projection: "Craniocaudal",
    description:
      "The CC projection provides a view from above. Together with MLO, it contributes a different perspective of the same breast.",
  },
  {
    key: "R-CC",
    name: "Right · CC",
    side: "Right breast",
    projection: "Craniocaudal",
    description:
      "The CC projection provides a view from above. Together with MLO, it contributes a different perspective of the same breast.",
  },
  {
    key: "L-MLO",
    name: "Left · MLO",
    side: "Left breast",
    projection: "Mediolateral oblique",
    description:
      "The MLO projection provides an angled view. Review it alongside CC; images from different projections are not directly interchangeable.",
  },
  {
    key: "R-MLO",
    name: "Right · MLO",
    side: "Right breast",
    projection: "Mediolateral oblique",
    description:
      "The MLO projection provides an angled view. Review it alongside CC; images from different projections are not directly interchangeable.",
  },
];

export default function ReviewWorkspace() {
  const [selected, setSelected] = useState("L-CC");
  const [mode, setMode] = useState("grid");
  const active = views.find((view) => view.key === selected);
  const visible = mode === "grid" ? views : [active];
  return (
    <section
      id="workspace"
      className="workspace-section"
      aria-labelledby="workspace-heading"
    >
      <div className="section-intro">
        <span className="eyebrow">A SPACE FOR CAREFUL REVIEW</span>
        <h2 id="workspace-heading">Every view has a place.</h2>
        <p>
          Explore the workspace. Select a projection, focus on one view, or
          bring all four together.
        </p>
      </div>
      <div className="review-shell">
        <div className="review-toolbar">
          <div className="workspace-label">
            <span className="mini-symbol">
              <Icon name="ribbon" size={17} />
            </span>
            <div>
              Study workspace<small>No study loaded</small>
            </div>
          </div>
          <div className="mode-switch" role="group" aria-label="View layout">
            <button
              aria-pressed={mode === "grid"}
              onClick={() => setMode("grid")}
            >
              <Icon name="grid" size={14} /> Four views
            </button>
            <button
              aria-pressed={mode === "focus"}
              onClick={() => setMode("focus")}
            >
              <Icon name="focus" size={14} /> Focus view
            </button>
          </div>
        </div>
        <div className="review-body">
          <div className="views-region">
            <div
              className="view-picker"
              role="group"
              aria-label="Select a projection"
            >
              {views.map((view) => (
                <button
                  key={view.key}
                  aria-pressed={view.key === selected}
                  aria-controls="projection-detail"
                  onClick={() => setSelected(view.key)}
                >
                  {view.key}
                </button>
              ))}
            </div>
            <div
              className={`view-grid ${mode === "focus" ? "focus-mode" : ""}`}
            >
              {visible.map((view) => (
                <button
                  className={`view-card ${selected === view.key ? "is-selected" : ""}`}
                  key={view.key}
                  onClick={() => setSelected(view.key)}
                  aria-pressed={selected === view.key}
                  aria-label={`Select ${view.name}`}
                  aria-controls="projection-detail"
                >
                  <span className="view-card-heading">
                    <strong>{view.name}</strong>
                    <span className="view-indicator">
                      {selected === view.key ? (
                        <Icon name="check" size={12} />
                      ) : (
                        <span />
                      )}
                    </span>
                  </span>
                  <span className="image-placeholder">
                    <span className="image-icon">
                      <Icon name="image" size={23} />
                    </span>
                    <span>No image added</span>
                    <small>{view.projection}</small>
                  </span>
                  <span className="view-card-footer">
                    {view.side}
                    <span>{view.key}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>
          <aside
            className="projection-panel"
            id="projection-detail"
            aria-label="Selected projection details"
          >
            <span className="panel-caption">SELECTED PROJECTION</span>
            <div className="projection-title" aria-live="polite">
              <h3>{active.name}</h3>
              <span>
                <Icon name="focus" size={17} />
              </span>
            </div>
            <p className="projection-description">{active.description}</p>
            <div className="projection-facts">
              <div>
                <span>Breast</span>
                <strong>{active.side.replace(" breast", "")}</strong>
              </div>
              <div>
                <span>Projection</span>
                <strong>{selected.endsWith("MLO") ? "MLO" : "CC"}</strong>
              </div>
              <div>
                <span>Image</span>
                <strong>Not loaded</strong>
              </div>
            </div>
            <div className="coming-next">
              <Icon name="file" size={19} />
              <div>
                <strong>Image intake is next</strong>
                <p>
                  Our next step adds file selection and four-view validation.
                </p>
              </div>
            </div>
            <div className="care-note">
              <Icon name="heart" size={16} />
              <p>
                Technology supports the review. A qualified professional makes
                the final interpretation.
              </p>
            </div>
          </aside>
        </div>
        <ConnectionPanel />
      </div>
    </section>
  );
}
