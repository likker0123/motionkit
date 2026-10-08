/**
 * Flex Wheel - Application State & UI Controller
 */

document.addEventListener("DOMContentLoaded", () => {
  // 1. Initialize Interactive Wheel
  const wheelInstance = new FlexWheel("wheel-svg-container", {
    appMode: "afterEffects",
    accentColor: "#00FF66",
    onFire: (tool) => {
      console.log("Tool executed:", tool);
    },
    onHover: (segment) => {
      const activeSegInfo = document.getElementById("active-seg-info");
      if (activeSegInfo) {
        activeSegInfo.textContent = `${segment.label} (${segment.tools.length} quick tools)`;
      }
    }
  });
  window.flexWheelInstance = wheelInstance;

  // 2. Initialize Floating Search Palette
  const searchPalette = new SearchPalette();
  window.searchPaletteInstance = searchPalette;

  const openSearchBtn = document.getElementById("open-search-modal-btn");
  if (openSearchBtn) {
    openSearchBtn.addEventListener("click", () => searchPalette.open());
  }

  // 3. Initialize The Grids visualizer
  const gridVis = new GridVisualizer("comp-canvas-area");
  window.gridVisualizer = gridVis;

  // 4. App Mode Switcher (After Effects <-> Premiere Pro)
  const btnAE = document.getElementById("btn-app-ae");
  const btnPremiere = document.getElementById("btn-app-premiere");
  const currentAppBadge = document.getElementById("current-app-badge");
  const heroToolCount = document.getElementById("hero-tool-count");

  function setApp(appKey) {
    wheelInstance.setAppMode(appKey);

    if (appKey === "afterEffects") {
      btnAE.classList.add("bg-green-500", "text-black", "font-bold", "shadow-[0_0_15px_rgba(0,255,102,0.4)]");
      btnAE.classList.remove("text-slate-400", "hover:text-white");
      btnPremiere.classList.remove("bg-green-500", "text-black", "font-bold", "shadow-[0_0_15px_rgba(0,255,102,0.4)]");
      btnPremiere.classList.add("text-slate-400", "hover:text-white");
      
      if (currentAppBadge) currentAppBadge.textContent = "After Effects Mode";
      if (heroToolCount) heroToolCount.textContent = "114";
    } else {
      btnPremiere.classList.add("bg-green-500", "text-black", "font-bold", "shadow-[0_0_15px_rgba(0,255,102,0.4)]");
      btnPremiere.classList.remove("text-slate-400", "hover:text-white");
      btnAE.classList.remove("bg-green-500", "text-black", "font-bold", "shadow-[0_0_15px_rgba(0,255,102,0.4)]");
      btnAE.classList.add("text-slate-400", "hover:text-white");
      
      if (currentAppBadge) currentAppBadge.textContent = "Premiere Pro Mode";
      if (heroToolCount) heroToolCount.textContent = "73";
    }

    renderToolCatalog(appKey);
    renderLayoutPills(appKey);
  }

  if (btnAE) btnAE.addEventListener("click", () => setApp("afterEffects"));
  if (btnPremiere) btnPremiere.addEventListener("click", () => setApp("premierePro"));

  // 5. Render Layout Pills
  function renderLayoutPills(appKey) {
    const container = document.getElementById("layouts-list");
    if (!container) return;
    container.innerHTML = "";

    const data = appKey === "afterEffects" ? FLEX_DATA.afterEffects : FLEX_DATA.premierePro;
    const layouts = data.layouts;

    Object.keys(layouts).forEach((name, idx) => {
      const btn = document.createElement("button");
      btn.className = `px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all ${
        idx === 0 
          ? "border-green-500 text-green-400 bg-green-500/10 shadow-[0_0_10px_rgba(0,255,102,0.2)]" 
          : "border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200"
      }`;
      btn.textContent = name;
      btn.addEventListener("click", () => {
        container.querySelectorAll("button").forEach(b => {
          b.className = "px-3.5 py-1.5 rounded-full text-xs font-semibold border border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200 transition-all";
        });
        btn.className = "px-3.5 py-1.5 rounded-full text-xs font-semibold border border-green-500 text-green-400 bg-green-500/10 shadow-[0_0_10px_rgba(0,255,102,0.2)] transition-all";
        wheelInstance.showToast(`Layout: ${name}`, `Switched active wheel configuration to ${name}`);
        if (window.soundEngine) window.soundEngine.fanout();
      });
      container.appendChild(btn);
    });
  }

  // 6. Render Tool Catalog Cards (Pages 3 & 5)
  function renderToolCatalog(appKey) {
    const grid = document.getElementById("tools-catalog-grid");
    if (!grid) return;
    grid.innerHTML = "";

    const data = appKey === "afterEffects" ? FLEX_DATA.afterEffects : FLEX_DATA.premierePro;

    data.categories.forEach(cat => {
      const card = document.createElement("div");
      card.className = "bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 rounded-xl p-5 backdrop-blur-sm transition-all flex flex-col justify-between";

      const header = document.createElement("div");
      header.className = "mb-3";
      header.innerHTML = `
        <div class="flex items-center justify-between mb-1">
          <h4 class="font-bold text-base text-white flex items-center space-x-2">
            <span>${cat.name}</span>
            <span class="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-green-400 font-mono">${cat.count}</span>
          </h4>
        </div>
        <p class="text-xs text-slate-400 leading-relaxed">${cat.desc}</p>
      `;

      const toolsWrap = document.createElement("div");
      toolsWrap.className = "flex flex-wrap gap-1.5 mt-3";

      cat.tools.forEach(tool => {
        const span = document.createElement("button");
        span.className = "px-2 py-1 rounded text-[11px] font-mono bg-slate-800/80 hover:bg-green-500 hover:text-black border border-slate-700/60 hover:border-green-400 text-slate-300 transition-colors";
        span.textContent = tool;
        span.addEventListener("click", () => {
          wheelInstance.fireTool(tool);
        });
        toolsWrap.appendChild(span);
      });

      card.appendChild(header);
      card.appendChild(toolsWrap);
      grid.appendChild(card);
    });
  }

  // 7. Render "Every way to drive it" table
  function renderWaysToDrive() {
    const tableBody = document.getElementById("ways-to-drive-body");
    if (!tableBody) return;
    tableBody.innerHTML = "";

    FLEX_DATA.waysToDrive.forEach(item => {
      const tr = document.createElement("tr");
      tr.className = "border-b border-slate-800/60 hover:bg-slate-900/40 transition-colors";
      tr.innerHTML = `
        <td class="py-3 px-4 font-mono text-xs text-green-400 font-semibold whitespace-nowrap">
          <span class="px-2 py-1 rounded bg-slate-800 border border-slate-700/80">${item.key}</span>
        </td>
        <td class="py-3 px-4 text-xs text-slate-300 leading-relaxed">
          ${item.action}
        </td>
      `;
      tableBody.appendChild(tr);
    });
  }

  // 8. Wheel Customizer Preferences (Page 6 & 7)
  const sizeBtns = document.querySelectorAll(".pref-size-btn");
  sizeBtns.forEach(btn => {
    btn.addEventListener("click", (e) => {
      sizeBtns.forEach(b => b.classList.remove("bg-green-500", "text-black", "font-bold"));
      btn.classList.add("bg-green-500", "text-black", "font-bold");
      const sz = btn.getAttribute("data-size");
      if (sz === "S") {
        wheelInstance.options.outerRadius = 115;
        wheelInstance.options.fanoutRadius = 180;
      } else if (sz === "M") {
        wheelInstance.options.outerRadius = 135;
        wheelInstance.options.fanoutRadius = 215;
      } else {
        wheelInstance.options.outerRadius = 150;
        wheelInstance.options.fanoutRadius = 235;
      }
      wheelInstance.render();
      if (window.soundEngine) window.soundEngine.tick();
    });
  });

  // Hold delay slider
  const delaySlider = document.getElementById("pref-delay-slider");
  const delayVal = document.getElementById("pref-delay-val");
  if (delaySlider && delayVal) {
    delaySlider.addEventListener("input", (e) => {
      delayVal.textContent = `${e.target.value} ms`;
    });
  }

  // Accent color swatches
  const colorSwatches = document.querySelectorAll(".pref-color-swatch");
  colorSwatches.forEach(swatch => {
    swatch.addEventListener("click", () => {
      colorSwatches.forEach(s => s.classList.remove("ring-2", "ring-white"));
      swatch.classList.add("ring-2", "ring-white");
      const hex = swatch.getAttribute("data-color");
      wheelInstance.setAccentColor(hex);
      if (window.soundEngine) window.soundEngine.trigger();
    });
  });

  // Sound toggle
  const soundToggle = document.getElementById("pref-sound-toggle");
  if (soundToggle) {
    soundToggle.addEventListener("change", (e) => {
      if (window.soundEngine) window.soundEngine.enabled = e.target.checked;
    });
  }

  // Initial render calls
  setApp("afterEffects");
  renderWaysToDrive();
});
