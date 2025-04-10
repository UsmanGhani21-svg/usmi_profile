
document.getElementById('contact-form').addEventListener('submit', async function (event) {
    event.preventDefault(); // Prevent the default form submission

    const formData = new FormData(this); // Collect form data
    const formObject = Object.fromEntries(formData.entries()); // Convert form data to an object

    try {
        const response = await fetch('/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded', // Sending form data in URL encoded format
            },
            body: new URLSearchParams(formObject), // Send form data in URLSearchParams format
        });

        const result = await response.json(); // Parse JSON response
        
        if (response.ok) {
            // Success: Display success message on the page and reset form
            document.getElementById('form-feedback').innerHTML = `<p>Message sent successfully!</p>`;
            document.getElementById('contact-form').reset(); // Reset the form fields
        } else {
            // Failure: Display error message on the page
            document.getElementById('form-feedback').innerHTML = `<p>Error: ${result.message || 'Failed to send message'}</p>`;
        }
    } catch (error) {
        console.error('Error:', error); // Log errors
        // Display generic error message on the page
        document.getElementById('form-feedback').innerHTML = `<p>There was an issue sending your message. Please try again later.</p>`;
    }
});
