// @link: http://www.timeanddate.com/time/zones/


var $timezones = $('table tbody > tr')
  , list = []
  , regex = {
      trailingReturns: /[\r\n](?:[\s\S]*)?/
    }
  ;


$timezones.each(function(index, value) {
    var tds = $(this).find('td');

    list.push({
      abbr:     tds.eq(0)[0].innerText
    , name:     tds.eq(1)[0].innerText.replace(regex.trailingReturns, '')
    , country:  tds.eq(2)[0].innerText.replace(regex.trailingReturns, '')
    , utc:      tds.eq(3)[0].innerText
    , offset:   0
    });
});


console.log(JSON.stringify(list));
