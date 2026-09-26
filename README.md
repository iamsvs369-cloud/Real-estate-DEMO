# Real Estate Demo — Production Static Website

A responsive five-page real-estate website:

- Home
- Services
- Properties
- About Us
- Contact

## Structure

Each page uses the same professional header, mobile navigation and footer. Shared behavior lives in `assets/js/site.js`; page-specific styles and property filtering remain in their respective files.

## Run locally

Open `index.html` in a local web server for best results. No build step is required.


## Site-wide consistency update
- Header uses one opaque forest-green background matching the footer.
- Header height, horizontal padding and navigation spacing are shared across all pages.
- Hero heights are normalized at desktop, tablet and mobile breakpoints.
- Footer social links use inline SVG icons.
- Major content sections use a consistent responsive vertical spacing scale.


Home hero alignment: the hero copy and location marker now share the same responsive left edge used by the professional page hero layouts.
