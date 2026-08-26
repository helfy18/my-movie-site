import csv
import requests, config, json, time

# Read all rows from the CSV as dictionaries
with open('MovieMovieMovies.csv', 'r', newline='', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    fieldnames = reader.fieldnames
    rows = [row for row in reader]

def get_rating(ratings, source):
    match = [r['Value'] for r in ratings if r['Source'] == source]
    return match[0] if match else 'N/A'

apikey = config.apikey

MAX_RETRIES = 5
WAIT_TIME = 2

currentTime = round(time.time() * 1000)

for index, row in enumerate(rows):
    if index == 949:
       apikey = config.apikey2

    # skip entries already filled, comment out if full update required
    # if row['Plot']:
    #     continue

    # title and year for search
    title = row['Movie']
    year = int(row['Year'])

    if not row['TMDBId']:
        url = f'https://api.themoviedb.org/3/search/movie?api_key={config.tmdbkey}&query={title}&year={year}'
        search = requests.get(url).json()
        print(url)
        path = search['results'][0]['poster_path']
        tmdbcode = int(search["results"][0]["id"])
        row['Poster'] = f'https://image.tmdb.org/t/p/w500{path}'
        row['TMDBId'] = str(tmdbcode)

        row['ms_added'] = str(currentTime)
    else:
        tmdbcode = int(row['TMDBId'])

    tmdb_url = f'https://api.themoviedb.org/3/movie/{tmdbcode}'

    if not row['Actors']:
        castAndCrew = requests.get(f'{tmdb_url}/credits?api_key={config.tmdbkey}').json()
        actorString = ', '.join(actor["name"] for actor in castAndCrew["cast"])
        print(title, actorString)
        if actorString:
            row['Actors'] = actorString
        else:
            row['Actors'] = "N/A"

        row['Director'] = ', '.join(credit["name"] for credit in castAndCrew["crew"] if credit["job"] == "Director")

    movieInfo = requests.get(f'{tmdb_url}?api_key={config.tmdbkey}').json()
    try:
        boxofficeTotal = movieInfo['revenue']
    except KeyError:
        boxofficeTotal = 'N/A'
    try:
        country = movieInfo['origin_country'][0]
    except KeyError:
        country = 'US'
    except IndexError:
        country = 'US'
    imdbid = movieInfo["imdb_id"]
    row['Plot'] = movieInfo["overview"]
    row['BoxOffice'] = f"{boxofficeTotal:,}"
    row['Budget'] = f"{movieInfo['budget']:,}"
    row['Runtime'] = f"{movieInfo['runtime']:,}"
    row['origin_counry'] = country

    providers = requests.get(f'{tmdb_url}/watch/providers?api_key={config.tmdbkey}').json()
    if providers['results'] and 'CA' in providers['results']:
        row['Provider'] = json.dumps(providers['results']['CA'])
    else:
        row['Provider'] = "{}"

    recoUrl = f'{tmdb_url}/recommendations?api_key={config.tmdbkey}'
    recommendations = requests.get(recoUrl).json()

    for i in range(0, MAX_RETRIES):
        try:
            row['Recommendations'] = str([item['id'] for item in recommendations['results']])
            break
        except:
            print(f'FAILED {i}, {recoUrl}, {title}, {year}')
            if i < MAX_RETRIES - 1:
                time.sleep(WAIT_TIME)

    videos = requests.get(f'{tmdb_url}/videos?api_key={config.tmdbkey}').json()
    trailerList = [result for result in videos['results'] if result['type'] == 'Trailer']
    # If there's more than one trailer, prioritize the official one
    if len(trailerList) > 0:
      selected_trailer = next((t for t in trailerList if t['official']), trailerList[0])
    elif len(videos['results']) > 0:
       selected_trailer = videos['results'][0]
    else:
       selected_trailer = ''
    row['Trailer'] = f'https://www.youtube.com/embed/{selected_trailer["key"]}' if selected_trailer != '' else ''

    url = f'{tmdb_url}/rating'
    headers = {'Content-Type': 'application/json;charset=utf8', 'Authorization': f'Bearer {config.tmdbtoken}'}
    if row['JH_Score']:
        value = round(float(row['JH_Score'])/5)/2
        if value == 0.0:
            value = 0.5
        data = {"value": value}
        response = requests.post(url, headers=headers, json=data).json()

    # OMDB SECTION
    omdb = requests.get(f'http://www.omdbapi.com/?apikey={apikey}&i={imdbid}&type=movie').json()
    row['RottenTomatoes'] = get_rating(omdb["Ratings"], 'Rotten Tomatoes')
    row['IMDB'] = get_rating(omdb["Ratings"], 'Internet Movie Database')
    row['Metacritic'] = get_rating(omdb["Ratings"], 'Metacritic')

    row['Ratings'] = json.dumps(omdb["Ratings"])
    row['Rated'] = omdb["Rated"]

    print(title, year, index)

with open('MovieMovieMovies.csv', 'w', newline='', encoding='utf-8') as f:
    writer = csv.DictWriter(f, fieldnames=fieldnames)
    writer.writeheader()
    writer.writerows(rows)
