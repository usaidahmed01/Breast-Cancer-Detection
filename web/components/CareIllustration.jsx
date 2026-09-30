import Icon from "./Icon";

export default function CareIllustration() {
  return (
    <div className="care-illustration" aria-hidden="true">
      <div className="illustration-orbit orbit-one" />
      <div className="illustration-orbit orbit-two" />
      <span className="decor-dot dot-one" />
      <span className="decor-dot dot-two" />
      <span className="decor-plus">+</span>
      <div className="ribbon-card">
        <span className="ribbon-caption">A LITTLE CLARITY. A LOT OF CARE.</span>
        <svg className="hero-ribbon" viewBox="0 0 240 250" fill="none">
          <defs>
            <linearGradient
              id="ribbon-main"
              x1="66"
              y1="21"
              x2="173"
              y2="221"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#f2adc0" />
              <stop offset="1" stopColor="#c45979" />
            </linearGradient>
            <linearGradient
              id="ribbon-fold"
              x1="91"
              y1="29"
              x2="156"
              y2="143"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#af4367" />
              <stop offset="1" stopColor="#e18ba7" />
            </linearGradient>
          </defs>
          <path
            d="M95 38c14-22 40-22 54 0 9 15 3 35-5 51L78 219l-32-17 64-124c9-17 14-29 8-39-5-9-15-8-23-1Z"
            fill="url(#ribbon-main)"
          />
          <path
            d="M145 38c-14-22-40-22-54 0-9 15-3 35 5 51l66 130 32-17-64-124c-9-17-14-29-8-39 5-9 15-8 23-1Z"
            fill="url(#ribbon-fold)"
          />
          <path
            d="M95 38c14-22 40-22 54 0 9 15 3 35-5 51l-21 42-19-37 6-16c9-17 14-29 8-39-5-9-15-8-23-1Z"
            fill="url(#ribbon-main)"
          />
          <path
            d="m95 100 29 55"
            stroke="#f9d4df"
            strokeWidth="2"
            strokeOpacity=".5"
          />
        </svg>
        <span className="ribbon-card-bottom">
          <Icon name="heart" size={15} /> Thoughtful by design
        </span>
      </div>
      <div className="floating-note note-top">
        <span className="note-icon">
          <Icon name="shield" size={18} />
        </span>
        <div>
          Human judgment<small>at the heart of every review</small>
        </div>
      </div>
      <div className="floating-note note-bottom">
        <span className="note-icon">
          <Icon name="grid" size={18} />
        </span>
        <div>
          Four views. One workspace.<small>Left & right · CC & MLO</small>
        </div>
      </div>
      <span className="illustration-label">Care begins with clarity.</span>
    </div>
  );
}
