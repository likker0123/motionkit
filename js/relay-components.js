/**
 * Relay & MotionKit Interactive Components & Visualizations
 * - Hero Motion Workflow Interactive Canvas
 * - Motion Pipeline Run Timing Interactive Breakdown (run 41902)
 * - Dual Harmonic Sine Wave Canvas Animation (Bezier & Audio Waves)
 * - Circular Progress Gauge Counter (82% Speed Boost)
 * - Pricing Volume / Editor Estimator Slider
 */

(function () {
  'use strict';

  // 1. Dual Harmonic Sine Wave Visualizer (Bezier Curves & Audio Harmonics)
  function initSineWaveCanvas() {
    const canvas = document.getElementById('sineWaveCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let step = 0;

    function resize() {
      const rect = canvas.parentElement.getBoundingClientRect();
      canvas.width = rect.width * (window.devicePixelRatio || 1);
      canvas.height = rect.height * (window.devicePixelRatio || 1);
      ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);
    }

    window.addEventListener('resize', resize);
    resize();

    function draw() {
      const width = canvas.width / (window.devicePixelRatio || 1);
      const height = canvas.height / (window.devicePixelRatio || 1);
      ctx.clearRect(0, 0, width, height);

      // Wave 1: Electric Lime Velocity Curve
      ctx.beginPath();
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = '#B7FF2A';
      ctx.shadowColor = 'rgba(183, 255, 42, 0.4)';
      ctx.shadowBlur = 12;

      for (let x = 0; x < width; x++) {
        const y = Math.sin((x * 0.015) + (step * 0.04)) * 28 +
                  Math.sin((x * 0.03) - (step * 0.02)) * 14 +
                  (height / 2);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Wave 2: Subtle Cyan Audio Waveform
      ctx.beginPath();
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.5)';
      ctx.shadowColor = 'rgba(56, 189, 248, 0.2)';
      ctx.shadowBlur = 8;

      for (let x = 0; x < width; x++) {
        const y = Math.sin((x * 0.012) - (step * 0.03)) * 20 +
                  Math.cos((x * 0.025) + (step * 0.02)) * 10 +
                  (height / 2);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      step += 1;
      animationFrameId = requestAnimationFrame(draw);
    }

    draw();
  }

  // 2. Hero Motion Workflow Node Interactions & Live Telemetry Simulator
  function initWorkflowInteractions() {
    const nodes = document.querySelectorAll('.workflow-graph-stage .node-card');
    const logTicker = document.getElementById('hero-log-stream');
    const durationTag = document.getElementById('hero-duration-tag');

    const logMessages = [
      { tag: 'TRIGGER', text: 'Footage dropped into timeline: interview_4k_scene01.mp4', dur: '12ms' },
      { tag: 'AI WHISPER', text: 'Transcribing speech audio locally: generated 42 word-by-word markers', dur: '380ms' },
      { tag: 'BEZIER', text: 'Applied 85% exponential ease velocity curve to title reveal', dur: '24ms' },
      { tag: 'WHEEL HUD', text: 'Radial flick dispatched: Auto-Crop Anchor Point (Hotkey Space+F)', dur: '8ms' },
      { tag: 'EXPORT', text: 'Pro sequence render completed with zero frame drops', dur: '1.4s' }
    ];

    let currentLogIdx = 0;

    function cycleLog() {
      if (!logTicker) return;
      currentLogIdx = (currentLogIdx + 1) % logMessages.length;
      const item = logMessages[currentLogIdx];
      logTicker.innerHTML = `
        <span class="ticker-pill-tag">${item.tag}</span>
        <span>${item.text}</span>
      `;
      if (durationTag) durationTag.textContent = `completed in ${item.dur}`;
    }

    setInterval(cycleLog, 3200);

    nodes.forEach(node => {
      node.addEventListener('click', () => {
        nodes.forEach(n => n.classList.remove('active'));
        node.classList.add('active');
        const nodeTitle = node.querySelector('.node-title')?.textContent || 'Step';
        if (logTicker) {
          logTicker.innerHTML = `
            <span class="ticker-pill-tag">ACTIVE</span>
            <span>Inspected motion tool: <strong>${nodeTitle}</strong> · Telemetry online</span>
          `;
        }
      });
    });
  }

  // 3. Execution Timing Interactive Replay
  window.replayRunTiming = function () {
    const bars = document.querySelectorAll('.timing-step-row .step-bar-fill');
    const statusText = document.getElementById('timing-run-status');
    if (statusText) statusText.textContent = 'Executing motion pipeline run 41902...';

    bars.forEach(bar => {
      const origWidth = bar.getAttribute('data-width') || bar.style.width;
      bar.setAttribute('data-width', origWidth);
      bar.style.width = '0%';
    });

    bars.forEach((bar, index) => {
      setTimeout(() => {
        const target = bar.getAttribute('data-width') || '70%';
        bar.style.width = target;
        if (index === bars.length - 1 && statusText) {
          statusText.textContent = '✓ Completed in 1.4s (6/6 tools executed)';
        }
      }, 250 * (index + 1));
    });
  };

  // 4. Interactive Pricing Volume / Editor Slider
  function initPricingSlider() {
    const slider = document.getElementById('pricing-volume-slider');
    const volumeDisplay = document.getElementById('pricing-volume-val');
    const cards = document.querySelectorAll('.pricing-tri-cards .plan-card');

    if (!slider) return;

    slider.addEventListener('input', (e) => {
      const val = parseInt(e.target.value, 10);
      let volText = 'Solo Motion Designer (1 PC)';
      let activeTier = 'wheel';

      if (val < 30) {
        volText = 'Solo Motion Designer (Wheel Only)';
        activeTier = 'wheel';
      } else if (val >= 30 && val < 70) {
        volText = 'Pro Studio Editor (Wheel + Pro Suite + AI)';
        activeTier = 'pro';
      } else {
        volText = 'Production Agency (Premiere Pro + AE Full Suite)';
        activeTier = 'ultimate';
      }

      if (volumeDisplay) volumeDisplay.textContent = volText;

      cards.forEach(card => {
        const tier = card.getAttribute('data-plan-tier');
        if (tier === activeTier) {
          card.classList.add('highlighted');
        } else {
          card.classList.remove('highlighted');
        }
      });
    });
  }

  // 5. Initialize All on DOM Ready
  document.addEventListener('DOMContentLoaded', () => {
    initSineWaveCanvas();
    initWorkflowInteractions();
    initPricingSlider();

    document.querySelectorAll('.timing-step-row .step-bar-fill').forEach(bar => {
      if (bar.style.width) {
        bar.setAttribute('data-width', bar.style.width);
      }
    });
  });

})();
