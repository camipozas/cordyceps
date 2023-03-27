# Cordyceps 🐛

In the serie [The Last of Us](https://en.wikipedia.org/wiki/The_Last_of_Us) Cordyceps is a fungus that infects humans and turns them into zombies. It's a very interesting fungus because it can infect other fungi and turn them into zombies too. In this case, Cordyceps is a CLI tool that infects your GitHub organization and clones all the repositories in a single command.

## Usage

1.  First, clone this repository:

    ```
    git clone
    ```

2.  Install the dependencies:

    ```
    yarn install
    ```

3.  You need to create a GitHub Personal Access Token. You can do it [here](https://docs.github.com/en/enterprise-server@3.4/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token). Then you need to add it to the `.env` file. In the same way, you can add the organization name, the path where you want to clone the repositories and the branch you want to clone (default is Home).

    ```
    GITHUB_TOKEN=
    ```

4.  Run the script:

    ```
    cordyceps
    ```
