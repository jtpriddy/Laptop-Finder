## Laptop-Finder

This finds the best value casual-usage laptops off of Wal-Mart's website.  

WebScraper.js uses nightmare and cheerio to loop over every laptop's webpage and upload the specifications of those laptops into a sql database.  From this database queries can be run to find laptops.

A React app was created as a front-end for querying the database.  Laptops are sorted by best value within the selected price range.  A laptop score is also shown to allow comparing laptops without considering price.

![App](https://user-images.githubusercontent.com/66924912/103328005-a738f680-4a1c-11eb-9005-156d3d6e9a6f.png)
