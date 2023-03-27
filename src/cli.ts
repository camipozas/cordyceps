import chalk from 'chalk';
import prompts, { PromptObject } from 'prompts';

import { main } from './index';

const enum Options {
  GetRepositoriesList = 'Get repositories list',
  GetRepositoriesListAndCloneIt = 'Get repositories list and clone it',
  GetRepositoriesListCloneItAndGetStatus = 'Get repositories list, clone it and get status',
  GetStatus = 'Get status',
  EndProgram = 'End program',
}

interface PromptAnswers {
  org: string;
  folder: string;
  option: Options;
}

/**
 * It asks the user for the GitHub organization, the folder to save the repositories, and the option to
 * run
 */
const runCLI = async () => {
  console.log(chalk.blue.bold('🚀 Create your own GitHub organization backup script 🚀'));

  const questions: PromptObject[] = [
    {
      type: 'select',
      name: 'option',
      message: 'Select an option:',
      choices: [
        { title: Options.GetRepositoriesList, value: Options.GetRepositoriesList },
        {
          title: Options.GetRepositoriesListAndCloneIt,
          value: Options.GetRepositoriesListAndCloneIt,
        },
        {
          title: Options.GetRepositoriesListCloneItAndGetStatus,
          value: Options.GetRepositoriesListCloneItAndGetStatus,
        },
        { title: Options.GetStatus, value: Options.GetStatus },
        { title: Options.EndProgram, value: Options.EndProgram },
      ],
    },
    {
      type: 'text',
      name: 'org',
      message: 'Enter the GitHub organization:',
    },
    {
      type: 'text',
      name: 'folder',
      message: 'Enter the folder to save the repositories:',
    },
  ];

  const answers = (await prompts(questions)) as PromptAnswers;

  const { org, folder, option } = answers;

  switch (option) {
    case Options.GetRepositoriesList:
      await main(org, folder, false, false);
      break;
    case Options.GetRepositoriesListAndCloneIt:
      await main(org, folder, true, false);
      break;
    case Options.GetRepositoriesListCloneItAndGetStatus:
      await main(org, folder, true, true);
      break;
    case Options.GetStatus:
      await main(org, folder, false, true);
      break;
    case Options.EndProgram:
      console.log(chalk.magenta.bold('👋 Bye!'));
      break;
    default:
      console.log(chalk.red.bold('Invalid option'));
      break;
  }
};

runCLI();
