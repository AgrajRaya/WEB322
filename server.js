/********************************************************************************
*  WEB322 – Assignment 02
* 
*  I declare that this assignment is my own work in accordance with Seneca's
*  Academic Integrity Policy:
*  https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
* 
*  Name: Agraj Raya Student ID: 147863237 Date: 2025-02-02
*
********************************************************************************/

const express = require("express");
const siteData = require("./modules/data-service");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, "public")));

// Initialize site data
siteData.initialize()
    .then(() => {
        console.log("Site data initialized.");
        app.listen(PORT, () => console.log(`Server running on port: http://localhost:${PORT}`));
    })
    .catch(err => {
        console.error(`Failed to initialize site data: ${err}`);
    });

// Routes

// Home page route
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "home.html"));
});

// About page route
app.get("/about", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "about.html"));
});

// Sites route with query parameters
app.get("/sites", (req, res) => {
    const region = req.query.region;
    const provinceOrTerritory = req.query.provinceOrTerritory;

    if (region) {
        // Return sites for the specified region
        siteData.getSitesByRegion(region)
            .then(data => res.json(data))
            .catch(err => res.status(404).send(err));
    } else if (provinceOrTerritory) {
        // Return sites for the specified province/territory
        siteData.getSitesByProvinceOrTerritoryName(provinceOrTerritory)
            .then(data => res.json(data))
            .catch(err => res.status(404).send(err));
    } else {
        // Return all sites
        siteData.getAllSites()
            .then(data => res.json(data))
            .catch(err => res.status(404).send(err));
    }
});

// Site by ID route
app.get("/sites/:siteId", (req, res) => {
    const siteId = req.params.siteId;

    siteData.getSiteById(siteId)
        .then(data => {
            if (!data) {
                return res.status(404).json({ error: "Site not found" });
            }
            res.json(data);
        })
        .catch(err => {
            console.error("Error fetching site:", err);
            res.status(500).json({ error: "Internal server error" });
        });
});


// Custom 404 error handler
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
});