$(document).ready(function () {
  //=======================================================
  //globals
  var advancedSearchObj = JSON.parse(localStorage.getItem("advancedSearch"));
  if (!advancedSearchObj) advancedSearchObj = {};
  var spoonSearchResults;
  var yelpResults;
  var currentYelpSearchTerm = 'Pizza'
  var currentYelpSearchLocation = JSON.parse(localStorage.getItem('lastYelpLocation'))  
  if (!currentYelpSearchLocation) currentYelpSearchLocation = 'Irvine'     

  //initial setup of advanced search parameters from storage
  setAdvancedSearch();

  //Recipe Search
  function getRecipe(query) {
    //get advanced search options to add to the end of the string
    var advancedOptions = parseAdvancedSearch();
    //query url
    let queryURL =
      "https://api.spoonacular.com/recipes/complexSearch?apiKey=1679c56d3606492fbf0477a862a3177a&sort=random&addRecipeNutrition=true&query=" 
      + query 
      + advancedOptions;
    //ajax call to find recipes
    $.ajax({
      url: queryURL,
      method: "GET",
    }).then(function (response) {
      //save the search results and create search buttons
      spoonSearchResults = response.results;
      createSearchButtons();
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

    var actualRecipe = $('<a target="_blank">').attr("href", response.sourceUrl).text('View Recipe').addClass('button')
    console.log(actualRecipe);
   
    $("#foodGoesHere").append(actualProtein);
    $('#foodGoesHere').append(actualRecipe);
  }

  //function to create buttons after search
  function createSearchButtons() {
    //parse the food block down to just the header
    $("#foodGoesHere").html('<h1 class="title has-text-white">Search Results</h1>');
    //for every item in the search results...
    spoonSearchResults.forEach((el, index) => {
      //create a new button
      var newFoodButton = $("<button>")
        //add classes
        .addClass("box is-inline-block m-2")
        //give it an index and text to be used for event listener
        .attr("data-index", index)
        .text(el.title)
        //on click, create a nutrition block from that index and run a yelp search for that term
        .on("click", function () {
          createNutritionBlock(spoonSearchResults[$(this).attr("data-index")]);
          currentYelpSearchTerm = $(this).text()
          callYelp(currentYelpSearchTerm, currentYelpSearchLocation);
        });
        //append the new button
      $("#foodGoesHere").append(newFoodButton);
    });
    //if there are no search results, display message
    if (spoonSearchResults.length === 0)
      $("#foodGoesHere").html(
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
  
  });

  //------------------------------------------------------------------

  //Yelp API------------------------------------------------------------
  function callYelp(term, location) {
    var APIkey =
      "Zc1zDKlQCxvJizw2y9oacMLa-ZU3dxlgJXxJsLDW3gR_zIdEa_7s1ffPqODwIt2tIS-YcIwPRSjzqx380E0GwCc90WrQJ8yvF-M52zNKSj20fUEPycHfNuGxZNI5X3Yx";
    var yelpQueryURL = `https://proxy-for-scoop.herokuapp.com/http://api.yelp.com/v3/businesses/search?term=${term}&location=${location}`;

    $.ajax({
      url: yelpQueryURL,
      method: "GET",
      headers: { Authorization: "Bearer " + APIkey },
    }).then(function (response) {
      console.log(response);
      yelpResults = response
      currentYelpSearchLocation = location
      localStorage.setItem('lastYelpLocation', JSON.stringify(currentYelpSearchLocation))
      buildYelpCards()
    });
  }

  //function build yelp cards after a yelp call
  function buildYelpCards() {
    //remove all previous yelp results
    $('#yelpSection').children('.card').remove()
    for (let i=0; i < 10; i++) {
      var thisBusiness = yelpResults.businesses[i];
      var newCard = $("<div>").addClass('card my-2');
      //header
        var newCardHeader = $('<header>').addClass('class-header');
          var newHeaderTitle = $('<p>').addClass('card-header-title').text(thisBusiness.name);
        newCardHeader.append(newHeaderTitle)
      newCard.append(newCardHeader)  
      //body
        var newCardBody = $('<div>').addClass('card-content');
          var newCardContent = $('<div>').addClass('content');
            var newPrice = $('<p>').text('Price: '+thisBusiness.price);
            var newRating = $('<p>').text('Rating: '+thisBusiness.rating);
            var newAddress = $('<p>').text(thisBusiness.location.display_address.join(' '));
          newCardContent.append(newPrice, newRating, newAddress);
        newCardBody.append(newCardContent);
      newCard.append(newCardBody);
      //footer
        var newCardFooter = $('<div>').addClass('card-footer');
          var newYelpLink = $('<a target="_blank">').addClass('card-footer-item').attr('href', thisBusiness.url).text('Check it out on Yelp');
        newCardFooter.append(newYelpLink);
      newCard.append(newCardFooter);
      $('#yelpSection').append(newCard)
    }
  }

  //function to search a new location with the yelp search
  $('#yelpSearch').on('click', function(e) {
    e.preventDefault()
    callYelp(currentYelpSearchTerm, $('#yelpLocation').val())
  })

  callYelp(currentYelpSearchTerm, currentYelpSearchLocation)
  //-------------------------------------------------------------------------

  //=========================================================================
});


