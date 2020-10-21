$(document).ready(function() {
console.log("rock and roll");





function getSource(id) {
let queryURL = "https://api.spoonacular.com/recipes/complexSearch?apiKey=233e29c645cf4eaca90809d7a4c85141&query="+id+"&maxFat=25&number=2";

$.ajax ({
    url: queryURL,
    method: "GET" })
    .then(function(response) {
        console.log("current response: " + JSON.stringify(response));
        // JSON.stringify(response)
        var foodImageDiv = $("<div class='food'>");
        var actualFoodImage = $("<img>").attr("src", response.results[0].image);
        console.log(actualFoodImage);
        foodImageDiv.append(actualFoodImage);
        console.log(foodImageDiv)
        $("#foodGoesHere").append(foodImageDiv);
    
})}

$("#button").on("click", function(event) {
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
