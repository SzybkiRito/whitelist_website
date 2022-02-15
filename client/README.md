# Whitelist App
This is frontend of the whitelist website which can be especially helpful on the fivem roleplay servers. 

## Dependiences
```
axios
```

## Project setup
```
npm install
```

### Configuring website
```
Create the .env files in your client root folder and enter IP of your backend api in Dashboard, LandingPage file. IP should be in IPv4 format with port number.
```

Your .env file should contain this two variables
```
VUE_APP_CLIENTID=CLIENTID_OF_OAUTH2_APP
VUE_APP_CLIENT_SECRET=CLIENT_SECRET_OF_OAUTH2_APP
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```