/**
 * Flex Wheel - Interactive Radial Engine (Web Showcase)
 * Persistent DOM: Never destroys elements on hover so clicks register 100% reliably.
 */

class FlexWheel {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    this.options = Object.assign({
      radius: 175,
      innerRadius: 55,
      outerRadius: 135,
      fanoutRadius: 215,
      appMode: "afterEffects",
      accentColor: "#8B5CF6",
      accentGlow: "rgba(139, 92, 246, 0.45)",
      onFire: null,
      onHover: null
    }, options);

    this.activeSegmentIndex = 2; // Default to 'Create'
    this.activeToolIndex = 2;    // Default to 'Null'

    this.init();
  }

  init() {
    if (!this.container) return;
    this.container.innerHTML = "";
    this.createSVG();
    this.render();
  }

  setAppMode(mode) {
    this.options.appMode = mode;
    this.activeSegmentIndex = mode === "afterEffects" ? 2 : 0;
    this.activeToolIndex = 0;
    this.render();
  }

  setAccentColor(color, glow) {
    this.options.accentColor = color;
    this.options.accentGlow = glow || `${color}66`;
    this.render();
  }

  getData() {
    return this.options.appMode === "afterEffects" 
      ? FLEX_DATA.afterEffects 
      : FLEX_DATA.premierePro;
  }

  createSVG() {
    const size = (this.options.radius * 2) + 160;
    this.size = size;
    this.center = size / 2;

    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    this.svg.setAttribute("viewBox", `0 0 ${size} ${size}`);
    this.svg.setAttribute("class", "w-full h-full select-none overflow-visible");

    const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
    defs.innerHTML = `
      <filter id="neon-glow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="6" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
      <linearGradient id="centerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#141820" />
        <stop offset="100%" stop-color="#0a0d12" />
      </linearGradient>
    `;
    this.svg.appendChild(defs);

    this.fanoutLayer = document.createElementNS("http://www.w3.org/2000/svg", "g");
    this.slicesLayer = document.createElementNS("http://www.w3.org/2000/svg", "g");
    this.centerLayer = document.createElementNS("http://www.w3.org/2000/svg", "g");

    this.svg.appendChild(this.fanoutLayer);
    this.svg.appendChild(this.slicesLayer);
    this.svg.appendChild(this.centerLayer);

    this.container.appendChild(this.svg);
  }

  polarToCartesian(centerX, centerY, radius, angleInDegrees) {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    };
  }

  describeArc(x, y, innerRadius, outerRadius, startAngle, endAngle) {
    const startOuter = this.polarToCartesian(x, y, outerRadius, endAngle);
    const endOuter = this.polarToCartesian(x, y, outerRadius, startAngle);
    const startInner = this.polarToCartesian(x, y, innerRadius, endAngle);
    const endInner = this.polarToCartesian(x, y, innerRadius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

    return [
      "M", startOuter.x, startOuter.y,
      "A", outerRadius, outerRadius, 0, largeArcFlag, 0, endOuter.x, endOuter.y,
      "L", endInner.x, endInner.y,
      "A", innerRadius, innerRadius, 0, largeArcFlag, 1, startInner.x, startInner.y,
      "Z"
    ].join(" ");
  }

  render() {
    const data = this.getData();
    const segments = data.segments;
    const numSegments = segments.length;
    const sliceAngle = 360 / numSegments;
    const cx = this.center;
    const cy = this.center;
    const rIn = this.options.innerRadius;
    const rOut = this.options.outerRadius;

    this.slicesLayer.innerHTML = "";
    this.sliceElements = [];

    segments.forEach((seg, i) => {
      const startAngle = (i * sliceAngle) - (sliceAngle / 2);
      const endAngle = startAngle + sliceAngle;
      const midAngle = startAngle + (sliceAngle / 2);
      const isActive = (i === this.activeSegmentIndex);

      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttribute("d", this.describeArc(cx, cy, rIn, rOut, startAngle, endAngle));
      path.setAttribute("fill", isActive ? this.options.accentColor : "#10141d");
      path.setAttribute("stroke", isActive ? this.options.accentColor : "#1d2330");
      path.setAttribute("stroke-width", "1.5");
      path.style.cursor = "pointer";
      path.style.transition = "fill 0.15s, stroke 0.15s";
      if (isActive) path.setAttribute("filter", "url(#neon-glow)");

      const iconRadius = (rIn + rOut) / 2 - 8;
      const textRadius = (rIn + rOut) / 2 + 15;
      const iconPos = this.polarToCartesian(cx, cy, iconRadius, midAngle);
      const textPos = this.polarToCartesian(cx, cy, textRadius, midAngle);

      const iconText = document.createElementNS("http://www.w3.org/2000/svg", "text");
      iconText.setAttribute("x", iconPos.x);
      iconText.setAttribute("y", iconPos.y + 4);
      iconText.setAttribute("text-anchor", "middle");
      iconText.setAttribute("fill", isActive ? "#06090e" : "#8e99ab");
      iconText.setAttribute("class", "pointer-events-none text-[15px] font-bold select-none");
      iconText.textContent = this.getSegmentGlyph(seg.icon);

      const labelText = document.createElementNS("http://www.w3.org/2000/svg", "text");
      labelText.setAttribute("x", textPos.x);
      labelText.setAttribute("y", textPos.y + 3);
      labelText.setAttribute("text-anchor", "middle");
      labelText.setAttribute("fill", isActive ? "#06090e" : "#e1e7f0");
      labelText.setAttribute("class", "pointer-events-none text-[10.5px] font-semibold tracking-wide select-none");
      labelText.textContent = seg.label;

      path.addEventListener("mouseenter", () => {
        this.selectSegment(i);
      });

      path.addEventListener("click", () => {
        this.selectSegment(i);
        this.fireSegmentFirstTool(i);
      });

      this.slicesLayer.appendChild(path);
      this.slicesLayer.appendChild(iconText);
      this.slicesLayer.appendChild(labelText);

      this.sliceElements.push({ path, iconText, labelText, seg });
    });

    this.renderCenter(cx, cy, rIn);
    this.updateFanout(cx, cy, sliceAngle);
  }

  getSegmentGlyph(icon) {
    const glyphs = {
      zap: "⚡", move: "✥", plus: "+", droplet: "💧",
      sparkles: "✦", palette: "🎨", crosshair: "⌖",
      snowflake: "❄", scissors: "✂", sliders: "☵",
      grid: "⊞", bookmark: "🔖", clock: "⏱"
    };
    return glyphs[icon] || "●";
  }

  selectSegment(index) {
    if (this.activeSegmentIndex === index) return;
    this.activeSegmentIndex = index;
    this.activeToolIndex = 0;

    if (window.soundEngine) window.soundEngine.tick();

    // Fast highlight toggle without clearing DOM
    this.sliceElements.forEach((el, i) => {
      const active = (i === index);
      el.path.setAttribute("fill", active ? this.options.accentColor : "#10141d");
      el.path.setAttribute("stroke", active ? this.options.accentColor : "#1d2330");
      if (active) {
        el.path.setAttribute("filter", "url(#neon-glow)");
        el.iconText.setAttribute("fill", "#06090e");
        el.labelText.setAttribute("fill", "#06090e");
      } else {
        el.path.removeAttribute("filter");
        el.iconText.setAttribute("fill", "#8e99ab");
        el.labelText.setAttribute("fill", "#e1e7f0");
      }
    });

    const cx = this.center;
    const cy = this.center;
    const sliceAngle = 360 / this.getData().segments.length;
    this.updateFanout(cx, cy, sliceAngle);
    this.updateCenterText();

    if (this.options.onHover) {
      this.options.onHover(this.getData().segments[index]);
    }
  }

  updateFanout(cx, cy, sliceAngle) {
    this.fanoutLayer.innerHTML = "";
    const data = this.getData();
    const activeSeg = data.segments[this.activeSegmentIndex];
    if (!activeSeg) return;

    const midAngle = (this.activeSegmentIndex * sliceAngle);

    if (activeSeg.isGrid) {
      const pos = this.polarToCartesian(cx, cy, this.options.fanoutRadius + 10, midAngle);
      const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
      g.setAttribute("transform", `translate(${pos.x - 45}, ${pos.y - 45})`);

      const bgRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      bgRect.setAttribute("width", "90");
      bgRect.setAttribute("height", "90");
      bgRect.setAttribute("rx", "10");
      bgRect.setAttribute("fill", "#0e1219");
      bgRect.setAttribute("stroke", "#222a3a");
      bgRect.setAttribute("stroke-width", "1.5");
      g.appendChild(bgRect);

      const positions = ["TL", "TC", "TR", "ML", "MC", "MR", "BL", "BC", "BR"];
      positions.forEach((cell, idx) => {
        const row = Math.floor(idx / 3);
        const col = idx % 3;
        const x = 6 + (col * 28);
        const y = 6 + (row * 28);

        const cellRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        cellRect.setAttribute("x", x);
        cellRect.setAttribute("y", y);
        cellRect.setAttribute("width", 24);
        cellRect.setAttribute("height", 24);
        cellRect.setAttribute("rx", "4");
        cellRect.setAttribute("fill", cell === "MC" ? this.options.accentColor : "#181e2b");
        cellRect.setAttribute("stroke", cell === "MC" ? "#fff" : "#2d3748");
        cellRect.style.cursor = "pointer";

        const cellText = document.createElementNS("http://www.w3.org/2000/svg", "text");
        cellText.setAttribute("x", x + 12);
        cellText.setAttribute("y", y + 15.5);
        cellText.setAttribute("text-anchor", "middle");
        cellText.setAttribute("fill", cell === "MC" ? "#000" : "#a0aec0");
        cellText.setAttribute("class", "text-[8.5px] font-bold pointer-events-none select-none");
        cellText.textContent = cell;

        cellRect.addEventListener("click", (e) => {
          e.stopPropagation();
          this.fireTool(`${activeSeg.label} ${cell}`);
        });

        g.appendChild(cellRect);
        g.appendChild(cellText);
      });

      this.fanoutLayer.appendChild(g);
      return;
    }

    const tools = activeSeg.tools;
    const count = tools.length;
    const arcSpread = 58;
    const startSubAngle = midAngle - (arcSpread / 2);
    const stepAngle = arcSpread / (count - 1 || 1);
    const toolRadius = this.options.fanoutRadius;

    tools.forEach((tool, idx) => {
      const angle = startSubAngle + (idx * stepAngle);
      const pos = this.polarToCartesian(cx, cy, toolRadius, angle);
      const isToolActive = (idx === this.activeToolIndex);

      const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
      g.setAttribute("transform", `translate(${pos.x}, ${pos.y})`);
      g.style.cursor = "pointer";

      const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      circle.setAttribute("r", "22");
      circle.setAttribute("fill", isToolActive ? this.options.accentColor : "#121620");
      circle.setAttribute("stroke", isToolActive ? "#ffffff" : "#2a3447");
      circle.setAttribute("stroke-width", isToolActive ? "2" : "1.5");
      circle.style.transition = "all 0.15s";

      const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
      text.setAttribute("y", "4");
      text.setAttribute("text-anchor", "middle");
      text.setAttribute("fill", isToolActive ? "#06090e" : "#cbd5e1");
      text.setAttribute("class", "text-[9.5px] font-bold select-none pointer-events-none");
      text.textContent = tool.length > 7 ? tool.slice(0, 6) + "…" : tool;

      g.addEventListener("mouseenter", () => {
        circle.setAttribute("fill", this.options.accentColor);
        circle.setAttribute("stroke", "#ffffff");
        text.setAttribute("fill", "#000000");
        if (window.soundEngine) window.soundEngine.tick();
      });

      g.addEventListener("mouseleave", () => {
        if (idx !== this.activeToolIndex) {
          circle.setAttribute("fill", "#121620");
          circle.setAttribute("stroke", "#2a3447");
          text.setAttribute("fill", "#cbd5e1");
        }
      });

      g.addEventListener("click", (e) => {
        e.stopPropagation();
        this.fireTool(tool);
      });

      g.appendChild(circle);
      g.appendChild(text);
      this.fanoutLayer.appendChild(g);
    });
  }

  renderCenter(cx, cy, rIn) {
    this.centerLayer.innerHTML = "";
    const centerCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    centerCircle.setAttribute("cx", cx);
    centerCircle.setAttribute("cy", cy);
    centerCircle.setAttribute("r", rIn);
    centerCircle.setAttribute("fill", "url(#centerGrad)");
    centerCircle.setAttribute("stroke", "#222a3a");
    centerCircle.setAttribute("stroke-width", "2");
    centerCircle.style.cursor = "pointer";

    centerCircle.addEventListener("click", () => {
      if (window.soundEngine) window.soundEngine.cancel();
      this.showToast("Canceled", "Center release triggered — no action executed.");
    });

    this.centerTitle = document.createElementNS("http://www.w3.org/2000/svg", "text");
    this.centerTitle.setAttribute("x", cx);
    this.centerTitle.setAttribute("y", cy - 4);
    this.centerTitle.setAttribute("text-anchor", "middle");
    this.centerTitle.setAttribute("fill", "#ffffff");
    this.centerTitle.setAttribute("class", "text-[12px] font-bold tracking-tight pointer-events-none select-none");

    this.centerSub = document.createElementNS("http://www.w3.org/2000/svg", "text");
    this.centerSub.setAttribute("x", cx);
    this.centerSub.setAttribute("y", cy + 12);
    this.centerSub.setAttribute("text-anchor", "middle");
    this.centerSub.setAttribute("fill", "#718096");
    this.centerSub.setAttribute("class", "text-[9px] font-medium tracking-wide pointer-events-none select-none");
    this.centerSub.textContent = "Default";

    this.centerLayer.appendChild(centerCircle);
    this.centerLayer.appendChild(this.centerTitle);
    this.centerLayer.appendChild(this.centerSub);
    this.updateCenterText();
  }

  updateCenterText() {
    const data = this.getData();
    const seg = data.segments[this.activeSegmentIndex];
    if (this.centerTitle && seg) {
      this.centerTitle.textContent = seg.label;
    }
  }

  fireSegmentFirstTool(index) {
    const seg = this.getData().segments[index];
    if (seg && seg.tools && seg.tools.length > 0) {
      this.fireTool(seg.tools[0]);
    }
  }

  fireTool(toolName) {
    if (window.soundEngine) window.soundEngine.trigger();
    this.showToast(toolName, `Fired via flick gesture. Undone in a single step.`);
    if (this.options.onFire) {
      this.options.onFire(toolName);
    }
  }

  showToast(title, desc) {
    const toast = document.getElementById("action-toast");
    if (!toast) return;
    const titleEl = document.getElementById("toast-title");
    const descEl = document.getElementById("toast-desc");
    if (titleEl) titleEl.textContent = title;
    if (descEl) descEl.textContent = desc;

    toast.classList.remove("opacity-0", "translate-y-4", "pointer-events-none");
    toast.classList.add("opacity-100", "translate-y-0");

    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => {
      toast.classList.add("opacity-0", "translate-y-4", "pointer-events-none");
      toast.classList.remove("opacity-100", "translate-y-0");
    }, 2800);
  }
}

window.FlexWheel = FlexWheel;
