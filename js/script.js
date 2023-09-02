const allButton = document.getElementById('all-button');
const musicButton = document.getElementById('music-button');
const comedyButton = document.getElementById('comedy-button');
const drawingButton = document.getElementById('drawing-button');

let selectedCategoryId = '1000'; 

const handleShowAll = () => {
    selectedCategoryId = '1000';
    setActiveButton(allButton);
    fetchVideosAndDisplay(selectedCategoryId);
};

const handleMusic = () => {
    selectedCategoryId = '1001';
    fetchVideosAndDisplay(selectedCategoryId);
    setActiveButton(musicButton);
};

const handleComedy = () => {
    selectedCategoryId = '1003';
    fetchVideosAndDisplay(selectedCategoryId);
    setActiveButton(comedyButton);
};

const handleDrawing = () => {
    selectedCategoryId = '1005';
    fetchVideosAndDisplay(selectedCategoryId);
    setActiveButton(drawingButton);
};

const handleSortByView = () => {
    fetchVideosAndDisplay(selectedCategoryId, true);
};

const setActiveButton = (button) => {
    allButton.classList.remove('active');
    musicButton.classList.remove('active');
    comedyButton.classList.remove('active');
    drawingButton.classList.remove('active');

    button.classList.add('active');
};

const fetchVideosAndDisplay = (categoryId, sortByViews = false) => {
    fetch(`https://openapi.programming-hero.com/api/videos/category/${categoryId}`)
        .then(response => response.json())
        .then(data => {
            const originalData = JSON.parse(JSON.stringify(data.data));
            
            if (sortByViews) {
                const sortedData = originalData.slice().sort((a, b) => {
                    const aViews = parseInt(a.others.views.replace('K', '000').replace('.', ''));
                    const bViews = parseInt(b.others.views.replace('K', '000').replace('.', ''));
                    return bViews - aViews;
                });
                displayVideos(sortedData);
            } else {
                displayVideos(originalData);
            }
        })
        .catch(error => console.error('Error:', error));
};

const displayVideos = (videos) => {
    const videoContainer = document.getElementById('video-container');
    videoContainer.textContent = '';

    if (videos.length === 0) {
        videoContainer.innerHTML = `
        <div class="col-span-full flex items-center justify-center text-center">
                <div>
                    <img src="icon.png" alt="No data" class="mx-auto mt-20 mb-10"/>
                    <p>Sorry, No data available</p>
                </div>
            </div>`;
    } else {
        videos.forEach(video => {
            const videoCard = document.createElement('div');
            videoCard.classList = `card bg-gray-100 p-4 shadow-xl relative`;

            const seconds = video.others.posted_date;
            let timeDisplay = '';
            if (seconds) {
                const hours = Math.floor(seconds / 3600);
                const minutes = Math.floor((seconds % 3600) / 60);
                timeDisplay = `<div class="absolute bottom-4 right-4 bg-slate-800 text-white p-2 rounded-md">${hours}h ${minutes}m ago</div>`;
            }

            const verifiedIcon = video.authors[0].verified ? '<i class="fas fa-check-circle text-blue-500"></i>' : '';

            videoCard.innerHTML = `
                <div class="relative">
                    <img src="${video.thumbnail}" alt="Thumbnail" class="w-full h-48 object-cover"/>
                    ${timeDisplay}
                </div>
                <div class="flex items-center mt-4">
                    <img src="${video.authors[0].profile_picture}" alt="Author" class="w-12 h-12 rounded-full"/>
                    <div class="ml-4">
                        <h2 class="text-xl font-bold">${video.title}</h2>
                        <h3 class="text-lg">${video.authors[0].profile_name} ${verifiedIcon}</h3>
                        <p>${video.others.views} views</p>
                    </div>
                </div>
            `;

            videoContainer.appendChild(videoCard);
        });
    }
};


handleShowAll();





