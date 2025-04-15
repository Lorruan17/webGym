self.addEventListener("install", (event) => {
    console.log("SW instalado.");
    self.skipWaiting();
  });
  
  self.addEventListener("activate", (event) => {
    console.log("SW ativado.");
  });
  
  self.addEventListener("fetch", (event) => {
    event.respondWith(fetch(event.request));
  });
  