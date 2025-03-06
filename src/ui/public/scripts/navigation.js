function toggleDropdown(event) {
    event.preventDefault();
    event.stopPropagation();
    const dropdown = event.target.closest('.dropdown, .login-dropdown');
    const isActive = dropdown.classList.contains('active');
    document.querySelectorAll('.dropdown, .login-dropdown').forEach(d => d.classList.remove('active'));
    if (!isActive) dropdown.classList.add('active');
}
document.addEventListener('click', function(event) {
    const dropdowns = document.querySelectorAll('.dropdown, .login-dropdown');
    dropdowns.forEach(dropdown => {
        if (!dropdown.contains(event.target)) {
            dropdown.classList.remove('active');
        }
    });
});

