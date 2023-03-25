import { getAllRepositories, accessibleRepos } from "./get-repositories";
import { cloneRepositories } from "./clone-repositories";

const main = async () => {
  const allRepos = await getAllRepositories();
  const accessible = await accessibleRepos(allRepos);
  await cloneRepositories(accessible);
  console.log(accessible);
};

main();
