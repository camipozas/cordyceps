// import simpleGit, { SimpleGit } from "simple-git";
// import { env } from "./env/env";

// export const cloneRepositories = async (repoNames: string[]) => {
//   const git: SimpleGit = simpleGit();

//   for (const repoName of repoNames) {
//     const repoUrl = `https://github.com/${env.GITHUB_ORG}/${repoName}`;
//     const localPath = `${env.HOME}/${repoName}`;

//     await git.clone(repoUrl, localPath);
//     console.log(`Cloned ${repoName} into ${localPath}`);
//   }
// };

import { env } from "./env/env";
