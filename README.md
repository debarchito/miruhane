## Setup Info

1) The setup assumes a UNIX or UNIX-like environment (such as **macOS** or **Linux**). If you are on Windows, it's highly recommened to use **Windows Subsystem for Linux v2** (WSL2). You can follow [Microsoft's WSL2 installation guide](https://learn.microsoft.com/en-us/windows/wsl/install) for more information.
2) **miruhane** primarily uses [devenv](https://devenv.sh/) and [Docker](https://www.docker.com/) for its development. While **devenv** is not mandatory to use, it is highly recommended. Alternative installation steps to substitute **devenv** will be provided. For, **WSL2** users, it's recommended to install the **Docker Engine** directly inside your **WSL2** distro; not using **Docker Desktop**. You can follow [Docker's official guide](https://docs.docker.com/engine/install/) for more information. It steamlines the development process and ensures that the development environment is consistent. You are free to substitue **Docker** for any other OCI compliant container runtime like **Podman** that can run **Docker Compose** files.

## Setup (devenv)

The required **devenv** configuration is already provided in the repository. Simply changing your directory to the repository root should activate the **devenv** environment. Now, run:

```sh
cp .env.example .env
# Edit the .env file with your fav text editor
hx .env
# set POSTGRES_USER and POSTGRES_PASSWORD to your desired values
```

Exiting your editor, should automatically trigger the **devenv** environment to reload; environment variables will be automatically loaded. This should also automatically update the credentials in the database container. If not, run:

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

Done and dusted! After this point, only a simple **pnpm dev** should suffice in future.

## Setup (alternative)

Install [pnpm](https://pnpm.io/) globally using either **curl** or **wget**.

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

...and you are good to go! You can also add a custom task to automate this process. We don't need such a task as **devenv** already does this for us automatically.

## LICENSE

This project is licensed under the MIT License. See the [LICENSE](/LICENSE) file for details.
