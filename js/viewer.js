// Function to display position photos and x-rays
function displayImages(imageUrls) {
    const imageContainer = document.getElementById('image-container');
    imageContainer.innerHTML = ''; // Clear previous images

    imageUrls.forEach(url => {
        const img = document.createElement('img');
        img.src = url;
        img.alt = 'Position Photo or X-ray';
        img.style.width = '100%'; // Set the width of the image
        img.style.margin = '10px 0'; // Add some margin
        // You can customize styles as needed
        imageContainer.appendChild(img);
    });
}

// Example usage
const imageUrls = ['url_to_position_photo_1', 'url_to_xray_1']; // Add actual URLs here
displayImages(imageUrls);