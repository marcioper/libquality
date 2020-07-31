# LibQuality API
This is a simple service api to compare quality of differente open source libraries available in GitHub.

## 🏷️ ABOUT
This tool collects data from GitHub, the first time the user chooses a repository he wants to store, after that the service API starts an automatic data collection on GitHub with a scheduled task that fetches new data every 10 minutes, collecting only new issues or updated issues.

## 🚀 Technologies used
The main technologies used to build this API were:

- [Node.js](https://nodejs.org/en/)
- [Adonis](https://adonisjs.com/)
- [MySQL](https://www.mysql.com/)

## 📦 How to download and run?

**Before downloading and running the project **, it is necessary to have ** Node.js ** already installed and then install the following tools:

- [Git](https://git-scm.com/)
- [Docker](https://www.docker.com/)

### ⬇️ Baixando o projeto

Open your operating system terminal and run the following commands:

```bash
  # Clone the repository
  git clone https://github.com/marcioper/libquality.git

  # Enter in directory
  cd gobarber-api

  # Install the dependencies
  npm install
```

## SETUP

#### 🌐 Environment variables

At the root of the project you can get the file `.env.example`. From there, create another file called `.env 'using the same structure.

## DataBase
Run command below to create mysql database
```bash
  docker-compose up -d
```

For more information, check the `config/database.js` file.

## Run migrations
Run command below to create tables in mysql database
```bash
  adonis migration:run
```

## Run server localhost:3333
Run command below to execute server
```bash
  adonis serve --dev
```

## Run schedule task
Run command below to start schedule task to collect data automatic from GitHub
```bash
  adonis run:scheduler
```

## Run tests
Run command below to test service api
```bash
  adonis test
```

## 📌 Routes from API
To test the routes, you can use the [Insomnia](https://insomnia.rest/). The whole **_workspace_** this API is available for use, just download the file **Insomnia_LibQuality.json** in project root.

If desired, use another way to perform as requests, as available routes are:

- **`GET /api/v1/projects/sync`**: Collect Data From GitHub.
- **`GET /api/v1/projects/average`**: Average Statistics Libs Issues.
- **`GET /api/v1/projects/statistics`**: Daily Statistics Lib Issues.

Or, case desired, you can use Swagger opening http://localhost:3333/docs in your browser, ayeey 🎉

Developed with 💜 by Marcio Pinto 🧑🏽‍🚀
