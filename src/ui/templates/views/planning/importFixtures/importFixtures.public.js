function toggleImportMethod(method) {
  const uploadSection = document.getElementById('upload-section');
  const pasteSection = document.getElementById('paste-section');
  const fileInput = document.getElementById('file');
  const pasteInput = document.getElementById('pastedData');

  // Ensure elements exist before manipulating them
  if (!uploadSection || !pasteSection || !fileInput || !pasteInput) {
    console.error('Import form elements not found for toggling.');
    return;
  }

  if (method === 'upload') {
    uploadSection.style.display = 'block';
    pasteSection.style.display = 'none';
    fileInput.required = true;
    pasteInput.required = false;
  } else {
    uploadSection.style.display = 'none';
    pasteSection.style.display = 'block';
    fileInput.required = false;
    pasteInput.required = true;
  }
}

// Function to initialize or re-initialize the toggle state
function initializeToggleState() {
    const uploadRadio = document.getElementById('upload-csv');
    const pasteRadio = document.getElementById('paste-data');
    
    if (uploadRadio?.checked) {
         toggleImportMethod('upload');
    } else if (pasteRadio?.checked) {
         toggleImportMethod('paste');
    } else if (uploadRadio) { 
         // Default to upload if neither is checked (shouldn't happen with 'checked' attribute, but safe fallback)
         uploadRadio.checked = true;
         toggleImportMethod('upload');
    }
}

// Run initialization when the script loads initially
// Use DOMContentLoaded for initial page load if this script runs early
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeToggleState);
} else {
    // If DOM is already ready, run immediately
    initializeToggleState();
}

// Ensure HTMX swap also triggers the re-initialization
document.body.addEventListener('htmx:afterSwap', function(event) {
console.log('triggered')
    // Check if the swapped content contains our import form elements
    if (event.detail.target.querySelector('#import-form')) {
         initializeToggleState();
    } else if (event.detail.target.id === 'import-fixtures' || event.detail.target.closest('#import-fixtures')) {
         // Also handle cases where the target itself or a parent is the container
         initializeToggleState();
    }
});


function clearPastedData() {
    const pasteInput = document.getElementById('pastedData');
    if (pasteInput) {
        pasteInput.value = '';
    } else {
         console.error('Paste textarea not found for clearing.');
    }
}
