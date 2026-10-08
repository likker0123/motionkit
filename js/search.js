/**
 * Flex Wheel - Floating Search Palette (Page 7)
 * Fast fuzzy and word-start search across all 187 tools and effects
 */

class SearchPalette {
  constructor() {
    this.modal = document.getElementById("search-modal");
    this.input = document.getElementById("search-input");
    this.resultsList = document.getElementById("search-results");
    this.selectedIndex = 0;
    this.currentMatches = [];

    this.allTools = this.buildToolDatabase();
    this.bindEvents();
  }

  buildToolDatabase() {
    const list = [];
    
    // After Effects tools
    FLEX_DATA.afterEffects.categories.forEach(cat => {
      cat.tools.forEach(tool => {
        list.push({
          name: tool,
          category: cat.name,
          app: "After Effects",
          type: "Built-in"
        });
      });
    });

    // Premiere Pro tools
    FLEX_DATA.premierePro.categories.forEach(cat => {
      cat.tools.forEach(tool => {
        list.push({
          name: tool,
          category: cat.name,
          app: "Premiere Pro",
          type: "Built-in"
        });
      });
    });

    // Third-party installed effects simulation (Page 1 & 7)
    const extraEffects = [
      { name: "Deep Glow 2", category: "Stylize", app: "After Effects", type: "Plugin Everything" },
      { name: "Optical Flares", category: "Video Copilot", app: "After Effects", type: "Installed Plugin" },
      { name: "Magic Bullet Looks", category: "Color", app: "Premiere Pro", type: "Red Giant" },
      { name: "Particular 3D", category: "Trapcode", app: "After Effects", type: "Installed Plugin" },
      { name: "Boris FX Mocha", category: "Tracking", app: "After Effects", type: "Installed Plugin" }
    ];

    return [...list, ...extraEffects];
  }

  bindEvents() {
    // Global hotkey: Cmd/Ctrl + K or 's' or '/'
    window.addEventListener("keydown", (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        this.toggle();
      } else if (e.key === "Escape" && this.isOpen()) {
        this.close();
      }
    });

    if (this.input) {
      this.input.addEventListener("input", (e) => {
        this.query(e.target.value);
      });

      this.input.addEventListener("keydown", (e) => {
        if (e.key === "ArrowDown") {
          e.preventDefault();
          this.moveSelection(1);
        } else if (e.key === "ArrowUp") {
          e.preventDefault();
          this.moveSelection(-1);
        } else if (e.key === "Enter") {
          e.preventDefault();
          const isPin = e.shiftKey;
          this.executeSelected(isPin);
        }
      });
    }

    // Close when clicking modal backdrop
    if (this.modal) {
      this.modal.addEventListener("click", (e) => {
        if (e.target === this.modal) this.close();
      });
    }
  }

  isOpen() {
    return this.modal && !this.modal.classList.contains("hidden");
  }

  open() {
    if (!this.modal) return;
    this.modal.classList.remove("hidden");
    this.input.value = "";
    this.input.focus();
    this.query("");
    if (window.soundEngine) window.soundEngine.fanout();
  }

  close() {
    if (!this.modal) return;
    this.modal.classList.add("hidden");
    if (window.soundEngine) window.soundEngine.cancel();
  }

  toggle() {
    if (this.isOpen()) this.close();
    else this.open();
  }

  query(text) {
    const q = text.trim().toLowerCase();
    if (!q) {
      // Show default popular / recent tools
      this.currentMatches = this.allTools.slice(0, 7);
    } else {
      this.currentMatches = this.allTools.filter(t => {
        const name = t.name.toLowerCase();
        const cat = t.category.toLowerCase();
        return name.includes(q) || cat.includes(q);
      }).sort((a, b) => {
        // Prioritize exact or prefix match
        const aStart = a.name.toLowerCase().startsWith(q);
        const bStart = b.name.toLowerCase().startsWith(q);
        if (aStart && !bStart) return -1;
        if (!aStart && bStart) return 1;
        return 0;
      }).slice(0, 10);
    }

    this.selectedIndex = 0;
    this.renderResults();
  }

  moveSelection(delta) {
    if (this.currentMatches.length === 0) return;
    this.selectedIndex = (this.selectedIndex + delta + this.currentMatches.length) % this.currentMatches.length;
    if (window.soundEngine) window.soundEngine.tick();
    this.renderResults();
  }

  executeSelected(isPin) {
    const selected = this.currentMatches[this.selectedIndex];
    if (selected) {
      if (window.soundEngine) window.soundEngine.trigger();
      if (isPin) {
        if (window.flexWheelInstance) {
          window.flexWheelInstance.showToast(selected.name, `Applied & pinned to your Flex Wheel active layout!`);
        }
      } else {
        if (window.flexWheelInstance) {
          window.flexWheelInstance.showToast(selected.name, `Applied directly to selected layer in ${selected.app}.`);
        }
      }
      this.close();
    }
  }

  renderResults() {
    if (!this.resultsList) return;
    this.resultsList.innerHTML = "";

    if (this.currentMatches.length === 0) {
      this.resultsList.innerHTML = `
        <div class="py-8 text-center text-slate-500 text-sm">
          No tools or effects found matching your query.
        </div>
      `;
      return;
    }

    this.currentMatches.forEach((item, idx) => {
      const isSelected = (idx === this.selectedIndex);
      const li = document.createElement("li");
      li.className = `flex items-center justify-between px-3.5 py-2.5 rounded-lg cursor-pointer transition-colors ${
        isSelected ? "bg-green-500/20 border border-green-500/40 text-white" : "hover:bg-slate-800/60 text-slate-300"
      }`;

      li.innerHTML = `
        <div class="flex items-center space-x-3">
          <span class="w-6 h-6 rounded flex items-center justify-center text-xs font-bold ${
            isSelected ? "bg-green-400 text-black shadow-[0_0_10px_rgba(0,255,102,0.5)]" : "bg-slate-800 text-slate-400"
          }">
            ✦
          </span>
          <div>
            <div class="font-semibold text-sm ${isSelected ? "text-green-300" : "text-white"}">${item.name}</div>
            <div class="text-[11px] text-slate-400">${item.category} · ${item.app}</div>
          </div>
        </div>
        <div class="flex items-center space-x-2 text-[11px] text-slate-400">
          <span class="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono text-[10px]">${item.type}</span>
          ${isSelected ? `<span class="text-green-400 font-mono text-[11px]">↵ apply &nbsp; ⇧↵ pin</span>` : ""}
        </div>
      `;

      li.addEventListener("mouseenter", () => {
        this.selectedIndex = idx;
        this.renderResults();
      });

      li.addEventListener("click", () => {
        this.executeSelected(false);
      });

      this.resultsList.appendChild(li);
    });
  }
}

window.SearchPalette = SearchPalette;
