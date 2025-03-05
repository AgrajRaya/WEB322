/********************************************************************************
*  WEB322 – Assignment 04
* 
*  I declare that this assignment is my own work in accordance with Seneca's
*  Academic Integrity Policy:
*  https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
* 
*  Name: Agraj Raya Student ID: 147863237 Date: 2025-03-04
*
********************************************************************************/

const express = require('express');
const dataService = require('./module/data-service');

const app = express();
const PORT = process.env.PORT || 3000;

app.set("view engine","ejs");

app.use(express.static(__dirname + '/public'));

dataService.initialize()
  .then(() => {

    // Serve home.html for the root route "/"
    app.get('/', (req, res) => {
res.render('home');
    });

    // Serve about.html for the "/about" route
    app.get('/about', (req, res) => {
      res.render('about');
    });

    // Handle the "/sites" route
    app.get('/sites', (req, res) => {
      const { region, provinceOrTerritory } = req.query;     

      if (region) {
        // If region is provided, filter by region
        dataService.getSitesByRegion(region)
          .then(sites => res.render('sites', { sites }))
          .catch(err => res.status(404).send(err));
      } else if (provinceOrTerritory) {
        // If provinceOrTerritory is provided, filter by province or territory
        dataService.getSitesByProvinceOrTerritoryName(provinceOrTerritory)
        .then(sites => res.render('sites', { sites })) 
          .catch(err => res.status(404).send(err));
      } else {
        // If no query parameters, return all sites
        dataService.getAllSites()
          .then(sites => res.render('sites', { sites }))
          .catch(err => res.status(404).send(err));
      }
    });

    // Dynamic route for individual sites by siteId
    app.get('/sites/:siteId', (req, res) => {
      const { siteId } = req.params;
      dataService.getSiteById(siteId)
        .then(site => res.render("site", {site: site}))
        .catch(err => res.status(404).send(err));
    });

    // 404 route for unmatched URLs
    app.use((req, res) => {
      res.status(404).render("404", {message: "I'm sorry, we're unable to find what you're looking for"});    });

    app.listen(PORT, () => console.log(`Express server running on: http://localhost:${PORT}`));
  })
  .catch(err => console.log(err));
