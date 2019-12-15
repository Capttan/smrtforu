db.getCollection('tweets').insert({
    date: '1574906447000',
    info: '<p class=?"TweetTextSize TweetTextSize--normal js-tweet-text tweet-text" lang=?"en" data-aria-label-part=?"0">?"From 1 Dec, "<a href=?"/?hashtag/?BPLRT?src=hash" data-query-source=?"hashtag_click" class=?"twitter-hashtag pretty-link js-nav" dir=?"ltr">?…?</a>?" will operate on a single loop during off-peak hours. There is no change to services during mornings and evening peak periods on weekdays. For better connectivity, peak hour bus service BP1 is now upgraded to a new full-day Bus Service 976."<a href=?"https:?/?/?t.co/?ommtqQG8HM" class=?"twitter-timeline-link u-hidden" data-pre-embedded=?"true" dir=?"ltr">?pic.twitter.com/ommtqQG8HM?</a>?</p>?'
    })
    
db.getCollection('tweets').insert({
    date: '1575081863000',
    info: '<p class="TweetTextSize TweetTextSize--normal js-tweet-text tweet-text" lang="en" data-aria-label-part="0">[EWL]: Due to a track point fault, pls add 30mins train travel time btwn <a href="/hashtag/TuasLink?src=hash" data-query-source="hashtag_click" class="twitter-hashtag pretty-link js-nav" dir="ltr"><s>#</s><b>TuasLink</b></a> and <a href="/hashtag/JooKoon?src=hash" data-query-source="hashtag_click" class="twitter-hashtag pretty-link js-nav" dir="ltr"><s>#</s><b>JooKoon</b></a>.</p>'
    })
    
db.getCollection('tweets').insert({
    date: '1575082056000',
    info: '<p class="TweetTextSize TweetTextSize--normal js-tweet-text tweet-text" lang="en" data-aria-label-part="0">[EWL] UPDATE: Free regular bus &amp; free bridging bus svcs btwn <a href="/hashtag/TuasLink?src=hash" data-query-source="hashtag_click" class="twitter-hashtag pretty-link js-nav" dir="ltr"><s>#</s><b>TuasLink</b></a> and <a href="/hashtag/JooKoon?src=hash" data-query-source="hashtag_click" class="twitter-hashtag pretty-link js-nav" dir="ltr"><s>#</s><b>JooKoon</b></a>.</p>'
    })
    
db.getCollection('tweets').insert({
    date: '1575083890000',
    info: '<p class="TweetTextSize TweetTextSize--normal js-tweet-text tweet-text" lang="en" data-aria-label-part="0">[EWL] UPDATE: Pls add 10mins train travel time btwn <a href="/hashtag/TuasLink?src=hash" data-query-source="hashtag_click" class="twitter-hashtag pretty-link js-nav" dir="ltr"><s>#</s><b>TuasLink</b></a> and <a href="/hashtag/JooKoon?src=hash" data-query-source="hashtag_click" class="twitter-hashtag pretty-link js-nav" dir="ltr"><s>#</s><b>JooKoon</b></a>. Free regular bus &amp; free bridging bus still available between <a href="/hashtag/TuasLink?src=hash" data-query-source="hashtag_click" class="twitter-hashtag pretty-link js-nav" dir="ltr"><s>#</s><b>TuasLink</b></a> and <a href="/hashtag/JooKoon?src=hash" data-query-source="hashtag_click" class="twitter-hashtag pretty-link js-nav" dir="ltr"><s>#</s><b>JooKoon</b></a>.</p>'
    })
    
db.getCollection('tweets').insert({
    date: '1575084609000',
    info: '<p class="TweetTextSize TweetTextSize--normal js-tweet-text tweet-text" lang="en" data-aria-label-part="0">[EWL] UPDATE: Pls add 5mins train travel time btwn <a href="/hashtag/TuasLink?src=hash" data-query-source="hashtag_click" class="twitter-hashtag pretty-link js-nav" dir="ltr"><s>#</s><b>TuasLink</b></a> and <a href="/hashtag/JooKoon?src=hash" data-query-source="hashtag_click" class="twitter-hashtag pretty-link js-nav" dir="ltr"><s>#</s><b>JooKoon</b></a>. Free regular bus &amp; free bridging bus svcs btwn <a href="/hashtag/TuasLink?src=hash" data-query-source="hashtag_click" class="twitter-hashtag pretty-link js-nav" dir="ltr"><s>#</s><b>TuasLink</b></a> and <a href="/hashtag/JooKoon?src=hash" data-query-source="hashtag_click" class="twitter-hashtag pretty-link js-nav" dir="ltr"><s>#</s><b>JooKoon</b></a> have ceased.</p>'
    })
    
db.getCollection('tweets').insert({
    date: '1575084929000',
    info: '<p class="TweetTextSize TweetTextSize--normal js-tweet-text tweet-text" lang="en" data-aria-label-part="0">[EWL] UPDATE: Fault cleared, train svcs are progressively being restored.</p>'
    })
    
db.getCollection('tweets').insert({
    date: '1575085052000',
    info: '<p class="TweetTextSize TweetTextSize--normal js-tweet-text tweet-text" lang="en" data-aria-label-part="0">[EWL] UPDATE: Track point fault cleared, train svcs are progressively being restored.</p>'
    })  

    
db.getCollection('tweets').find({})

db.getCollection('tweets').createIndex( { date: -1 } )


