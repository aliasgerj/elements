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
