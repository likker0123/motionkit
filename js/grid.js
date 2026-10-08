/**
 * Flex Wheel - The Grids Interactive Engine (Page 4)
 * Real-time 3x3 Anchor Point vs Comp Alignment visual simulator
 */

class GridVisualizer {
  constructor(canvasContainerId) {
    this.container = document.getElementById(canvasContainerId);
    this.mode = "anchor"; // 'anchor' or 'align'
    this.anchorPosition = "MC"; // Middle Center by default
    this.alignPosition = "MC";
    this.rotation = 15; // deg
    this.scale = 1.0;

    this.init();
  }

  init() {
    if (!this.container) return;
    this.bindButtons();
    this.update();
  }

  setMode(mode) {
    this.mode = mode;
    this.update();
  }

  bindButtons() {
    // Grid buttons in the 3x3 control
    const buttons = document.querySelectorAll(".grid-cell-btn");
    buttons.forEach(btn => {
      btn.addEventListener("click", (e) => {
        const pos = e.currentTarget.getAttribute("data-pos");
        if (this.mode === "anchor") {
          this.anchorPosition = pos;
        } else {
          this.alignPosition = pos;
        }
        if (window.soundEngine) window.soundEngine.tick();
        this.update();
      });
    });

    // Rotation slider
    const rotSlider = document.getElementById("grid-rot-slider");
    if (rotSlider) {
      rotSlider.addEventListener("input", (e) => {
        this.rotation = parseFloat(e.target.value);
        this.update();
      });
    }

    // Mode tab buttons
    const anchorTab = document.getElementById("tab-anchor-grid");
    const alignTab = document.getElementById("tab-align-grid");

    if (anchorTab && alignTab) {
      anchorTab.addEventListener("click", () => {
        this.mode = "anchor";
        anchorTab.classList.add("bg-green-500", "text-black");
        anchorTab.classList.remove("text-slate-400", "bg-transparent");
        alignTab.classList.remove("bg-green-500", "text-black");
        alignTab.classList.add("text-slate-400", "bg-transparent");
        this.update();
      });

      alignTab.addEventListener("click", () => {
        this.mode = "align";
        alignTab.classList.add("bg-green-500", "text-black");
        alignTab.classList.remove("text-slate-400", "bg-transparent");
        anchorTab.classList.remove("bg-green-500", "text-black");
        anchorTab.classList.add("text-slate-400", "bg-transparent");
        this.update();
      });
    }
  }

  update() {
    const targetBox = document.getElementById("comp-mock-layer");
    const anchorPin = document.getElementById("comp-anchor-pin");
    const readout = document.getElementById("grid-readout");
    const buttons = document.querySelectorAll(".grid-cell-btn");

    const currentPos = this.mode === "anchor" ? this.anchorPosition : this.alignPosition;

    // Highlight active button
    buttons.forEach(btn => {
      if (btn.getAttribute("data-pos") === currentPos) {
        btn.classList.add("bg-green-400", "text-black", "font-bold", "shadow-[0_0_8px_rgba(0,255,102,0.6)]");
        btn.classList.remove("bg-slate-800", "text-slate-400");
      } else {
        btn.classList.remove("bg-green-400", "text-black", "font-bold", "shadow-[0_0_8px_rgba(0,255,102,0.6)]");
        btn.classList.add("bg-slate-800", "text-slate-400");
      }
    });

    if (!targetBox) return;

    // Position mapping percentages
    const coords = {
      TL: { x: 0, y: 0, alignX: 15, alignY: 15 },
      TC: { x: 50, y: 0, alignX: 50, alignY: 15 },
      TR: { x: 100, y: 0, alignX: 85, alignY: 15 },
      ML: { x: 0, y: 50, alignX: 15, alignY: 50 },
      MC: { x: 50, y: 50, alignX: 50, alignY: 50 },
      MR: { x: 100, y: 50, alignX: 85, alignY: 50 },
      BL: { x: 0, y: 100, alignX: 15, alignY: 85 },
      BC: { x: 50, y: 100, alignX: 50, alignY: 85 },
      BR: { x: 100, y: 100, alignX: 85, alignY: 85 }
    };

    const coord = coords[currentPos] || coords.MC;

    if (this.mode === "anchor") {
      // In Anchor Grid: Layer stays in comp center, anchor point shifts inside it!
      targetBox.style.left = "50%";
      targetBox.style.top = "50%";
      targetBox.style.transform = `translate(-50%, -50%) rotate(${this.rotation}deg)`;

      if (anchorPin) {
        anchorPin.style.left = `${coord.x}%`;
        anchorPin.style.top = `${coord.y}%`;
      }

      if (readout) {
        readout.innerHTML = `
          <span class="text-green-400 font-mono font-bold">Anchor Mode:</span> Anchor Point set to <strong class="text-white">${currentPos}</strong>. 
          Layer position keyframe automatically compensated by <span class="font-mono text-green-300">ΔX, ΔY</span>. Layer never moves.
        `;
      }
    } else {
      // In Align Mode: Entire layer snaps to that part of comp!
      targetBox.style.left = `${coord.alignX}%`;
      targetBox.style.top = `${coord.alignY}%`;
      targetBox.style.transform = `translate(-50%, -50%) rotate(${this.rotation}deg)`;

      if (anchorPin) {
        anchorPin.style.left = "50%";
        anchorPin.style.top = "50%";
      }

      if (readout) {
        readout.innerHTML = `
          <span class="text-green-400 font-mono font-bold">Align Mode:</span> Snapped layer bounds exactly to comp's <strong class="text-white">${currentPos}</strong>. 
          Exact under rotation (${this.rotation}°). Never rescales.
        `;
      }
    }
  }
}

window.GridVisualizer = GridVisualizer;
