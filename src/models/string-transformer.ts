export interface StringTransformer {
	replace(sourceString: string, searchValue: string, replaceValue: string): string;
}
