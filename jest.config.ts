import type {Config} from 'jest';

const config: Config = {
  //preset: 'ts-jest',
  preset: 'ts-jest', 
  "moduleDirectories": [
    "node_modules",
    "src"
  ],
  testEnvironment: 'node',
  transform: {
    '^.+\\.ts?$': 'ts-jest',
  },

  "moduleNameMapper": {
    "@App/(.*)": "<rootDir>/src/$1",
    "@Shared/(.*)": "<rootDir>/src/Shared/$1",
    "@/(.*)": "<rootDir>/src/$1",
    
  },
  testEnvironmentOptions: { resources: "usable" },
  transformIgnorePatterns: ['^.+\\.js$'],
  //transformIgnorePatterns: ['<rootDir>/node_modules/']
};

export default config;

