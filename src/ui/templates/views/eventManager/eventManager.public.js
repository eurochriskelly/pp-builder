// Function to set up competition click listeners
function setupCompetitionListeners() {
    document.querySelectorAll('.competition-link').forEach(link => {
        link.addEventListener('click', function() {
            // Remove selected class from all links
            document.querySelectorAll('.competition-link').forEach(el => {
                el.classList.remove('selected-competition');
            });
            
            // Add selected class to clicked link
            this.classList.add('selected-competition');
        });
    });
}

function toggleIcon(iconElement) {
    if (iconElement.getAttribute('data-lucide') === 'toggle-left') {
        iconElement.setAttribute('data-lucide', 'toggle-right');
    } else {
        iconElement.setAttribute('data-lucide', 'toggle-left');
    }
    lucide.createIcons(); // Reinitialize Lucide icons
}

// Set up listeners when the page loads
document.addEventListener('DOMContentLoaded', setupCompetitionListeners);

// Also listen for HTMX after-swap events in case the competition links are reloaded
document.body.addEventListener('htmx:afterSwap', setupCompetitionListeners);