const cheerio = require('cheerio');
const Nightmare = require('nightmare');
const mysql = require('mysql');

const nightmare = Nightmare({ show: true });
const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "peanutbutter94",
    database: "laptop_data",
    multipleStatements: true
});

const startLink = 'https://www.walmart.com/search/?cat_id=0&facet=condition%3ANew%7C%7Ccustomer_rating%3A3+-+3.9+Stars%7C%7Ccustomer_rating%3A4+-+5+Stars&grid=false&page=';
const endLink = '&ps=40&query=laptop&sort=best_seller';
var link = startLink + 1 + endLink;

nightmare
    .goto(link)
    .wait('body')
    .evaluate(() => document.querySelector('body').innerHTML)
    .then(response => {
        const $ = cheerio.load(response);
        searchLinks = getSearchPages($);
        //removing links
        //for (var i = 0; i < (searchLinks.length - 2); i++){
        //   searchLinks.pop();
        //}
        //speed up testing
        scrapePages(searchLinks);
    }).catch(err => {
        console.log(err);
    });

function scrapePages(sLinks) {
    searchLinks.reduce(function (acc, Slink) {
        return acc.then(ress => {
            return nightmare
                .goto(Slink)
                .wait('body')
                .evaluate(() => document.querySelector('body').innerHTML)
                .then(res => {
                    ress.push(res);
                    return ress;
                });
        });
    }, Promise.resolve([])).then(ress => {
        scrapePageData(ress);
    }).catch(er => {
        console.log(er);
    });
}

function scrapePageData(ress) {
    var linkArr = loadLinkData(ress);
    //for testing
    //var linkArr = ['https://www.walmart.com/ip/Dell-Inspiron-13-7000-i7370-5725SLV-13-3-FHD-1920-x-1080-Intel-Core-i5-8250U-8GB-2400MHz-DDR4-256-GB-SSD-Intel-UHD-Graphics-620/809339105','https://www.walmart.com/ip/HP-Chromebook-14-14-Full-HD-Touchscreen-Display-AMD-A4-9120C-AMD-Radeon-R4-Graphics-4GB-SDRAM-eMMC-Audio-by-B-O-Ink-Blue-14-db0044wm/218817736'];
    //var linkArr = ['https://www.walmart.com/ip/Hewlett-Packard-Pavilion-17-3-17-e130us-Notebook-PC-AMD-Quad-Core-A6-5200-Acc/33846075'];
    //removing links
    //for (var i = 0; i < 38; i++) {
    //    linkArr.pop();
    //}
    //speed up testing
    var str = "";
    for (var i = 0; i < 87; i++) {
        str += '\t';
    }
    str += '\r';
    linkArr.reduce(function (accumulator, url) {
        return accumulator.then(function (rslts) {
            return nightmare
                .goto(url)
                .wait('#checkout-comments')
                .wait(1000) //This could be a page where I need to click "Specs" to see additional details so I must wait in case that appears.  There's not necessarily an element that will load after.
                .evaluate(() => {
                    const selr = document.querySelector('li[data-automation-id=tab-item-0]');
                    !!selr && selr.click();
                })
                .wait('body')
                .evaluate(() => document.querySelector('body').innerHTML)
                .then(result => {
                    var dict = loadOneLaptop(result, url);
                    rslts.push(dict);
                    return rslts;
                });
        });
    }, Promise.resolve([])).then(rslts => {
        setLaptopData(rslts);
    }).catch(error => {
        console.log(error)
    });
}

function loadOneLaptop(result, url) {
    const $ = cheerio.load(result);
    var dict = getIdentifiers(url);
    $('.product-specification-table tr').each((i, element) => {
        const key = $(element).children().first().text();
        const value = $(element).children().last().text();
        dict.set(key, value);
    });
    const price = $('.price--stylized').children('.visuallyhidden').first().text().substring(1); //maybe just #price
    const desc = $('.about-product-description').text().toUpperCase();
    const title = $('.prod-productTitle-buyBox');
    dict = getDriveType(dict, desc);
    var isNew = (dict.get("Condition") == 'New');
    isNew = +isNew;
    dict.set("isNew", isNew);
    dict.set("price", price);
    dict.set("url", url);
    dict.set("title", title.text());
    return dict;
}

