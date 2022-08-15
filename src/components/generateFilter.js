export default function GenerateFilter({data}) {
  var genres = data.genre.distinct.concat(data.genre_two.distinct.filter((item) => data.genre.distinct.indexOf(item) < 0)).sort();
  var universes = data.universes.distinct;
  var sub_universes = data.sub_universes.distinct;
  var years = data.years.distinct;
  var exclusive = data.exclusive.distinct;
  var holiday = data.holiday.distinct;
  var everything = [
    {genres: genres},
    {universes: universes},
    {"sub universes": sub_universes},
    {exclusive: exclusive},
    {holiday: holiday},
    { years: years }
  ]
  for (var headerIndex in everything) {
    for (const type in everything[headerIndex]) {
      let optionsArray = [];
      for (let opt of everything[headerIndex][type]) {
        optionsArray.push({ value: opt, label: opt, category: type});
      }
      everything[headerIndex] = {
        label: type,
        options: optionsArray
      };
    }
  }
  return everything;
}
