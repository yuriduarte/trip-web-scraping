let axios = require("axios");
let cheerio = require("cheerio");
let fs = require("fs");
let urls = Array(10).fill().map((_, i) => {
    if (i === 0) {
      return 'https://www.tripadvisor.com.br/Attraction_Review-g303506-d11725544-Reviews-AquaRio-Rio_de_Janeiro_State_of_Rio_de_Janeiro.html'
    } else {
      return `https://www.tripadvisor.com.br/Attraction_Review-g303506-d11725544-Reviews-or${i}0-AquaRio-Rio_de_Janeiro_State_of_Rio_de_Janeiro.html`
    }
});
// let urls = [
//   "https://www.tripadvisor.com.br/Attraction_Review-g303506-d11725544-Reviews-AquaRio-Rio_de_Janeiro_State_of_Rio_de_Janeiro.html",
//   "https://www.tripadvisor.com.br/Attraction_Review-g303506-d11725544-Reviews-or10-AquaRio-Rio_de_Janeiro_State_of_Rio_de_Janeiro.html",
//   "https://www.fifao.com.br"
// ];
Promise.all(urls.map(extractData)).then(allResults => {
    let result = [].concat.apply([], allResults);
    let file = JSON.stringify(result, null, 4);
    // let file = result.join('\n')
    fs.writeFile("data.json", file, err =>
        console.log("File successfully written!")
    );
})

function extractData(url) {
  return axios.get(url).then(response => {
    let data = [];
    if (response.status === 200) {
      const html = response.data;
      const $ = cheerio.load(html);
      $(".review-container").each(function(i, elem) {
        let review = {
          title: $(this)
            .find("span.noQuotes")
            .text()
            .trim(),
          description: $(this)
            .find("p.partial_entry")
            .text()
            .trim(),
          location: $(this)
            .find("div.userLoc strong")
            .text()
            .trim(),
          publication: $(this)
            .find("span.ratingDate")
            .text()
            .trim(),
          date: $(this)
            .find(".prw_reviews_stay_date_hsx")
            .text()
            .replace('Data da experiência:', '')
            .trim()
        };
        data.push(review);        
        // data.push(`
        //     ${review.title},${review.description},${review.location},${review.publication},${review.date}
        // `.trim());
      });
      console.log('[200]', url);
    } else {
        console.log('[ERR]', url);
    }
    return data;
  }).catch(() => {
    console.log('[ERR]', url);
  });
}

// const dataTrimmed = data.filter(n => n != undefined);



// console.log(result);

// axios.get('https://www.tripadvisor.com.br/Attraction_Review-g303506-d11725544-Reviews-or4690-AquaRio-Rio_de_Janeiro_State_of_Rio_de_Janeiro.html')
//     .then((response) => {
//         if(response.status === 200) {
//             const html = response.data;
//             const $ = cheerio.load(html);
//             let devtoList = [];
//             $('.review-container').each(function(i, elem) {
//                 devtoList[i] = {
//                     title: $(this).find('span.noQuotes').text().trim(),
//                     description: $(this).find('p.partial_entry').text().trim(),
//                     location: $(this).find('div.userLoc strong').text().trim(),
//                     publication: $(this).find('span.ratingDate').text().trim(),
//                     data: $(this).find('.prw_reviews_stay_date_hsx').text().trim(),
//                 }
//             });

//             const devtoListTrimmed = devtoList.filter(n => n != undefined )
//             fs.writeFile('devtoList.json',
//                           JSON.stringify(devtoListTrimmed, null, 4),
//                           (err)=> console.log('File successfully written!'))
//     }
// }, (error) => console.log(err) );
