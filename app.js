$(document).ready(function() {
  //=======================================================
  //globals
  var advancedSearchObj = {};
  var nutritionInformation

  //Recipe Search
  function getRecipe(query) {
    var advancedOptions = parseAdvancedSearch()
    let queryURL = "https://api.spoonacular.com/recipes/complexSearch?apiKey=233e29c645cf4eaca90809d7a4c85141&sort=healthiness&sortDirection=desc&query="+query+advancedOptions;
    $.ajax ({
        url: queryURL,
        method: "GET" })
      .then(function(response) {
        var recipeId = response.results[0].id
        var queryURLForRecipes = "https://api.spoonacular.com/recipes/"+recipeId+"/information?includeNutrition=true&apiKey=815dd17c93024961a0ec520e355d0775"
        $.ajax({
          url: queryURLForRecipes,
          method: "GET"
        }).then(function(response) {
          nutritionInformation = response
          console.log(nutritionInformation)
          createNutritionBlock(response);
      })
    })
  }

  
  //create function to write nutrition block and call write nutrition function in ajax
  function createNutritionBlock(response){
    var actualTitle = $("<h1 class='title has-text-white'>").text(response.title)
    $("#foodGoesHere").append(actualTitle);

    var foodImageDiv = $("<div class='food'>");
    var actualFoodImage = $("<img>").attr("src", response.image);
    foodImageDiv.append(actualFoodImage);
    $("#foodGoesHere").append(foodImageDiv);

    var actualCalories = $("<h1 class='subtitle has-text-white'>").text("Calories: " + response.nutrition.nutrients[0].amount + "cal")
    $("#foodGoesHere").append(actualCalories);

    var actualFat = $("<h1 class='subtitle has-text-white'>").text("Fat: " + response.nutrition.nutrients[1].amount + "g")
    $("#foodGoesHere").append(actualFat);

    var actualCarbs = $("<h1 class='subtitle has-text-white'>").text("Carbs: " + response.nutrition.nutrients[3].amount + "g")
    $("#foodGoesHere").append(actualCarbs);

    var actualSugar = $("<h1 class='subtitle has-text-white'>").text("Sugar: " + response.nutrition.nutrients[5].amount + "g")
    $("#foodGoesHere").append(actualSugar);

    var actualProtein = $("<h1 class='subtitle has-text-white'>").text("Protein: " + response.nutrition.nutrients[9].amount + "g")
    $("#foodGoesHere").append(actualProtein);    
  }
  
  //response.nutrition.nutrients.find(function(el){
  //  return el.title==="Calories";
 // })


  
  //Search button listener
  $("#searchButton").on("click", function(event) {
      // Preventing the button from trying to submit the form
      event.preventDefault();
      // Storing the food name
      var inputFood = $("#search").val().trim();
      // Running the food function(passing in the food as an argument)
      getRecipe(inputFood);
    });


  //ADVANCED SEARCH --------------------------------------------------
  //Listener for hide button
  $('#advancedSearchBox').hide()
  $("#advancedMenuToggle").on("click", function (e) {
    e.preventDefault();
    $("#advancedSearchBox").slideToggle();
  });

  //Listener for sliders
  $("#advancedSearchBox")
    .find('input[type="range"]')
    .on("change", function (e) {
      e.preventDefault();
      var currentValue = $(e.currentTarget).val();
      var targetDisplay = $(e.currentTarget).attr("data-slider");
      $(`[data-display=${targetDisplay}]`).text(currentValue);
      advancedSearchObj[targetDisplay] = currentValue;
    });

  //Listener for dietary dropdown
  $('#dietarySelect').on('change', function(e) {
    e.preventDefault();
    advancedSearchObj.diet = $(e.currentTarget).val().toLowerCase()
  })

  //Listener for checkbox
  $('[type="checkbox"]').on('change', function(e) {
    var targetAllergy = $(e.currentTarget).attr('data-allergy')
    if (!advancedSearchObj.allergies) {
      advancedSearchObj.allergies = {}
      advancedSearchObj.allergies[targetAllergy] = e.currentTarget.checked
    } else {
      advancedSearchObj.allergies[targetAllergy] = e.currentTarget.checked;
    }
  })

  //function to parse the advance search object
  function parseAdvancedSearch() {
    var optionsString = ''
    if (advancedSearchObj.maxCalories) optionsString += `&maxCalories=${advancedSearchObj.maxCalories}`;
    if (advancedSearchObj.minProtein) optionsString += `&minProtein=${advancedSearchObj.minProtein}`;
    if (advancedSearchObj.maxCarbs) optionsString += `&maxCarbs=${advancedSearchObj.maxCarbs}`;
    if (advancedSearchObj.maxSugar) optionsString += `&maxSugar=${advancedSearchObj.maxSugar}`;
    if (advancedSearchObj.diet) optionsString += `&diet=${advancedSearchObj.diet}`;
    if (advancedSearchObj.allergies) {
      var allergiesString = ''
      for (let key in advancedSearchObj.allergies) {
        if (advancedSearchObj.allergies[key]) allergiesString += key+','
      }
      allergiesString += ','
      optionsString += `&intolerances=${allergiesString.split(',,')[0]}`;
    }
    console.log(optionsString)
    return optionsString
  }

  //test button
  $('#testAS').on('click', function() {

  })
  //------------------------------------------------------------------



//=========================================================================
});

// Yelp API call below:
var APIkey = "w6fgLGzcpy_01ZiH1W8Wdv69R_KtftS4uTpN-pt6VXrjQQeVISsP88yoeNd8gPFVWbDC2S4g-BRfKBJnQAYsFiTHlPE3HswwZTt7ZCHSSQ6UlupqIkn2TR9RE1OLX3Yx";
var yelpClientID = "5W6-7gKDvj8VLYIHT96lzQ"
var yelpQueryURL = "https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?term=pizza&location=Irvine";

$.ajax({
  url: yelpQueryURL,
  method: "GET",
  headers: { Authorization: "Bearer " + APIkey}})
  .then(function(response) {
      console.log(response);
  });

