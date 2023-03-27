# Cordyceps 🐛

<p>
  <a href="https://github.com/camipozas/cordyceps">
    <img alt="Top Language" src="https://img.shields.io/github/languages/top/camipozas/cordyceps"/>
  </a>
  <a href="https://github.com/camipozas/cordyceps/blob/main/LICENSE">
    <img alt="License" src="https://img.shields.io/github/license/camipozas/cordyceps"/>
  </a>
  <a href="https://github.com/camipozas/cordyceps">
    <img alt="Repo Size" src="https://img.shields.io/github/repo-size/camipozas/cordyceps"/>
  </a>
    <a href="https://img.shields.io/github/last-commit/camipozas/cordyceps">
    <img alt="Last Commit" src="https://img.shields.io/github/last-commit/camipozas/cordyceps"/>
</p>

In the serie [The Last of Us](https://en.wikipedia.org/wiki/The_Last_of_Us) Cordyceps is a fungus that infects humans and turns them into zombies. It's a very interesting fungus because it can infect other fungi and turn them into zombies too. In this case, Cordyceps is a CLI tool that infects your GitHub organization and clones all the repositories in a single command.

![Initial Screen](/img/img1.png 'Initial screen')

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

There are two ways to do it in GitHub:

- **Fine-grained personal access tokens (beta):** You can select the permissions you want to give to the token.
  Here y have to select in resource owner: your organization. Then you have to select the permissions you want to give to the token. In this case, you need to select repository access: `All repositories`.

  Then at repositories permissions you have to select:

  - Commit statuses: `read-only`
  - Contents: `read-only`
  - Metadata: `read-only`
  - Pull requests: `read-only`

  ![Fine-grained personal access tokens](/img/grained-token.png 'Fine-grained personal access tokens')

- Personal access tokens (classic): Here are the permissions you need to give to the token:

  - repo: `Full control of private repositories`
  - admin:org: `read:org`

  ![Personal access tokens](/img/classic-token.png 'Personal access tokens')

  ```
  GITHUB_TOKEN=
  ```

4. Build the project and install it globally:

   ```
   yarn build
   ```

   ```
   npm install -g .
   ```

> Is important to know if you change the `.env` file you need to build the project again.

5. Run the script:

```
cordyceps
```

![Get repositories](/img/img2.png 'Get repositories')

### You need to know

1.  **GitHub Organization:** The organization you want to clone.
2.  **Folder:** The path where you want to clone the repositories. If the folder doesn't exist, it will be created.

## Roadmap 🚀

- [ ] If you select _get all repositories_, don't ask for the folder name.
- [ ] If you select _break_, don't ask GitHub organization or folder name.
