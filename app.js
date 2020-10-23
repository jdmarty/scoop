$(document).ready(function() {
  //=======================================================
  //globals
  var advancedSearchObj = {};
  var nutritionInformation

  //Recipe Search
  function getRecipe(query) {
    var advancedOptions = parseAdvancedSearch()
    let queryURL = "https://api.spoonacular.com/recipes/complexSearch?apiKey=233e29c645cf4eaca90809d7a4c85141&query="+query+advancedOptions;
    $.ajax ({
        url: queryURL,
        method: "GET" })
      .then(function(response) {
        var recipeId = response.results[0].id
        var queryURLForRecipes = "https://api.spoonacular.com/recipes/"+recipeId+"/information?includeNutrition=true&apiKey=233e29c645cf4eaca90809d7a4c85141"
        $.ajax({
          url: queryURLForRecipes,
          method: "GET"
        }).then(function(response) {
          nutritionInformation = response
          console.log(nutritionInformation)
      })
    })
  }

  
  //create function to write nutrition block and call write nutrition function in ajax
  function createNutritionBlock(nutritionInformation){
    var foodImageDiv = $("<div class='food'>");
    var actualFoodImage = $("<img>").attr("src", response.results[0].image);
    foodImageDiv.append(actualFoodImage);
    $("#foodGoesHere").html(foodImageDiv);
  }
  
  
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
      console.log(advancedSearchObj);
    });

  //Listener for dietary dropdown
  $('#dietarySelect').on('change', function(e) {
    e.preventDefault();
    advancedSearchObj.diet = $(e.currentTarget).val()
    console.log(advancedSearchObj)
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
    console.log(advancedSearchObj)
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
var yelpQueryURL = "https://api.yelp.com/v3/businesses/"+yelpClientID;

// $.ajax({
//   url: yelpQueryURL,
//   method: "GET",
//   headers: { Authorization: "Bearer "+apiKey }})
//   .then(function(response) {
//       console.log(queryURL);
//       console.log(response);
//   });



