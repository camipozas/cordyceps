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

Cordyceps is a CLI tool that allows you to easily clone all the repositories in a GitHub organization with just one command.

![Initial Screen](/img/img1.png 'Initial screen')

## Introduction

In the series [The Last of Us](https://en.wikipedia.org/wiki/The_Last_of_Us), Cordyceps is a fungus that infects humans and turns them into zombies. Similarly, Cordyceps is a tool that can "infect" your GitHub organization and clone all the repositories in it with ease.

## Usage

1. Clone this repository:

```bash
git clone https://github.com/camipozas/cordyceps.git
```

2. Install the dependencies:

```bash
yarn install
```

3.  Create a GitHub Personal Access Token [here](https://docs.github.com/en/enterprise-server@3.4/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token), then add it to the `.env` file. You can also add the organization name, the path where you want to clone the repositories, and the branch you want to clone (default is Home).

There are two ways to do it in GitHub:

- **Fine-grained personal access tokens (beta):** You can select the permissions you want to give to the token.
  Here y have to select in resource owner: your organization. Then you have to select the permissions you want to give to the token. In this case, you need to select repository access: `All repositories`.

  Then at repositories permissions you have to select:

  - Commit statuses: `read-only`
  - Contents: `read-only`
  - Metadata: `read-only`
  - Pull requests: `read-only`

  ![Fine-grained personal access tokens](/img/grained-token.jpeg 'Fine-grained personal access tokens')

- Personal access tokens (classic): Here are the permissions you need to give to the token:

  - repo: `Full control of private repositories`
  - admin:org: `read:org`

  ![Personal access tokens](/img/classic-token.jpeg 'Personal access tokens')

  ```
  GITHUB_TOKEN=
  ```

1. Build the project and install it globally:

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

### Options

- **GitHub Organization:** The name of the organization you want to clone.
- **Folder:** The path where you want to clone the repositories. If the folder doesn't exist, it will be created.

### Example

I want to clone all the repositories in the organization called `test` into the folder `~/test`:
![Get repositories](/img/img2.png 'Get repositories')

## Requirements

- Node.js
- Yarn

## Roadmap 🚀

- [ ] If you select _get all repositories_, don't ask for the folder name.
- [ ] If you select _break_, don't ask GitHub organization or folder name.
- [ ] Add option to clone only specific repositories.
- [ ] Add option to clone repositories from multiple organizations.
- [ ] Improve error handling and messaging.

## Contributing

Contributions are welcome! If you'd like to contribute, please create a pull request with your proposed changes.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