function getSearchPages($) {
    var searchLinks = new Array();
    var results = $('.result-summary-container').text();
    results = results.split("of ");
    results = results[1].split(" ");
    results = results[0];
    const pages = Math.floor(results / 40) + 1;
    for (var i = 1; i <= pages; i++) {
        link = startLink + i + endLink;
        searchLinks.push(link);
    }
    return searchLinks;
}

function getLinkData(arr, $) {
    $('.search-result-product-title').each((i, element) => {
        const href = $(element).find('a').attr('href');
        var lapLink = "https://www.walmart.com" + href;
        if (href.startsWith("/ip/")) {
            arr.push(lapLink);
        }
    })
    return arr;
}

function setLaptopData(dictList) {
    connection.connect((err) => {
        if (!err) {
            var columns = ['walmart_id', 'walmart_unique', 'price', 'url', 'processor_brand', 'processor_speed', 'drive_capacity', 'manufacturer', 'is_new', 'ram', 'ram_max', 'os', 'battery_life', 'model', 'screen_size', 'drive_type', 'instant', 'title'];
            for (var i = 0; i < dictList.length; i++) {
                var dict = dictList[i];
                var data = [dict.get("ID"), dict.get("Unique Key"), dict.get("price"), dict.get("url"), dict.get("Processor Brand"), dict.get("Processor Speed"), dict.get("Hard Drive Capacity"), dict.get("Brand"), dict.get("isNew"), dict.get("RAM Memory"),
                dict.get("Maximum RAM Supported"), dict.get("Operating System"), dict.get("Battery Life"), dict.get("Model"), dict.get("Screen Size"), dict.get("Hard Drive Type"), dict.get("Instant"), dict.get("title")];
                var sql = getSql(columns, data);
                connection.query(sql, function (err, result) {
                    if (err) throw err;
                });
            }
        }
        else {
            console.log("Connection Failed. " + err)
        }
    })
}

function loadLinkData(resp) {
    var arr = new Array();
    for (var i = 0; i < resp.length; i++) {
        const $ = cheerio.load(resp[i]);
        arr = getLinkData(arr, $);
    }
    return arr;
}

function getIdentifiers(idLink) {
    var dict = new Map();
    var inst = Date.now();
    dict.set("Instant", inst);
    dict.set("Url", idLink);
    var idPieces = idLink.split('/');
    var id = idPieces[idPieces.length - 1];
    var uniqueKey = "1" + id + inst;
    dict.set("Unique Key", uniqueKey);
    dict.set("ID", id);
    return dict;
}

function getDriveType(dict, desc) {
    var driveType = "";
    const driveTypes = ["EMMC", "SSD", "HDD", "HHDD", "SSHD"];
    for (var i = 0; i < driveTypes.length; i++) {
        if (desc.indexOf(driveTypes[i]) !== -1) {
            driveType += driveTypes[i];
            driveType += ", ";
        }
    }
    //keep undefined if nothing found
    if (driveType !== null) {
        driveType = driveType.substring(0, driveType.length - 2);
        dict.set("Hard Drive Type", driveType);
    }
    return dict;
}

function getSql(columns, data) {
    var sql = "INSERT INTO walmart (";
    if (columns.length != data.length) {
        console.log("Error: " + columns.length + "columns and " + data.length + "values.");
    } else {
        for (var i = 0; i < (columns.length - 1); i++) {
            sql += columns[i];
            sql += ", ";
        }
        sql += columns[columns.length - 1];
        sql += ") VALUES ('"
        for (var i = 0; i < (data.length - 1); i++) {
            sql += data[i];
            sql += "', '";
        }
        sql += data[data.length - 1];
        sql += "')";
    }
    return sql;
}