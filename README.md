## Laptop-Finder

This finds the best value casual-usage laptops off of Wal-Mart's website.  

WebScraper.js uses nightmare and cheerio to loop over every laptop's webpage and upload the specifications of those laptops into a sql database.  From this database queries can be run to find laptops.

A React app was created as a front-end for querying the database.  Laptops are sorted by best value within the selected price range.  A laptop score is also shown to allow comparing laptops without considering price.

![App](https://user-images.githubusercontent.com/66924912/103328005-a738f680-4a1c-11eb-9005-156d3d6e9a6f.png)

index.php is used to query the database.  A request to index.php is made in the react app when the page is loaded or the search button is clicked.  

For example, a request to //index.php?min=574&max=575 yields:
[{"walmart_id":"220462077","walmart_unique":"12204620771609296396992","url":"\https:\/\/www.walmart.com\/ip\/HP-15-dy1731ms-Core-i3-1005G1-1-2-GHz-Win-10-Home-S-mode-8-GB-RAM-128-SSD-15-6-1366-x-768-HD-UHD-Graphics-Wi-Fi-Bluetooth-natural-silver-cover-base-v\/220462077","price":"574.9","processor_brand":"Intel","processor_speed":"13 GHz","drive_capacity":"128 GB","manufacturer":"HP","is_new":"1","ram":"8 GB","ram_max":"undefined","os":"Windows 10","battery_life":"11.5 hours","model":"15-dy1731ms","screen_size":"15.6\"","drive_type":"SSD","instant":"1609296396992","title":"HP 15-dy1731ms - Core i3 1005G1 \/ 1.2 GHz - Win 10 Home in S mode - 8 GB RAM - 128 GB SSD - 15.6\" 1366 x 768 (HD) - UHD Graphics - Wi-Fi, Bluetooth - natural silver (cover and base), vertical brushed pattern, ash silver base and keyboard frame - kbd: US","lScore":"171.3333","vScore":"74.50571113237085"}]
