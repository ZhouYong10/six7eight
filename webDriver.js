
const {Builder, By, Key, until} = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
let driver;

async function getDriver() {
    if (!driver) {
        driver = await new Builder()
            .forBrowser('chrome')
            // .setChromeOptions(new chrome.Options().addArguments('--headless'))
            .setChromeOptions(new chrome.Options().addArguments('disable-infobars'))
            .build();
        driver.manage().window().maximize();
    }
    return driver;
}

async function getWxTitle(url) {
    let driver = await getDriver();
    let title;
    try {
        await driver.get(url);
        title = await driver.findElement(By.id('activity-name')).getText();
    }catch (e) {
        title = await driver.findElement(By.className('text_area')).getText();
    }
    return title;
}

async function getWbFocusFans(url) {
    let driver = await getDriver();
    let obj;
    try {
        await driver.get(url);
        await driver.sleep(10000);
        let aimElements = await driver.findElements(By.className('W_f18'));
        let aimFocus = aimElements[0];
        let aimFans = aimElements[1];
        let aimWeibo = aimElements[2];

        return obj = {
            focus: await aimFocus.getText(),
            fans: await aimFans.getText(),
            weibo: await aimWeibo.getText(),
        };
    }catch (e) {
        console.log(e.message, ' ======================');
    }
    return fans;
}

async function getWbForwardCommentLike(url) {
    let driver = await getDriver();
    let obj;
    try {
        await driver.get(url);
        await driver.sleep(10000);
        let aimElements = await driver.findElements(By.className('pos'));
        let forward = (await aimElements[0].findElements(By.tagName('em')))[1];
        let comment = (await aimElements[1].findElements(By.tagName('em')))[1];
        let like = (await aimElements[2].findElements(By.tagName('em')))[1];

        return obj = {
            focus: await forward.getText(),
            fans: await comment.getText(),
            weibo: await like.getText(),
        };
    }catch (e) {
        console.log(e.message, ' ======================');
    }
    return fans;
}

(async function example() {
    let title = await getWbForwardCommentLike('https://weibo.com/5944040431/HphNsxgY4?from=page_1005055944040431_profile&wvr=6&mod=weibotime&type=comment#_rnd1555054562817');
    console.log(title, ' ----------------------------------------');
})();