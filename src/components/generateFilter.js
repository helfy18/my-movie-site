function genreManagement(temp_genre, genre2) {
  // Data management for the genre filter
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
  return [{label: "Popular Genres", options: firstGenre}, {label: "More Genres", options: secondGenre}]
}

function generateDecades(years) {
  var minDecade = parseInt(Math.min.apply(Math, years) / 10)
  var maxDecade = parseInt(Math.max.apply(Math, years) / 10)
  var decades = []
  for (minDecade; minDecade <= maxDecade; minDecade++) {
    decades.push(`${minDecade}0 - ${minDecade}9`)
  }
  return decades
}

export default function GenerateFilter({data}) {
  var temp_genre = data.genrealt.group
  var genre2 = data.genre2alt.group
  var universes = data.universes.distinct.filter((item) => item !== "");
  var sub_universes = data.sub_universes.distinct.filter((item) => item !== "");
  var years = data.years.distinct;
  var exclusive = data.exclusive.distinct.filter((item) => item !== "");
  var holiday = data.holiday.distinct.filter((item) => item !== "");
  var director = data.director.group

  // Data management for the director filter
  director.sort((a,b) => {return b.totalCount - a.totalCount})
  director = director.slice(0, 30)
  director.sort((a,b) => {return (a.fieldValue > b.fieldValue) ? 1 : ((a.fieldValue < b.fieldValue) ? -1: 0)})
  director = director.map((dir) => dir.fieldValue)

  // Data management for the decades filter
  var extraGenres = genreManagement(temp_genre, genre2)

  var decades = generateDecades(years)

  var everything = [
    {"Genre": extraGenres},
    {"Universe": universes},
    {"Sub Universe": sub_universes},
    {"Exclusive": exclusive},
    {"Holiday": holiday},
    {"Year": years.sort().reverse() },
    {"Director": director},
    {"Decade": decades},
  ]

  for (var headerIndex in everything) {
    for (const type in everything[headerIndex]) {
      let optionsArray = [];
      if (type === "Genre") {
        for (let arr of everything[headerIndex][type]) {
          let subOptionsArray = []
          for (let entry of arr.options) {
            subOptionsArray.push({value: entry.fieldValue, label: entry.fieldValue, category: "Genres"})
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
