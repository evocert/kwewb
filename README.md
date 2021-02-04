# KWE Workbench

Instructions:
```
git clone https://github.com/evocert/kwewb.git
```
Deploy to public web directory. Hit `$(WBPATH)/`, `$(WBPATH)/index.html`, `$(WBPATH)/dist`, or `$(WBPATH)/dist/index.html`.
Customize `index.html` and `index.js` or use defaults.

# Building ./dist
You can build the zip package using the following
```
Make
```
Clean using
```
Make clean
```

# Remoting
In `conf.js`, add the following
```
...
resourcing.RegisterEndpoint("/wb","https://raw.githubusercontent.com/evocert/kwewb/main/");
...
``` 
Hit `http://localhost:1234/wb/lib/index.html` or `http://localhost:1234/wb/index.html` 
