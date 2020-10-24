$(document).ready(function() {
  //=======================================================
  //globals
  var advancedSearchObj = {};
  var searchResults
  var nutritionInformation

  //Recipe Search
  function getRecipe(query) {
    var advancedOptions = parseAdvancedSearch()
    let queryURL = "https://api.spoonacular.com/recipes/complexSearch?apiKey=1679c56d3606492fbf0477a862a3177a&sort=random&addRecipeNutrition=true&query="+query+advancedOptions;
    $.ajax ({
        url: queryURL,
        method: "GET" })
      .then(function(response) {
        console.log(response)
        searchResults = response.results
        console.log(searchResults)
        nutritionInformation = response.results[0]
        console.log(nutritionInformation)
        createNutritionBlock(nutritionInformation);
    })
  }

  
  //create function to write nutrition block and call write nutrition function in ajax
  function createNutritionBlock(response){
    if (response) $('#foodGoesHere').empty()
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
  // Listener for hide button
  // $('#advancedSearchBox').hide()
  $("#advancedMenuToggle").on("click", function (e) {
    e.preventDefault();
    $("#advancedSearchBox").slideToggle();
  });

  //Listener for sliders
  $('input[type="range"]')
    .on("change", function (e) {
      e.preventDefault();
      var currentValue = $(e.currentTarget).val();
      var targetDisplay = $(e.currentTarget).attr("data-slider");
      $(`[data-display=${targetDisplay}]`).text(currentValue);
      advancedSearchObj[targetDisplay] = currentValue;
      console.log(advancedSearchObj)
    });

  //Listener for dietary dropdown
  $('#dietarySelect').on('change', function(e) {
    e.preventDefault();
    advancedSearchObj.diet = $(e.currentTarget).val().toLowerCase()
  })

  //Listener for checkbox
  $('[type="checkbox"]').on('change', function(e) {
    var targetAllergy = $(e.currentTarget).attr('data-allergy')
    if (!advancedSearchObj.allergies) advancedSearchObj.allergies = {}
    advancedSearchObj.allergies[targetAllergy] = e.currentTarget.checked;
  })

  //function to parse the advance search object
  function parseAdvancedSearch() {
    var optionsString = ''
    if (advancedSearchObj.maxCalories) optionsString += `&maxCalories=${advancedSearchObj.maxCalories}`;
    if (advancedSearchObj.minProtein) optionsString += `&maxProtein=${advancedSearchObj.minProtein}`;
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
    return optionsString
  }

  //function to reset advanced search options
  function resetAS() {
    $('input[type="range"]').val('');
    $("[data-display]").each(el => $("[data-display]")[el].textContent = '___');
    $("#dietarySelect").val('None')
    $('[type="checkbox"]').each((el) => {
      if ($('[type="checkbox"]')[el].checked === true) $($('[type="checkbox"]')[el]).trigger('click')
    });
    advancedSearchObj = {}
    console.log(advancedSearchObj)
  }

  $('#resetAS').on('click', function() {

  })
  

  //test button
  $('#testAS').on('click', function() {
    resetAS()
  })
  //------------------------------------------------------------------



//=========================================================================
});

// Yelp API call below:
// var APIkey = "w6fgLGzcpy_01ZiH1W8Wdv69R_KtftS4uTpN-pt6VXrjQQeVISsP88yoeNd8gPFVWbDC2S4g-BRfKBJnQAYsFiTHlPE3HswwZTt7ZCHSSQ6UlupqIkn2TR9RE1OLX3Yx";
// var yelpClientID = "5W6-7gKDvj8VLYIHT96lzQ"
// var yelpQueryURL = "https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?term=pizza&location=Irvine";

// $.ajax({
//   url: yelpQueryURL,
//   method: "GET",
//   headers: { Authorization: "Bearer " + APIkey}})
//   .then(function(response) {
//       console.log(response);
//   });

