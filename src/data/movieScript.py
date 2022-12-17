from openpyxl import *
import requests, sys, config

# ws contains the main sheet (MasterList)
wb = load_workbook('MovieMovieMovies.xlsx')
ws = wb.active

# indexes for columns of excel sheet
title = 0
year = 8
plot = 10
poster = 11
actors = 12
director = 13
ratings = 14
boxoffice = 15
rated = 16
runtime = 17
budget = 18

for index, row in enumerate(ws.iter_rows(values_only=True)):
    if index >= 1:
        try:
            # skip entries already filled, comment out if full update required
            if ws[index + 1][plot].value:
                continue

            # title and year for search
            t = ws[index + 1][title].value
            y = ws[index + 1][year].value
            # Special Cases
            if t == "The Black Phone":
                y = '2021'
            if t == "Monty Python's Life of Brian":
                t = "Life of Brian"
            if t == "The Lion King 1 1/2":
                t = "The Lion King 3"
            if "Batman v Superman" in t:
                t = "Batman v Superman"
            if t == "Mom and Dad":
                y = '2017'
            if t == "Aladdin 2: The Return of Jafar":
                t = "The Return of Jafar"
            if t == "Fant4stic":
                t = "Fantastic Four"
            if "Kangaroo Jack:" in t and y == 2004:
                t = "Kangaroo Jack 2"
            if t == "Cyrano":
                y = '2021'
            if "&" in t:
                t = t.replace("&", "\&")
            if t == "Tiptoes":
                y = '2002'
            # submit api request
            m = requests.get(f'http://www.omdbapi.com/?apikey={config.apikey}&t={t}&y={y}&type=movie').json()

            if t == "Tiptoes":
                y = '2003'
            # if not (ws[index + 1][actors].value and ws[index + 1][boxoffice].value and ws[index+1][budget].value):
            m2 = requests.get(f'https://api.themoviedb.org/3/search/movie?api_key={config.tmdbkey}&query={t}&year={y}').json()
            tmdbcode = m2["results"][0]["id"]
            if not (ws[index + 1][actors].value):
                m3 = requests.get(f'https://api.themoviedb.org/3/movie/{tmdbcode}/credits?api_key={config.tmdbkey}').json()
                actorString = ""
                count = 1
                for actor in m3["cast"]:
                    if count < 8:
                        actorString = f'{actorString}{actor["name"]}, '
                        count = count + 1
                    else:
                        actorString = f'{actorString}{actor["name"]}'
                        break
                if actorString and actorString[-2] == ",":
                    actorString = actorString[:-2]
                print(t, actorString)
                if actorString:
                    ws[index + 1][actors].value = actorString
                else:
                    ws[index + 1][actors].value = m["Actors"]
            if not (ws[index + 1][boxoffice].value and ws[index + 1][budget].value):
                m3 = requests.get(f'https://api.themoviedb.org/3/movie/{tmdbcode}?api_key={config.tmdbkey}').json()
                try:
                    boxofficeTotal = m3['revenue']
                except KeyError:
                    boxofficeTotal = 'N/A'
                ws[index + 1][plot].value = m3["overview"]
                ws[index + 1][boxoffice].value = f"{boxofficeTotal:,}"
                ws[index + 1][budget].value = f"{m3['budget']:,}"
                ws[index + 1][plot].value = m3['overview']
            # unpack values and save to spreadsheet
            ws[index + 1][poster].value = m["Poster"]
            ws[index + 1][director].value = m["Director"]
            ws[index + 1][ratings].value = str(m["Ratings"])
            ws[index + 1][rated].value = m["Rated"]
            ws[index + 1][runtime].value = m["Runtime"]
            wb.save('MovieMovieMovies.xlsx')
        except:
            print(t, y)
            sys.exit()
