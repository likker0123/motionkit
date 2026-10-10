(function() {
    let sfxList = [];
    let currentAudio = null;
    let currentPlayingId = null;

    async function loadCatalog() {
        try {
            const res = await fetch('/SFX/sfx_catalog.json');
            if (res.ok) {
                sfxList = await res.json();
                renderSFX();
            }
        } catch (e) {
            console.warn('Could not load /SFX/sfx_catalog.json:', e);
        }
    }

    function renderSFX(filteredList) {
        const container = document.getElementById('panel-sfx-items-container');
        if (!container) return;
        const list = filteredList || sfxList;

        if (list.length === 0) {
            container.innerHTML = '<div style="color:#9ca3af;font-size:10px;text-align:center;padding:15px;">No sounds found matching filter</div>';
            return;
        }

        container.innerHTML = list.map(item => {
            const isPlaying = currentPlayingId === item.id;
            return `
            <div class="panel-sfx-item ${isPlaying ? 'playing' : ''}" data-sfx-id="${item.id}">
                <button class="sfx-play-btn" onclick="window.panelPlaySFX('${item.id}', '${item.file}', '${item.name}')" title="Play ${item.name}">
                    ${isPlaying ? '⏸' : '▶'}
                </button>
                <div style="flex:1;overflow:hidden;cursor:pointer;" onclick="window.panelPlaySFX('${item.id}', '${item.file}', '${item.name}')">
                    <div style="font-size:10.5px;font-weight:600;color:#fff;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">
                        ${item.name}
                    </div>
                    <div style="font-size:8.5px;color:#9ca3af;display:flex;gap:6px;align-items:center;">
                        <span style="color:#D4AF37;">${item.category}</span>
                        <span>•</span>
                        <span>${item.duration}</span>
                        <span>•</span>
                        <span>${item.size}</span>
                    </div>
                </div>
                <button class="sfx-add-btn" onclick="window.panelAddToComp('${item.name}', '${item.file}')" title="Add to After Effects Comp">
                    + Comp
                </button>
            </div>
            `;
        }).join('');
    }

    window.panelPlaySFX = function(id, file, name) {
        const status = document.getElementById('panel-sfx-current-status');
        const vol = document.getElementById('panel-sfx-vol');

        if (currentPlayingId === id && currentAudio && !currentAudio.paused) {
            currentAudio.pause();
            currentPlayingId = null;
            if (status) status.textContent = 'Paused';
            renderSFX(getActiveFiltered());
            return;
        }

        if (currentAudio) {
            currentAudio.pause();
            currentAudio = null;
        }

        currentPlayingId = id;
        currentAudio = new Audio(file);
        if (vol) currentAudio.volume = parseFloat(vol.value);

        if (status) status.textContent = '▶ ' + name;
        renderSFX(getActiveFiltered());

        currentAudio.play().catch(e => {
            console.warn('Audio playback error:', e);
        });

        currentAudio.onended = function() {
            currentPlayingId = null;
            if (status) status.textContent = 'Finished · Click ▶ to audition';
            renderSFX(getActiveFiltered());
        };
    };

    window.panelAddToComp = function(name, file) {
        if (window.soundEngine && window.soundEngine.tick) {
            window.soundEngine.tick();
        }
        
        const toast = document.getElementById('toast');
        const toastMsg = document.getElementById('toast-msg');
        if (toast && toastMsg) {
            toastMsg.textContent = '✓ Sound added to Timeline: ' + name;
            toast.classList.add('show');
            setTimeout(() => toast.classList.remove('show'), 2200);
        }

        if (window.__adobe_cep__) {
            try {
                const cs = new CSInterface();
                cs.evalScript(`app.beginUndoGroup("Import MotionKit SFX"); try { var comp = app.project.activeItem; if (comp && comp instanceof CompItem) { alert("Imported ${name} into active comp!"); } } catch(e){} app.endUndoGroup();`);
            } catch(e) {}
        }
    };

    function getActiveFiltered() {
        const searchInput = document.getElementById('panel-sfx-search');
        const query = searchInput ? searchInput.value.trim().toLowerCase() : '';
        const activeCatBtn = document.querySelector('.panel-sfx-filter.active');
        const category = activeCatBtn ? activeCatBtn.getAttribute('data-panelsfxcat') : 'all';

        return sfxList.filter(item => {
            const matchesCat = (category === 'all' || item.category === category);
            const matchesQuery = (!query || item.name.toLowerCase().includes(query) || item.category.toLowerCase().includes(query));
            return matchesCat && matchesQuery;
        });
    }

    document.addEventListener('DOMContentLoaded', function() {
        loadCatalog();

        const searchInput = document.getElementById('panel-sfx-search');
        if (searchInput) {
            searchInput.addEventListener('input', function() {
                renderSFX(getActiveFiltered());
            });
        }

        const catBtns = document.querySelectorAll('.panel-sfx-filter');
        catBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                catBtns.forEach(b => {
                    b.classList.remove('active');
                    b.classList.remove('primary');
                });
                this.classList.add('active');
                this.classList.add('primary');
                renderSFX(getActiveFiltered());
            });
        });

        const btnStop = document.getElementById('btn-panel-sfx-stop');
        if (btnStop) {
            btnStop.addEventListener('click', function() {
                if (currentAudio) {
                    currentAudio.pause();
                    currentAudio = null;
                }
                currentPlayingId = null;
                const status = document.getElementById('panel-sfx-current-status');
                if (status) status.textContent = 'Audio Stopped';
                renderSFX(getActiveFiltered());
            });
        }

        const volInput = document.getElementById('panel-sfx-vol');
        if (volInput) {
            volInput.addEventListener('input', function() {
                if (currentAudio) {
                    currentAudio.volume = parseFloat(this.value);
                }
            });
        }
    });
})();
