import { camelCase, kebabCase, snakeCase } from 'lodash';

import { angularCase } from './utils/angular-case';
import { constantCase } from './utils/constant-case';
import { pascalCase } from './utils/pascal-case';

type CaseTransformer = (str: string) => string;

export const defaultTransformers = [angularCase, camelCase, constantCase, kebabCase, pascalCase, snakeCase];

export class StringTransformerImp {
	constructor(
		private caseTransformers: CaseTransformer[] = defaultTransformers,
		private defaultTransformer: CaseTransformer = camelCase,
	) {
		this.setDefaultTransformer();
	}

	replace(sourceString: string, searchValue: string, replaceValue: string): string {
		const replaceMap = this.getReplaceMap(searchValue, replaceValue);
		const regExp = new RegExp(Object.keys(replaceMap).join('|'), 'g');
		return sourceString.replace(regExp, (matched) => (matched in replaceMap ? replaceMap[matched] : matched));
	}

	private getReplaceMap(searchValue: string, replaceValue: string): { [s: string]: string } {
		const searchValues = this.caseTransformers.map((transform) => transform(searchValue));
		const replaceValues = this.caseTransformers.map((transform) => transform(replaceValue));
		return searchValues.reduce(
			(acc, value, index) => {
				acc[value] = replaceValues[index];
				return acc;
			},
			{} as { [s: string]: string },
		);
	}

	private setDefaultTransformer() {
		this.caseTransformers.sort((transformer) => (transformer === this.defaultTransformer ? 1 : -1));
	}
}
