import { Configuration, OpenAIApi } from "openai";
import fs from 'fs'

const configuration = new Configuration({
    organization: 'YOUR_ORG_ID',
    apiKey: 'YOUR_API_KEY',
});
const openai = new OpenAIApi(configuration);

const rawData = fs.readFileSync('allData.json', 'utf8');

const dataArray = JSON.parse(rawData);

const cleanedData = [];

const MAX_RETRIES = 10;

const processProductData = async () => {
    for (const product of dataArray) {

        let retries = 0;
        let success = false;

        while (!success && retries < MAX_RETRIES) {
            try{
                const productString = JSON.stringify(product)
                const response = await openai.createChatCompletion({
                    model: "gpt-3.5-turbo",
                    temperature: .5,
                    messages: [{"role": "assistant", "content": `you are a data cleaning tool that no matter the input you only return objects.`}, 
                    {
                        "role": "user", 
                        "content": `Standardize the product attributes for the given data from different stores. Return a modified product object with at least the following common keys: store, brand, productName, price, rating, imgLink, and productLinkFull. Some products may have additional keys, which should be preserved. Analyze each object and perform the necessary transformations to extract and clean the information.

                        Additional Considerations:
                        - The "price" key should only contain the lowest price.
                        - Product names may contain additional information that can be used to create additional keys if necessary.
                        - If there is no rating available, include the key "rating" with the value "no rating available".

                        Below are just some examples on how to do so because each store has similar formats. Please review this full set of instructions before deciding what to give as the modified output.

                        Examples:

                        If store == "amazon":
                        
                        Example Input:
                        {
                            "store": "amazon",
                            "imgLink": "https://images-na.ssl-images-amazon.com/images/I/71J0BtuYB2L._AC_UL600_SR600,400_.jpg",
                            "productLinkFull": "https://www.amazon.com//CeraVe-Facial-Moisturizing-Lotion-AM/dp/B00F97FHAW/ref=zg_bs_g_7792567011_sccl_1/131-6369187-2163232?psc=1",
                            "brandAndProduct": "CeraVe AM Facial Moisturizing Lotion SPF 30 | Oil-Free Face Moisturizer with Sunscreen | Non-Comedogenic | 3 Ounce",
                            "price": "5 offers from $14.00",
                            "rating": "4.5 out of 5 stars 73,654"
                        }
                        
                        Example Modified Output:
                        {
                            "store": "amazon",
                            "brand": "CeraVe",
                            "productName": "AM Facial Moisturizing Lotion SPF 30",
                            "productDescription": ["Oil-Free Face Moisturizer with Sunscreen", "Non-Comedogenic"],
                            "productSize": "3 Ounce",
                            "price": "$14.00",
                            "rating": "4.5",
                            "imgLink": "https://images-na.ssl-images-amazon.com/images/I/71J0BtuYB2L._AC_UL600_SR600,400_.jpg",
                            "productLinkFull": "https://www.amazon.com//CeraVe-Facial-Moisturizing-Lotion-AM/dp/B00F97FHAW/ref=zg_bs_g_7792567011_sccl_1/131-6369187-2163232?psc=1"
                        }
                        
                        If store == "kohls":
                        
                        Example Input:
                        {
                            "store": "kohls",
                            "imgLink": "https://media.kohlsimg.com/is/image/kohls/5079262_Sunrise?wid=240&hei=240&op_sharpen=1",
                            "productLinkFull": "https://www.kohls.com//product/prd-5079262/glowscreen-spf-40-sunscreen-with-hyaluronic-acid-niacinamide.jsp?color=Sunrise&prdPV=1",
                            "brandAndProduct": "Supergoop! Glowscreen SPF 40 Sunscreen with Hyaluronic Acid + Niacinamide",
                            "price": "$22.00 - $48.00",
                            "rating": 4.3
                        }
                        
                        Example Modified Output:
                        {
                            "store": "kohls",
                            "brand": "Supergoop!",
                            "productName": "Glowscreen SPF 40 Sunscreen with Hyaluronic Acid + Niacinamide",
                            "price": "$22.00",
                            "rating": "4.3",
                            "imgLink": "https://media.kohlsimg.com/is/image/kohls/5079262_Sunrise?wid=240&hei=240&op_sharpen=1",
                            "productLinkFull": "https://www.kohls.com//product/prd-5079262/glowscreen-spf-40-sunscreen-with-hyaluronic-acid-niacinamide.jsp?color=Sunrise&prdPV=1"
                        }
                        
                        If store == "sephora":
                        
                        Example Input:
                        {
                            "store": "sephora",
                            "imgLink": "https://www.sephora.com/productimages/sku/s2534923-main-zoom.jpg?pb=allure-2022-bestofbeauty-badge&imwidth=175",
                            "productLinkFull": "https://www.sephora.com/product/shiseido-urban-environment-oil-free-mineral-sunscreen-broad-spectrum-spf-42-P482741?skuId=2534923&icid2=products%20grid:p482741:product",
                            "brand": "Shiseido",
                            "productName": "Urban Environment Oil-Free Mineral Sunscreen Broad-Spectrum SPF 42 with Hyaluronic Acid",
                            "price": "$38.00"
                        }
                        
                        Example Modified Output:
                        {
                            "store": "sephora",
                            "brand": "Shiseido",
                            "productName": "Urban Environment Oil-Free Mineral Sunscreen Broad-Spectrum SPF 42 with Hyaluronic Acid",
                            "price": "$38.00",
                            "rating": "no rating available",
                            "imgLink": "https://www.sephora.com/productimages/sku/s2534923-main-zoom.jpg?pb=allure-2022-bestofbeauty-badge&imwidth=175",
                            "productLinkFull": "https://www.sephora.com/product/shiseido-urban-environment-oil-free-mineral-sunscreen-broad-spectrum-spf-42-P482741?skuId=2534923&icid2=products%20grid:p482741:product"
                        }
                        
                        If store == "ulta":
                        
                        Example Input:
                        {
                            "store": "ulta",
                            "imgLink": "no image link available for ulta store",
                            "productLinkFull": "https://www.ulta.com/p/unseen-sunscreen-spf-40-pimprod2029930?sku=2589386",
                            "brand": "Supergoop!",
                            "productName": "Unseen Sunscreen SPF 40",
                            "price": "$38.00",
                            "rating": "4.6 out of 5 stars ; 3576 reviews(3,576)",
                            "offers": "Free Gift with Purchase"
                        }
                        
                        Example Modified Output (note: remember that the rating in the modified output should only be a a number):
                        {
                            "store": "ulta",
                            "brand": "Supergoop!",
                            "productName": "Unseen Sunscreen SPF 40",
                            "price": "$38.00",
                            "rating": "4.6",
                            "imgLink": "no image link available for ulta store",
                            "productLinkFull": "https://www.ulta.com/p/unseen-sunscreen-spf-40-pimprod2029930?sku=2589386"
                        }
                        
                        If store == "walgreens":
                        
                        Example Input:
                        {
                            "store": "walgreens",
                            "imgLink": "https://pics.walgreens.com/prodimg/645407/450.jpg",
                            "productLinkFull": "https://www.walgreens.com/store/c/walgreens-mineral-sunscreen-spf-50/ID=300423829-product",
                            "brand": "Walgreens",
                            "productName": "Mineral Sunscreen SPF 50 ",
                            "size": " - 2 fl oz",
                            "price": "$10.99",
                            "offers": "Buy 1, Get 1 50% OFF",
                            "extras": "Extra 15% off $25 w/ code..."
                        }
                        
                        Example Modified Output:
                        {
                            "store": "walgreens",
                            "brand": "Walgreens",
                            "productName": "Mineral Sunscreen SPF 50",
                            "size": "2 fl oz",
                            "price": "$10.99",
                            "imgLink": "https://pics.walgreens.com/prodimg/645407/450.jpg",
                            "productLinkFull": "https://www.walgreens.com/store/c/walgreens-mineral-sunscreen-spf-50/ID=300423829-product",
                            "offers": "Buy 1, Get 1 50% OFF",
                            "extras": "Extra 15% off $25 w/ code..."
                        }

                        Process this product and return me the cleaned product object following the instructions given above:
                        ${productString}
                        `
                    }],
                });
                
                console.log(response.data.choices[0].message.content)

                const cleanedProduct = JSON.parse(response.data.choices[0].message.content);
                cleanedData.push(cleanedProduct);
                success = true;

            } catch (error) {
                retries++;
                console.error(`Error processing product. Retrying (attempt ${retries}/${MAX_RETRIES})...`);
            }
        }

        if (!success) {
            console.error(`Unable to process product after ${MAX_RETRIES} retries. Skipping.`);
        }
    }


    const cleanedDataJson = JSON.stringify(cleanedData);
    fs.writeFileSync('cleanedData.json', cleanedDataJson);

}

processProductData().catch((error) => {
    console.error(error);
});