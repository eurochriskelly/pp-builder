const PREFERENCE_ALL = '__ALL__';
const RELATIVE_UPDATE_INTERVAL_MS = 60 * 1000;

function cssEscape(value) {
    if (typeof CSS !== 'undefined' && CSS.escape) {
        return CSS.escape(value);
    }
    return value.replace(/([\0-\x1F\x7F-\x9F!"#$%&'()*+,./:;<=>?@\[\]^`{|}~])/g, '\\$1');
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
        return decodeURIComponent(parts.pop().split(';').shift());
    }
    return null;
}

function setCookie(name, value, days = 365) {
    const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString();
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
}

function markSelectedCompetition(targetLink) {
    document.querySelectorAll('.competition-link').forEach(link => {
        link.classList.remove('selected-competition');
    });
    if (targetLink) {
        targetLink.classList.add('selected-competition');
    }
    const container = document.getElementById('event-manager');
    if (container) {
        if (targetLink && targetLink.dataset && targetLink.dataset.competitionName) {
            container.dataset.activeCompetition = targetLink.dataset.competitionName;
        } else {
            delete container.dataset.activeCompetition;
        }
    }
}

function triggerCompetitionLoad(link) {
    if (!link) {
        return;
    }
    markSelectedCompetition(link);
    if (window.htmx && typeof window.htmx.trigger === 'function') {
        window.htmx.trigger(link, 'click');
    } else {
        link.click();
    }
}

function updateCompetitionDisplay(container, preferenceValue) {
    const linksContainer = container.querySelector('[data-role="links-container"]');
    const selectionDisplay = container.querySelector('[data-role="selection-display"]');
    const selectionValue = container.querySelector('[data-role="selection-value"]');
    const label = container.querySelector('[data-role="competition-label"]');

    if (preferenceValue && preferenceValue !== PREFERENCE_ALL) {
        if (label) {
            label.textContent = '';
            label.classList.add('hidden');
        }
        if (linksContainer) linksContainer.classList.add('hidden');
        if (selectionDisplay) selectionDisplay.classList.remove('hidden');
        if (selectionValue) selectionValue.textContent = preferenceValue;
        container.dataset.activeCompetition = preferenceValue;
    } else {
        if (label) {
            label.textContent = 'Competitions:';
            label.classList.remove('hidden');
        }
        if (linksContainer) linksContainer.classList.remove('hidden');
        if (selectionDisplay) selectionDisplay.classList.add('hidden');
        if (selectionValue) selectionValue.textContent = '';
        delete container.dataset.activeCompetition;
    }
}

function resetPreferenceCookie(container) {
    const cookieName = container.dataset.preferenceCookie || 'preferredCompetition';
    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
}

function renderLastUpdated(container) {
    const display = container.querySelector('[data-role="last-updated"]');
    if (!display) {
        return;
    }
    const stored = Number(container.dataset.lastUpdated || '');
    if (!stored) {
        display.textContent = 'never';
        return;
    }
    const diffMs = Date.now() - stored;
    if (diffMs < 0) {
        display.textContent = 'just now';
        return;
    }
    const diffSeconds = Math.floor(diffMs / 1000);
    if (diffSeconds < 60) {
        display.textContent = 'just now';
        return;
    }
    const diffMinutes = Math.floor(diffSeconds / 60);
    if (diffMinutes < 60) {
        display.textContent = `${diffMinutes}m ago`;
        return;
    }
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) {
        display.textContent = `${diffHours}h ago`;
        return;
    }
    const diffDays = Math.floor(diffHours / 24);
    display.textContent = `${diffDays}d ago`;
}

function scheduleRelativeUpdates(container) {
    if (window._eventManagerLastUpdatedInterval) {
        clearInterval(window._eventManagerLastUpdatedInterval);
    }
    window._eventManagerLastUpdatedInterval = setInterval(() => {
        const currentContainer = document.getElementById('event-manager');
        if (!currentContainer) {
            clearInterval(window._eventManagerLastUpdatedInterval);
            window._eventManagerLastUpdatedInterval = null;
            return;
        }
        renderLastUpdated(currentContainer);
    }, RELATIVE_UPDATE_INTERVAL_MS);
}

function setLastUpdated(container, timestamp = Date.now()) {
    if (!container) {
        return;
    }
    container.dataset.lastUpdated = String(timestamp);
    renderLastUpdated(container);
    scheduleRelativeUpdates(container);
}

function clearLastUpdated(container) {
    if (!container) {
        return;
    }
    delete container.dataset.lastUpdated;
    renderLastUpdated(container);
    if (window._eventManagerLastUpdatedInterval) {
        clearInterval(window._eventManagerLastUpdatedInterval);
        window._eventManagerLastUpdatedInterval = null;
    }
}

function loadPreferredCompetition(container, preferenceOverride) {
    if (!container) {
        return;
    }
    const cookieName = container.dataset.preferenceCookie || 'preferredCompetition';
    const preference = typeof preferenceOverride === 'string' ? preferenceOverride : getCookie(cookieName);
    const links = Array.from(container.querySelectorAll('.competition-link'));
    if (links.length === 0) {
        return;
    }

    let targetLink = null;
    if (preference && preference !== PREFERENCE_ALL) {
        targetLink = links.find(link => link.dataset.competitionName === preference) || null;
    }
    if (!targetLink) {
        targetLink = links[0];
    }

    if (preference === PREFERENCE_ALL) {
        resetPreferenceCookie(container);
        updateCompetitionDisplay(container, PREFERENCE_ALL);
        showPreferenceModal(container);
        clearLastUpdated(container);
        return;
    }

    const activePreference = preference && preference !== PREFERENCE_ALL
        ? preference
        : null;

    triggerCompetitionLoad(targetLink);
    updateCompetitionDisplay(container, activePreference || targetLink.dataset.competitionName);
}

function showPreferenceModal(container) {
    if (!container) {
        return;
    }
    const modal = container.querySelector('#competition-preferences-modal');
    if (modal) {
        modal.classList.remove('hidden');
    }
}

function hidePreferenceModal(container) {
    if (!container) {
        return;
    }
    const modal = container.querySelector('#competition-preferences-modal');
    if (modal) {
        modal.classList.add('hidden');
    }
}

function handlePreferenceSelection(event) {
    const container = document.getElementById('event-manager');
    if (!container) {
        return;
    }
    const chosen = event.target.dataset.preference;
    if (!chosen) {
        return;
    }
    const cookieName = container.dataset.preferenceCookie || 'preferredCompetition';
    if (chosen === PREFERENCE_ALL) {
        resetPreferenceCookie(container);
        hidePreferenceModal(container);
        updateCompetitionDisplay(container, PREFERENCE_ALL);
        clearLastUpdated(container);
        return;
    }

    setCookie(cookieName, chosen);
    hidePreferenceModal(container);
    loadPreferredCompetition(container, chosen);
}

function bindPreferenceControls(container) {
    if (!container || container.dataset.preferenceBound === 'true') {
        return;
    }

    container.dataset.preferenceBound = 'true';
    const cookieName = container.dataset.preferenceCookie || 'preferredCompetition';
    const trigger = container.querySelector('.competition-preferences-trigger');
    if (trigger) {
        trigger.addEventListener('click', () => {
            showPreferenceModal(container);
        });
    }

    const modal = container.querySelector('#competition-preferences-modal');
    if (modal) {
        modal.addEventListener('click', event => {
            if (event.target.classList.contains('competition-preferences-option')) {
                handlePreferenceSelection(event);
            }
            if (event.target.classList.contains('competition-preferences-close')) {
                hidePreferenceModal(container);
                const preference = getCookie(cookieName);
                if (!preference) {
                    loadPreferredCompetition(container, PREFERENCE_ALL);
                }
            }
        });
    }

    container.querySelectorAll('.competition-link').forEach(link => {
        link.addEventListener('click', () => {
            markSelectedCompetition(link);
        });
    });

    const refreshButton = container.querySelector('[data-role="refresh-button"]');
    if (refreshButton) {
        refreshButton.addEventListener('click', () => {
            triggerCompetitionRefresh();
        });
    }
}

function getCompetitionLinkByName(name) {
    if (!name) {
        return null;
    }
    const selector = `.competition-link[data-competition-name="${cssEscape(name)}"]`;
    return document.querySelector(selector);
}

function triggerCompetitionRefresh() {
    const container = document.getElementById('event-manager');
    if (!container) {
        return;
    }

    const activeName = container.dataset.activeCompetition;
    let link = null;
    if (activeName) {
        link = getCompetitionLinkByName(activeName);
    }
    if (!link) {
        link = document.querySelector('.competition-link.selected-competition');
    }
    if (!link) {
        link = document.querySelector('.competition-link');
    }

    if (!link) {
        showPreferenceModal(container);
        return;
    }

    const url = link.getAttribute('hx-get');
    if (!url || !window.htmx) {
        showPreferenceModal(container);
        return;
    }

    window.htmx.ajax('GET', url, { target: '#content', swap: 'innerHTML' });
}

function initializeCompetitionPreferences(showModalIfMissing = true) {
    const container = document.getElementById('event-manager');
    if (!container) {
        return;
    }

    bindPreferenceControls(container);

    const cookieName = container.dataset.preferenceCookie || 'preferredCompetition';
    const existingPreference = getCookie(cookieName);
    if (!existingPreference && showModalIfMissing) {
        showPreferenceModal(container);
        return; // Wait for the user to choose before loading content
    }

    loadPreferredCompetition(container, existingPreference || PREFERENCE_ALL);
}

function toggleIcon(iconElement) {
    if (iconElement.getAttribute('data-lucide') === 'toggle-left') {
        iconElement.setAttribute('data-lucide', 'toggle-right');
    } else {
        iconElement.setAttribute('data-lucide', 'toggle-left');
    }
    lucide.createIcons(); // Reinitialize Lucide icons
}

document.addEventListener('DOMContentLoaded', () => {
    initializeCompetitionPreferences(true);
});

document.body.addEventListener('htmx:afterSwap', event => {
    if (event.target && event.target.id === 'event-manager') {
        initializeCompetitionPreferences(false);
    }
    if (event.target && event.target.id === 'content') {
        const container = document.getElementById('event-manager');
        if (container) {
            setLastUpdated(container, Date.now());
        }
    }
});
