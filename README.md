# multi-replace

Replaces text and filenames preserving cases.
Can be used to rename Angular components.

## Usage

1. Right click folder in Explorer (e.g. `my-component`)
2. Select `multi-replace` option
3. Select additional option (or press `Enter` to skip)
4. Insert search value (e.g. `my-component`) and press `Enter`
5. Insert replace value (e.g. `our-new-component`) and press `Enter`

Files in selected folder will be renamed and text inside this files will be replaced.

## Troubleshooting

If you want replace single word string like "example" with several word string like "new_example" it will be replaced with "newExample" because camelCase used by default for string that case not detected.

Use `strict` option to replace some string with another string without case detection or configure `"multi-replace.default-case"` setting.
