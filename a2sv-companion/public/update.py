from urllib.request import urlretrieve
import zipfile

download_url = "https://a2sv.pythonanywhere.com/download"
filename = "a2sv-companion-latest.zip"

path, headers = urlretrieve(download_url, filename)

with zipfile.ZipFile(path, "r") as zfile:
    zfile.extractall()
