# Angular Elements Tutorial: Building Custom Elements from Angular Libraries

This project demonstrates how to create Angular libraries in a monorepo workspace and convert them into Angular Elements (Custom Elements/Web Components) that can be used in any HTML page, including non-Angular projects.

## Table of Contents

1. [Creating the Angular Workspace](#1-creating-the-angular-workspace)
2. [Creating Libraries in the Workspace](#2-creating-libraries-in-the-workspace)
3. [Adding Angular Elements Support](#3-adding-angular-elements-support)
4. [Building the Element Output](#4-building-the-element-output)
5. [Using the Custom Element](#5-using-the-custom-element)

---

## 1. Creating the Angular Workspace

### Step 1.1: Create a new Angular workspace

First, create a new Angular workspace using the Angular CLI:

```bash
ng new confirmation-lib --create-application=false
```

**Explanation:**
- `--create-application=false` creates a workspace without a default application, perfect for a library-only monorepo
- This creates a workspace structure with a `projects/` directory where libraries will live

### Step 1.2: Navigate to the project

```bash
cd confirmation-lib
```

---

## 2. Creating Libraries in the Workspace

### Step 2.1: Create the first library (grid-lib)

```bash
ng generate library grid-lib
```

**What this does:**
- Creates a new library project in `projects/grid-lib/`
- Sets up the library structure with:
  - `src/lib/` - Library source code
  - `src/public-api.ts` - Public API exports
  - `ng-package.json` - ng-packagr configuration
  - `tsconfig.lib.json` - TypeScript configuration for library builds

### Step 2.2: Create the second library (filter-lib)

```bash
ng generate library filter-lib
```

**What this does:**
- Creates another library project in `projects/filter-lib/`
- Same structure as grid-lib
- Both libraries can be built independently

### Step 2.3: Verify the workspace structure

After creating both libraries, your workspace structure should look like:

```
confirmation-lib/
├── projects/
│   ├── grid-lib/
│   │   ├── src/
│   │   │   ├── lib/
│   │   │   │   └── grid-lib.ts
│   │   │   └── public-api.ts
│   │   └── ng-package.json
│   └── filter-lib/
│       ├── src/
│       │   ├── lib/
│       │   │   └── filter-lib.ts
│       │   └── public-api.ts
│       └── ng-package.json
├── angular.json
├── package.json
└── tsconfig.json
```

**Key Points:**
- `angular.json` contains configuration for all projects in the workspace
- Each library has its own `package.json` for publishing
- Libraries can depend on each other through TypeScript path mappings

---

## 3. Adding Angular Elements Support

To convert an Angular component into a Custom Element (Web Component), we need to add Angular Elements support to the `filter-lib` library.

### Step 3.1: Install @angular/elements

```bash
npm install @angular/elements
```

**What this does:**
- Adds the `@angular/elements` package which provides the `createCustomElement()` function
- This function converts Angular components into Custom Elements that work in any HTML page

### Step 3.2: Create the bootstrap file (main.ts)

Create a new file `projects/filter-lib/src/main.ts`:

```typescript
import { createApplication } from '@angular/platform-browser';
import { createCustomElement } from '@angular/elements';
import { FilterLib } from './lib/filter-lib';

// Bootstrap the Angular application
createApplication().then((appRef) => {
  // Convert the FilterLib component to a custom element
  const FilterElement = createCustomElement(FilterLib, {
    injector: appRef.injector,
  });

  // Register the custom element with the browser
  // Use a different tag name than the component selector to avoid conflicts
  customElements.define('filter-element', FilterElement);
});
```

**Explanation:**
- `createApplication()` - Bootstraps a minimal Angular application (needed for dependency injection)
- `createCustomElement()` - Converts the Angular component into a Custom Element class
- `customElements.define()` - Registers the custom element with the browser's CustomElementRegistry
- The tag name `filter-element` is different from the component selector `lib-filter-lib` to avoid conflicts

### Step 3.3: Create TypeScript configuration for element build

Create `projects/filter-lib/tsconfig.element.json`:

```json
{
  "extends": "./tsconfig.lib.json",
  "compilerOptions": {
    "outDir": "../../out-tsc/element",
    "types": []
  },
  "files": [
    "src/main.ts"
  ]
}
```

**Explanation:**
- Extends the library TypeScript config
- Specifies `main.ts` as the entry point for the element build
- Sets a separate output directory to avoid conflicts with library builds

### Step 3.4: Create index.html template

Create `projects/filter-lib/src/index.html`:

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Filter Lib Element</title>
</head>
<body>
  <!-- Use the custom element -->
  <filter-element></filter-element>
</body>
</html>
```

**Explanation:**
- This template is used by the build process
- The `<filter-element>` tag demonstrates usage
- The build will automatically inject the script tag with the correct hash

---

## 4. Building the Element Output

### Step 4.1: Add build configuration to angular.json

Add a new build target in `angular.json` under the `filter-lib` project's `architect` section:

```json
"build-element": {
  "builder": "@angular/build:application",
  "options": {
    "outputPath": "dist/filter-lib-element",
    "index": "projects/filter-lib/src/index.html",
    "browser": "projects/filter-lib/src/main.ts",
    "polyfills": [],
    "tsConfig": "projects/filter-lib/tsconfig.element.json",
    "assets": [],
    "styles": [],
    "scripts": []
  },
  "configurations": {
    "production": {
      "budgets": [
        {
          "type": "initial",
          "maximumWarning": "500kb",
          "maximumError": "1mb"
        },
        {
          "type": "anyComponentStyle",
          "maximumWarning": "2kb",
          "maximumError": "4kb"
        }
      ],
      "outputHashing": "all"
    },
    "development": {
      "optimization": false,
      "extractLicenses": false,
      "sourceMap": true
    }
  },
  "defaultConfiguration": "production"
}
```

**Key Configuration Points:**
- `builder: "@angular/build:application"` - Uses the application builder (not library builder) to create a standalone bundle
- `browser: "projects/filter-lib/src/main.ts"` - Entry point is our bootstrap file
- `tsConfig: "projects/filter-lib/tsconfig.element.json"` - Uses our element-specific TypeScript config
- `outputPath: "dist/filter-lib-element"` - Output directory for the built element
- `outputHashing: "all"` - Adds content hashes to filenames for cache busting

### Step 4.2: Add npm script

Add to `package.json` scripts section:

```json
"build:filter-element": "ng run filter-lib:build-element"
```

**Explanation:**
- `ng run` executes a specific architect target
- `filter-lib:build-element` refers to the `build-element` target in the `filter-lib` project

### Step 4.3: Build the element

```bash
npm run build:filter-element
```

**What happens:**
- Angular compiles `main.ts` and all its dependencies
- Bundles everything into a single JavaScript file
- Outputs to `dist/filter-lib-element/browser/`
- Creates `index.html` with the custom element tag and script reference
- Filenames include content hashes (e.g., `main-CHSX62GP.js`)

**Output Structure:**
```
dist/filter-lib-element/
└── browser/
    ├── index.html          # Example HTML with the element
    └── main-CHSX62GP.js    # Bundled JavaScript (hash changes per build)
```

---

## 5. Using the Custom Element

### Step 5.1: View the built example

The build process creates `dist/filter-lib-element/browser/index.html` which you can open in a browser (requires a local server for ES modules):

```bash
cd dist/filter-lib-element/browser
python3 -m http.server 8000
# Open http://localhost:8000/index.html
```

### Step 5.2: Use in any HTML page

You can use the custom element in any HTML page:

```html
<!doctype html>
<html>
<head>
  <title>My App</title>
</head>
<body>
  <!-- Use the custom element like any HTML element -->
  <filter-element></filter-element>
  
  <!-- Load the Angular element bundle -->
  <!-- Note: Update the filename to match the actual generated file -->
  <script type="module" src="path/to/dist/filter-lib-element/browser/main-CHSX62GP.js"></script>
</body>
</html>
```

**Important Notes:**
- The custom element works in **any** HTML page, not just Angular apps
- ES modules require a web server (can't use `file://` protocol)
- The JavaScript filename includes a content hash that changes on each build
- You'll need to update the script tag filename after each build, or use a build tool to inject it automatically

---

## Summary of Changes

To add Angular Elements support to a library, you need to:

1. ✅ Install `@angular/elements` package
2. ✅ Create `main.ts` bootstrap file that:
   - Bootstraps an Angular application
   - Converts the component to a custom element
   - Registers it with the browser
3. ✅ Create `tsconfig.element.json` for element-specific TypeScript config
4. ✅ Create `index.html` template with the custom element tag
5. ✅ Add `build-element` target to `angular.json` using the application builder
6. ✅ Add npm script to build the element
7. ✅ Build and use the output in any HTML page

---

## Key Concepts

### Monorepo Workspace
- A single repository containing multiple related projects
- Shared dependencies and configuration
- Libraries can be built and published independently

### Angular Elements
- Angular components packaged as Custom Elements (Web Components)
- Framework-agnostic - works in any HTML page
- Self-bootstrapping - no Angular app required to use them

### Build Process
- Library build (`ng build filter-lib`) - Creates npm package
- Element build (`npm run build:filter-element`) - Creates standalone bundle
- Different builders: `ng-packagr` for libraries, `application` for elements

---

## Additional Resources

- [Angular Elements Documentation](https://angular.dev/guide/elements)
- [Angular Workspace Configuration](https://angular.dev/tools/cli/workspace-config)
- [Web Components Specification](https://developer.mozilla.org/en-US/docs/Web/Web_Components)

---

## Development Commands

```bash
# Build the library (for npm publishing)
ng build filter-lib

# Build the element (for standalone use)
npm run build:filter-element

# Run tests
ng test
```
