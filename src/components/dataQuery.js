export default function dataQuery(selected, { data }, runtime) {
  var genre = data.genre.distinct
    .concat(
      data.genre_two.distinct.filter(
        (item) => data.genre.distinct.indexOf(item) < 0
      )
    )
    .sort();
  var universes = data.universes.distinct.concat(
    data.sub_universes.distinct.filter(
      (item) => data.universes.distinct.indexOf(item) < 0
    )
  );
  var holiday = data.holiday.distinct;
  var exclusive = data.exclusive.distinct;
  var years = data.years.distinct;
  var movies = data.movies.nodes;
  var directors = data.directors.distinct;
  var decades = data.years.distinct;
  var studio = data.studio.distinct;
  var rated = data.rated.distinct;

  var genre_flag = false;
  var universes_flag = false;
  var holiday_flag = false;
  var exclusive_flag = false;
  var years_flag = false;
  var directors_flag = false;
  var decades_flag = false;
  var studio_flag = false;
  var rated_flag = false;

  if (selected) {
    for (let object of selected) {
      switch (object.category.toUpperCase()) {
        case "GENRE":
          if (!genre_flag) {
            genre = [];
            genre_flag = true;
          }
          genre.push(object.value);
          break;
        case "UNIVERSE":
          if (!universes_flag) {
            universes = [];
            universes_flag = true;
          }
          universes.push(object.value);
          break;
        case "HOLIDAY":
          if (!holiday_flag) {
            holiday = [];
            holiday_flag = true;
          }
          holiday.push(object.value);
          break;
        case "EXCLUSIVE":
          if (!exclusive_flag) {
            exclusive = [];
            exclusive_flag = true;
          }
          exclusive.push(object.value);
          break;
        case "YEAR":
          if (!years_flag) {
            years = [];
            years_flag = true;
          }
          years.push(object.value);
          break;
        case "DIRECTOR":
          if (!directors_flag) {
            directors = [];
            directors_flag = true;
          }
          directors.push(object.value);
          break;
        case "DECADE":
          if (!decades_flag) {
            decades = [];
            decades_flag = true;
          }
          let dec = object.value.split("-");
          let low = parseInt(dec[0]);
          let high = parseInt(dec[1]);
          for (low; low <= high; low++) {
            decades.push(low.toString());
          }
          break;
        case "STUDIO":
          if (!studio_flag) {
            studio = [];
            studio_flag = true;
          }
          studio.push(object.value);
          break;
        case "RATED":
          if (!rated_flag) {
            rated = [];
            rated_flag = true;
          }
          rated.push(object.value);
          break;
        default:
          break;
      }
    }
  }
  movies = movies.filter(function (e) {
    return (
      (genre.includes(e.Genre) || genre.includes(e.Genre_2)) &&
      exclusive.includes(e.Exclusive) &&
      holiday.includes(e.Holiday) &&
      (universes.includes(e.Universe) || universes.includes(e.Sub_Universe)) &&
      years.includes(e.Year.toString()) &&
      directors.includes(e.Director) &&
      decades.includes(e.Year.toString()) &&
      studio.includes(e.Studio) &&
      rated.includes(e.Rated) &&
      parseInt(e.Runtime.split(" ")[0]) <= runtime[1] &&
      parseInt(e.Runtime.split(" ")[0]) >= runtime[0]
    );
  });
  return movies;
}
