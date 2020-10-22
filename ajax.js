
$(document).ready(function() {
    console.log("rock and roll");
    
    
    
    
    
    function getSource(id) {
    let queryURL = "https://api.spoonacular.com/recipes/complexSearch?apiKey=233e29c645cf4eaca90809d7a4c85141&query="+id;
    
    $.ajax ({
        url: queryURL,
        method: "GET" })
        .then(function(response) {
            console.log(response);
            // JSON.stringify(response)
            createNutritionBlock(response);
    
              ;
    
    })}
    
    //create function to write nutrition block and call write nutrition function in ajax
    function createNutritionBlock(response){
      var foodImageDiv = $("<div class='food'>");
            var actualFoodImage = $("<img>").attr("src", response.results[0].image);
            console.log(actualFoodImage);
            foodImageDiv.append(actualFoodImage);
            console.log(foodImageDiv)
            $("#foodGoesHere").html(foodImageDiv);
            getRecipe()
    
    
            function getRecipe() {
              var spoonFoodId = response.results[0].id
              console.log(spoonFoodId);
              var queryURLForRecipes = "https://api.spoonacular.com/recipes/"+spoonFoodId+"/similar?apiKey=233e29c645cf4eaca90809d7a4c85141"
    
              $.ajax ({
                url: queryURLForRecipes,
                method: "GET" })
                .then(function(recipe) {
                  console.log(recipe);
                  var foodLink = $("<a>").attr("href", recipe[0].sourceUrl).text(recipe[0].sourceUrl);
                  
                  // var actualRecipe = $("<p></p>").text(recipe[0].sourceURL);
                  // console.log(actualRecipe)
                  console.log(foodLink);
                  // foodLink.append(actualRecipe)
                  foodImageDiv.append(foodLink)
                  $("#recipeGoesHere").html(foodImageDiv);
                })
              }
            }
    
    
    
    $("#searchButton").on("click", function(event) {
        // Preventing the button from trying to submit the form
        event.preventDefault();
        // Storing the food name
        var inputFood = $("#search").val().trim();
    
        // Running the food function(passing in the food as an argument)
        getSource(inputFood);
      });
    });
    
    
    
    
    
    
    
    
    
    
    
    // $('#button').on("click", function(event) {
    //     event.preventDefault();
    
    
    // var inputFood = $('#search').val().trim();
    // getSource(inputFood);
    
    // })