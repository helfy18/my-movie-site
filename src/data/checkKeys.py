# Checks whether each OMDB key in config.py still has quota today.
# Run from this folder:  python3 checkKeys.py
import config, requests

for name in ('apikey', 'apikey2', 'apikey3'):
    key = getattr(config, name, None)
    if not key:
        print(f'{name}: not set in config.py')
        continue
    try:
        r = requests.get(f'http://www.omdbapi.com/?apikey={key}&i=tt0468569&type=movie', timeout=15).json()
        status = 'OK' if r.get('Response') == 'True' else r.get('Error', 'unknown error')
    except Exception as e:
        status = f'request failed: {e}'
    print(f'{name}: {status}')
