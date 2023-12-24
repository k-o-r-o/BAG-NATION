function searchImages() {
    const searchTerm = document.getElementById('search-box').value;
    fetch(`/api/images/search?term=${encodeURIComponent(searchTerm)}`)
        .then(response => response.json())
        .then(data => {
            console.log('Search results:', data); // Log the data for debugging
            displayResults(data);
        })
        .catch(error => console.error('Error:', error));
}

function displayResults(data) {
    const resultsContainer = document.getElementById('results-container');
    resultsContainer.innerHTML = ''; // Clear previous results
    data.forEach(image => {
        const resultContainer = document.createElement('div');
        resultContainer.classList.add('result');

        const imgElement = document.createElement('img');
        imgElement.src = `/uploads/${image.imageUrl}`; // Correct URL for the image
        imgElement.alt = image.name;

        const nameElement = document.createElement('p');
        nameElement.textContent = image.name;

        resultContainer.appendChild(imgElement);
        resultContainer.appendChild(nameElement);
        resultsContainer.appendChild(resultContainer);
    });
}

