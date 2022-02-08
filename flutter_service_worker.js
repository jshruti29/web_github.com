'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "assets/AssetManifest.json": "be4d4e0363b1dbef81e8aa6b6b251df8",
"assets/assets/backgroundImages/shadowEllipsis.svg": "49911eb01568b3ce29c843474ffa9544",
"assets/assets/bottomNavigationItems/design.svg": "f2385af959c14f6d53337a6e45030c90",
"assets/assets/bottomNavigationItems/designFilled.svg": "234384648aa392cf7905b24709c86178",
"assets/assets/bottomNavigationItems/homeFilledIcon.svg": "a55a9aebf048cb584d0e7a58562c8405",
"assets/assets/bottomNavigationItems/homeIcon.svg": "73975be844d4b0307c1d2087d4ac0877",
"assets/assets/bottomNavigationItems/lineMdAccount.svg": "28da31309c3edc512f4005e853835af7",
"assets/assets/bottomNavigationItems/lineMdAccountFilled.svg": "687c686b6055f96c73fda330b1b16633",
"assets/assets/bottomNavigationItems/rateUs.svg": "babe60db52accf8777157e43d5441aa7",
"assets/assets/bottomNavigationItems/rateUsFilled.svg": "aa3622564afdde8d2144f37d941cee1d",
"assets/assets/circle.svg": "300981037c0716a48aeda1e9b37076f9",
"assets/assets/dots.svg": "0b1629a9e45a78c04788c25948e501e0",
"assets/assets/marketingImages/Poster1.png": "a735154abe6d04176bbceecc4468e502",
"assets/assets/marketingImages/Poster2.png": "897a113f97d1b3b187c90aca43540cd6",
"assets/assets/profileAssets/profileImage.png": "591ab0ad12751dbdd20c88956e149eaf",
"assets/assets/profileSvg/logoutIcon.svg": "65cdd3e0204450b6a6625652bfbe9757",
"assets/assets/profileSvg/myDesign.svg": "52468359f463e08ce553cf667ae2ad65",
"assets/assets/profileSvg/shieldIcon.svg": "83b7d9b54c7522d1ed7bf6066bec5723",
"assets/assets/profileSvg/termsIcon.svg": "4227e41ea637975fdd7eb931f21be6e9",
"assets/assets/profileSvg/userProfile.svg": "a147edb979c7e3e1f666fa7e889de197",
"assets/assets/rateUsAssets/starGolden.svg": "97dd28968c11b8636968b616bc78870b",
"assets/assets/rateUsAssets/starGrey.svg": "77b0eba6954ebf08a29db10267a8b31b",
"assets/assets/speedlabsLogo.svg": "cda714389e134e6a4dd5812775422234",
"assets/assets/Union.svg": "5b69befcd08c35187f89f38ecc11a3d8",
"assets/FontManifest.json": "dc3d03800ccca4601324923c0b1d6d57",
"assets/fonts/MaterialIcons-Regular.otf": "4e6447691c9509f7acdbf8a931a85ca1",
"assets/NOTICES": "f6f045265333dc54f79b160777d4688c",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "6d342eb68f170c97609e9da345464e5e",
"assets/packages/fluttertoast/assets/toastify.css": "a85675050054f179444bc5ad70ffc635",
"assets/packages/fluttertoast/assets/toastify.js": "e7006a0a033d834ef9414d48db3be6fc",
"favicon.png": "5dcef449791fa27946b3d35ad8803796",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"icons/Icon-maskable-192.png": "c457ef57daa1d16f64b27b786ec2ea3c",
"icons/Icon-maskable-512.png": "301a7604d45b3e739efc881eb04896ea",
"index.html": "55430a6730fee1e13a4fdc431459ef22",
"/": "55430a6730fee1e13a4fdc431459ef22",
"main.dart.js": "1eda3d8408f461314433d152d58a94af",
"manifest.json": "1c5fd603809cc1557a783b61ef51a666",
"version.json": "e12d16673f638ed170a5f83edf27c036"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "/",
"main.dart.js",
"index.html",
"assets/NOTICES",
"assets/AssetManifest.json",
"assets/FontManifest.json"];
// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});

// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});

// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache.
        return response || fetch(event.request).then((response) => {
          cache.put(event.request, response.clone());
          return response;
        });
      })
    })
  );
});

self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});

// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}

// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
