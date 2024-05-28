from openpyxl import *
import requests, config, json

# ws contains the main sheet (MasterList)
wb = load_workbook('MovieMovieMovies.xlsx')
ws = wb.active

# indexes for columns of excel sheet
titleIndex = 0
yearIndex = 10
plot = 12
poster = 13
actors = 14
director = 15
ratings = 16
boxoffice = 17
rated = 18
runtime = 19
provider = 20
budget = 21
tmdbid = 22
recos = 23

for index, row in enumerate(ws.iter_rows(values_only=True)):
    if index >= 1:
        # skip entries already filled, comment out if full update required
        # if ws[index + 1][plot].value:
        #     continue

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
        if "Kangaroo Jack:" in title and year == 2004:
            title = "Kangaroo Jack 2"
        if title == "Cyrano":
            year = '2021'
        if title == 'Blades of Glory':
            year = '2006'
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
        # submit api request

        if not ws[index + 1][ratings].value:
            omdb = requests.get(f'http://www.omdbapi.com/?apikey={config.apikey}&t={title}&y={year}&type=movie').json()
            ws[index + 1][ratings].value = json.dumps(omdb["Ratings"])
            ws[index + 1][rated].value = omdb["Rated"]

        if title == 'Blades of Glory':
            year = '2007'
        if title == "Tiptoes":
            year = '2003'
        if title == 'Heathers':
            year = '1989'
        
        if not ws[index + 1][tmdbid].value:
            search = requests.get(f'https://api.themoviedb.org/3/search/movie?api_key={config.tmdbkey}&query={title}&year={year}').json()
            path = search['results'][0]['poster_path']
            tmdbcode = search["results"][0]["id"]
            
            ws[index + 1][poster].value = f'https://image.tmdb.org/t/p/w500{path}'
            ws[index + 1][tmdbid].value = tmdbcode
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

        url = f'https://api.themoviedb.org/3/movie/{tmdbcode}/rating'
        headers = {'Content-Type': 'application/json;charset=utf8', 'Authorization': f'{config.tmdbtoken}'}
        value = round((ws[index + 1][1].value)/5)/2
        if value == 0.0:
            value = 0.5
        data = {"value": value}
        response = requests.post(url, headers=headers, json=data).json()

        # print(title, year)
        
wb.save('MovieMovieMovies.xlsx')
