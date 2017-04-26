var app = angular.module("weather", []);
var daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
app.controller("weather", function($scope) {
    $scope.visibleCards = {};
    $scope.init = function(data){
      $scope.updateForecastCard(data);
    }

    $scope.updateForecastCard = function(data) {
      var dataLastUpdated = new Date(data.created);
      var sunrise = data.channel.astronomy.sunrise;
      var sunset = data.channel.astronomy.sunset;
      var current = data.channel.item.condition;
      var humidity = data.channel.atmosphere.humidity;
      var wind = data.channel.wind;

      var card = app.visibleCards[data.key];
      if (!card) {
        card = $(".cardTemplate").clone();
        $(card).removeClass("cardTemplate");
        $(card).children('.location').textContent = data.label;
        $(card).removeAttr('hidden');
        $('.main').append(card);
        app.visibleCards[data.key] = card;
      }

      // Verifies the data provide is newer than what's already visible
      // on the card, if it's not bail, if it is, continue and update the
      // time saved in the card
      var cardLastUpdatedElem = card.querySelector('.card-last-updated');
      var cardLastUpdated = cardLastUpdatedElem.textContent;
      if (cardLastUpdated) {
        cardLastUpdated = new Date(cardLastUpdated);
        // Bail if the card has more recent data then the data
        if (dataLastUpdated.getTime() < cardLastUpdated.getTime()) {
          return;
        }
      }
      cardLastUpdatedElem.textContent = data.created;

      card.querySelector('.description').textContent = current.text;
      card.querySelector('.date').textContent = current.date;
      card.querySelector('.current .icon').classList.add(app.getIconClass(current.code));
      card.querySelector('.current .temperature .value').textContent =
        Math.round(current.temp);
      card.querySelector('.current .sunrise').textContent = sunrise;
      card.querySelector('.current .sunset').textContent = sunset;
      card.querySelector('.current .humidity').textContent =
        Math.round(humidity) + '%';
      card.querySelector('.current .wind .value').textContent =
        Math.round(wind.speed);
      card.querySelector('.current .wind .direction').textContent = wind.direction;
      var nextDays = card.querySelectorAll('.future .oneday');
      var today = new Date();
      today = today.getDay();
      for (var i = 0; i < 7; i++) {
        var nextDay = nextDays[i];
        var daily = data.channel.item.forecast[i];
        if (daily && nextDay) {
          nextDay.querySelector('.date').textContent =
            app.daysOfWeek[(i + today) % 7];
          nextDay.querySelector('.icon').classList.add(app.getIconClass(daily.code));
          nextDay.querySelector('.temp-high .value').textContent =
            Math.round(daily.high);
          nextDay.querySelector('.temp-low .value').textContent =
            Math.round(daily.low);
        }
      }
      if (app.isLoading) {
        app.spinner.setAttribute('hidden', true);
        app.container.removeAttribute('hidden');
        app.isLoading = false;
      }
    };
});

app.controller("header",function($scope){

});
