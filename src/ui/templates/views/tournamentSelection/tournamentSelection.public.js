async function generateAndCopyToken(uuid) {
    try {
        const response = await fetch('/event/' + uuid + '/generate-token');
        const data = await response.json();
        const baseUrl = window.location.origin;
        const shareUrl = `${baseUrl}/event/${uuid}?token=${data.token}`;
        copyToClipboard(shareUrl)
            .then(() => alert('Link copied to clipboard: ' + shareUrl))
            .catch(err => alert('Failed to copy link: ' + shareUrl));
    } catch (err) {
        console.error('Error generating token:', err);
        alert('Failed to generate shareable link.');
    }
}

function copyToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        return navigator.clipboard.writeText(text)
            .catch(err => {
                console.error('Failed to copy with clipboard API: ', err);
                return fallbackCopyToClipboard(text);
            });
    } else {
        console.warn('Clipboard API not available, using fallback');
        return fallbackCopyToClipboard(text);
    }
}

function fallbackCopyToClipboard(text) {
    return new Promise((resolve, reject) => {
        var textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        try {
            var successful = document.execCommand('copy');
            if (successful) {
                resolve();
            } else {
                reject(new Error('Fallback copy failed'));
            }
        } catch (err) {
            reject(err);
        } finally {
            document.body.removeChild(textarea);
        }
    });
}

function copyEventLink(uuid) {
    const baseUrl = window.location.origin;
    const shareUrl = `${baseUrl}/event/${uuid}`;
    copyToClipboard(shareUrl)
        .then(() => alert('Link copied to clipboard: ' + shareUrl))
        .catch(err => alert('Failed to copy link: ' + shareUrl));
}
