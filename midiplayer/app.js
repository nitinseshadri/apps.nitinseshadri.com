// MIDI Player microsite
// By Nitin Seshadri

// Template engine
// Simple JavaScript Templating
// John Resig - https://johnresig.com/ - MIT Licensed
(function(){
  var cache = {};
   
  this.tmpl = function tmpl(str, data){
    // Figure out if we're getting a template, or if we need to
    // load the template - and be sure to cache the result.
    var fn = !/\W/.test(str) ?
      cache[str] = cache[str] ||
        tmpl(document.getElementById(str).innerHTML) :
       
      // Generate a reusable function that will serve as a template
      // generator (and which will be cached).
      new Function("obj",
        "var p=[],print=function(){p.push.apply(p,arguments);};" +
         
        // Introduce the data as local variables using with(){}
        "with(obj){p.push('" +
         
        // Convert the template into pure JavaScript
        str
          .replace(/[\r\t\n]/g, " ")
          .split("<%").join("\t")
          .replace(/((^|%>)[^\t]*)'/g, "$1\r")
          .replace(/\t=(.*?)%>/g, "',$1,'")
          .split("\t").join("');")
          .split("%>").join("p.push('")
          .split("\r").join("\\'")
      + "');}return p.join('');");
     
    // Provide some basic currying to the user
    return data ? fn( data ) : fn;
  };
})();

// Components
const HomeComponent = {
  render: () => {
    if (location.hash != "#/home") location.hash = "#/home";
    return tmpl(`
      <h1 class="cover-heading">NS MIDI Player</h1>
      <p class="lead">A simple MIDI player for iOS and macOS.</p>
      <p class="lead">
        <a href="https://apps.apple.com/us/app/id1514225088" class="btn btn-lg btn-secondary">Get the app</a>
      </p>
    `, []);
  }
} 

const PrivacyComponent = {
  render: () => {
    return tmpl(`
      <h1>Privacy Policy</h1>
      <p>This app does not collect or store any user data or analytics, period.</p>
      <link href="./privacylabels.css" rel="stylesheet">
      <div class="app-privacy__cards">
        <div class="app-privacy__card">
          <div class="privacy-type__icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64" aria-hidden="true"><path d="M32.09 61.568c16.185 0 29.586-13.43 29.586-29.587 0-16.186-13.43-29.587-29.616-29.587-16.157 0-29.558 13.4-29.558 29.587 0 16.156 13.43 29.587 29.587 29.587zm0-4.932c-13.692 0-24.628-10.964-24.628-24.655 0-13.692 10.907-24.656 24.598-24.656 13.691 0 24.656 10.964 24.685 24.656.03 13.69-10.965 24.655-24.656 24.655zM28.897 45.76c.958 0 1.77-.464 2.35-1.363L44.504 23.54c.32-.551.696-1.219.696-1.857 0-1.276-1.16-2.117-2.378-2.117-.725 0-1.45.435-2.002 1.305l-12.038 19.29-5.714-7.368c-.696-.928-1.334-1.19-2.146-1.19-1.248 0-2.234 1.016-2.234 2.321 0 .61.261 1.247.667 1.799l7.078 8.673c.725.957 1.508 1.363 2.465 1.363z"></path></svg>
          </div>
          <h3 class="privacy-type__heading">Data Not Collected</h3>
          <p class="privacy-type__description">The developer does not collect any data from this app.</p>
          <!---->      
        </div>
      </div>
    `, []);
  }
} 

const ContactComponent = {
  render: () => {
    return tmpl(`
      <h1>Contact Me</h1>
      <p>Need help or have feedback? Drop me a line at:</p>
      <pre>apps@nitinseshadri.com</pre>
    `, []);
  }
} 

const ErrorComponent = {
  render: () => {
    return tmpl(`
      <h1>Error</h1>
      <p>That page could not be found.</p>
    `, []);
  }
}

// Routes 
const routes = [
  { path: '/', component: HomeComponent, },
  { path: '/home', component: HomeComponent, },
  { path: '/privacy', component: PrivacyComponent, },
  { path: '/contact', component: ContactComponent, },
];

// Router
const parseLocation = () => location.hash.slice(1).toLowerCase() || '/';
const findComponentByPath = (path, routes) => routes.find(r => r.path.match(new RegExp(`^\\${path}$`, 'gm'))) || undefined;

const router = () => {
  // Find the component based on the current path
  const path = parseLocation();
  // If there's no matching route, get the "Error" component
  const { component = ErrorComponent } = findComponentByPath(path, routes) || {};
  // Render the component in the "app" placeholder
  document.getElementById('app').innerHTML = component.render();
  // Update the navigation bar to match the current page
  var navLinks = document.querySelectorAll("a.nav-link");
  navLinks.forEach(function (element) {
    element.classList.remove("active");
    if (element.dataset.uiHref == path) {
      element.classList.add("active");
    }
  });
};

window.addEventListener('hashchange', router);
window.addEventListener('load', router);
