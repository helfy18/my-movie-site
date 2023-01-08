export default function dataQuery(selected, {data}) {
  var genre = data.genre.distinct.concat(data.genre_two.distinct.filter((item) => data.genre.distinct.indexOf(item) < 0)).sort();
  var universes = data.universes.distinct;
  var sub_universes = data.sub_universes.distinct;
  var holiday = data.holiday.distinct;
  var exclusive = data.exclusive.distinct;
  var years = data.years.distinct;
  var movies = data.movies.nodes;
  var directors = data.directors.distinct

  var genre_flag = false;
  var universes_flag = false;
  var sub_universes_flag = false;
  var holiday_flag = false;
  var exclusive_flag = false;
  var years_flag = false;
  var directors_flag = false;
  
  if (selected) {
    for (let object of selected) {
      switch (object.category.toUpperCase()) {
        case "GENRES":
          if (!genre_flag) {
            genre = [];
            genre_flag = true;
          }
          genre.push(object.value);
          break;
        case "UNIVERSES":
          if (!universes_flag) {
            universes = [];
            universes_flag = true;
          }
          universes.push(object.value);
          break;
        case "SUB UNIVERSES":
          if (!sub_universes_flag) {
            sub_universes = [];
            sub_universes_flag = true;
          }
          sub_universes.push(object.value);
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
        case "YEARS":
          if (!years_flag) {
            years = [];
            years_flag = true;
          }
          years.push(object.value);
          break;
        case "DIRECTORS":
          if (!directors_flag) {
            directors = [];
            directors_flag = true;
          }
          directors.push(object.value);
          break;
        default:
          break;
      }
    }
    movies = movies.filter(function (e) {
      return (genre.includes(e.Genre) || genre.includes(e.Genre_2))
      && exclusive.includes(e.Exclusive)
      && holiday.includes(e.Holiday) 
      && universes.includes(e.Universe)
      && sub_universes.includes(e.Sub_Universe)
      && years.includes(e.Year.toString())
      && directors.includes(e.Director)
    });
  }
  return movies;
}