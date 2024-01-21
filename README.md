# A2SV Companion

## Build

- Clone the repo and run `npm install` to install the dependencies 
- `npm run build`
- Load the extension from `dist` folder
- Zip the content of `dist` folder for deployment


## Overview

- Repo for the [A2SV Companion backend](https://github.com/meraf00/a2sv-companion-backend)

### Authentication

- Uses github oatuh web application flow to authenticate user
- Companion initiates the authentication flow by redirecting the user to the github oauth page
- A2SV-backend handles the authentication and returns the access token
- Companion uses retured github access token

### Content

- Anything related to injection/parsing of content
- Separeted by the platform
  - auth for parsing responses of the backend
  - leetcode, codeforces.. for parsing respective website

### Lib

- Anything related to platform specific api requests
- Separeted by the platform
  - leetcode, codeforces.. for platform specific api requests
  - github for github api requests
  - a2sv for a2sv api requests (backend is hosted [here](a2sv-companion-backend.vercel.app))

### services.ts and Services

- Services are the main entry point for the companion background scripts
- Background scripts, separated by platform are found in services folder

### scripts.ts

- For message coordination between content and services, the `from` field is used to identify the `sender`

### main.ts and style.css

- Popup script and css

### update.py

- Script to update the extension when a new version is released
- New release is hosted at [here](https://a2sv.pythonanywhere.com/download)

## Project Structure

```
├── public
│   ├── icons
│   ├── index.html
│   ├── manifest.json
│   ├── update.py
|
├── src
│   ├── content
│   │   ├── codeforces
│   │   ├── leetcode
│   │   ├── auth.content.ts
│   │   ├── leetcode.content.ts
│   │   ├── codeforces.content.ts
│   │
│   ├── lib
│   │   ├── codeforces
│   │   ├── leetcode
│   │   ├── github
│   │   ├── a2sv
│   │
│   ├── services
│   │   ├── auth.services.ts
│   │   ├── leetcode.services.ts
│   │   ├── codeforces.services.ts
│   │
│   ├── utils
│   │
│   ├── config.ts
│   ├── event.ts
│   ├── main.ts
│   ├── scripts.ts
│   ├── services.ts
│   ├── style.css
```
