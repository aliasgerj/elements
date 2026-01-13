# Angular Elements Tutorial: Building Custom Elements from Angular Libraries

This project demonstrates how to create Angular libraries in a monorepo workspace and convert them into Angular Elements (Custom Elements/Web Components) that can be used in any HTML page, including non-Angular projects.

## Table of Contents

1. [Creating the Angular Workspace](#1-creating-the-angular-workspace)
2. [Creating Libraries in the Workspace](#2-creating-libraries-in-the-workspace)
3. [Adding Applications to the Workspace](#3-adding-applications-to-the-workspace)
4. [Adding Angular Elements Support](#4-adding-angular-elements-support)
5. [Building the Element Output](#5-building-the-element-output)
6. [Using the Custom Element](#6-using-the-custom-element)

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

## 3. Adding Applications to the Workspace

In addition to libraries, you can also add full Angular applications to your workspace. This is useful for:
- Testing libraries in a real application context
- Creating demo applications
- Building multiple applications that share libraries
- Developing applications that consume your custom elements

### Step 3.1: Generate the first application (support-app)

```bash
ng generate application support-app
```

**What this does:**
- Creates a new Angular application in `projects/support-app/`
- Sets up a complete application structure with:
  - `src/app/` - Application source code (components, services, etc.)
  - `src/main.ts` - Application bootstrap file
  - `src/index.html` - Main HTML template
  - `src/styles.scss` - Global styles
  - `public/` - Static assets (favicon, etc.)
  - `tsconfig.app.json` - TypeScript configuration for the app

### Step 3.2: Generate the second application (customer-app)

```bash
ng generate application customer-app
```

**What this does:**
- Creates another application in `projects/customer-app/`
- Same structure as support-app
- Both applications are independent and can be built/served separately

### Step 3.3: Verify the workspace structure

After adding applications, your workspace structure should look like:

```
confirmation-lib/
├── projects/
│   ├── grid-lib/          # Library
│   ├── filter-lib/         # Library
│   ├── support-app/        # Application
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── app.ts
│   │   │   │   ├── app.html
│   │   │   │   └── app.scss
│   │   │   ├── main.ts
│   │   │   ├── index.html
│   │   │   └── styles.scss
│   │   └── public/
│   └── customer-app/       # Application
│       ├── src/
│       │   ├── app/
│       │   │   ├── app.ts
│       │   │   ├── app.html
│       │   │   └── app.scss
│       │   ├── main.ts
│       │   ├── index.html
│       │   └── styles.scss
│       └── public/
├── angular.json            # Configuration for all projects
├── package.json
└── tsconfig.json
```

**Key Points:**
- Applications are added to `angular.json` automatically
- Each application has its own `serve` configuration for development
- Applications can import and use libraries from the same workspace
- Applications can consume custom elements built from libraries

### Step 3.4: Running the applications

You can run any application in development mode using the Angular CLI:

**Run support-app:**
```bash
ng serve support-app
```

**Run customer-app:**
```bash
ng serve customer-app
```

**What happens:**
- Angular starts a development server (default: `http://localhost:4200`)
- The application is compiled and served with hot-reload
- Changes to source files trigger automatic rebuilds
- The browser automatically refreshes when changes are detected

**Alternative: Using project-specific serve commands**

You can also use the `ng run` command with the serve target:

```bash
# Serve support-app
ng run support-app:serve

# Serve customer-app
ng run customer-app:serve
```

**Running multiple applications simultaneously:**

Since each application runs on port 4200 by default, you'll need to specify different ports when running multiple apps:

```bash
# Terminal 1: Run support-app on port 4200
ng serve support-app

# Terminal 2: Run customer-app on port 4201
ng serve customer-app --port 4201
```

**Building applications for production:**

```bash
# Build support-app
ng build support-app

# Build customer-app
ng build customer-app
```

The production builds are output to `dist/support-app/` and `dist/customer-app/` respectively.

**Educational Notes:**
- Applications in a monorepo share the same `node_modules` and dependencies
- Applications can import libraries using TypeScript path mappings (configured in `tsconfig.json`)
- This setup allows you to develop libraries and test them in real applications simultaneously
- The workspace structure makes it easy to maintain multiple related projects together

---

## 4. Adding Angular Elements Support

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

## 5. Building the Element Output

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

## 6. Using the Custom Element

### Step 5.1: View the built example

The build process creates `dist/filter-lib-element/browser/index.html` which you can open in a browser (requires a local server for ES modules):

```bash
cd dist/filter-lib-element/browser
npx http-server -p 8000
# Open http://localhost:8000/index.html
```

**Explanation:**
- `npx http-server` - Runs the http-server package without needing to install it globally
- `-p 8000` - Specifies the port number (default is 8080 if not specified)
- ES modules require a web server and cannot be loaded using the `file://` protocol

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

# Serve applications in development mode
ng serve support-app
ng serve customer-app

# Build applications for production
ng build support-app
ng build customer-app

# Run tests
ng test
```
