# FilterLib

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.0.0.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

### Building as a Library

To build the library, run:

```bash
ng build filter-lib
```

This command will compile your project, and the build artifacts will be placed in the `dist/` directory.

### Building as an Angular Element (Custom Element)

To build the library as a standalone Angular Element that can be used in any HTML page (including non-Angular projects), run:

```bash
npm run build:filter-element
```

Or:

```bash
ng build filter-lib --configuration build-element
```

This will create a bundle in `dist/filter-lib-element/` that you can use in any HTML page.

### Using the Custom Element

After building the element, you can use it in any HTML page:

```html
<!doctype html>
<html>
<head>
  <title>My App</title>
</head>
<body>
  <!-- Use the custom element -->
  <filter-element></filter-element>
  
  <!-- Load the Angular element bundle -->
  <!-- Note: The filename includes a hash that changes on each build -->
  <!-- Check dist/filter-lib-element/browser/ for the actual filename -->
  <script type="module" src="path/to/dist/filter-lib-element/browser/main-XXXXX.js"></script>
</body>
</html>
```

The custom element is registered as `<filter-element>` and can be used just like any other HTML element. 

**Note:** The generated JavaScript file includes a content hash in its filename (e.g., `main-CHSX62GP.js`). You'll need to update the script tag with the actual filename after each build, or use a build tool to automatically inject it.

The built `index.html` in `dist/filter-lib-element/browser/` serves as a working example of the custom element.

### Publishing the Library

Once the project is built, you can publish your library by following these steps:

1. Navigate to the `dist` directory:
   ```bash
   cd dist/filter-lib
   ```

2. Run the `npm publish` command to publish your library to the npm registry:
   ```bash
   npm publish
   ```

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
