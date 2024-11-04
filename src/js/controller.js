import * as model from './model.js';
import {MODEL_CLOSE_SEC} from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchview.js';
import resultsView from './views/resultView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import {async} from 'regenerator-runtime';

// if (module.hot) {
//   module.hot.accept();
// }

// https://forkify-api.herokuapp.com/v2

const controlRecipes = async function(){
  try{
    const id = window.location.hash.slice(1);

    if(!id) return;

    recipeView.renderSpinner();

    // 0) Update results view to mark seleted search result
    resultsView.update(model.getSearchResultPage());
    // 1) Updating bookmakrs view
    bookmarksView.update(model.state.bookmarks);
    
    // 2) Loading Recipe
    await model.loadRecipe(id);
    
    // 3) Rendering Recipe
    recipeView.render(model.state.recipe);
    

  } catch (err){
    recipeView.renderError();
  }

};

const controlSearchResult = async function() {
  try{
    resultsView.renderSpinner();

    // 1) Get search query
    const query = searchView.getQuery();
    if(!query) return;

    // 2) Load search results
    await model.loadSearchResult(query);

    // 3) Render results
    // resultsView.render(model.state.search.result);
    resultsView.render(model.getSearchResultPage(1));

    // 4) Render the initial pagination buttons
    paginationView.render(model.state.search);

  } catch(err) {
    console.log(err);
  }
};


const controlPagination = function(goToPage) {
      // 1) Render NEW results;
      resultsView.render(model.getSearchResultPage(goToPage));

      // 2) Render NEW pagination buttons
      paginationView.render(model.state.search);
}

const controlServings = function(newServings) {
  // Update the recipe servings (in state)
  model.updateServings(newServings);

  // Update the recipe view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);

}

const controlAddBookmark = function() {
  // 1) Add/Remove bookmark
  if(!model.state.recipe.bookmarks) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // 2) Update recipe view
  recipeView.update(model.state.recipe);

  // 3) Render bookmarks
  bookmarksView.render(model.state.bookmarks);
}

const controlBookmarks = function() {
  bookmarksView.render(model.state.bookmarks);
}

const controlAddRecipe = async function(newRecipe) {

  try{
    // Show loading spinner
    addRecipeView.renderSpinner();

    // Upload new recipe data
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe)

    // Render recipe
    recipeView.render(model.state.recipe);

    // Success method
    addRecipeView.renderMessage();

    // Render bookmark view
    bookmarksView.render(model.state.bookmarks);

    // Change id in URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`); // pushState(state, title, url <= Important) => changing URL without reloading the page
    // window.history.back() // Going back to last page

    // Close form window
    setTimeout(function(){
      addRecipeView.toggleWindow()
    }, MODEL_CLOSE_SEC * 1000);

  } catch(err){
    console.error('💥', err);
    addRecipeView.renderError(err.message);
  }

}

const init = function() {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHendlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResult);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
}

init();

x = y=> y+10;
console.log (x);
//311