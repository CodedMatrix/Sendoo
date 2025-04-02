// History JavaScript for Sendoo

document.addEventListener('DOMContentLoaded', function() {
    // Filter functionality
    const filterStatus = document.getElementById('filter-status');
    const deliveryItems = document.querySelectorAll('.delivery-item');

    if (filterStatus) {
        filterStatus.addEventListener('change', function() {
            const selectedStatus = this.value.toLowerCase();

            deliveryItems.forEach(item => {
                const statusBadge = item.querySelector('.badge');
                const itemStatus = statusBadge.textContent.toLowerCase();

                if (selectedStatus === 'all' || itemStatus === selectedStatus) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    }

    // Cancel delivery functionality
    const cancelButtons = document.querySelectorAll('.btn-danger');
    cancelButtons.forEach(button => {
        button.addEventListener('click', function() {
            if (confirm('Are you sure you want to cancel this delivery?')) {
                const deliveryItem = this.closest('.delivery-item');
                const statusBadge = deliveryItem.querySelector('.badge');

                // Update status to canceled
                statusBadge.textContent = 'Canceled';
                statusBadge.classList.remove('badge-primary', 'badge-success', 'badge-warning');
                statusBadge.classList.add('badge-danger');

                // Disable cancel button
                this.disabled = true;
                this.innerHTML = '<i class="fas fa-times"></i> Canceled';

                // Show success message
                const successMessage = document.createElement('div');
                successMessage.classList.add('alert', 'alert-success');
                successMessage.innerHTML = `
                    <div class="alert-icon">
                        <i class="fas fa-check-circle"></i>
                    </div>
                    <div class="alert-content">
                        <h4>Success!</h4>
                        <p>Your delivery has been canceled successfully.</p>
                    </div>
                `;

                // Insert success message before delivery list
                const deliveryList = document.querySelector('.history-list');
                deliveryList.parentElement.insertBefore(successMessage, deliveryList);

                // Remove success message after 3 seconds
                setTimeout(function() {
                    successMessage.remove();
                }, 3000);
            }
        });
    });

    // Repeat delivery functionality
    const repeatButtons = document.querySelectorAll('.btn-outline:not(.btn-danger):not(.btn-primary)');
    repeatButtons.forEach(button => {
        button.addEventListener('click', function() {
            alert('This feature is coming soon!');
        });
    });

    // Pagination functionality (for future implementation)
    const prevButton = document.querySelector('.pagination-prev');
    const nextButton = document.querySelector('.pagination-next');

    if (prevButton && nextButton) {
        prevButton.addEventListener('click', function() {
            if (!this.disabled) {
                // Handle previous page
                alert('Previous page functionality will be implemented in the future.');
            }
        });

        nextButton.addEventListener('click', function() {
            if (!this.disabled) {
                // Handle next page
                alert('Next page functionality will be implemented in the future.');
            }
        });
    }

    // Logout functionality
    const logoutLinks = document.querySelectorAll('.logout-link');
    logoutLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            // Show confirmation dialog
            if (confirm('Are you sure you want to logout?')) {
                // Redirect to index page
                window.location.href = 'index.html';
            }
        });
    });
});
