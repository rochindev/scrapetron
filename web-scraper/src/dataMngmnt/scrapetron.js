import puppeteer from 'puppeteer'
import fs from 'fs'
import {getProductDetailsAmazon} from './scraper-amazon.js'
import {getProductDetailsKohls} from './scraper-kohls.js'
import {getProductDetailsSephora} from './scraper-sephora.js'
import {getProductDetailsUlta} from './scraper-ulta.js'
import {getProductDetailsWalgreens} from './scraper-walgreens.js'

//ONLY USE IF YOU KNOW WHAT YOU'RE DOING, NOT ALL WEBSITES RESPOND THE SAME TO SCRAPING TECH AND YOU MIGHT ENCOUNTER ISSUES WHEN RUNNING ALL OF THE SCRAPERS. ALSO THESE FUNCTIONS ARE BEING CALLED ON THEIR OWN SCRIPTS SO MAKE SURE TO EDIT EACH FILE ONE BY ONE OR YOU WILL CALL THEM AT THE SAME TIME.

const scrapeThemAll = async () => {

    const amazonData = await getProductDetailsAmazon();
    const kohlsData = await getProductDetailsKohls();
    const sephoraData = await getProductDetailsSephora();
    const ultaData = await  getProductDetailsUlta();
    const walgreensData = await getProductDetailsWalgreens();
}

scrapeThemAll()