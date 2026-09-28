const searchBox = document.querySelector(".searchBox");
const searchForm = document.querySelector(".search-form");
const recipeContainer = document.querySelector(".recipe-container");
const recipeDetailsContent = document.querySelector(".recipe-details-content");
const recipeDetails = document.querySelector(".recipe-details");
const recipeCloseBtn = document.querySelector(".recipe-close-btn");

// ===========================
// Fetch Recipes from API
// ===========================
const fetchRecipes = async (query) => {
    recipeContainer.innerHTML = "<h2>Fetching recipes...</h2>";

    try {
        const data = await fetch(
            `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`
        );
        const response = await data.json();

        recipeContainer.innerHTML = "";

        if (!response.meals) {
            recipeContainer.innerHTML = "<h2>No recipes found</h2>";
            return;
        }

        response.meals.forEach((meal) => {
            const recipeDiv = document.createElement("div");
            recipeDiv.classList.add("recipe");

            recipeDiv.innerHTML = `
                <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                <h3>${meal.strMeal}</h3>
                <p><span>${meal.strArea}</span> Dish</p>
                <p>Category: <span>${meal.strCategory}</span></p>
            `;

            const button = document.createElement("button");
            button.textContent = "View Recipe";

            button.addEventListener("click", () => {
                openRecipePopUp(meal);
            });

            recipeDiv.appendChild(button);
            recipeContainer.appendChild(recipeDiv);
        });

    } catch (error) {
        recipeContainer.innerHTML = "<h2>Error fetching recipes</h2>";
        console.error(error);
    }
};

// ===========================
// Open Recipe Popup
// ===========================
const openRecipePopUp = (meal) => {
    recipeDetailsContent.innerHTML = `
        <h2>${meal.strMeal}</h2>

        <h3>Ingredients</h3>
        <ul>${fetchIngredients(meal)}</ul>

        <h3>Instructions</h3>
        <p>${meal.strInstructions}</p>
    `;

    recipeDetails.style.display = "block";
};

// ===========================
// Close Popup
// ===========================
recipeCloseBtn.addEventListener("click", () => {
    recipeDetails.style.display = "none";
});

// ===========================
// Fetch Ingredients
// ===========================
const fetchIngredients = (meal) => {
    let ingredientsList = "";

    for (let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}`];
        const measure = meal[`strMeasure${i}`];

        if (ingredient && ingredient.trim() !== "") {
            ingredientsList += `<li>${measure} ${ingredient}</li>`;
        } else {
            break;
        }
    }
    return ingredientsList;
};

// ===========================
// Handle Search
// ===========================
searchForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const searchQuery = searchBox.value.trim();

    if (!searchQuery) {
        recipeContainer.innerHTML = "<h2>Please enter a recipe name</h2>";
        return;
    }

    fetchRecipes(searchQuery);
});
