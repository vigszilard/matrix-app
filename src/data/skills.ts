import { Category, Skill } from '../types';

export const categories: Category[] = [
  // General categories (applicable to all)
  {
    id: 'general-programming',
    name: 'General Programming',
    applicableTo: ['manual', 'selenium', 'cypress', 'playwright']
  },
  {
    id: 'testing-fundamentals',
    name: 'Testing Fundamentals',
    applicableTo: ['manual', 'selenium', 'cypress', 'playwright']
  },
  {
    id: 'problem-solving',
    name: 'Problem Solving',
    applicableTo: ['manual', 'selenium', 'cypress', 'playwright']
  },
  
  // Manual testing specific
  {
    id: 'manual-testing',
    name: 'Manual Testing',
    applicableTo: ['manual']
  },
  
  // Automation specific
  {
    id: 'selenium-specific',
    name: 'Selenium Specific',
    applicableTo: ['selenium']
  },
  {
    id: 'cypress-specific',
    name: 'Cypress Specific',
    applicableTo: ['cypress']
  },
  {
    id: 'playwright-specific',
    name: 'Playwright Specific',
    applicableTo: ['playwright']
  }
];

export const skills: Skill[] = [
  // General Programming
  {
    id: 'javascript-basics',
    name: 'JavaScript Basics',
    category: 'general-programming',
    applicableTo: ['manual', 'selenium', 'cypress', 'playwright'],
    description: [
      'Understanding of variables, functions, and basic syntax',
      'Knowledge of data types (strings, numbers, booleans, objects)',
      'Ability to write simple scripts and understand code flow',
      'Familiarity with ES6+ features (arrow functions, destructuring)'
    ]
  },
  {
    id: 'css-selectors',
    name: 'CSS Selectors',
    category: 'general-programming',
    applicableTo: ['manual', 'selenium', 'cypress', 'playwright'],
    description: [
      'Understanding of CSS selector syntax and specificity',
      'Knowledge of element, class, ID, and attribute selectors',
      'Ability to write complex selectors for precise targeting',
      'Understanding of pseudo-selectors and combinators'
    ]
  },
  {
    id: 'html-knowledge',
    name: 'HTML Knowledge',
    category: 'general-programming',
    applicableTo: ['manual', 'selenium', 'cypress', 'playwright'],
    description: [
      'Understanding of HTML structure and semantic elements',
      'Knowledge of forms, inputs, and user interaction elements',
      'Understanding of accessibility attributes and best practices',
      'Ability to identify and work with different HTML elements'
    ]
  },
  
  // Testing Fundamentals
  {
    id: 'test-design',
    name: 'Test Design',
    category: 'testing-fundamentals',
    applicableTo: ['manual', 'selenium', 'cypress', 'playwright'],
    description: [
      'Ability to create comprehensive test cases and scenarios',
      'Understanding of test coverage and risk-based testing',
      'Knowledge of positive and negative test cases',
      'Ability to design tests for different user personas and workflows'
    ]
  },
  {
    id: 'bug-reporting',
    name: 'Bug Reporting',
    category: 'testing-fundamentals',
    applicableTo: ['manual', 'selenium', 'cypress', 'playwright'],
    description: [
      'Ability to write clear, detailed bug reports with steps to reproduce',
      'Understanding of bug severity and priority classification',
      'Knowledge of bug tracking tools and workflows',
      'Ability to provide screenshots, logs, and supporting evidence'
    ]
  },
  {
    id: 'test-planning',
    name: 'Test Planning',
    category: 'testing-fundamentals',
    applicableTo: ['manual', 'selenium', 'cypress', 'playwright']
  },
  
  // Problem Solving
  {
    id: 'debugging-skills',
    name: 'Debugging Skills',
    category: 'problem-solving',
    applicableTo: ['manual', 'selenium', 'cypress', 'playwright']
  },
  {
    id: 'analytical-thinking',
    name: 'Analytical Thinking',
    category: 'problem-solving',
    applicableTo: ['manual', 'selenium', 'cypress', 'playwright']
  },
  
  // Manual Testing
  {
    id: 'exploratory-testing',
    name: 'Exploratory Testing',
    category: 'manual-testing',
    applicableTo: ['manual'],
    description: [
      'Ability to perform ad-hoc testing without predefined test cases',
      'Understanding of session-based testing and charter creation',
      'Skills in discovering defects through systematic exploration',
      'Ability to adapt testing approach based on findings'
    ]
  },
  {
    id: 'usability-testing',
    name: 'Usability Testing',
    category: 'manual-testing',
    applicableTo: ['manual'],
    description: [
      'Understanding of user experience principles and usability heuristics',
      'Ability to evaluate interface design and user workflows',
      'Skills in identifying usability issues and accessibility problems',
      'Experience with user-centered testing approaches'
    ]
  },
  
  // Selenium Specific
  {
    id: 'selenium-webdriver',
    name: 'Selenium WebDriver',
    category: 'selenium-specific',
    applicableTo: ['selenium'],
    description: [
      'Understanding of WebDriver architecture and browser automation',
      'Knowledge of WebDriver API methods and commands',
      'Ability to interact with web elements (click, type, select)',
      'Understanding of browser-specific drivers and capabilities'
    ]
  },
  {
    id: 'selenium-grid',
    name: 'Selenium Grid',
    category: 'selenium-specific',
    applicableTo: ['selenium']
  },
  {
    id: 'selenium-waits',
    name: 'Selenium Waits',
    category: 'selenium-specific',
    applicableTo: ['selenium']
  },
  
  // Cypress Specific
  {
    id: 'cypress-basics',
    name: 'Cypress Basics',
    category: 'cypress-specific',
    applicableTo: ['cypress'],
    description: [
      'Understanding of Cypress architecture and test runner',
      'Knowledge of Cypress commands and API methods',
      'Ability to write and execute Cypress tests',
      'Understanding of Cypress debugging and time-travel features'
    ]
  },
  {
    id: 'cypress-fixtures',
    name: 'Cypress Fixtures',
    category: 'cypress-specific',
    applicableTo: ['cypress']
  },
  {
    id: 'cypress-commands',
    name: 'Cypress Commands',
    category: 'cypress-specific',
    applicableTo: ['cypress']
  },
  
  // Playwright Specific
  {
    id: 'playwright-basics',
    name: 'Playwright Basics',
    category: 'playwright-specific',
    applicableTo: ['playwright'],
    description: [
      'Understanding of Playwright architecture and multi-browser support',
      'Knowledge of Playwright API and page object model',
      'Ability to write cross-browser tests with Playwright',
      'Understanding of Playwright auto-waiting and retry mechanisms'
    ]
  },
  {
    id: 'playwright-trace',
    name: 'Playwright Trace',
    category: 'playwright-specific',
    applicableTo: ['playwright']
  },
  {
    id: 'playwright-debugging',
    name: 'Playwright Debugging',
    category: 'playwright-specific',
    applicableTo: ['playwright']
  }
];
