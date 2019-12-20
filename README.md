# Archlint

### What is this repository for?

Archlint is a tool for checking and enforcing proper standards for Nuxt projects.

Featured Rules:

- Lint naming conventions for files
- TODO: Lint Vue Store Usage
- TODO: Lint directory structure

### How do I get set up?

- Cloan repo to any directory
- `cd` to the directory
- Run...
  ```
  npm link
  ```
- Open your desired Nuxt Repo in VSCode (or whatever IDE)
- Copy and past the contents of the .exampleSetupFiles into your root directory
- Open the terminal from your Nuxt repo root and run ...

  ```
  bash npm link archlint-demo
  ```

* In your local Nuxt Repo's `package.json` add...

```
"scripts": {
    "archlint": "archlint",
    ...
}
```

### Contribution guidelines

- TODO: Writing tests
- Code review
- Other guidelines

### Who do I talk to?

- Spencer Marx
- Matthew Bowler
