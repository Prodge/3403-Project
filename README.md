# Action Box
## Instructions to deploy
These instructions have been validated for Ubuntu 14.04 LTS and Ubuntu 16.04 LTS distributions.

- Login to the ubuntu server
```
ssh user@xxx.xxx.xxx.xxx
```
- Update packages
```
sudo apt-get update
sudo apt-get upgrade
```
- Install package dependencies
```
sudo apt-get install nodejs npm nodejs-legacy g++-4.8 mongodb git
```
- Clone the 3403 Project github repository
```
git clone https://github.com/Prodge/3403-Project.git; cd 3403-Project/
```
- Install dependencies
```
npm install
```
####That's it!


## Running the server
To attatch the server to your current shell:
```
npm start
```
To run tests:
```
npm test
```
To run coverage:
```
num run coverage
```
To run the server in the background, forever provides an easy solution:
```
sudo npm -g install forever
```
To start the server with forever:
```
sudo forever start start.js
```
To stop the server with forever:
```
sudo forever stop start.js
```
