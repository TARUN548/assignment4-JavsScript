// Get DOM elements
const searchBtn = document.getElementById('search-btn');
const mealList = document.getElementById('meal');
const mealDetailsContent = document.querySelector('.meal-details-content');
const recipeCloseBtn = document.getElementById('recipe-close-btn');

// Event listeners
searchBtn.addEventListener('click', handleSearch);
mealList.addEventListener('click', handleMealClick);
recipeCloseBtn.addEventListener('click', hideRecipeModal);

// Function to handle meal search
function handleSearch() {
    const searchInput = document.getElementById('search-input').value.trim();
    fetchMealList(searchInput);
}

// Function to fetch meal list based on ingredients
function fetchMealList(ingredient) {
    fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`)
        .then(response => response.json())
        .then(data => displayMealList(data.meals))
        .catch(error => console.error('Error fetching meal list:', error));
}

// Function to display meal list
function displayMealList(meals) {
    const mealListContainer = document.getElementById('meal');
    let html = "";

    if (meals) {
        meals.forEach(meal => {
            html += createMealItemHTML(meal);
        });
        mealListContainer.classList.remove('notFound');
    } else {
        html = "Sorry, we didn't find any meal!";
        mealListContainer.classList.add('notFound');
    }

    mealListContainer.innerHTML = html;
}

// Function to create HTML for a meal item
function createMealItemHTML(meal) {
    return `
        <div class="meal-item" data-id="${meal.idMeal}">
            <div class="meal-img">
                <img src="${meal.strMealThumb}" alt="food">
            </div>
            <div class="meal-name">
                <h3>${meal.strMeal}</h3>
                <a href="#" class="recipe-btn">Get Recipe</a>
            </div>
        </div>
    `;
}

// Function to handle meal item click and fetch recipe
function handleMealClick(event) {
    event.preventDefault();
    if (event.target.classList.contains('recipe-btn')) {
        const mealItem = event.target.parentElement.parentElement;
        fetchMealRecipe(mealItem.dataset.id);
    }
}

// Function to fetch meal recipe
function fetchMealRecipe(mealId) {
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`)
        .then(response => response.json())
        .then(data => displayMealRecipe(data.meals))
        .catch(error => console.error('Error fetching meal recipe:', error));
}

// Function to display meal recipe in a modal
function displayMealRecipe(meal) {
    console.log(meal);
    const mealDetails = meal[0];
    const html = `
        <h2 class="recipe-title">${mealDetails.strMeal}</h2>
        <p class="recipe-category">${mealDetails.strCategory}</p>
        <div class="recipe-instruct">
            <h3>Instructions:</h3>
            <p>${mealDetails.strInstructions}</p>
        </div>
        <div class="recipe-meal-img">
            <img src="${mealDetails.strMealThumb}" alt="">
        </div>
        <div class="recipe-link">
            <a href="${mealDetails.strYoutube}" target="_blank">Watch Video</a>
        </div>
    `;
    mealDetailsContent.innerHTML = html;
    mealDetailsContent.parentElement.classList.add('showRecipe');
}

// Function to hide recipe modal
function hideRecipeModal() {
    mealDetailsContent.parentElement.classList.remove('showRecipe');
}
