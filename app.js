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
})}

//create function to write nutrition block and call write nutrition function in ajax
function createNutritionBlock(response){
  var foodImageDiv = $("<div class='food'>");
        var actualFoodImage = $("<img>").attr("src", response.results[0].image);
        console.log(actualFoodImage);
        foodImageDiv.append(actualFoodImage);
        console.log(foodImageDiv)
        $("#foodGoesHere").html(foodImageDiv);
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
