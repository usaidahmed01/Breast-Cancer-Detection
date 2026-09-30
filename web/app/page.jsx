import SiteHeader from "../components/SiteHeader";
import CareIllustration from "../components/CareIllustration";
import ReviewWorkspace from "../components/ReviewWorkspace";
import Icon from "../components/Icon";

const steps = [
  {
    number: "01",
    title: "Bring the views together",
    subtitle: "Four views, clearly organized",
    text: "The intended intake groups left and right CC and MLO images into one study, checks completeness, and makes unsupported inputs visible. File intake is the next implementation step.",
  },
  {
    number: "02",
    title: "Look closer, with evidence",
    subtitle: "Original images stay within reach",
    text: "The planned review experience will keep original mammograms alongside separately labeled finding boxes and validated explanations. Model inference is not enabled in this version.",
  },
  {
    number: "03",
    title: "Keep judgment human",
    subtitle: "Support for professional review",
    text: "Model outputs will describe their supported labels and uncertainty. They require professional interpretation and cannot rule out cancer. A structured summary follows the validated findings.",
  },
];

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <SiteHeader />
      <main id="main-content">
        <section className="hero container" aria-labelledby="hero-heading">
          <div className="hero-copy entrance">
            <span className="hero-badge">
              <span /> BREAST CARE, THOUGHTFULLY CONNECTED
            </span>
            <h1 id="hero-heading">
              A clearer view.
              <br />A more <em>caring</em>
              <br />
              experience.
            </h1>
            <p>
              A calm space for mammography review. Bringing every view together,
              with clarity, context, and human judgment at its heart.
            </p>
            <div className="hero-actions">
              <a className="button-primary" href="#workspace">
                Explore the workspace <Icon name="arrow" size={17} />
              </a>
              <a className="button-text" href="#approach">
                See our approach{" "}
                <span className="round-arrow">
                  <Icon name="chevron" size={15} />
                </span>
              </a>
            </div>
            <div className="hero-footnote">
              <Icon name="shield" size={15} />
              <span>Research prototype · Professional review required</span>
            </div>
          </div>
          <CareIllustration />
        </section>
        <div className="principles container" aria-label="Design principles">
          <div>
            <span className="principle-icon">
              <Icon name="grid" size={21} />
            </span>
            <p>
              <strong>Every perspective matters</strong>
              <span>CC and MLO, left and right.</span>
            </p>
          </div>
          <div>
            <span className="principle-icon">
              <Icon name="focus" size={21} />
            </span>
            <p>
              <strong>Clarity at every step</strong>
              <span>Understand what you are reviewing.</span>
            </p>
          </div>
          <div>
            <span className="principle-icon">
              <Icon name="heart" size={21} />
            </span>
            <p>
              <strong>People at the center</strong>
              <span>Designed to support human judgment.</span>
            </p>
          </div>
        </div>
        <div className="container">
          <ReviewWorkspace />
        </div>
        <section
          id="approach"
          className="approach-section"
          aria-labelledby="approach-heading"
        >
          <div className="container approach-layout">
            <div className="approach-intro">
              <span className="eyebrow">OUR APPROACH</span>
              <h2 id="approach-heading">
                Thoughtful technology.
                <br />
                <em>Careful review.</em>
              </h2>
              <p>
                A transparent journey from an organized study to evidence that a
                professional can inspect.
              </p>
              <span className="planned-label">
                <Icon name="spark" size={15} /> The workflow we are building
              </span>
            </div>
            <div className="workflow-list">
              {steps.map((step) => (
                <details className="workflow-step" key={step.number}>
                  <summary>
                    <span className="step-number">{step.number}</span>
                    <span className="step-copy">
                      <strong>{step.title}</strong>
                      <small>{step.subtitle}</small>
                    </span>
                    <Icon name="chevron" size={17} />
                  </summary>
                  <p>{step.text}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
        <section
          id="questions"
          className="questions-section container"
          aria-labelledby="questions-heading"
        >
          <div className="section-intro">
            <span className="eyebrow">GOOD TO KNOW</span>
            <h2 id="questions-heading">Clarity begins with honest answers.</h2>
          </div>
          <div className="faq-grid">
            <details className="faq-card">
              <summary>
                What can I do right now?
                <Icon name="chevron" size={17} />
              </summary>
              <p>
                Explore the four-view layout, select a projection, switch to
                focus mode, and check the connection to your local API. Image
                intake and AI analysis are being built in subsequent steps.
              </p>
            </details>
            <details className="faq-card">
              <summary>
                Does this provide a diagnosis?
                <Icon name="chevron" size={17} />
              </summary>
              <p>
                This research prototype supports a future professional review
                workflow. It does not provide a diagnosis. This version has no
                image analysis or loaded AI model.
              </p>
            </details>
          </div>
        </section>
      </main>
      <footer className="site-footer">
        <div className="container footer-inner">
          <div className="footer-brand">
            <Icon name="ribbon" size={20} />
            <strong>breastai</strong>
            <span>Clarity through care.</span>
          </div>
          <p>Research prototype. Built for careful, professional review.</p>
          <a href="#main-content">Back to top ↑</a>
        </div>
      </footer>
    </>
  );
}
