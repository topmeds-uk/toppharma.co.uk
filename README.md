# Top Pharma informational website

Preview: http://localhost/toppharma.co.uk/

Build: node tools/build.js
Verify: node tools/verify.js

The homepage follows the supplied document section order, adapted to an informational service. The original is preserved in source/homepage-original.html and blocked from HTTP access. No ordering, payment, prescription upload or spreadsheet integration is enabled.

GSC, GA4 and body integrations remain pending. Add supplied tags to the shared page template in tools/build.js, update the privacy policy if data collection changes, then rebuild. No identifiers or endpoints are reused from another site.

Deploy the generated directories, assets, index.html, robots.txt, sitemap.xml and .htaccess to the toppharma.co.uk document root on Apache with mod_rewrite and PHP enabled (PHP renders the real 404 response). Keep tools, source, setup.js and README.md private. Canonicals use HTTPS without www and directory URLs. Test HTTPS and host redirects on the production server before launch; local tests cannot validate hosting or Search Console indexing.

Content sources: linked NHS medicine resources and electronic Medicines Compendium, checked 5 September 2026. These are navigation guides, not clinical reviews. Website contact details have not been supplied.
