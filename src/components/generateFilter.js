function genreManagement(temp_genre, genre2) {
  // Data management for the genre filter
  var genre = JSON.parse(JSON.stringify(temp_genre));
  for (let entry of genre2) {
    if (entry.fieldValue === "") continue;
    var genreIndex = temp_genre.findIndex(
      (e) => e.fieldValue === entry.fieldValue
    );
    if (genreIndex !== -1) {
      genre[genreIndex].totalCount += entry.totalCount;
    } else {
      genre.push(entry);
    }
  }
  genre.sort((a, b) => b.totalCount - a.totalCount);
  var firstGenre = genre.slice(1, 11);
  var secondGenre = genre.slice(11);
  firstGenre.sort((a, b) => {
    return a.fieldValue > b.fieldValue
      ? 1
      : a.fieldValue < b.fieldValue
      ? -1
      : 0;
  });
  secondGenre.sort((a, b) => {
    return a.fieldValue > b.fieldValue
      ? 1
      : a.fieldValue < b.fieldValue
      ? -1
      : 0;
  });
  return [
    { label: "Popular Genres", options: firstGenre },
    { label: "More Genres", options: secondGenre },
  ];
}

function universeManagement(temp_universes) {
  var universes = JSON.parse(JSON.stringify(temp_universes));
  universes = universes
    .filter((universe) => universe.fieldValue !== "")
    .sort((a, b) => b.totalCount - a.totalCount);
  var with_sub = universes.filter((universe) => universe.group.length > 1);
  var no_sub = universes.filter((universe) => universe.group.length <= 1);
  with_sub.forEach((universe, index) => {
    universe.group = universe.group
      .filter((sub_universe) => {
        return sub_universe.fieldValue !== "";
      })
      .map((sub_universe) => {
        return {
          value: sub_universe.fieldValue,
          label: sub_universe.fieldValue,
          category: "Universe",
        };
      });
    universe.group.unshift({
      value: universe.fieldValue,
      label: `All ${universe.fieldValue}`,
      category: "Universe",
    });
    with_sub[index] = { label: universe.fieldValue, options: universe.group };
  });
  no_sub.sort((a, b) => {
    return a.fieldValue > b.fieldValue
      ? 1
      : a.fieldValue < b.fieldValue
      ? -1
      : 0;
  });
  no_sub = no_sub.map((universe) => {
    return {
      value: universe.fieldValue,
      label: universe.fieldValue,
      category: "Universe",
    };
  });
  return [...with_sub, { label: "Others", options: no_sub }];
}

function generateDecades(years) {
  var minDecade = parseInt(Math.min.apply(Math, years) / 10);
  var maxDecade = parseInt(Math.max.apply(Math, years) / 10);
  var decades = [];
  for (minDecade; minDecade <= maxDecade; minDecade++) {
    decades.push(`${minDecade}0 - ${minDecade}9`);
  }
  return decades;
}

export default function GenerateFilter({ data }) {
  var temp_genre = data.genrealt.group;
  var genre2 = data.genre2alt.group;
  var universes = data.universes.distinct.filter((item) => item !== "");
  var universes_together = data.universes_together.group;
  var years = data.years.distinct;
  var exclusive = data.exclusive.distinct.filter((item) => item !== "");
  var holiday = data.holiday.distinct.filter((item) => item !== "");
  var studio = data.studio.distinct;
  var rated = data.rated.distinct;
  var director = data.director.group;
  var runtime = data.runtime.distinct;
  runtime.forEach(function (part, index) {
    if (typeof part === "string") this[index] = parseInt(part.split(" ")[0]);
  }, runtime);
  runtime = runtime.sort((a, b) => {
    return a - b;
  });

  // Data management for the director filter
  director.sort((a, b) => {
    return b.totalCount - a.totalCount;
  });
  director = director.slice(0, 30);
  director.sort((a, b) => {
    return a.fieldValue > b.fieldValue
      ? 1
      : a.fieldValue < b.fieldValue
      ? -1
      : 0;
  });
  director = director.map((dir) => dir.fieldValue);

  // Data management for the decades filter
  var extraGenres = genreManagement(temp_genre, genre2);
  var builtUniverses = universeManagement(universes_together);

  var decades = generateDecades(years);

  var everything = [
    { Genre: extraGenres },
    { Universe: universes },
    { Exclusive: exclusive },
    { Studio: studio },
    { Holiday: holiday },
    { Year: years.sort().reverse() },
    { Director: director },
    { Rated: rated },
    { Decade: decades },
    { Runtime: runtime },
  ];

  for (var headerIndex in everything) {
    if (headerIndex !== (everything.length - 1).toString()) {
      for (const type in everything[headerIndex]) {
        let optionsArray = [];
        if (type === "Genre") {
          for (let arr of everything[headerIndex][type]) {
            let subOptionsArray = [];
            for (let entry of arr.options) {
              subOptionsArray.push({
                value: entry.fieldValue,
                label: entry.fieldValue,
                category: "Genre",
              });
            }
            optionsArray.push({ label: arr.label, options: subOptionsArray });
          }
        } else if (type === "Universe") {
          optionsArray = builtUniverses;
        } else {
          for (let opt of everything[headerIndex][type]) {
            optionsArray.push({ value: opt, label: opt, category: type });
          }
        }
        everything[headerIndex] = {
          label: type,
          options: optionsArray,
        };
      }
    }
  }
  return everything;
}
