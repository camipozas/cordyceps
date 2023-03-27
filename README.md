# Get GitHub Organization Repositories

This is a simple script to get all repositories from a GitHub organization and then clone them.

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
    yarn dev
    ```

    > If the folder doesn't exist, it will be created.
