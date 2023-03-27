#! /usr/bin/env node

import chalk from 'chalk';
import prompts, { PromptObject } from 'prompts';

import { getRepositoriesList } from './get-repositories';
import {
  getRepositoriesAndCloneIt,
  getRepositoriesCloneItAndGetStatus,
  getStatus,
} from './utils/git-utils';

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
      message: '🏢 Enter the GitHub organization:',
    },
    {
      type: 'text',
      name: 'folder',
      message: '📁Enter the folder to save the repositories:',
    },
  ];

  const answers = (await prompts(questions)) as PromptAnswers;

  const { org, folder, option } = answers;

  if (option === Options.EndProgram) {
    console.log(chalk.magenta.bold('👋 Bye!'));
  } else {
    switch (option) {
      case Options.GetRepositoriesList:
        await getRepositoriesList(org);
        [
          {
            type: 'text',
            name: 'org',
            message: '🏢 Enter the GitHub organization:',
          },
        ];
        break;
      case Options.GetRepositoriesListAndCloneIt:
        await getRepositoriesAndCloneIt(org, folder);
        break;
      case Options.GetRepositoriesListCloneItAndGetStatus:
        await getRepositoriesCloneItAndGetStatus(org, folder);
        break;
      case Options.GetStatus:
        await getStatus(org, folder);
        break;
      default:
        console.log(chalk.red.bold('Invalid option'));
        break;
    }
  }
};

runCLI();
