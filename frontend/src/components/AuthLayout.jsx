// AuthLayout.jsx
import { useEffect, useRef } from 'react';
import './AuthLayout.css';

/* ── Floating particle canvas ── */
function ParticleCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let raf;
    const particles = [];

    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    for (let i = 0; i < 55; i++) {
      particles.push({
        x:   Math.random() * canvas.width,
        y:   Math.random() * canvas.height,
        r:   Math.random() * 1.8 + 0.4,
        dx:  (Math.random() - 0.5) * 0.4,
        dy:  (Math.random() - 0.5) * 0.4,
        alpha: Math.random() * 0.5 + 0.1,
        hue:  Math.floor(Math.random() * 60) + 195, // cyan-blue range
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 85%, 65%, ${p.alpha})`;
        ctx.fill();
        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 0 || p.x > canvas.width)  p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
      });
      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="auth-particle-canvas" />;
}

/* ── SVG Dashboard Illustration ── */
function DashboardIllustration() {
  return (
    <svg
      className="auth-illustration"
      viewBox="0 0 420 320"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Monitor frame */}
      <rect x="30" y="20" width="360" height="230" rx="16" fill="rgba(30,41,59,0.9)" stroke="rgba(99,102,241,0.4)" strokeWidth="1.5"/>
      <rect x="44" y="36" width="332" height="194" rx="8" fill="rgba(15,23,42,0.95)"/>

      {/* Top bar */}
      <rect x="44" y="36" width="332" height="28" rx="8" fill="rgba(30,41,59,0.8)"/>
      <circle cx="62" cy="50" r="5" fill="rgba(239,68,68,0.7)"/>
      <circle cx="78" cy="50" r="5" fill="rgba(251,191,36,0.7)"/>
      <circle cx="94" cy="50" r="5" fill="rgba(52,211,153,0.7)"/>
      {/* Nav tabs mock */}
      <rect x="120" y="43" width="50" height="14" rx="7" fill="rgba(99,102,241,0.5)"/>
      <rect x="178" y="43" width="40" height="14" rx="7" fill="rgba(255,255,255,0.08)"/>
      <rect x="226" y="43" width="40" height="14" rx="7" fill="rgba(255,255,255,0.08)"/>

      {/* KPI cards row */}
      <rect x="54" y="76" width="90" height="48" rx="8" fill="rgba(251,191,36,0.12)" stroke="rgba(251,191,36,0.25)" strokeWidth="1"/>
      <rect x="60" y="84" width="20" height="20" rx="5" fill="rgba(251,191,36,0.25)"/>
      <rect x="88" y="87" width="42" height="6" rx="3" fill="rgba(251,191,36,0.4)"/>
      <rect x="88" y="97" width="28" height="9" rx="3" fill="#fbbf24"/>

      <rect x="154" y="76" width="90" height="48" rx="8" fill="rgba(52,211,153,0.12)" stroke="rgba(52,211,153,0.25)" strokeWidth="1"/>
      <rect x="160" y="84" width="20" height="20" rx="5" fill="rgba(52,211,153,0.25)"/>
      <rect x="188" y="87" width="42" height="6" rx="3" fill="rgba(52,211,153,0.4)"/>
      <rect x="188" y="97" width="28" height="9" rx="3" fill="#34d399"/>

      <rect x="254" y="76" width="90" height="48" rx="8" fill="rgba(6,182,212,0.12)" stroke="rgba(6,182,212,0.25)" strokeWidth="1"/>
      <rect x="260" y="84" width="20" height="20" rx="5" fill="rgba(6,182,212,0.25)"/>
      <rect x="288" y="87" width="42" height="6" rx="3" fill="rgba(6,182,212,0.4)"/>
      <rect x="288" y="97" width="28" height="9" rx="3" fill="#06b6d4"/>

      {/* Chart area */}
      <rect x="54" y="134" width="180" height="84" rx="8" fill="rgba(30,41,59,0.8)" stroke="rgba(255,255,255,0.06)" strokeWidth="1"/>
      {/* Line chart */}
      <polyline points="66,202 88,185 110,190 132,170 154,175 176,155 198,160 220,148" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" fill="none"/>
      <path d="M66,202 88,185 110,190 132,170 154,175 176,155 198,160 220,148 L220,218 L66,218 Z" fill="rgba(99,102,241,0.08)"/>

      {/* Activity list */}
      <rect x="244" y="134" width="132" height="84" rx="8" fill="rgba(30,41,59,0.8)" stroke="rgba(255,255,255,0.06)" strokeWidth="1"/>
      {[0,1,2,3].map(i => (
        <g key={i}>
          <circle cx="260" cy={148 + i * 18} r="5" fill={['rgba(52,211,153,0.6)','rgba(251,191,36,0.6)','rgba(99,102,241,0.6)','rgba(239,68,68,0.6)'][i]}/>
          <rect x="272" cy={144 + i * 18} y={144 + i * 18} width={Math.random() * 20 + 50} height="5" rx="3" fill="rgba(255,255,255,0.12)"/>
          <rect x="272" y={152 + i * 18} width="35" height="4" rx="2" fill="rgba(255,255,255,0.06)"/>
        </g>
      ))}

      {/* Monitor stand */}
      <rect x="185" y="250" width="50" height="14" rx="4" fill="rgba(30,41,59,0.9)"/>
      <rect x="165" y="262" width="90" height="8" rx="4" fill="rgba(30,41,59,0.8)"/>

      {/* Floating badges */}
      <g className="auth-float-badge-1">
        <rect x="5" y="60" width="90" height="32" rx="8" fill="rgba(16,24,40,0.9)" stroke="rgba(52,211,153,0.4)" strokeWidth="1"/>
        <circle cx="22" cy="76" r="7" fill="rgba(52,211,153,0.2)"/>
        <text x="19" y="80" fontSize="8" fill="#34d399" fontFamily="Inter">✓</text>
        <rect x="34" y="70" width="52" height="5" rx="3" fill="rgba(52,211,153,0.3)"/>
        <rect x="34" y="78" width="38" height="4" rx="2" fill="rgba(255,255,255,0.08)"/>
      </g>

      <g className="auth-float-badge-2">
        <rect x="318" y="10" width="96" height="32" rx="8" fill="rgba(16,24,40,0.9)" stroke="rgba(99,102,241,0.4)" strokeWidth="1"/>
        <circle cx="335" cy="26" r="7" fill="rgba(99,102,241,0.2)"/>
        <text x="332" y="30" fontSize="8" fill="#818cf8" fontFamily="Inter">🤖</text>
        <rect x="348" y="20" width="52" height="5" rx="3" fill="rgba(99,102,241,0.3)"/>
        <rect x="348" y="28" width="36" height="4" rx="2" fill="rgba(255,255,255,0.08)"/>
      </g>

      <g className="auth-float-badge-3">
        <rect x="290" y="270" width="110" height="32" rx="8" fill="rgba(16,24,40,0.9)" stroke="rgba(6,182,212,0.4)" strokeWidth="1"/>
        <circle cx="307" cy="286" r="7" fill="rgba(6,182,212,0.2)"/>
        <text x="303" y="290" fontSize="8" fill="#06b6d4" fontFamily="Inter">📊</text>
        <rect x="320" y="280" width="60" height="5" rx="3" fill="rgba(6,182,212,0.3)"/>
        <rect x="320" y="288" width="44" height="4" rx="2" fill="rgba(255,255,255,0.08)"/>
      </g>
    </svg>
  );
}

function AuthLayout({ children, title, subtitle, showFeatures = true }) {
  return (
    <div className="auth-wrapper">
      {/* Animated background orbs */}
      <div className="auth-bg-orb auth-bg-orb-1" />
      <div className="auth-bg-orb auth-bg-orb-2" />
      <div className="auth-bg-orb auth-bg-orb-3" />

      <div className="auth-container">
        {/* Left Side - Branding */}
        <div className="auth-branding">
          <ParticleCanvas />

          <div className="branding-content">
            <div className="branding-logo">
              <div className="logo-icon">
                <i className="fas fa-chart-line" />
                <div className="logo-icon-ring" />
              </div>
              <div>
                <span className="logo-text">TeamPulse</span>
                <span className="logo-tagline">Insights Engine</span>
              </div>
            </div>

            <h1 className="branding-title">{title}</h1>
            <p className="branding-subtitle">{subtitle}</p>

            {/* SVG illustration */}
            <DashboardIllustration />

            {showFeatures && (
              <div className="branding-features">
                {[
                  { icon: 'fa-file-alt',        text: 'Weekly report creation & submission' },
                  { icon: 'fa-users',            text: 'Project assignment & team collaboration' },
                  { icon: 'fa-chart-bar',        text: 'Admin dashboards & progress insights' },
                  { icon: 'fa-shield-alt',       text: 'Real-time visibility & secure access' },
                ].map(({ icon, text }, i) => (
                  <div className="feature-item" key={i} style={{ animationDelay: `${0.1 + i * 0.1}s` }}>
                    <span className="feature-icon"><i className={`fas ${icon}`} /></span>
                    <span>{text}</span>
                  </div>
                ))}
              </div>
            )}

            {showFeatures && (
              <div className="branding-trust">
                {[
                  { icon: 'fa-shield-alt',   label: 'Secure access' },
                  { icon: 'fa-bolt',         label: 'Real-time' },
                  { icon: 'fa-users',        label: 'Team ready' },
                ].map(({ icon, label }, i) => (
                  <span className="trust-pill" key={i}>
                    <i className={`fas ${icon}`} /> {label}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="auth-form-container">
          <div className="form-wrapper">
            <div className="form-header">
              <div className="form-header-icon">
                <i className="fas fa-lock" />
              </div>
              <h2>{title}</h2>
              <p>{subtitle}</p>
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;