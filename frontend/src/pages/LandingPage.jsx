import React from "react";
import { useNavigate } from "react-router-dom";
import "./LandingPage.css";

export default function LandingPage() {
  const navigate = useNavigate();

  const goToLogin = () => {
    navigate("/login");
  };

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
    });
  };

  return (
    <div className="landing-page">

      {/* ================= NAVBAR ================= */}
      <header className="landing-navbar">

        <div
          className="landing-logo"
          onClick={() => scrollTo("home")}
        >
          <div className="logo-icon">✧</div>

          <div>
            <div className="logo-name">SkinIQ</div>
            <div className="logo-tagline">
              AI Skin Intelligence
            </div>
          </div>
        </div>

        <nav className="landing-nav">
          <button onClick={() => scrollTo("home")}>
            Home
          </button>

          <button onClick={() => scrollTo("features")}>
            Features
          </button>

          <button onClick={() => scrollTo("how-it-works")}>
            How It Works
          </button>

          <button onClick={() => scrollTo("about")}>
            About
          </button>
        </nav>

        {/* Only ONE login button in navbar */}
        <button
          className="get-started-btn"
          onClick={goToLogin}
        >
          Get Started →
        </button>

      </header>


      {/* ================= HERO ================= */}
      <section className="hero-section" id="home">

        <div className="hero-content">

          <div className="hero-badge">
            ✨ AI-Powered Skincare
          </div>

          <h1>
            Your Skin.
            <br />
            <span>Your Intelligence.</span>
          </h1>

          <p>
            Discover a smarter way to understand and care for your skin.
            SkinIQ uses intelligent analysis to create personalized
            skincare recommendations made specifically for you.
          </p>

          <div className="hero-buttons">

            <button
              className="primary-hero-btn"
              onClick={goToLogin}
            >
              Start Your Skin Journey
              <span> →</span>
            </button>

            <button
              className="secondary-hero-btn"
              onClick={() => scrollTo("features")}
            >
              Explore Features
            </button>

          </div>

          <div className="hero-trust">
            <span>✓ Personalized</span>
            <span>✓ AI-Powered</span>
            <span>✓ Easy to Use</span>
          </div>

        </div>


        {/* ================= INTERACTIVE SKIN CARD ================= */}
        <div className="hero-visual">

          <div className="skin-card">

            <div className="skin-card-top">
              <span>SkinIQ</span>

              <span className="ai-dot">
                <span className="pulse-dot"></span>
                AI Active
              </span>
            </div>

            <div className="face-placeholder">

              <div className="scan-line"></div>

              <div className="face-circle">
                ✨
              </div>

              <div className="analysis-tag tag-one">
                ✦ Healthy
              </div>

              <div className="analysis-tag tag-two">
                ✦ Clear
              </div>

              <div className="analysis-tag tag-three">
                ✦ Hydrated
              </div>

            </div>

            <div className="skin-analysis">

              <div>
                <span>Skin Health</span>
                <strong>Excellent</strong>
              </div>

              <div className="score-circle">
                86
                <small>/100</small>
              </div>

            </div>

            <div className="analysis-line">
              <span>AI Skin Analysis</span>
              <span>86%</span>
            </div>

            <div className="progress-bar">
              <div></div>
            </div>

            <div className="card-status">
              <span>●</span>
              Analysis completed successfully
            </div>

          </div>

        </div>

      </section>


      {/* ================= FEATURES ================= */}
      <section
        className="features-section"
        id="features"
      >

        <div className="section-heading">

          <div className="small-heading">
            SMARTER SKINCARE
          </div>

          <h2>
            Everything your skin needs,
            <br />
            in one place.
          </h2>

          <p>
            SkinIQ combines intelligent analysis, personalized routines,
            and progress tracking to help you build better skincare habits.
          </p>

        </div>


        <div className="feature-grid">

          <div
            className="feature-card"
            onClick={goToLogin}
          >
            <div className="feature-icon">🔍</div>

            <h3>AI Skin Assessment</h3>

            <p>
              Analyze your skin and understand concerns such as
              acne, dryness, pigmentation, and more.
            </p>

            <span className="feature-link">
              Analyze your skin →
            </span>
          </div>


          <div
            className="feature-card"
            onClick={goToLogin}
          >
            <div className="feature-icon">🧴</div>

            <h3>Personalized Routine</h3>

            <p>
              Get skincare routines tailored to your skin profile,
              concerns, and personal goals.
            </p>

            <span className="feature-link">
              Build my routine →
            </span>
          </div>


          <div
            className="feature-card"
            onClick={() => scrollTo("how-it-works")}
          >
            <div className="feature-icon">📊</div>

            <h3>Progress Tracking</h3>

            <p>
              Track your skin health over time and see how your
              skincare routine is improving your skin.
            </p>

            <span className="feature-link">
              See how it works →
            </span>
          </div>


          <div
            className="feature-card"
            onClick={goToLogin}
          >
            <div className="feature-icon">🔔</div>

            <h3>Smart Reminders</h3>

            <p>
              Receive personalized reminders for your skincare
              routine, products, hydration, and progress.
            </p>

            <span className="feature-link">
              Get started →
            </span>
          </div>

        </div>

      </section>


      {/* ================= HOW IT WORKS ================= */}
      <section
        className="how-section"
        id="how-it-works"
      >

        <div className="section-heading">

          <div className="small-heading">
            HOW IT WORKS
          </div>

          <h2>
            Your personalized skincare journey
          </h2>

          <p>
            Get started in just a few simple steps.
          </p>

        </div>


        <div className="steps-grid">

          <div className="step-card">
            <div className="step-number">01</div>

            <div className="step-icon">👤</div>

            <h3>Create Your Profile</h3>

            <p>
              Tell SkinIQ about your skin type, concerns,
              goals, and skincare preferences.
            </p>
          </div>


          <div className="step-card">
            <div className="step-number">02</div>

            <div className="step-icon">🔍</div>

            <h3>Analyze Your Skin</h3>

            <p>
              Upload a skin image and let our AI analyze
              your skin condition and concerns.
            </p>
          </div>


          <div className="step-card">
            <div className="step-number">03</div>

            <div className="step-icon">🧴</div>

            <h3>Follow Your Routine</h3>

            <p>
              Receive personalized product and routine
              recommendations designed around your needs.
            </p>
          </div>


          <div className="step-card">
            <div className="step-number">04</div>

            <div className="step-icon">📈</div>

            <h3>Track Your Progress</h3>

            <p>
              Monitor your skin health and receive
              intelligent reminders as you continue.
            </p>
          </div>

        </div>

      </section>


      {/* ================= CTA ================= */}
      {/* ABOUT SKINIQ */}
<section className="about-section" id="about">

  <div className="about-container">

    {/* LEFT CONTENT */}
    <div className="about-content">

      <div className="small-heading">
        ABOUT SKINIQ
      </div>

      <h2>
        Skincare that
        <br />
        <span>understands you.</span>
      </h2>

      <p className="about-intro">
        SkinIQ is an AI-powered skincare platform designed to make
        understanding your skin simple, personal, and smarter.
      </p>

      <p>
        Instead of following generic skincare advice, SkinIQ looks at
        your skin profile, concerns, goals, and preferences to help
        create recommendations that are made specifically for you.
      </p>

      <div className="about-points">

        <div className="about-point">
          <div className="about-point-icon">✦</div>
          <div>
            <h3>Personalized Intelligence</h3>
            <p>
              Recommendations designed around your unique skin profile.
            </p>
          </div>
        </div>

        <div className="about-point">
          <div className="about-point-icon">◉</div>
          <div>
            <h3>Continuous Progress</h3>
            <p>
              Track your skincare journey and understand changes over time.
            </p>
          </div>
        </div>

        <div className="about-point">
          <div className="about-point-icon">✓</div>
          <div>
            <h3>Simple & Easy</h3>
            <p>
              Clear insights without complicated skincare terminology.
            </p>
          </div>
        </div>

      </div>

    </div>


    {/* RIGHT SIDE */}
    <div className="about-visual">

      <div className="about-main-card">

        <div className="about-card-icon">
          ✨
        </div>

        <h3>
          Your skin is unique.
        </h3>

        <p>
          Your skincare should be too.
        </p>

        <div className="about-card-line"></div>

        <div className="about-mini-stats">

          <div>
            <strong>AI</strong>
            <span>Powered</span>
          </div>

          <div>
            <strong>24/7</strong>
            <span>Insights</span>
          </div>

          <div>
            <strong>1:1</strong>
            <span>Personalized</span>
          </div>

        </div>

      </div>

      <div className="floating-card floating-card-one">
        <span>✓</span>
        Personalized
      </div>

      <div className="floating-card floating-card-two">
        <span>✦</span>
        AI Powered
      </div>

    </div>

  </div>


  {/* WHY SKINIQ */}
  <div className="why-skin-section">

    <div className="section-heading">

      <div className="small-heading">
        WHY SKINIQ
      </div>

      <h2>
        A smarter approach to skincare.
      </h2>

      <p>
        Everything you need to understand your skin and build better
        skincare habits in one intelligent platform.
      </p>

    </div>


    <div className="why-skin-grid">

      <div className="why-card">
        <div className="why-icon">🧠</div>
        <h3>Understand</h3>
        <p>
          Get meaningful insights into your skin concerns instead of
          relying on guesswork.
        </p>
      </div>

      <div className="why-card">
        <div className="why-icon">💜</div>
        <h3>Personalize</h3>
        <p>
          Build routines based on your skin type, concerns, goals,
          and preferences.
        </p>
      </div>

      <div className="why-card">
        <div className="why-icon">📈</div>
        <h3>Improve</h3>
        <p>
          Track your progress and make better decisions as your skin
          changes over time.
        </p>
      </div>

      <div className="why-card">
        <div className="why-icon">🔔</div>
        <h3>Stay Consistent</h3>
        <p>
          Smart reminders help you stay consistent with your skincare
          routine.
        </p>
      </div>

    </div>

  </div>


  {/* FINAL CTA */}
  <div className="about-cta">

    <div className="about-cta-icon">
      ✨
    </div>

    <h2>
      Ready to understand
      <br />
      your skin better?
    </h2>

    <p>
      Start your personalized skincare journey with SkinIQ.
    </p>

    <button
      className="about-cta-button"
      onClick={goToLogin}
    >
      Start My Skin Journey →
    </button>

  </div>

</section>

      {/* ================= FOOTER ================= */}
      <footer className="landing-footer">

        <div
          className="footer-brand"
          onClick={() => scrollTo("home")}
        >

          <div className="logo-icon">
            ✧
          </div>

          <div>
            <div className="logo-name">
              SkinIQ
            </div>

            <div className="logo-tagline">
              AI Skin Intelligence
            </div>
          </div>

        </div>

        <p>
          Personalized skincare powered by intelligence.
        </p>

        <div className="footer-copy">
          © {new Date().getFullYear()} SkinIQ
        </div>

      </footer>

    </div>
  );
}