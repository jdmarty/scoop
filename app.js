$(document).ready(function () {
  //=======================================================
  //globals
  var advancedSearchObj = JSON.parse(localStorage.getItem("advancedSearch"));
  if (!advancedSearchObj) advancedSearchObj = {};
  var searchResults;
  var nutritionInformation;
  var yelpResults

  //intialize functions
  setAdvancedSearch();

  //Recipe Search
  function getRecipe(query) {
    var advancedOptions = parseAdvancedSearch();
    let queryURL =
      "https://api.spoonacular.com/recipes/complexSearch?apiKey=1679c56d3606492fbf0477a862a3177a&sort=random&addRecipeNutrition=true&query=" +
      query +
      advancedOptions;
    $.ajax({
      url: queryURL,
      method: "GET",
    }).then(function (response) {
      console.log(response);
      searchResults = response.results;
      console.log(searchResults);
      nutritionInformation = response.results[0];
      console.log(nutritionInformation);
      createSearchButtons();
      // createNutritionBlock(nutritionInformation);
    });
  }

  //create function to write nutrition block and call write nutrition function in ajax
  function createNutritionBlock(response) {
    if (response) $("#foodGoesHere").empty();
    var actualTitle = $("<h1 class='title has-text-white'>").text(
      response.title
    );
    $("#foodGoesHere").append(actualTitle);

    var foodImageDiv = $("<div class='food'>");
    var actualFoodImage = $("<img>").attr("src", response.image);
    foodImageDiv.append(actualFoodImage);
    $("#foodGoesHere").append(foodImageDiv);

    var actualCalories = $("<h1 class='subtitle has-text-white'>").text(
      "Calories: " + response.nutrition.nutrients[0].amount + "cal"
    );
    $("#foodGoesHere").append(actualCalories);

    var actualFat = $("<h1 class='subtitle has-text-white'>").text(
      "Fat: " + response.nutrition.nutrients[1].amount + "g"
    );
    $("#foodGoesHere").append(actualFat);

    var actualCarbs = $("<h1 class='subtitle has-text-white'>").text(
      "Carbs: " + response.nutrition.nutrients[3].amount + "g"
    );
    $("#foodGoesHere").append(actualCarbs);

    var actualSugar = $("<h1 class='subtitle has-text-white'>").text(
      "Sugar: " + response.nutrition.nutrients[5].amount + "g"
    );
    $("#foodGoesHere").append(actualSugar);

    var actualProtein = $("<h1 class='subtitle has-text-white'>").text(
      "Protein: " + response.nutrition.nutrients[9].amount + "g"
    );
    $("#foodGoesHere").append(actualProtein);
  }

  //function to create buttons after search
  function createSearchButtons() {
    $("#foodGoesHere")
      .empty()
      .append('<h1 class="title has-text-white">Search Results</h1>');
    searchResults.forEach((el, index) => {
      var newFoodButton = $("<button>")
        .addClass("button m-2")
        .attr("data-index", index)
        .text(el.title)
        .on("click", function () {
          createNutritionBlock(searchResults[$(this).attr("data-index")]);
          callYelp($(this).text());
        });
      $("#foodGoesHere").append(newFoodButton);
    });
    if (searchResults.length === 0)
      $("#foodGoesHere").append(
        '<h1 class="subtitle has-text-white">Oops! No results found</h1>'
      );
  }

  //Search button listener
  $("#searchButton").on("click", function (event) {
    // Preventing the button from trying to submit the form
    event.preventDefault();
    // Storing the food name
    var inputFood = $("#search").val().trim();
    //when button is pressed main will appear
    $("#main").css({"display":"block"}); 
    // Running the food function(passing in the food as an argument)
    getRecipe(inputFood);
  });

  //ADVANCED SEARCH --------------------------------------------------
  $("#advancedSearchBox").hide();

  //function to parse the object in storage to display the advanced search
  function setAdvancedSearch() {
    //set slider displays
    $("#calRange").val(advancedSearchObj.maxCalories);
    $("#calDisplay").text(advancedSearchObj.maxCalories);
    $("#protRange").val(advancedSearchObj.maxProtein);
    $("#protDisplay").text(advancedSearchObj.maxProtein);
    $("#carbsRange").val(advancedSearchObj.maxCarbs);
    $("#carbsDisplay").text(advancedSearchObj.maxCarbs);
    $("#sugarRange").val(advancedSearchObj.maxSugar);
    $("#sugarDisplay").text(advancedSearchObj.maxSugar);
    //set diet display
    $("#dietarySelect").val(advancedSearchObj.diet || "None");
    //loop through all checkboxes
    $('[type="checkbox"]').each((el) => {
      //find the allergy associated with this checkbox
      var thisAllergy = $($('[type="checkbox"]')[el]).attr("data-allergy");
      //if there are allergies saved and the saved allergy object is tru
      if (
        advancedSearchObj.allergies &&
        advancedSearchObj.allergies[thisAllergy] === true
      ) {
        $($('[type="checkbox"]')[el]).trigger("click");
      }
    });
  }

  // Listener for hide button
  $("#advancedMenuToggle").on("click", function (e) {
    e.preventDefault();
    $("#advancedSearchBox").slideToggle();
  });

  //Listener for sliders
  $('input[type="range"]').on("change", function (e) {
    e.preventDefault();
    var currentValue = $(e.currentTarget).val();
    var targetDisplay = $(e.currentTarget).attr("data-slider");
    $(`[data-display=${targetDisplay}]`).text(currentValue);
    advancedSearchObj[targetDisplay] = currentValue;
    localStorage.setItem("advancedSearch", JSON.stringify(advancedSearchObj));
  });

  //Listener for dietary dropdown
  $("#dietarySelect").on("change", function (e) {
    e.preventDefault();
    advancedSearchObj.diet = $(e.currentTarget).val();
    localStorage.setItem("advancedSearch", JSON.stringify(advancedSearchObj));
  });

  //Listener for checkbox
  $('[type="checkbox"]').on("click", function (e) {
    var targetAllergy = $(e.currentTarget).attr("data-allergy");
    if (!advancedSearchObj.allergies) advancedSearchObj.allergies = {};
    advancedSearchObj.allergies[targetAllergy] = e.currentTarget.checked;
    localStorage.setItem("advancedSearch", JSON.stringify(advancedSearchObj));
  });

  //function to parse the advance search object
  function parseAdvancedSearch() {
    var optionsString = "";
    if (advancedSearchObj.maxCalories)
      optionsString += `&maxCalories=${advancedSearchObj.maxCalories}`;
    if (advancedSearchObj.minProtein)
      optionsString += `&maxProtein=${advancedSearchObj.maxProtein}`;
    if (advancedSearchObj.maxCarbs)
      optionsString += `&maxCarbs=${advancedSearchObj.maxCarbs}`;
    if (advancedSearchObj.maxSugar)
      optionsString += `&maxSugar=${advancedSearchObj.maxSugar}`;
    if (advancedSearchObj.diet)
      optionsString += `&diet=${advancedSearchObj.diet}`;
    if (advancedSearchObj.allergies) {
      var allergiesString = "";
      for (let key in advancedSearchObj.allergies) {
        if (advancedSearchObj.allergies[key]) allergiesString += key + ",";
      }
      allergiesString += ",";
      optionsString += `&intolerances=${allergiesString.split(",,")[0]}`;
    }
    return optionsString;
  }

  //function to reset advanced search options
  function resetAS() {
    $('input[type="range"]').val("");
    $("[data-display]").each(
      (el) => ($("[data-display]")[el].textContent = "___")
    );
    $("#dietarySelect").val("None");
    $('[type="checkbox"]').each((el) => {
      if ($('[type="checkbox"]')[el].checked === true)
        $($('[type="checkbox"]')[el]).trigger("click");
    });
    advancedSearchObj = {};
    localStorage.setItem("advancedSearch", JSON.stringify(advancedSearchObj));
  }

  $("#resetAS").on("click", function () {
    resetAS();
  });

  //test button
  $("#testAS").on("click", function () {
    $("#foodGoesHere")
      .empty()
      .append('<h1 class="title has-text-white">Search Results</h1>');
    var array = [
      "item1",
      "item 2",
      "item 3",
      "item 2",
      "item 3",
      "item 2",
      "item 3",
      "item 2",
      "item 3",
    ];
    array.forEach((el) => {
      $("#foodGoesHere").append(`<button class="button m-2">${el}</button>`);
    });
  });

  //------------------------------------------------------------------

  function callYelp(term) {
    var APIkey =
      "Zc1zDKlQCxvJizw2y9oacMLa-ZU3dxlgJXxJsLDW3gR_zIdEa_7s1ffPqODwIt2tIS-YcIwPRSjzqx380E0GwCc90WrQJ8yvF-M52zNKSj20fUEPycHfNuGxZNI5X3Yx";
    var yelpQueryURL = `https://proxy-for-scoop.herokuapp.com/http://api.yelp.com/v3/businesses/search?term=${term}&location=Irvine`;

    $.ajax({
      url: yelpQueryURL,
      method: "GET",
      headers: { Authorization: "Bearer " + APIkey },
    }).then(function (response) {
      console.log(response);
      yelpResults = response
    });
  }

  //=========================================================================
});

// Yelp API call below:
