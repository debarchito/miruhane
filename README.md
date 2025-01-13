## Some important info

1. The setup assumes a UNIX or UNIX-like environment (such as **macOS** or **Linux**). If you are on Windows, it's highly recommened to use **Windows Subsystem for Linux v2** (WSL2). You can follow [Microsoft's WSL2 installation guide](https://learn.microsoft.com/en-us/windows/wsl/install) for more information.
2. **miruhane.** primarily uses [devenv](https://devenv.sh/) and [Docker](https://www.docker.com/) for its development. While **devenv** is not mandatory to use, it is highly recommended. Alternative installation steps to substitute **devenv** will be provided. For, **WSL2** users, it's recommended to install the **Docker Engine** directly inside your **WSL2** distro; not using **Docker Desktop**. You can follow [Docker's official guide](https://docs.docker.com/engine/install/) for more information. It steamlines the development process and ensures that the development environment is consistent. You are free to substitue **Docker** for any other OCI compliant container runtime like **Podman** that can run **Docker Compose** files.

## Run

You can use docker compose to build and run the project. The **docker-compose-prod.yml** file is provided for this purpose.

```sh
cp .env.example .env
# Edit the .env file with your fav text editor
hx .env
# set POSTGRES_USER and POSTGRES_PASSWORD to your desired values
# setup your API keys accordingly; I've attached some reference links
docker compose -f docker-compose-prod.yml up -d
```

Hopefully, you don't encounter any mirror issues due to npm registry. If you do, try to adjust your proxy settings or use some other corepack mirror closest to you. Alternatively, try one of the development setups and build the project manually.

## Development Setup (devenv)

The required **devenv** configuration is already provided in the repository. Simply changing your directory to the repository root should activate the **devenv** environment. Now, run:

```sh
cp .env.example .env
# Edit the .env file with your fav text editor
hx .env
# set POSTGRES_USER and POSTGRES_PASSWORD to your desired values
# setup your API keys accordingly; I've attached some reference links
```

Saving and exiting your editor, should automatically trigger the **devenv** environment to reload; environment variables will be automatically loaded. This should also automatically update the credentials in the database container. If not, run:

```sh
pnpm db:down
pnpm db:up
```

...and it should fix it. Now, install the dependencies and push the **drizzle** migrations to the database using:

```sh
pnpm install
pnpm db:push
```

...and start the development server using:

```sh
pnpm dev
```

Done and dusted! After this point, only a simple **pnpm dev** should suffice to spin up the dev server in future. To build the project for production, do:

```sh
pnpm build
```

...and you can run the production server using:

```sh
pnpm start
# or
node build/index.js
```

## Development Setup (alternative)

Install [pnpm](https://pnpm.io/) globally using either **curl** or **wget**. You can also use **npm**, **yarn** or some other package manager if you prefer. This guide assumes you are using **pnpm**.

```sh
curl -fsSL https://get.pnpm.io/install.sh | sh -
# or
wget -qO- https://get.pnpm.io/install.sh | sh -
```

Now, use **pnpm env** to install the latest version of **Node.js**.

```sh
pnpm env use --global latest
```

Now, run:

```sh
cp .env.example .env
# Edit the .env file with your fav text editor
hx .env
# set POSTGRES_USER and POSTGRES_PASSWORD to your desired values
# setup your API keys accordingly; I've attached some reference links
```

Load the environment variables using:

```sh
source .env
```

...and spin up the database using:

```sh
pnpm db:up
```

Now install the dependencies and push the **drizzle** migrations to the database using:

```sh
pnpm install
pnpm db:push
```

...and start the development server using:

```sh
pnpm dev
```

Done and dusted! After this point, just run:

```sh
source .env
pnpm db:up
pnpm dev
```

Similarly, to build the project for production, do:

```sh
pnpm build
```

...and you can run the production server using:

```sh
source .env
pnpm db:up
# and then:
pnpm start
# or
node build/index.js
```

...and you are good to go! You can also add a custom task to automate this process. We don't need such a task as **devenv** already does this for us automatically.

## LICENSE

This project is licensed under the MIT License. See the [LICENSE](/LICENSE) file for details.
