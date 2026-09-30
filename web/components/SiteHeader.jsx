"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Icon from "./Icon";

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const toggle = useRef(null);
  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 961px)");
    const closeOnDesktop = () => {
      if (desktop.matches) setOpen(false);
    };
    desktop.addEventListener("change", closeOnDesktop);
    return () => desktop.removeEventListener("change", closeOnDesktop);
  }, []);
  function handleKey(event) {
    if (event.key === "Escape" && open) {
      setOpen(false);
      toggle.current?.focus();
    }
  }
  return (
    <header className="site-header" onKeyDown={handleKey}>
      <div className="header-inner">
        <Link href="/" className="brand" aria-label="Breast AI home">
          <span className="brand-symbol">
            <Icon name="ribbon" size={25} />
          </span>
          <span>
            breast<span className="brand-ai">ai</span>
            <small>CLARITY THROUGH CARE</small>
          </span>
        </Link>
        <button
          ref={toggle}
          className="menu-toggle"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-controls="site-navigation"
          aria-label={open ? "Close navigation" : "Open navigation"}
        >
          <Icon name={open ? "close" : "menu"} />
        </button>
        <nav
          id="site-navigation"
          className={`site-nav ${open ? "is-open" : ""}`}
          aria-label="Main navigation"
        >
          <a href="#approach" onClick={() => setOpen(false)}>
            Our approach
          </a>
          <a href="#workspace" onClick={() => setOpen(false)}>
            Review workspace
          </a>
          <a href="#questions" onClick={() => setOpen(false)}>
            Good to know
          </a>
          <a
            className="nav-cta"
            href="#workspace"
            onClick={() => setOpen(false)}
          >
            Open workspace <Icon name="arrow" size={16} />
          </a>
        </nav>
      </div>
    </header>
  );
}
