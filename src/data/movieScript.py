from openpyxl import *
import requests, config, json, time

# ws contains the main sheet (MasterList)
wb = load_workbook('MovieMovieMovies.xlsx')
ws = wb.active

# indexes for columns of excel sheet
titleIndex = 0
yearIndex = 9
plot = 12
poster = plot + 1
actors = poster + 1
director = actors + 1
ratings = director + 1
boxoffice = ratings + 1
rated = boxoffice + 1
runtime = rated + 1
provider = runtime + 1
budget = provider + 1
tmdbid = budget + 1
recos = tmdbid + 1
rt = recos + 1
imdb = rt + 1
metacritic = imdb + 1
trailer = metacritic + 1
millis = trailer + 1

apikey = config.apikey

for index, row in enumerate(ws.iter_rows(values_only=True)):
    #if index == 950:
    #    apikey = config.apikey2
    if index >= 1:
        # skip entries already filled, comment out if full update required
        if ws[index + 1][plot].value:
            continue

        # title and year for search
        title = ws[index + 1][titleIndex].value
        year = ws[index + 1][yearIndex].value

        # Special Cases
        if title == "The Black Phone":
            year = '2021'
        if title == "Monty Python's Life of Brian":
            title = "Life of Brian"
        if title == "The Lion King 1 1/2":
            title = "The Lion King 3"
        if "Batman v Superman" in title:
            title = "Batman v Superman"
        if title == "Mom and Dad":
            year = '2017'
        if title == "Aladdin 2: The Return of Jafar":
            title = "The Return of Jafar"
        if title == "Fant4stic":
            title = "Fantastic Four"
        if title == "Cyrano":
            year = '2021'
        if "&" in title:
            title = title.replace("&", "%26")
        if title == "Tiptoes":
            year = '2002'
        if title == 'Glass Onion: A Knives Out Mystery':
            title = 'Glass Onion'
        if title == 'Marcel the Shell with Shoes On':
            year = '2021'
        if title == 'M3GAN':
            year = '2022'
        if title == 'Heathers':
            year = '1988'
        if "Mad Max 2" in title:
            title = "The Road Warrior"
        if 'Naruto Shippuden the Movie' in title:
            title = 'Naruto Shippuden'
        if title == 'Expend4bles':
            title = 'The Expendables 4'
        if title == 'Friday the 13th Part III':
            title = 'Friday the 13th: Part 3'

        # submit api request

        if not ws[index + 1][ratings].value:
            omdb = requests.get(f'http://www.omdbapi.com/?apikey={apikey}&t={title}&y={year}&type=movie').json()
            rotten = [rating['Value'] for rating in omdb["Ratings"] if rating['Source'] == 'Rotten Tomatoes']
            ws[index + 1][rt].value = rotten[0] if len(rotten) > 0 else 'N/A'
            internationalMovieDB = [rating['Value'] for rating in omdb["Ratings"] if rating['Source'] == 'Internet Movie Database']
            ws[index + 1][imdb].value = internationalMovieDB[0] if len(internationalMovieDB) > 0 else 'N/A'
            mc = [rating['Value'] for rating in omdb["Ratings"] if rating['Source'] == 'Metacritic']
            ws[index + 1][metacritic].value = mc[0] if len(mc) > 0 else 'N/A'

            ws[index + 1][ratings].value = json.dumps(omdb["Ratings"])
            ws[index + 1][rated].value = omdb["Rated"]
        
        if 'Naruto Shippuden' in title:
            title = ws[index + 1][titleIndex].value
        if title == 'Blades of Glory':
            year = '2007'
        if title == "Tiptoes":
            year = '2003'
        if title == 'Heathers':
            year = '1989'
        if title == 'Spiral':
            title = 'Spiral: From the Book of Saw'
        
        if not ws[index + 1][tmdbid].value:
            search = requests.get(f'https://api.themoviedb.org/3/search/movie?api_key={config.tmdbkey}&query={title}&year={year}').json()
            path = search['results'][0]['poster_path']
            tmdbcode = search["results"][0]["id"]
            
            ws[index + 1][poster].value = f'https://image.tmdb.org/t/p/w500{path}'
            ws[index + 1][tmdbid].value = tmdbcode

            ws[index + 1][millis].value = round(time.time() * 1000)
        else:
            tmdbcode = ws[index + 1][tmdbid].value

        if not ws[index + 1][actors].value:
            castAndCrew = requests.get(f'https://api.themoviedb.org/3/movie/{tmdbcode}/credits?api_key={config.tmdbkey}').json()
            actorString = ""
            count = 1
            for actor in castAndCrew["cast"]:
                if count < 8:
                    actorString = f'{actorString}{actor["name"]}, '
                    count = count + 1
                else:
                    actorString = f'{actorString}{actor["name"]}'
                    break
            if actorString and actorString[-2] == ",":
                actorString = actorString[:-2]
            print(title, actorString)
            if actorString:
                ws[index + 1][actors].value = actorString
            else:
                ws[index + 1][actors].value = "N/A"
            
            ws[index + 1][director].value = ', '.join(credit["name"] for credit in castAndCrew["crew"] if credit["job"] == "Director")
        
        movieInfo = requests.get(f'https://api.themoviedb.org/3/movie/{tmdbcode}?api_key={config.tmdbkey}').json()
        try:
            boxofficeTotal = movieInfo['revenue']
        except KeyError:
            boxofficeTotal = 'N/A'
        ws[index + 1][plot].value = movieInfo["overview"]
        ws[index + 1][boxoffice].value = f"{boxofficeTotal:,}"
        ws[index + 1][budget].value = f"{movieInfo['budget']:,}"
        ws[index + 1][runtime].value = f"{movieInfo['runtime']:,}"
        
        providers = requests.get(f'https://api.themoviedb.org/3/movie/{tmdbcode}/watch/providers?api_key={config.tmdbkey}').json()
        if providers['results'] and 'CA' in providers['results']:
            ws[index + 1][provider].value = json.dumps(providers['results']['CA'])
        else:
            ws[index + 1][provider].value = "{" + "}"

        recommendations = requests.get(f'https://api.themoviedb.org/3/movie/{tmdbcode}/recommendations?api_key={config.tmdbkey}').json()
        ws[index + 1][recos].value = str([item['id'] for item in recommendations['results']])

        videos = requests.get(f'https://api.themoviedb.org/3/movie/{tmdbcode}/videos?api_key={config.tmdbkey}').json()
        trailers = [result for result in videos['results'] if result['type'] == 'Trailer']
        # If there's more than one trailer, prioritize the official one
        if len(trailers) > 0:
          selected_trailer = next((trailer for trailer in trailers if trailer['official']), trailers[0])
        elif len(videos['results']) > 0:
           selected_trailer = videos['results'][0]
        else:
           selected_trailer = ''
        ws[index + 1][trailer].value = f'https://www.youtube.com/embed/{selected_trailer["key"]}' if selected_trailer != '' else ''


        url = f'https://api.themoviedb.org/3/movie/{tmdbcode}/rating'
        headers = {'Content-Type': 'application/json;charset=utf8', 'Authorization': f'Bearer {config.tmdbtoken}'}
        if ws[index + 1][1].value:
            value = round((ws[index + 1][1].value)/5)/2
            if value == 0.0:
                value = 0.5
            data = {"value": value}
            response = requests.post(url, headers=headers, json=data).json()

        print(title, year)
        
wb.save('MovieMovieMovies.xlsx')
