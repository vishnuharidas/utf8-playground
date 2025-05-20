# Generate Unicode Data JSON
This project includes a utility script to fetch and process the latest Unicode character data from the official `UnicodeData.txt` and save it as a JSON file to use within the application.

#### Usage:

Run the script:

```shell
node utils/generate_unicode_lookup.js
```

This will:

 - Download the latest Unicode character data from unicode.org.
 - Process the data to extract code points and character names.
 - Save the result as unicode_data.json in the current directory.

Output
 - The script creates a file named `unicode_data.json` containing an array of objects:

```json
[
  { "code": "0020", "name": "SPACE" },
  { "code": "0021", "name": "EXCLAMATION MARK" },
  ...
]
```

This data is minified using a minifier tool like `jq` and then copied to `src/utf8/unicode_table.json`, where it is utilized by the application.

Example:

```shell
jq -c < unicode_data.json > unicode_table.json
```