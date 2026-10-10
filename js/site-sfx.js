(function() {
    let sfxList = [];
    let currentAudio = null;
    let currentItem = null;
    let currentVolume = 0.8;

    async function initSFXHub() {
        try {
            const res = await fetch('/SFX/sfx_catalog.json');
            if (res.ok) {
                sfxList = await res.json();
                renderSiteSFX();
            }
        } catch (e) {
            console.warn('Could not load /SFX/sfx_catalog.json:', e);
        }
    }

    function renderSiteSFX(filteredList) {
        const grid = document.getElementById('site-sfx-grid');
        const countLabel = document.getElementById('site-sfx-count-label');
        if (!grid) return;

        const list = filteredList || sfxList;
        if (countLabel) {
            countLabel.textContent = `Showing ${list.length} sound${list.length === 1 ? '' : 's'}`;
        }

        if (list.length === 0) {
            grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:40px;color:var(--text-muted);font-size:14px;">No sounds found matching your search. Try another query.</div>';
            return;
        }

        grid.innerHTML = list.map(item => {
            const isPlaying = currentItem && currentItem.id === item.id && currentAudio && !currentAudio.paused;
            return `
            <div class="site-sfx-card ${isPlaying ? 'playing' : ''}" onclick="window.playSiteSFX('${item.id}')" data-id="${item.id}">
                <button class="site-sfx-playbtn" onclick="event.stopPropagation(); window.playSiteSFX('${item.id}')" title="Play ${item.name}">
                    ${isPlaying ? '⏸' : '▶'}
                </button>
                <div style="flex:1;overflow:hidden;">
                    <div style="font-size:13.5px;font-weight:600;color:#fff;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">
                        ${item.name}
                    </div>
                    <div style="font-size:11px;color:var(--text-muted);margin-top:3px;display:flex;gap:6px;align-items:center;">
                        <span style="color:#D4AF37;font-weight:500;">${item.category}</span>
                        <span>•</span>
                        <span>${item.duration}</span>
                        <span>•</span>
                        <span>${item.size}</span>
                    </div>
                </div>
                <a href="${item.file}" download="${item.id}.wav" onclick="event.stopPropagation();" title="Download WAV" style="color:var(--text-muted);font-size:14px;padding:6px;border-radius:6px;display:flex;align-items:center;justify-content:center;transition:color 0.15s;" onmouseover="this.style.color='#D4AF37'" onmouseout="this.style.color='var(--text-muted)'">
                    ⬇
                </a>
            </div>
            `;
        }).join('');
    }

    window.playSiteSFX = function(id) {
        const item = sfxList.find(s => s.id === id);
        if (!item) return;

        const masterBtn = document.getElementById('site-sfx-master-playbtn');
        const nowTitle = document.getElementById('site-sfx-now-title');
        const nowMeta = document.getElementById('site-sfx-now-meta');
        const eq = document.getElementById('site-sfx-equalizer');

        // If clicking currently playing audio, toggle pause
        if (currentItem && currentItem.id === id && currentAudio) {
            if (!currentAudio.paused) {
                currentAudio.pause();
                if (masterBtn) masterBtn.textContent = '▶';
                if (eq) eq.classList.remove('active');
                renderSiteSFX(getFilteredList());
                return;
            } else {
                currentAudio.play();
                if (masterBtn) masterBtn.textContent = '⏸';
                if (eq) eq.classList.add('active');
                renderSiteSFX(getFilteredList());
                return;
            }
        }

        // Stop previous audio
        if (currentAudio) {
            currentAudio.pause();
            currentAudio = null;
        }

        currentItem = item;
        currentAudio = new Audio(item.file);
        currentAudio.volume = currentVolume;

        if (nowTitle) nowTitle.textContent = item.name;
        if (nowMeta) nowMeta.textContent = `${item.category} · ${item.duration} · 44.1kHz WAV Studio Master`;
        if (masterBtn) masterBtn.textContent = '⏸';
        if (eq) eq.classList.add('active');

        renderSiteSFX(getFilteredList());

        currentAudio.play().catch(e => {
            console.warn('Playback error:', e);
        });

        currentAudio.onended = function() {
            if (masterBtn) masterBtn.textContent = '▶';
            if (eq) eq.classList.remove('active');
            renderSiteSFX(getFilteredList());
        };
    };

    window.toggleSiteMasterPlay = function() {
        if (!currentItem && sfxList.length > 0) {
            window.playSiteSFX(sfxList[0].id);
            return;
        }
        if (currentItem) {
            window.playSiteSFX(currentItem.id);
        }
    };

    window.setSiteSFXVolume = function(val) {
        currentVolume = parseFloat(val);
        if (currentAudio) {
            currentAudio.volume = currentVolume;
        }
    };

    function getFilteredList() {
        const searchInput = document.getElementById('site-sfx-search');
        const query = searchInput ? searchInput.value.trim().toLowerCase() : '';
        const activeCatBtn = document.querySelector('.site-sfx-cat-btn.active');
        const category = activeCatBtn ? activeCatBtn.getAttribute('data-sitecat') : 'all';

        return sfxList.filter(item => {
            const matchesCat = (category === 'all' || item.category === category);
            const matchesQuery = (!query || item.name.toLowerCase().includes(query) || item.category.toLowerCase().includes(query));
            return matchesCat && matchesQuery;
        });
    }

    document.addEventListener('DOMContentLoaded', function() {
        initSFXHub();

        // Search input handler
        const searchInput = document.getElementById('site-sfx-search');
        if (searchInput) {
            searchInput.addEventListener('input', function() {
                renderSiteSFX(getFilteredList());
            });
        }

        // Category filter buttons
        const catBtns = document.querySelectorAll('.site-sfx-cat-btn');
        catBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                catBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                renderSiteSFX(getFilteredList());
            });
        });
    });
})();
