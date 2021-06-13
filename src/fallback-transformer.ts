import { camelCase, kebabCase, snakeCase } from 'lodash';
import { workspace } from 'vscode';

enum FallbackCase {
  Camel = 'camelCase',
  Snake = 'snake_case',
  Kebab = 'kebab-case',
}

export const fallbackTransformer = () => {
  const fallbackCase =
    (workspace.getConfiguration('multi-replace').get('default-case') as FallbackCase) ??
    FallbackCase.Camel;
  switch (fallbackCase) {
    case FallbackCase.Kebab: {
      return kebabCase;
    }
    case FallbackCase.Snake: {
      return snakeCase;
    }
    default: {
      return camelCase;
    }
  }
};
