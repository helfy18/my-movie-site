export default function GenerateFilter({data}) {
  var temp_genre = data.genrealt.group
  var genre2 = data.genre2alt.group
  var universes = data.universes.distinct.filter((item) => item !== "");
  var sub_universes = data.sub_universes.distinct.filter((item) => item !== "");
  var years = data.years.distinct;
  var exclusive = data.exclusive.distinct.filter((item) => item !== "");
  var holiday = data.holiday.distinct.filter((item) => item !== "");
  var minYear = years[0]
  var maxYear = years[years.length - 1]
  // console.log(minYear, maxYear, sub_universes)

  var genre = JSON.parse(JSON.stringify(temp_genre))
  for (let entry of genre2) {
    if (entry.fieldValue === "") continue
    var genreIndex = temp_genre.findIndex(e => e.fieldValue === entry.fieldValue)
    if (genreIndex !== -1) {
      genre[genreIndex].totalCount += entry.totalCount
    } else {
      genre.push(entry)
    }
  }
  genre.sort((a,b) => {return b.totalCount - a.totalCount})
  var firstGenre = genre.slice(1, 11)
  var secondGenre = genre.slice(11)
  firstGenre.sort((a,b) => {return (a.fieldValue > b.fieldValue) ? 1 : ((a.fieldValue < b.fieldValue) ? -1: 0)})
  secondGenre.sort((a,b) => {return (a.fieldValue > b.fieldValue) ? 1 : ((a.fieldValue < b.fieldValue) ? -1: 0)})
  var extraGenres = [{label: "Popular Genres", options: firstGenre}, {label: "More Genres", options: secondGenre}]

  var decades = []
  //for

  var everything = [
    {"Genres": extraGenres},
    {"Universes": universes},
    {"Sub Universes": sub_universes},
    {"Exclusive": exclusive},
    {"Holiday": holiday},
    {"Years": years.sort().reverse() }
  ]

  for (var headerIndex in everything) {
    for (const type in everything[headerIndex]) {
      let optionsArray = [];
      if (type === "Genres") {
        for (let arr of everything[headerIndex][type]) {
          let subOptionsArray = []
          for (let entry of arr.options) {
            subOptionsArray.push({value: entry.fieldValue, label: entry.fieldValue, category: arr.label})
          }
          optionsArray.push({label: arr.label, options: subOptionsArray})
        }
      } else {
        for (let opt of everything[headerIndex][type]) {
          optionsArray.push({ value: opt, label: opt, category: type});
        }
      }
      everything[headerIndex] = {
        label: type,
        options: optionsArray
      };
    }
  }
  return everything;
}
