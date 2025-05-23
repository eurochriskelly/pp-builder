console.log('[CompetitionView] competitionView.public.js loaded');
console.log('[CompetitionView] document.readyState:', document.readyState);
document.addEventListener('DOMContentLoaded', function() {
    console.log('[CompetitionView] DOMContentLoaded - Initializing');
    
    const loadingEl = document.getElementById('competition-loading');
    const contentEl = document.getElementById('competition-content');
    
    if (!loadingEl || !contentEl) {
        console.error('[CompetitionView] Missing elements - loadingEl:', !!loadingEl, 'contentEl:', !!contentEl);
        console.log('[CompetitionView] Document body:', document.body.innerHTML);
        return;
    }

    console.log('[CompetitionView] Initial state - loadingEl classes:', loadingEl.classList.value, 
                'contentEl classes:', contentEl.classList.value);

    function handleLoadComplete(source) {
        console.log(`[CompetitionView] ${source} handler executing`);
        console.log('[CompetitionView] Pre-change - loadingEl hidden:', loadingEl.classList.contains('hidden'),
                   'contentEl hidden:', contentEl.classList.contains('hidden'));
        
        loadingEl.classList.add('hidden');
        contentEl.classList.remove('hidden');
        
        console.log('[CompetitionView] Post-change - loadingEl hidden:', loadingEl.classList.contains('hidden'),
                   'contentEl hidden:', contentEl.classList.contains('hidden'));
        
        // Verify DOM state after changes
        console.log('[CompetitionView] Computed loading display:', getComputedStyle(loadingEl).display);
        console.log('[CompetitionView] Computed content display:', getComputedStyle(contentEl).display);
    }

    // Add error handling for load event
    window.addEventListener('load', function() {
        try {
            console.log('[CompetitionView] Window.load event received');
            handleLoadComplete('window.load');
        } catch (e) {
            console.error('[CompetitionView] Error in load handler:', e);
        }
    });

    // Fallback timeout with more diagnostics
    const fallbackTimeout = setTimeout(() => {
        console.warn('[CompetitionView] Fallback timeout triggered');
        console.log('[CompetitionView] Document.readyState:', document.readyState);
        console.log('[CompetitionView] HTMX status:', window.htmx ? 'loaded' : 'missing');
        console.log('[CompetitionView] Web Components status:', 
                   window.customElements ? 'supported' : 'not supported');
        
        try {
            handleLoadComplete('timeout-fallback');
        } catch (e) {
            console.error('[CompetitionView] Error in fallback handler:', e);
        }
    }, 3000);

    // Cleanup timeout if load completes
    window.addEventListener('load', () => clearTimeout(fallbackTimeout));
});

// Tab switching functionality
function setupTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => {
                btn.classList.remove('active');
                btn.style.background = '#e0d1d6';
                btn.style.color = '#777';
                btn.style.fontWeight = 'normal';
            });
            
            tabContents.forEach(content => {
                content.classList.remove('active');
                content.style.display = 'none';
            });

            // Add active class to clicked button and show corresponding content
            button.classList.add('active');
            button.style.background = '#d5a8b6';
            button.style.color = 'white';
            button.style.fontWeight = 'bold';
            
            const tabId = button.dataset.tab;
            const content = document.querySelector(`[data-tab-content="${tabId}"]`);
            if (content) {
                content.style.display = 'block';
                content.classList.add('active');
            }
        });
    });
}

// Immediately handle case where document already loaded
if (document.readyState === 'interactive' || document.readyState === 'complete') {
    console.log('[CompetitionView] Document already readyState:', document.readyState, '- performing immediate loadComplete');
    const loadingEl = document.getElementById('competition-loading');
    const contentEl = document.getElementById('competition-content');
    if (loadingEl && contentEl) {
        loadingEl.classList.add('hidden');
        contentEl.classList.remove('hidden');
        console.log('[CompetitionView] Spinner hidden, content shown via immediate check');
        setupTabs();
    }
}

// Initialize tabs when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    setupTabs();
    
    // Set initial active tab styles
    const activeTab = document.querySelector('.tab-button.active');
    if (activeTab) {
        activeTab.style.background = '#d5a8b6';
        activeTab.style.color = 'white';
        activeTab.style.fontWeight = 'bold';
        
        const tabId = activeTab.dataset.tab;
        const activeContent = document.querySelector(`[data-tab-content="${tabId}"]`);
        if (activeContent) {
            activeContent.style.display = 'block';
        }
    }
    
    // Hide all other tab contents
    document.querySelectorAll('.tab-content').forEach(content => {
        if (!content.classList.contains('active')) {
            content.style.display = 'none';
        }
    });
});
