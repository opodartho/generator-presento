# <%= config.get("presentationTitle") %>
> <%= config.get("presentationDescription") %>
<% if (config.get("deployToGithubPages")) { %>
[Check out the online](https://<%= config.get("githubUsername")%>.github.io/<%= config.get("githubRepository")%>)
<% } %>
## Technologies used
- [RevealJS](https://github.com/hakimel/reveal.js)
- [npm](https://github.com/npm/cli)
- [Grunt](https://gruntjs.com)
- [Docker](https://www.docker.com)

## Installation
First, install dependencies using npm (we assume you have pre-installed node.js).
```bash
npm install
```

## How to use?
Run development server using npm.
```bash
npm start
```
<% if (config.get("deployToGithubPages")) { %>
## Deploy to Github.
```bash
npm run deploy
```
<% } %>

<% if (config.get("dockerize")) { %>
## Like to make docker image?
```bash
docker build -t <%= config.get("githubUsername") %>/<%= config.get("githubRepository") %> .
```
<% } %>

## License
<% if (config.get("deployToGithubPages")) { %>
[<%= license %>](LICENSE) © [<%= config.get("author") %>](https://github.com/<%= config.get("githubUsername") %>)
<% } else { %>
[<%= license %>](LICENSE) © [<%= config.get("author") %>]
<% } %>
