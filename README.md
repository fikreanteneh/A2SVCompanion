# A2SV Companion

## Build

- Clone the repo and run `npm install` to install the dependencies
- `npm run build`
- Load the extension from `dist` folder
- Zip the content of `dist` folder for deployment

### Authentication

- Uses A2SV Hub for authentication
- When logging to A2SV Hub it automatically authenticate the user in the background
- Link to A2SV Hub: [A2SV Hub](https://hub.a2sv.org/)

### Codeforces, Leetcode, A2SV

- Evrything related to codeforces is found in `src/codeforces` folder
- Evrything related to leetcode is found in `src/leetcode` folder
- Evrything related to a2svhub is found in `src/a2sv` folder

### Content

- Anything related to injection/parsing of content
- Separeted by the platform
  - leetcode, codeforces, a2sv.. for parsing respective website
- Each of the above folder contains a `{}.content.ts` file which is responsible for parsing the content of the website

### API

- Anything related to platform specific api requests
- Separeted by the platform
  - leetcode, codeforces.. for platform specific api requests
  - github for github api requests
- Each of the above folder contains a `{}.api.ts` file which is responsible for parsing the content of the website

### services.ts and Services

- Services are the main entry point for the companion background scripts
- Background scripts, separated by platform are found in each folder with the name `{}.services.ts`

### messsage.ts

- For message coordination between content and services, the `from` field is used to identify the `sender`
- Each platform has its own message file with the name `{}.message.ts`

### main.ts and style.css

- Popup script and css

## Project Structure

```
├── public
│   ├── icons
│   ├── index.html
│   ├── manifest.json
│
├── src
│   ├── leetcode
│   │   ├── leetcode.api.ts
│   │   ├── leetcode.content.ts
│   │   ├── leetcode.services.ts
│   │   ├── leetcode.types.ts
│   │   ├── leetcode.message.ts
│   │   ├── leetcode.utils.ts
│   │   ├── leetcode.parseui.ts
│   │
│   ├── codeforces
│   │   ├── codeforces.api.ts
│   │   ├── codeforces.content.ts
│   │   ├── codeforces.services.ts
│   │   ├── codeforces.types.ts
│   │   ├── codeforces.message.ts
│   │   ├── codeforces.utils.ts
│   │   ├── codeforces.parseui.ts
│   │
│   ├── a2sv
│   │   ├── a2sv.api.ts
│   │   ├── a2sv.content.ts
│   │   ├── a2sv.services.ts
│   │   ├── a2sv.types.ts
│   │   ├── parseui
│   │   │   ├── new.ts
│   │   │   ├── old.ts
│   │   │   ├── common.ts
│   │
│   ├── utils
│   │   ├── readStorage.ts
│   │
│   ├── config.ts
│   ├── main.ts
│   ├── services.ts
│   ├── style.css
```
