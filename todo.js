
// TODO: figure out build.js
// : https://www.youtube.com/watch?v=m6VNhqKDM4E


// TODO: consider discussing NPM Shrinkwrap in dev training
// : may not be necessary since build tooling isn't super dependant on unique packages


// TODO: test possibility of debugMode triggered spaceless on production storefront
// - I don't think the block scopes will be inherited by templates that extend page.hypr
// - Would likely have to override Site Default Template definition to point to this template
// : PAGE-LOADER.HYPR
// ---------------------------------
//  {% if pageContext.isDebug %}
//    {% include "page" %}
//  {% else %}
//    {% spaceless %}
//      {% include "page" %}
//    {% endspaceless %}
//  {% endif %}
