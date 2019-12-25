// www.wieli.at
// By Florian Wieland
// IF YOU HAVE QUESTIONS: reddit.com/u/wieli99


//CHANGE YOUR DATA HERE
var gpsdata = {
    coords: {'latitude': '48.210033', 'longitude': '16.363449'} //ENTER THE LAT & LONG OF YOUR HOMETOWN HERE, ONLY CHANGE THE NUMBERS, YOU CAN FIND YOU LAT & LONG HERE: HTTPS://WWW.LATLONG.NET/
};

var DarkSkyAPIKey = "YOUR KEY FROM DRAKSKY"; //ENTER YOUR DARKSKY API KEY, YOU CAN GET ONE FOR FREE HERE: https://darksky.net/dev
var newsAPIKey = "YOUR KEY FROM NEWSAPI"; //ENTER YOUR NEWSAPI KEY, YOU CAN GET ONE FOR FREE HERE: https://newsapi.org

var displayMessage = true; // CHANGE THIS TO false WHEN YOU'RE DONE!

//THAT'S ALL, IF YOU ALREADY CHANGED YOUR NAME IN js/dateMath.js YOU'RE GOOD TO GO! HAVE FUN :)
















// DON'T TOUCH THIS UNLESS YOU KNOW WHAT YOU'RE DOING

if(displayMessage){
    alert("Hi! I'm glad you enjoyed my little Project :)\nTo start, open the file js/dateMath.js to enter your Name, after that open js/dynamicData.js to enter some needed information. I hope you enjoy my stuff :) If you do, you can check out my Website:\nwww.wieli.at");
}

callAPINoGPS(gpsdata);
updateNews();
refreshPage();

async function callAPINoGPS(gpsdata) {

    for (i=1; i<2;){
        callAPI(gpsdata);
        await sleep(900000);
    }
}

async function updateNews() {
    for (i=1; i<2;){
        cycleNews();
        handleFiles();
        await sleep(300000);
    }
}

async function refreshPage() {
    // I don't know why, but if we don't do this, the page sometimes crashes
    await sleep(3600000);
    location.reload();
}

function callAPI(gpsdata) {
    console.log(gpsdata);
    var lat = gpsdata.coords.latitude;
    var long = gpsdata.coords.longitude;


    // Set Variables for API URL
    var exclude = "?exclude=alerts,flags";
    var unit = "&units=si";


    var url_API = lat + "," + long + exclude + unit;
    var url_city = lat + "&lon=" + long + "&format=json";

    var half_url_API = "https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/" + DarkSkyAPIKey + "/";
    var half_url_city = "https://cors-anywhere.herokuapp.com/https://eu1.locationiq.com/v1/reverse.php?key=d2c1d2b99010ab&normalizecity=1&lat=";


    fetch(half_url_city + url_city).then(
        (result) => {
            return result.json()
        }
    ).then((json) => {
            var cityname = json["address"]["city"] + ", " + json["address"]["country"];

            fetch(half_url_API + url_API).then(
                (result) => {
                    return result.json()
                }
            ).then((json) => {
                interpretWeatherAndAPIData(json, json.cityname);
                }
            ).catch((err) => console.log(err));
        }
    ).catch((err) => console.log(err));
}

function interpretWeatherAndAPIData(data, cityname) {
    console.log(data);
    //Most important data
    var daily = data["daily"];
    var daily_data_list = daily["data"];
    var hourly = data["hourly"];
    var hourly_data_list = hourly["data"];
    var currently = data["currently"];

    // Minutely is not always available
    if(data["minutely"] != "undefined"){
        var minutely = data["minutely"];
    }


    document.getElementById("dayIcon").src = "pictures/" + data["currently"]["icon"] + ".png";
    document.getElementById("currentShortSummary").innerHTML = data["currently"]["summary"];
    document.getElementById("currentTemp").innerHTML = currently["temperature"].toString().slice(0, -1) + " °C";

    // Precip data
    var precip_type = "0% Precip.";
    if (daily_data_list[0]["precipType"] != null) {
        precip_type = parseInt(daily_data_list[0]["precipProbability"] * 100).toString() + "% " + daily_data_list[0]["precipType"];
    }
    document.getElementById("currentChanceOfRain").innerHTML = precip_type;

    // Minutely is not always available
    if(typeof minutely != "undefined"){
        document.getElementById("currentSummary").innerHTML = minutely["summary"];
    } else{
        document.getElementById("currentSummary").innerHTML = hourly["summary"];
    }


    document.getElementById("tomorrowIcon").src = "pictures/" + daily_data_list[1]["icon"] + ".png";
    document.getElementById("upArrow").innerHTML = "&uarr; ";
    document.getElementById("tomorrowHighTemp").innerHTML = daily_data_list[1]["temperatureHigh"].toString().slice(0, -1) + " °C";
    document.getElementById("downArrow").innerHTML = "&darr; ";
    document.getElementById("tomorrowLowTemp").innerHTML = daily_data_list[1]["temperatureLow"].toString().slice(0, -1) + " °C";


    document.getElementById("tomorrowSummary").innerHTML = daily_data_list[1]["summary"];

    selectWear(hourly_data_list)
}


function cycleNews() {
    newsUrl = "https://newsapi.org/v2/everything?q=technology&apikey=" + newsAPIKey;
    var art1 = Math.floor(Math.random() * 15);
    var art2 = Math.floor(Math.random() * 15);

    if (art1 == art2){
        art2 ++;
    }

    fetch(newsUrl).then(
        (result) => {
            return result.json()
        }
    ).then( (json)=>{
            url1Text = json["articles"][art1]["url"].split("/")[2];
            url2Text = json["articles"][art2]["url"].split("/")[2];
            time1 = json["articles"][art1]["publishedAt"].split("T")[0];
            time2 = json["articles"][art2]["publishedAt"].split("T")[0];

            document.getElementById("headline1").innerHTML = json["articles"][art1]["title"];
            document.getElementById("headline2").innerHTML = json["articles"][art2]["title"];
            document.getElementById("headlineUrl1").innerHTML = url1Text;
            document.getElementById("headlineUrl2").innerHTML = url2Text;
            document.getElementById("headlineTime1").innerHTML = " - " + time1;
            document.getElementById("headlineTime2").innerHTML = " - " + time2;
        }
    )
}

function selectWear(hourly_data_list, hourly_weather_list){
    // Possible Wearables
    var jeans;
    var long_shirt;
    var umbrella;
    var jacket;
    var scarf;

    // Picks what to wear
    next_5_hours_temp = [];
    for (i=0; i<5; i++){
        next_5_hours_temp[i] = hourly_data_list[i]["apparentTemperature"]
    }

    // For Jeans
    if (Math.min.apply(Math, next_5_hours_temp) < 18){
        jeans = true
    } else {
        jeans = false
    }

    // For Long Shirt
    if (Math.min.apply(Math, next_5_hours_temp) < 13){
        long_shirt = true
    } else {
        long_shirt = false
    }

    // For Umbrella
    var hourly_weather_list = [];
    for (i = 0; i < 25; i++) {
        if (hourly_data_list[i]["icon"] == "clear-day" || hourly_data_list[i]["icon"] == "clear-night"){
            hourly_weather_list[i] = ("clear")
        } else if (hourly_data_list[i]["icon"] == "partly-cloudy-day" || hourly_data_list[i]["icon"] == "partly-cloudy-night"){
            hourly_weather_list[i] = ("cloudy")
        } else {
            hourly_weather_list[i] = (hourly_data_list[i]["icon"])
        }
    }

    if (hourly_weather_list.includes("rain") || hourly_weather_list.includes("snow") || hourly_weather_list.includes("sleet")){
        umbrella = true
    } else {
        umbrella = false
    }

    // For Jacket
    if (Math.min.apply(Math, next_5_hours_temp) < 10){
        jacket = true
    } else {
        jacket = false
    }


    // For Scarf
    if (Math.min.apply(Math, next_5_hours_temp) < 5){
        scarf = true
    } else {
        scarf = false
    }

    //Choose Images
    if (jeans){
        document.getElementById("jeans").src = "pictures/trousers.png";
    } else {
        document.getElementById("jeans").src = "pictures/shorts.png";
    }

    if (long_shirt){
        document.getElementById("shirt").src = "pictures/long-shirt.png";
    } else {
        document.getElementById("shirt").src = "pictures/shirt.png";
    }

    if (jacket){
        document.getElementById("jacket").parentElement.style.display = "unset";
        document.getElementById("jacket").src = "pictures/jacket.png";
    } else {
        document.getElementById("jacket").parentElement.style.display = "none";
    }

    if (umbrella){
        document.getElementById("umbrella").parentElement.style.display = "unset";
        document.getElementById("umbrella").src = "pictures/umbrella.png";
    } else {
        document.getElementById("umbrella").parentElement.style.display = "none";
    }

    if (scarf){
        document.getElementById("scarf").parentElement.style.display = "unset";
        document.getElementById("scarf").src = "pictures/scarf.png";
    } else {
        document.getElementById("scarf").parentElement.style.display = "none";
    }


}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}







function handleFiles() { // Yes, this IS incredibly ugly...
    var text = '"Thomas Edison","Genius is one percent inspiration and ninety-nine percent perspiration."\n' +
        '"Yogi Berra","You can observe a lot just by watching."\n' +
        '"Abraham Lincoln","A house divided against itself cannot stand."\n' +
        '"Johann Wolfgang von Goethe","Difficulties increase the nearer we get to the goal."\n' +
        '"Byron Pulsifer","Fate is in your hands and no one elses"\n' +
        '"Lao Tzu","Be the chief but never the lord."\n' +
        '"Carl Sandburg","Nothing happens unless first we dream."\n' +
        '"Aristotle","Well begun is half done."\n' +
        '"Yogi Berra","Life is a learning experience, only if you learn."\n' +
        '"Margaret Sangster","Self-complacency is fatal to progress."\n' +
        '"Buddha","Peace comes from within. Do not seek it without."\n' +
        '"Byron Pulsifer","What you give is what you get."\n' +
        '"Iris Murdoch","We can only learn to love by loving."\n' +
        '"Karen Clark","Life is change. Growth is optional. Choose wisely."\n' +
        '"Wayne Dyer","You\'ll see it when you believe it."\n' +
        '"Lao Tzu","To lead people walk behind them."\n' +
        '"William Shakespeare","Having nothing, nothing can he lose."\n' +
        '"Henry J. Kaiser","Trouble is only opportunity in work clothes."\n' +
        '"Publilius Syrus","A rolling stone gathers no moss."\n' +
        '"Napoleon Hill","Ideas are the beginning points of all fortunes."\n' +
        '"Donald Trump","Everything in life is luck."\n' +
        '"Lao Tzu","Doing nothing is better than being busy doing nothing."\n' +
        '"Benjamin Spock","Trust yourself. You know more than you think you do."\n' +
        '"Confucius","Study the past, if you would divine the future."\n' +
        '"Sigmund Freud","From error to error one discovers the entire truth."\n' +
        '"Benjamin Franklin","Well done is better than well said."\n' +
        '"Ella Williams","Bite off more than you can chew, then chew it."\n' +
        '"Buddha","Work out your own salvation. Do not depend on others."\n' +
        '"Benjamin Franklin","One today is worth two tomorrows."\n' +
        '"Christopher Reeve","Once you choose hope, anythings possible."\n' +
        '"Albert Einstein","God always takes the simplest way."\n' +
        '"Charles Kettering","One fails forward toward success."\n' +
        '"Chinese proverb","Learning is a treasure that will follow its owner everywhere"\n' +
        '"Socrates","Be as you wish to seem."\n' +
        '"V. Naipaul","The world is always in movement."\n' +
        '"John Wooden","Never mistake activity for achievement."\n' +
        '"Haddon Robinson","What worries you masters you."\n' +
        '"Pearl Buck","One faces the future with ones past."\n' +
        '"Brian Tracy","Goals are the fuel in the furnace of achievement."\n' +
        '"Leonardo da Vinci","Who sows virtue reaps honour."\n' +
        '"Dalai Lama","Be kind whenever possible. It is always possible."\n' +
        '"Chinese proverb","Talk doesn\'t cook rice."\n' +
        '"Buddha","He is able who thinks he is able."\n' +
        '"Larry Elder","A goal without a plan is just a wish."\n' +
        '"Michael Korda","To succeed, we must first believe that we can."\n' +
        '"Albert Einstein","Learn from yesterday, live for today, hope for tomorrow."\n' +
        '"James Lowell","A weed is no more than a flower in disguise."\n' +
        '"Yoda","Do, or do not. There is no try."\n' +
        '"Harriet Beecher Stowe","All serious daring starts from within."\n' +
        '"Byron Pulsifer","The best teacher is experience learned from failures."\n' +
        '"Murray Gell-Mann","Think how hard physics would be if particles could think."\n' +
        '"John Lennon","Love is the flower you\'ve got to let grow."\n' +
        '"Napoleon Hill","Don\'t wait. The time will never be just right."\n' +
        '"Pericles","Time is the wisest counsellor of all."\n' +
        '"Napoleon Hill","You give before you get."\n' +
        '"Socrates","Wisdom begins in wonder."\n' +
        '"Baltasar Gracian","Without courage, wisdom bears no fruit."\n' +
        '"Aristotle","Change in all things is sweet."\n' +
        '"Byron Pulsifer","What you fear is that which requires action to overcome."\n' +
        '"Cullen Hightower","When performance exceeds ambition, the overlap is called success."\n' +
        '"African proverb","When deeds speak, words are nothing."\n' +
        '"Wayne Dyer","Real magic in relationships means an absence of judgement of others."\n' +
        '"Albert Einstein","I never think of the future. It comes soon enough."\n' +
        '"Ralph Emerson","Skill to do comes of doing."\n' +
        '"Sophocles","Wisdom is the supreme part of happiness."\n' +
        '"Maya Angelou","I believe that every person is born with talent."\n' +
        '"Abraham Lincoln","Important principles may, and must, be inflexible."\n' +
        '"Richard Evans","The undertaking of a new action brings new strength."\n' +
        '"Ralph Emerson","The years teach much which the days never know."\n' +
        '"Ralph Emerson","Our distrust is very expensive."\n' +
        '"Bodhidharma","All know the way; few actually walk it."\n' +
        '"Johann Wolfgang von Goethe","Great talent finds happiness in execution."\n' +
        '"Michelangelo","Faith in oneself is the best and safest course."\n' +
        '"Winston Churchill","Courage is going from failure to failure without losing enthusiasm."\n' +
        '"Leo Tolstoy","The two most powerful warriors are patience and time."\n' +
        '"Lao Tzu","Anticipate the difficult by managing the easy."\n' +
        '"Buddha","Those who are free of resentful thoughts surely find peace."\n' +
        '"Sophocles","A short saying often contains much wisdom."\n' +
        '"Princess Diana","Only do what your heart tells you."\n' +
        '"John Pierrakos","Life is movement-we breathe, we eat, we walk, we move!"\n' +
        '"Eleanor Roosevelt","No one can make you feel inferior without your consent."\n' +
        '"Richard Bach","Argue for your limitations, and sure enough theyre yours."\n' +
        '"Seneca","Luck is what happens when preparation meets opportunity."\n' +
        '"Napoleon Bonaparte","Victory belongs to the most persevering."\n' +
        '"William Shakespeare","Love all, trust a few, do wrong to none."\n' +
        '"Richard Bach","In order to win, you must expect to win."\n' +
        '"Napoleon Hill","A goal is a dream with a deadline."\n' +
        '"Napoleon Hill","You can do it if you believe you can!"\n' +
        '"Bo Jackson","Set your goals high, and don\'t stop till you get there."\n' +
        '"Thich Nhat Hanh","Smile, breathe, and go slowly."\n' +
        '"Liberace","Nobody will believe in you unless you believe in yourself."\n' +
        '"William Arthur Ward","Do more than dream: work."\n' +
        '"Seneca","No man was ever wise by chance."\n' +
        '"William Shakespeare","He that is giddy thinks the world turns round."\n' +
        '"Ellen Gilchrist","Don\'t ruin the present with the ruined past."\n' +
        '"Albert Schweitzer","Do something wonderful, people may imitate it."\n' +
        '"Eleanor Roosevelt","Do one thing every day that scares you."\n' +
        '"Byron Pulsifer","If you cannot be silent be brilliant and thoughtful."\n' +
        '"Carl Jung","Who looks outside, dreams; who looks inside, awakes."\n' +
        '"Buddha","What we think, we become."\n' +
        '"Lord Herbert","The shortest answer is doing."\n' +
        '"Leonardo da Vinci","All our knowledge has its origins in our perceptions."\n' +
        '"Anne Wilson Schaef","Trusting our intuition often saves us from disaster."\n' +
        '"Sojourner Truth","Truth is powerful and it prevails."\n' +
        '"Elizabeth Browning","Light tomorrow with today!"\n' +
        '"German proverb","Silence is a fence around wisdom."\n' +
        '"Madame de Stael","Society develops wit, but its contemplation alone forms genius."\n' +
        '"Richard Bach","The simplest things are often the truest."\n' +
        '"Bernadette Devlin","Yesterday I dared to struggle. Today I dare to win."\n' +
        '"Napoleon Hill","No alibi will save you from accepting the responsibility."\n' +
        '"Walt Disney","If you can dream it, you can do it."\n' +
        '"Buddha","It is better to travel well than to arrive."\n' +
        '"Anais Nin","Life shrinks or expands in proportion to one\'s courage."\n' +
        '"Sun Tzu","You have to believe in yourself."\n' +
        '"Wayne Dyer","Our intention creates our reality."\n' +
        '"Confucius","Silence is a true friend who never betrays."\n' +
        '"Johann Wolfgang von Goethe","Character develops itself in the stream of life."\n' +
        '"American proverb","From little acorns mighty oaks do grow."\n' +
        '"Jon Kabat-Zinn","You can\'t stop the waves, but you can learn to surf."\n' +
        '"Gustave Flaubert","Reality does not conform to the ideal, but confirms it."\n' +
        '"William Shakespeare","Speak low, if you speak love."\n' +
        '"Johann Wolfgang von Goethe","A really great talent finds its happiness in execution."\n' +
        '"John Lennon","Reality leaves a lot to the imagination."\n' +
        '"Seneca","The greatest remedy for anger is delay."\n' +
        '"Pearl Buck","Growth itself contains the germ of happiness."\n' +
        '"Leonardo da Vinci","Nothing strengthens authority so much as silence."\n' +
        '"Confucius","Wherever you go, go with all your heart."\n' +
        '"Albert Einstein","The only real valuable thing is intuition."\n' +
        '"Ralph Emerson","Good luck is another name for tenacity of purpose."\n' +
        '"Sylvia Voirol","Rainbows apologize for angry skies."\n' +
        '"Theophrastus","Time is the most valuable thing a man can spend."\n' +
        '"Tony Robbins","Whatever happens, take responsibility."\n' +
        '"Oscar Wilde","Experience is simply the name we give our mistakes."\n' +
        '"Wayne Dyer","I think and that is all that I am."\n' +
        '"Gloria Steinem","If the shoe doesn\'t fit, must we change the foot?"\n' +
        '"Marcus Aurelius","Each day provides its own gifts."\n' +
        '"Publilius Syrus","While we stop to think, we often miss our opportunity."\n' +
        '"Bernard Shaw","Life isn\'t about finding yourself. Life is about creating yourself."\n' +
        '"Richard Bach","To bring anything into your life, imagine that it\'s already there."\n' +
        '"German proverb","Begin to weave and God will give you the thread."\n' +
        '"Confucius","The more you know yourself, the more you forgive yourself."\n' +
        '"Mary Bethune","Without faith, nothing is possible. With it, nothing is impossible."\n' +
        '"Albert Einstein","Once we accept our limits, we go beyond them."\n' +
        '"Brian Tracy","Whatever we expect with confidence becomes our own self-fulfilling prophecy."\n' +
        '"Pablo Picasso","Everything you can imagine is real."\n' +
        '"Usman Asif","Fear is a darkroom where negatives develop."\n' +
        '"Napoleon Bonaparte","The truest wisdom is a resolute determination."\n' +
        '"Victor Hugo","Life is the flower for which love is the honey."\n' +
        '"Epictetus","Freedom is the right to live as we wish."\n' +
        '"Robert Heller","Never ignore a gut feeling, but never believe that it\'s enough."\n' +
        '"Marcus Aurelius","Loss is nothing else but change,and change is Natures delight."\n' +
        '"Byron Pulsifer","Someone is special only if you tell them."\n' +
        '"Thich Nhat Hanh","There is no way to happiness, happiness is the way."\n' +
        '"Lao Tzu","He who talks more is sooner exhausted."\n' +
        '"Lao Tzu","He who is contented is rich."\n' +
        '"Plutarch","What we achieve inwardly will change outer reality."\n' +
        '"Ralph Waldo Emerson","Our strength grows out of our weaknesses."\n' +
        '"Mahatma Gandhi","We must become the change we want to see."\n' +
        '"Napoleon Hill","Happiness is found in doing, not merely possessing."\n' +
        '"Wit","We choose our destiny in the way we treat others."\n' +
        '"Voltaire","No snowflake in an avalanche ever feels responsible."\n' +
        '"Virgil","Fortune favours the brave."\n' +
        '"Joseph Stalin","I believe in one thing only, the power of human will."\n' +
        '"Robert Frost","The best way out is always through."\n' +
        '"Seneca","The mind unlearns with difficulty what it has long learned."\n' +
        '"Abraham Lincoln","I destroy my enemies when I make them my friends."\n' +
        '"Thomas Fuller","No garden is without its weeds."\n' +
        '"Elbert Hubbard","There is no failure except in no longer trying."\n' +
        '"Turkish proverb","Kind words will unlock an iron door."\n' +
        '"Hugh Miller","Problems are only opportunities with thorns on them."\n' +
        '"A. Powell Davies","Life is just a chance to grow a soul."\n' +
        '"Johann Wolfgang von Goethe","Mountains cannot be surmounted except by winding paths."\n' +
        '"Thich Nhat Hanh","May our hearts garden of awakening bloom with hundreds of flowers."\n' +
        '"John Dryden","Fortune befriends the bold."\n' +
        '"Friedrich von Schiller","Keep true to the dreams of thy youth."\n' +
        '"Mike Ditka","You\'re never a loser until you quit trying."\n' +
        '"Immanuel Kant","Science is organized knowledge. Wisdom is organized life."\n' +
        '"Johann Wolfgang von Goethe","Knowing is not enough; we must apply!"\n' +
        '"Richard Bach","Strong beliefs win strong men, and then make them stronger."\n' +
        '"Albert Camus","Autumn is a second spring when every leaf is a flower."\n' +
        '"Toni Morrison","If you surrender to the wind, you can ride it."\n' +
        '"Helen Keller","Keep yourself to the sunshine and you cannot see the shadow."\n' +
        '"Paulo Coelho","Write your plans in pencil and give God the eraser."\n' +
        '"Pablo Picasso","Inspiration exists, but it has to find us working."\n' +
        '"Jonathan Kozol","Pick battles big enough to matter, small enough to win."\n' +
        '"Janis Joplin","Don\'t compromise yourself. You are all you\'ve got."\n' +
        '"Sophocles","A short saying oft contains much wisdom."\n' +
        '"Epictetus","Difficulties are things that show a person what they are."\n' +
        '"Honore de Balzac","When you doubt your power, you give power to your doubt."\n' +
        '"Ovid","The cause is hidden. The effect is visible to all."\n' +
        '"Francis Bacon","A prudent question is one half of wisdom."\n' +
        '"Tony Robbins","The path to success is to take massive, determined action."\n' +
        '"Manuel Puig","I allow my intuition to lead my path."\n' +
        '"William R. Inge","Nature takes away any faculty that is not used."\n' +
        '"Epictetus","If you wish to be a writer, write."\n' +
        '"Wayne Dyer","There is no way to prosperity, prosperity is the way."\n' +
        '"Jim Rohn","Either you run the day or the day runs you."\n' +
        '"Publilius Syrus","Better be ignorant of a matter than half know it."\n' +
        '"Oprah Winfrey","Follow your instincts. That is where true wisdom manifests itself."\n' +
        '"Benjamin Franklin","There never was a good knife made of bad steel."\n' +
        '"Anatole France","To accomplish great things, we must dream as well as act."\n' +
        '"Saint Augustine","Patience is the companion of wisdom."\n' +
        '"Buddha","The mind is everything. What you think you become."\n' +
        '"Voltaire","To enjoy life, we must touch much of it lightly."\n' +
        '"Maya Lin","To fly, we have to have resistance."\n' +
        '"Blaise Pascal","The heart has its reasons which reason knows not of."\n' +
        '"William Shakespeare","Be great in act, as you have been in thought."\n' +
        '"Napoleon Bonaparte","Imagination rules the world."\n' +
        '"Blaise Pascal","Kind words do not cost much. Yet they accomplish much."\n' +
        '"Michelangelo","There is no greater harm than that of time wasted."\n' +
        '"Jonas Salk","Intuition will tell the thinking mind where to look next."\n' +
        '"Napoleon Hill","Fears are nothing more than a state of mind."\n' +
        '"Lao Tzu","The journey of a thousand miles begins with one step."\n' +
        '"Peter Drucker","Efficiency is doing things right; effectiveness is doing the right things."\n' +
        '"Luisa Sigea","Blaze with the fire that is never extinguished."\n' +
        '"Dr. Seuss","Don\'t cry because it\'s over. Smile because it happened."\n' +
        '"Jason Fried","No is easier to do. Yes is easier to say."\n' +
        '"Confucius","To be wrong is nothing unless you continue to remember it."\n' +
        '"Babe Ruth","Yesterdays home runs don\'t win today\'s games."\n' +
        '"Carlyle","Silence is deep as Eternity, Speech is shallow as Time."\n' +
        '"Leo F. Buscaglia","Don\'t smother each other. No one can grow in the shade."\n' +
        '"Lao Tzu","An ant on the move does more than a dozing ox"\n' +
        '"Indira Gandhi","You can\'t shake hands with a clenched fist."\n' +
        '"Plato","A good decision is based on knowledge and not on numbers."\n' +
        '"Confucius","The cautious seldom err."\n' +
        '"Frederick Douglass","If there is no struggle, there is no progress."\n' +
        '"Willa Cather","Where there is great love, there are always miracles."\n' +
        '"John Lennon","Time you enjoy wasting, was not wasted."\n' +
        '"Richard Bach","Every problem has a gift for you in its hands."\n' +
        '"Jean de la Fontaine","Sadness flies away on the wings of time."\n' +
        '"Publilius Syrus","I have often regretted my speech, never my silence."\n' +
        '"Thomas Jefferson","Never put off till tomorrow what you can do today."\n' +
        '"Thomas Dewar","Minds are like parachutes. They only function when open."\n' +
        '"George Patton","If a man does his best, what else is there?"\n' +
        '"Benjamin Disraeli","The secret of success is constancy to purpose."\n' +
        '"Ralph Emerson","Life is a progress, and not a station."\n' +
        '"Horace Friess","All seasons are beautiful for the person who carries happiness within."\n' +
        '"Elbert Hubbard","To avoid criticism, do nothing, say nothing, be nothing."\n' +
        '"Ovid","All things change; nothing perishes."\n' +
        '"Haynes Bayly","Absence makes the heart grow fonder."\n' +
        '"Lauren Bacall","Imagination is the highest kite one can fly."\n' +
        '"Frank Herbert","The beginning of knowledge is the discovery of something we do not understand."\n' +
        '"Elizabeth Browning","Love doesn\'t make the world go round, love is what makes the ride worthwhile."\n' +
        '"Arthur Conan Doyle","Whenever you have eliminated the impossible, whatever remains, however improbable, must be the truth."\n' +
        '"J. Willard Marriott","Good timber does not grow with ease; the stronger the wind, the stronger the trees."\n' +
        '"Dalai Lama","I believe that we are fundamentally the same and have the same basic potential."\n' +
        '"Edward Gibbon","The winds and waves are always on the side of the ablest navigators."\n' +
        '"Eleanor Roosevelt","The future belongs to those who believe in the beauty of their dreams."\n' +
        '"Mahatma Gandhi","Strength does not come from physical capacity. It comes from an indomitable will."\n' +
        '"Og Mandino","Each misfortune you encounter will carry in it the seed of tomorrows good luck."\n' +
        '"Lewis B. Smedes","To forgive is to set a prisoner free and realize that prisoner was you."\n' +
        '"Buddha","In separateness lies the world\'s great misery, in compassion lies the world\'s true strength."\n' +
        '"Nikos Kazantzakis","By believing passionately in something that does not yet exist, we create it."\n' +
        '"John Eliot","All the great performers I have worked with are fuelled by a personal dream."\n' +
        '"A. A. Milne","One of the advantages of being disorderly is that one is constantly making exciting discoveries."\n' +
        '"Marie Curie","I never see what has been done; I only see what remains to be done."\n' +
        '"Seneca","Begin at once to live and count each separate day as a separate life."\n' +
        '"Lawrence Peter","If you don\'t know where you are going, you will probably end up somewhere else."\n' +
        '"Hannah More","It is not so important to know everything as to appreciate what we learn."\n' +
        '"John Berry","The bird of paradise alights only upon the hand that does not grasp."\n' +
        '"William Yeats","Think as a wise man but communicate in the language of the people."\n' +
        '"Epictetus","Practice yourself, for heavens sake in little things, and then proceed to greater."\n' +
        '"Seneca","If one does not know to which port is sailing, no wind is favorable."\n' +
        '"Ken S. Keyes","To be upset over what you don\'t have is to waste what you do have."\n' +
        '"Thomas Edison","If we did the things we are capable of, we would astound ourselves."\n' +
        '"Marie Curie","Nothing in life is to be feared. It is only to be understood."\n' +
        '"Tony Robbins","Successful people ask better questions, and as a result, they get better answers."\n' +
        '"Anne Schaef","Life is a process. We are a process. The universe is a process."\n' +
        '"Eleanor Roosevelt","I think somehow we learn who we really are and then live with that decision."\n' +
        '"Kenneth Patton","We learn what we have said from those who listen to our speaking."\n' +
        '"Kahlil Gibran","A little knowledge that acts is worth infinitely more than much knowledge that is idle."\n' +
        '"Flora Whittemore","The doors we open and close each day decide the lives we live."\n' +
        '"H. W. Arnold","The worst bankrupt in the world is the person who has lost his enthusiasm."\n' +
        '"Buddha","Happiness comes when your work and words are of benefit to yourself and others."\n' +
        '"Wayne Dyer","Everything is perfect in the universe, even your desire to improve it."\n' +
        '"Eden Phillpotts","The universe is full of magical things, patiently waiting for our wits to grow sharper."\n' +
        '"Buddha","Just as a candle cannot burn without fire, men cannot live without a spiritual life."\n' +
        '"Mark Twain","A thing long expected takes the form of the unexpected when at last it comes."\n' +
        '"Benjamin Disraeli","Action may not always bring happiness; but there is no happiness without action."\n' +
        '"Oprah Winfrey","I don\'t believe in failure. It is not failure if you enjoyed the process."\n' +
        '"Confucius","What you do not want done to yourself, do not do to others."\n' +
        '"Winston Churchill","Short words are best and the old words when short are best of all."\n' +
        '"Buddha","If you light a lamp for somebody, it will also brighten your path."\n' +
        '"Lin-yutang","I have done my best: that is about all the philosophy of living one needs."\n' +
        '"Benjamin Disraeli","Through perseverance many people win success out of what seemed destined to be certain failure."\n' +
        '"Byron Pulsifer","Give thanks for the rain of life that propels us to reach new horizons."\n' +
        '"Dave Weinbaum","The secret to a rich life is to have more beginnings than endings."\n' +
        '"Ralph Waldo Emerson","It is only when the mind and character slumber that the dress can be seen."\n' +
        '"Maya Angelou","If you don\'t like something, change it. If you can\'t change it, change your attitude."\n' +
        '"Confucius","Reviewing what you have learned and learning anew, you are fit to be a teacher."\n' +
        '"Augustinus Sanctus","The world is a book, and those who do not travel read only a page."\n' +
        '"Henri-Frederic Amiel","So long as a person is capable of self-renewal they are a living being."\n' +
        '"Louisa Alcott","I\'m not afraid of storms, for Im learning how to sail my ship."\n' +
        '"Voltaire","Think for yourselves and let others enjoy the privilege to do so too."\n' +
        '"Annie Dillard","How we spend our days is, of course, how we spend our lives."\n' +
        '"Man Ray","It has never been my object to record my dreams, just to realize them."\n' +
        '"Sigmund Freud","The most complicated achievements of thought are possible without the assistance of consciousness."\n' +
        '"Wayne Dyer","Be miserable. Or motivate yourself. Whatever has to be done, it\'s always your choice."\n' +
        '"Napoleon Hill","Most great people have attained their greatest success just one step beyond their greatest failure."\n' +
        '"Henry Ford","If you think you can, you can. And if you think you can\'t, you\'re right."\n' +
        '"St. Augustine","Better to have loved and lost, than to have never loved at all."\n' +
        '"Leo Tolstoy","Everyone thinks of changing the world, but no one thinks of changing himself."\n' +
        '"Richard Bach","The best way to pay for a lovely moment is to enjoy it."\n' +
        '"Winston Churchill","You have enemies? Good. That means you\'ve stood up for something, sometime in your life."\n' +
        '"John De Paola","Slow down and everything you are chasing will come around and catch you."\n' +
        '"Buddha","Your worst enemy cannot harm you as much as your own unguarded thoughts."\n' +
        '"Lily Tomlin","I always wanted to be somebody, but I should have been more specific."\n' +
        '"John Lennon","Yeah we all shine on, like the moon, and the stars, and the sun."\n' +
        '"Martin Fischer","Knowledge is a process of piling up facts; wisdom lies in their simplification."\n' +
        '"Albert Einstein","Life is like riding a bicycle. To keep your balance you must keep moving."\n' +
        '"Albert Schweitzer","We should all be thankful for those people who rekindle the inner spirit."\n' +
        '"Thomas Edison","Opportunity is missed by most because it is dressed in overalls and looks like work."\n' +
        '"Albert Einstein","Feeling and longing are the motive forces behind all human endeavor and human creations."\n' +
        '"Johann Wolfgang von Goethe","In the end we retain from our studies only that which we practically apply."\n' +
        '"Lao Tzu","If you correct your mind, the rest of your life will fall into place."\n' +
        '"Ralph Emerson","The world makes way for the man who knows where he is going."\n' +
        '"Napoleon Hill","When your desires are strong enough you will appear to possess superhuman powers to achieve."\n' +
        '"John Adams","Patience and perseverance have a magical effect before which difficulties disappear and obstacles vanish."\n' +
        '"Henry David Thoreau","I cannot make my days longer so I strive to make them better."\n' +
        '"Chinese proverb","Tension is who you think you should be. Relaxation is who you are."\n' +
        '"Helen Keller","Never bend your head. Always hold it high. Look the world right in the eye."\n' +
        '"Albert Schweitzer","One who gains strength by overcoming obstacles possesses the only strength which can overcome adversity."\n' +
        '"Calvin Coolidge","We cannot do everything at once, but we can do something at once."\n' +
        '"Abraham Lincoln","You have to do your own growing no matter how tall your grandfather was."\n' +
        '"General Douglas MacArthur","It is fatal to enter any war without the will to win it."\n' +
        '"Julius Charles Hare","Be what you are. This is the first step toward becoming better than you are."\n' +
        '"Buckminster Fuller","There is nothing in a caterpillar that tells you it\'s going to be a butterfly."\n' +
        '"Dalai Lama","Love and compassion open our own inner life, reducing stress, distrust and loneliness."\n' +
        '"Walter Lippmann","Ideals are an imaginative understanding of that which is desirable in that which is possible."\n' +
        '"Confucius","The superior man is satisfied and composed; the mean man is always full of distress."\n' +
        '"Bruce Lee","If you spend too much time thinking about a thing, you\'ll never get it done."\n' +
        '"Buddha","The way is not in the sky. The way is in the heart."\n' +
        '"Abraham Lincoln","Most people are about as happy as they make up their minds to be"\n' +
        '"Buddha","Three things cannot be long hidden: the sun, the moon, and the truth."\n' +
        '"Dalai Lama","More often than not, anger is actually an indication of weakness rather than of strength."\n' +
        '"Jim Beggs","Before you put on a frown, make absolutely sure there are no smiles available."\n' +
        '"Donald Kircher","A man of ability and the desire to accomplish something can do anything."\n' +
        '"Buddha","You, yourself, as much as anybody in the entire universe, deserve your love and affection."\n' +
        '"Eckhart Tolle","It is not uncommon for people to spend their whole life waiting to start living."\n' +
        '"H. Jackson Browne","Don\'t be afraid to go out on a limb. That\'s where the fruit is."\n' +
        '"Marquis Vauvenargues","Wicked people are always surprised to find ability in those that are good."\n' +
        '"Charlotte Bronte","Life is so constructed that an event does not, cannot, will not, match the expectation."\n' +
        '"Wayne Dyer","If you change the way you look at things, the things you look at change."\n' +
        '"Napoleon Hill","No man can succeed in a line of endeavor which he does not like."\n' +
        '"Buddha","You will not be punished for your anger, you will be punished by your anger."\n' +
        '"Robert Stevenson","Don\'t judge each day by the harvest you reap but by the seeds you plant."\n' +
        '"Andy Warhol","They say that time changes things, but you actually have to change them yourself."\n' +
        '"Benjamin Disraeli","Never apologize for showing feelings. When you do so, you apologize for the truth."\n' +
        '"Pema Chodron","The truth you believe and cling to makes you unavailable to hear anything new."\n' +
        '"Horace","Adversity has the effect of eliciting talents, which in prosperous circumstances would have lain dormant."\n' +
        '"Morris West","If you spend your whole life waiting for the storm, you\'ll never enjoy the sunshine."\n' +
        '"Franklin Roosevelt","The only limit to our realization of tomorrow will be our doubts of today."\n' +
        '"Edwin Chapin","Every action of our lives touches on some chord that will vibrate in eternity."\n' +
        '"Les Brown","Shoot for the moon. Even if you miss, you\'ll land among the stars."\n' +
        '"Confucius","It does not matter how slowly you go as long as you do not stop."\n' +
        '"Abraham Lincoln","Most folks are about as happy as they make up their minds to be."\n' +
        '"Lao Tzu","If you would take, you must first give, this is the beginning of intelligence."\n' +
        '"Havelock Ellis","It is on our failures that we base a new and different and better success."\n' +
        '"John Ruskin","Quality is never an accident; it is always the result of intelligent effort."\n' +
        '"Confucius","To study and not think is a waste. To think and not study is dangerous."\n' +
        '"Ralph Emerson","Life is a succession of lessons, which must be lived to be understood."\n' +
        '"Thomas Hardy","Time changes everything except something within us which is always surprised by change."\n' +
        '"Wayne Dyer","You are important enough to ask and you are blessed enough to receive back."\n' +
        '"Napoleon Hill","If you cannot do great things, do small things in a great way."\n' +
        '"Oprah Winfrey","If you want your life to be more rewarding, you have to change the way you think."\n' +
        '"Byron Pulsifer","Transformation doesn\'t take place with a vacuum; instead, it occurs when we are indirectly and directly connected to all those around us."\n' +
        '"Leonardo Ruiz","The only difference between your abilities and others is the ability to put yourself in their shoes and actually try."\n' +
        '"Leon Blum","The free man is he who does not fear to go to the end of his thought."\n' +
        '"Ralph Emerson","Great are they who see that spiritual is stronger than any material force, that thoughts rule the world."\n' +
        '"Bernard Shaw","A life spent making mistakes is not only more honourable but more useful than a life spent in doing nothing."\n' +
        '"Lao Tzu","The wise man does not lay up his own treasures. The more he gives to others, the more he has for his own."\n' +
        '"Charles Dickens","Don\'t leave a stone unturned. It\'s always something, to know you have done the most you could."\n' +
        '"Dalai Lama","By going beyond your own problems and taking care of others, you gain inner strength, self-confidence, courage, and a greater sense of calm."\n' +
        '"Sam Keen","We come to love not by finding a perfect person, but by learning to see an imperfect person perfectly."\n' +
        '"Walt Emerson","What lies behind us and what lies before us are tiny matters compared to what lies within us."\n' +
        '"John Astin","There are things so deep and complex that only intuition can reach it in our stage of development as human beings."\n' +
        '"Elbert Hubbard","A little more persistence, a little more effort, and what seemed hopeless failure may turn to glorious success."\n' +
        '"Henry Moore","There is no retirement for an artist, it\'s your way of living so there is no end to it."\n' +
        '"Confucius","I will not be concerned at other men is not knowing me;I will be concerned at my own want of ability."\n' +
        '"Laozi","When you are content to be simply yourself and don\'t compare or compete, everybody will respect you."\n' +
        '"William Shakespeare","Be not afraid of greatness: some are born great, some achieve greatness, and some have greatness thrust upon them."\n' +
        '"George Sheehan","Success means having the courage, the determination, and the will to become the person you believe you were meant to be."\n' +
        '"Thomas Jefferson","Do you want to know who you are? Don\'t ask. Act! Action will delineate and define you."\n' +
        '"Antoine de Saint-Exupery","It is only with the heart that one can see rightly, what is essential is invisible to the eye."\n' +
        '"Marcel Proust","Let us be grateful to people who make us happy; they are the charming gardeners who make our souls blossom."\n' +
        '"Epictetus","Make the best use of what is in your power, and take the rest as it happens."\n' +
        '"Louise Hay","The thoughts we choose to think are the tools we use to paint the canvas of our lives."\n' +
        '"W. Clement Stone","No matter how carefully you plan your goals they will never be more that pipe dreams unless you pursue them with gusto."\n' +
        '"Robert McKain","The reason most goals are not achieved is that we spend our time doing second things first."\n' +
        '"John Quincy Adams","If your actions inspire others to dream more, learn more, do more and become more, you are a leader."\n' +
        '"Thomas Jefferson","I\'m a great believer in luck and I find the harder I work, the more I have of it."\n' +
        '"Ralph Emerson","Do not waste yourself in rejection, nor bark against the bad, but chant the beauty of the good."\n' +
        '"Johann Wolfgang von Goethe","The person born with a talent they are meant to use will find their greatest happiness in using it."\n' +
        '"William Saroyan","Good people are good because they\'ve come to wisdom through failure. We get very little wisdom from success, you know."\n' +
        '"Byron Pulsifer","Your destiny isn\'t just fate; it is how you use your own developed abilities to get what you want."\n' +
        '"Leonardo da Vinci","Iron rusts from disuse; water loses its purity from stagnation... even so does inaction sap the vigour of the mind."\n' +
        '"Isaac Asimov","A subtle thought that is in error may yet give rise to fruitful inquiry that can establish truths of great value."\n' +
        '"Henry Van Dyke","Be glad of life because it gives you the chance to love, to work, to play, and to look up at the stars."\n' +
        '"Yogi Berra","You got to be careful if you don\'t know where you\'re going, because you might not get there."\n' +
        '"Naguib Mahfouz","You can tell whether a man is clever by his answers. You can tell whether a man is wise by his questions."\n' +
        '"Anthony Robbins","Life is a gift, and it offers us the privilege, opportunity, and responsibility to give something back by becoming more"\n' +
        '"John Wooden","You can\'t let praise or criticism get to you. It\'s a weakness to get caught up in either one."\n' +
        '"Og Mandino","I will love the light for it shows me the way, yet I will endure the darkness because it shows me the stars."\n' +
        '"Jane Addams","Our doubts are traitors and make us lose the good we often might win, by fearing to attempt."\n' +
        '"Thomas Carlyle","By nature man hates change; seldom will he quit his old home till it has actually fallen around his ears."\n' +
        '"M. Scott Peck","Until you value yourself, you won\'t value your time. Until you value your time, you won\'t do anything with it."\n' +
        '"Maureen Dowd","The minute you settle for less than you deserve, you get even less than you settled for."\n' +
        '"Charles Darwin","The highest stage in moral ure at which we can arrive is when we recognize that we ought to control our thoughts."\n' +
        '"Dalai Lama","If we have a positive mental attitude, then even when surrounded by hostility, we shall not lack inner peace."\n' +
        '"Christopher Morley","There is only one success, to be able to spend your life in your own way."\n' +
        '"Hannah Arendt","Promises are the uniquely human way of ordering the future, making it predictable and reliable to the extent that this is humanly possible."\n' +
        '"Alan Cohen","Appreciation is the highest form of prayer, for it acknowledges the presence of good wherever you shine the light of your thankful thoughts."\n' +
        '"Aldous Huxley","There is only one corner of the universe you can be certain of improving, and that\'s your own self."\n' +
        '"Marian Edelman","You\'re not obligated to win. You\'re obligated to keep trying to do the best you can every day."\n' +
        '"Byron Pulsifer","Everyone can taste success when the going is easy, but few know how to taste victory when times get tough."\n' +
        '"Sue Patton Thoele","Deep listening is miraculous for both listener and speaker.When someone receives us with open-hearted, non-judging, intensely interested listening, our spirits expand."\n' +
        '"Frank Crane","You may be deceived if you trust too much, but you will live in torment if you don\'t trust enough."\n' +
        '"Lao Tzu","Great indeed is the sublimity of the Creative, to which all beings owe their beginning and which permeates all heaven."\n' +
        '"Kathleen Norris","All that is necessary is to accept the impossible, do without the indispensable, and bear the intolerable."\n' +
        '"Confucius","Choose a job you love, and you will never have to work a day in your life."\n' +
        '"Eckhart Tolle","You cannot find yourself by going into the past. You can find yourself by coming into the present."\n' +
        '"Anne Bronte","All our talents increase in the using, and the every faculty, both good and bad, strengthen by exercise."\n' +
        '"Richard Bach","In order to live free and happily you must sacrifice boredom. It is not always an easy sacrifice."\n' +
        '"Desiderius Erasmus","The fox has many tricks. The hedgehog has but one. But that is the best of all."\n' +
        '"Arthur Rubinstein","Of course there is no formula for success except perhaps an unconditional acceptance of life and what it brings."\n' +
        '"Louis Pasteur","Let me tell you the secret that has led me to my goal: my strength lies solely in my tenacity"\n' +
        '"Rumi","Something opens our wings. Something makes boredom and hurt disappear. Someone fills the cup in front of us: We taste only sacredness."\n' +
        '"Sogyal Rinpoche","We must never forget that it is through our actions, words, and thoughts that we have a choice."\n' +
        '"Dennis Kimbro","We see things not as they are, but as we are. Our perception is shaped by our previous experiences."\n' +
        '"William Penn","True silence is the rest of the mind; it is to the spirit what sleep is to the body, nourishment and refreshment."\n' +
        '"Immanuel Kant","All our knowledge begins with the senses, proceeds then to the understanding, and ends with reason. There is nothing higher than reason."\n' +
        '"Buddha","The thought manifests as the word. The word manifests as the deed. The deed develops into habit. And the habit hardens into character."\n' +
        '"Byron Pulsifer","Patience is a virtue but you will never ever accomplish anything if you don\'t exercise action over patience."\n' +
        '"Robert Lynd","Any of us can achieve virtue, if by virtue we merely mean the avoidance of the vices that do not attract us."\n' +
        '"Ralph Emerson","If the single man plant himself indomitably on his instincts, and there abide, the huge world will come round to him."\n' +
        '"Donald Trump","Money was never a big motivation for me, except as a way to keep score. The real excitement is playing the game."\n' +
        '"Eleanor Roosevelt","Friendship with oneself is all important because without it one cannot be friends with anybody else in the world."\n' +
        '"Robert Fulghum","Peace is not something you wish for. It\'s something you make, something you do, something you are, and something you give away."\n' +
        '"Bruce Lee","A wise man can learn more from a foolish question than a fool can learn from a wise answer."\n' +
        '"Arthur Schopenhauer","Every man takes the limits of his own field of vision for the limits of the world."\n' +
        '"Andre Gide","One does not discover new lands without consenting to lose sight of the shore for a very long time."\n' +
        '"Sai Baba","What is new in the world? Nothing. What is old in the world? Nothing. Everything has always been and will always be."\n' +
        '"Dalai Lama","Genuine love should first be directed at oneself. if we do not love ourselves, how can we love others?"\n' +
        '"Tom Lehrer","Life is like a sewer. What you get out of it depends on what you put into it."\n' +
        '"Bruce Lee","Notice that the stiffest tree is most easily cracked, while the bamboo or willow survives by bending with the wind."\n' +
        '"Alfred Sheinwold","Learn all you can from the mistakes of others. You won\'t have time to make them all yourself."\n' +
        '"Sri Chinmoy","Judge nothing, you will be happy. Forgive everything, you will be happier. Love everything, you will be happiest."\n' +
        '"Johann Wolfgang von Goethe","People are so constituted that everybody would rather undertake what they see others do, whether they have an aptitude for it or not."\n' +
        '"James Freeman Clarke","We are either progressing or retrograding all the while. There is no such thing as remaining stationary in this life."\n' +
        '"Anais Nin","The possession of knowledge does not kill the sense of wonder and mystery. There is always more mystery."\n' +
        '"Marcus Aurelius","Everything that happens happens as it should, and if you observe carefully, you will find this to be so."\n' +
        '"Wayne Dyer","What we think determines what happens to us, so if we want to change our lives, we need to stretch our minds."\n' +
        '"Buddha","In a controversy the instant we feel anger we have already ceased striving for the truth, and have begun striving for ourselves."\n' +
        '"Sydney Smith","It is the greatest of all mistakes to do nothing because you can only do little, do what you can."\n' +
        '"Confucius","When you see a man of worth, think of how you may emulate him. When you see one who is unworthy, examine yourself."\n' +
        '"Mary Kay Ash","Aerodynamically the bumblebee shouldn\'t be able to fly, but the bumblebee doesn\'t know that so it goes on flying anyway."\n' +
        '"Lloyd Jones","Those who try to do something and fail are infinitely better than those who try nothing and succeed."\n' +
        '"Vista Kelly","Snowflakes are one of natures most fragile things, but just look what they can do when they stick together."\n' +
        '"Ben Stein","The first step to getting the things you want out of life is this: decide what you want."\n' +
        '"Aldous Huxley","Experience is not what happens to a man. It is what a man does with what happens to him."\n' +
        '"Oscar Wilde","The only thing to do with good advice is to pass it on. It is never of any use to oneself."\n' +
        '"Honore de Balzac","The smallest flower is a thought, a life answering to some feature of the Great Whole, of whom they have a persistent intuition."\n' +
        '"Jacob Braude","Consider how hard it is to change yourself and you\'ll understand what little chance you have in trying to change others."\n' +
        '"Vince Lombardi","If you\'ll not settle for anything less than your best, you will be amazed at what you can accomplish in your lives."\n' +
        '"Oliver Holmes","What lies behind us and what lies before us are small matters compared to what lies within us."\n' +
        '"Dalai Lama","With the realization of ones own potential and self-confidence in ones ability, one can build a better world."\n' +
        '"Nelson Mandela","There is nothing like returning to a place that remains unchanged to find the ways in which you yourself have altered."\n' +
        '"Robert Anthony","Forget about all the reasons why something may not work. You only need to find one good reason why it will."\n' +
        '"Aristotle","It is the mark of an educated mind to be able to entertain a thought without accepting it."\n' +
        '"Washington Irving","Love is never lost. If not reciprocated, it will flow back and soften and purify the heart."\n' +
        '"Anne Frank","We all live with the objective of being happy; our lives are all different and yet the same."\n' +
        '"Byron Pulsifer","Many people think of prosperity that concerns money only to forget that true prosperity is of the mind."\n' +
        '"Thich Nhat Hanh","To be beautiful means to be yourself. You don\'t need to be accepted by others. You need to accept yourself."\n' +
        '"Buddha","Do not overrate what you have received, nor envy others. He who envies others does not obtain peace of mind."\n' +
        '"Jessamyn West","It is very easy to forgive others their mistakes; it takes more grit to forgive them for having witnessed your own."\n' +
        '"Plato","Bodily exercise, when compulsory, does no harm to the body; but knowledge which is acquired under compulsion obtains no hold on the mind."\n' +
        '"Bruce Lee","Always be yourself, express yourself, have faith in yourself, do not go out and look for a successful personality and duplicate it."\n' +
        '"Charlotte Gilman","Let us revere, let us worship, but erect and open-eyed, the highest, not the lowest; the future, not the past!"\n' +
        '"Mother Teresa","Every time you smile at someone, it is an action of love, a gift to that person, a beautiful thing."\n' +
        '"Margaret Runbeck","Silences make the real conversations between friends. Not the saying but the never needing to say is what counts."\n' +
        '"Dalai Lama","The key to transforming our hearts and minds is to have an understanding of how our thoughts and emotions work."\n' +
        '"Johann Wolfgang von Goethe","If you must tell me your opinions, tell me what you believe in. I have plenty of douts of my own."\n' +
        '"Ovid","Chance is always powerful. Let your hook be always cast; in the pool where you least expect it, there will be a fish."\n' +
        '"Og Mandino","I seek constantly to improve my manners and graces, for they are the sugar to which all are attracted."\n' +
        '"James Barrie","We never understand how little we need in this world until we know the loss of it."\n' +
        '"Buddha","To keep the body in good health is a duty... otherwise we shall not be able to keep our mind strong and clear."\n' +
        '"Bruce Lee","Take no thought of who is right or wrong or who is better than. Be not for or against."\n' +
        '"Everett Dirksen","I am a man of fixed and unbending principles, the first of which is to be flexible at all times."\n' +
        '"Byron Pulsifer","Today, give a stranger a smile without waiting for it may be the joy they need to have a great day."\n' +
        '"Henry Miller","The moment one gives close attention to anything, even a blade of grass, it becomes a mysterious, awesome, indescribably magnificent world in itself."\n' +
        '"Lao Tzu","At the center of your being you have the answer; you know who you are and you know what you want."\n' +
        '"Niels Bohr","How wonderful that we have met with a paradox. Now we have some hope of making progress."\n' +
        '"Georg Lichtenberg","Everyone is a genius at least once a year. A real genius has his original ideas closer together."\n' +
        '"Anais Nin","Dreams pass into the reality of action. From the actions stems the dream again; and this interdependence produces the highest form of living."\n' +
        '"Gloria Steinem","Without leaps of imagination, or dreaming, we lose the excitement of possibilities. Dreaming, after all, is a form of planning."\n' +
        '"Byron Pulsifer","Sadness may be part of life but there is no need to let it dominate your entire life."\n' +
        '"Charles Schwab","Keeping a little ahead of conditions is one of the secrets of business, the trailer seldom goes far."\n' +
        '"Epictetus","Nature gave us one tongue and two ears so we could hear twice as much as we speak."\n' +
        '"Barbara Baron","Don\'t wait for your feelings to change to take the action. Take the action and your feelings will change."\n' +
        '"Richard Bach","You are always free to change your mind and choose a different future, or a different past."\n' +
        '"Lou Holtz","You were not born a winner, and you were not born a loser. You are what you make yourself be."\n' +
        '"Napoleon Hill","Cherish your visions and your dreams as they are the children of your soul, the blueprints of your ultimate achievements."\n' +
        '"Napoleon Hill","Cherish your visions and your dreams as they are the children of your soul; the blueprints of your ultimate achievements."\n' +
        '"Robert Stevenson","To be what we are, and to become what we are capable of becoming, is the only end of life."\n' +
        '"Charles DeLint","The road leading to a goal does not separate you from the destination; it is essentially a part of it."\n' +
        '"Bruce Lee","Take things as they are. Punch when you have to punch. Kick when you have to kick."\n' +
        '"Albert Einstein","I believe that a simple and unassuming manner of life is best for everyone, best both for the body and the mind."\n' +
        '"Paavo Nurmi","Mind is everything: muscle, pieces of rubber. All that I am, I am because of my mind."\n' +
        '"Anne Frank","How wonderful it is that nobody need wait a single moment before starting to improve the world."\n' +
        '"Ralph Emerson","It is one of the blessings of old friends that you can afford to be stupid with them."\n' +
        '"Tryon Edwards","He that never changes his opinions, never corrects his mistakes, and will never be wiser on the morrow than he is today."\n' +
        '"Abraham Lincoln","Give me six hours to chop down a tree and I will spend the first four sharpening the axe."\n' +
        '"E. M. Forster","One must be fond of people and trust them if one is not to make a mess of life."\n' +
        '"David Seamans","We cannot change our memories, but we can change their meaning and the power they have over us."\n' +
        '"Confucius","Being in humaneness is good. If we select other goodness and thus are far apart from humaneness, how can we be the wise?"\n' +
        '"Byron Pulsifer","To give hope to someone occurs when you teach them how to use the tools to do it for themselves."\n' +
        '"Lucille Ball","Id rather regret the things that I have done than the things that I have not done."\n' +
        '"Eckhart Tolle","The past has no power to stop you from being present now. Only your grievance about the past can do that."\n' +
        '"Ralph Emerson","If the stars should appear but one night every thousand years how man would marvel and adore."\n' +
        '"Laurence J. Peter","There are two kinds of failures: those who thought and never did, and those who did and never thought."\n' +
        '"Elizabeth Arden","I\'m not interested in age. People who tell me their age are silly. You\'re as old as you feel."\n' +
        '"Dalai Lama","I find hope in the darkest of days, and focus in the brightest. I do not judge the universe."\n' +
        '"Confucius","When it is obvious that the goals cannot be reached, don\'t adjust the goals, adjust the action steps."\n' +
        '"Nikola Tesla","Our virtues and our failings are inseparable, like force and matter. When they separate, man is no more."\n' +
        '"Leo Aikman","Blessed is the person who is too busy to worry in the daytime, and too sleepy to worry at night."\n' +
        '"Pablo Picasso","He can who thinks he can, and he can\'t who thinks he can\'t. This is an inexorable, indisputable law."\n' +
        '"Vernon Cooper","These days people seek knowledge, not wisdom. Knowledge is of the past, wisdom is of the future."\n' +
        '"Benjamin Disraeli","One secret of success in life is for a man to be ready for his opportunity when it comes."\n' +
        '"Dalai Lama","People take different roads seeking fulfilment and happiness. Just because theyre not on your road doesn\'t mean they\'ve gotten lost."\n' +
        '"Carl Jung","The shoe that fits one person pinches another; there is no recipe for living that suits all cases."\n' +
        '"Buddha","There are only two mistakes one can make along the road to truth; not going all the way, and not starting."\n' +
        '"Marcus Aurelius","Very little is needed to make a happy life; it is all within yourself, in your way of thinking."\n' +
        '"Johann Wolfgang von Goethe","Treat people as if they were what they ought to be and you help them to become what they are capable of being."\n' +
        '"Thich Nhat Hanh","The most precious gift we can offer anyone is our attention. When mindfulness embraces those we love, they will bloom like flowers."\n' +
        '"Jack Dixon","If you focus on results, you will never change. If you focus on change, you will get results."\n' +
        '"G. K. Chesterton","I would maintain that thanks are the highest form of thought, and that gratitude is happiness doubled by wonder."\n' +
        '"Denis Waitley","There are two primary choices in life: to accept conditions as they exist, or accept the responsibility for changing them."\n' +
        '"Lao-Tzu","All difficult things have their origin in that which is easy, and great things in that which is small."\n' +
        '"Byron Pulsifer","You can be what you want to be. You have the power within and we will help you always."\n' +
        '"Johannes Gaertner","To speak gratitude is courteous and pleasant, to enact gratitude is generous and noble, but to live gratitude is to touch Heaven."\n' +
        '"Doug Larson","Wisdom is the reward you get for a lifetime of listening when you\'d have preferred to talk."\n' +
        '"Charles Lamb","The greatest pleasure I know is to do a good action by stealth, and to have it found out by accident."\n' +
        '"John Muir","When one tugs at a single thing in nature, he finds it attached to the rest of the world."\n' +
        '"Winston Churchill","Courage is what it takes to stand up and speak; courage is also what it takes to sit down and listen."\n' +
        '"Helen Keller","The most beautiful things in the world cannot be seen or even touched. They must be felt with the heart."\n' +
        '"Buddha","To live a pure unselfish life, one must count nothing as ones own in the midst of abundance."\n' +
        '"Thomas Edison","Many of life\'s failures are people who did not realize how close they were to success when they gave up."\n' +
        '"William Ward","When we seek to discover the best in others, we somehow bring out the best in ourselves."\n' +
        '"Michael Jordan","If you accept the expectations of others, especially negative ones, then you never will change the outcome."\n' +
        '"Oliver Holmes","A man may fulfil the object of his existence by asking a question he cannot answer, and attempting a task he cannot achieve."\n' +
        '"Confucius","I am not bothered by the fact that I am unknown. I am bothered when I do not know others."\n' +
        '"Epictetus","He is a wise man who does not grieve for the things which he has not, but rejoices for those which he has."\n' +
        '"Pablo Picasso","I am always doing that which I cannot do, in order that I may learn how to do it."\n' +
        '"Barack Obama","If you\'re walking down the right path and you\'re willing to keep walking, eventually you\'ll make progress."\n' +
        '"Ivy Baker Priest","The world is round and the place which may seem like the end may also be the beginning."\n' +
        '"Danielle Ingrum","Give it all you\'ve got because you never know if there\'s going to be a next time."\n' +
        '"Old German proverb","You have to take it as it happens, but you should try to make it happen the way you want to take it."\n' +
        '"Ralph Blum","Nothing is predestined: The obstacles of your past can become the gateways that lead to new beginnings."\n' +
        '"Bruce Lee","Im not in this world to live up to your expectations and you\'re not in this world to live up to mine."\n' +
        '"Thich Nhat Hanh","Sometimes your joy is the source of your smile, but sometimes your smile can be the source of your joy."\n' +
        '"Walter Cronkite","I can\'t imagine a person becoming a success who doesn\'t give this game of life everything hes got."\n' +
        '"Socrates","The greatest way to live with honor in this world is to be what we pretend to be."\n' +
        '"Seneca","The conditions of conquest are always easy. We have but to toil awhile, endure awhile, believe always, and never turn back."\n' +
        '"Chalmers","The grand essentials of happiness are: something to do, something to love, and something to hope for."\n' +
        '"Thich Nhat Hanh","By living deeply in the present moment we can understand the past better and we can prepare for a better future."\n' +
        '"Ralph Emerson","Do not be too timid and squeamish about your reactions. All life is an experiment. The more experiments you make the better."\n' +
        '"Ralph Emerson","Do not go where the path may lead, go instead where there is no path and leave a trail."\n' +
        '"Robert Louis Stevenson","There is no duty we so underrate as the duty of being happy. By being happy we sow anonymous benefits upon the world."\n' +
        '"Napoleon Hill","Edison failed 10,000 times before he made the electric light. Do not be discouraged if you fail a few times."\n' +
        '"Henry Thoreau","The only way to tell the truth is to speak with kindness. Only the words of a loving man can be heard."\n' +
        '"Benjamin Disraeli","The greatest good you can do for another is not just to share your riches but to reveal to him his own."\n' +
        '"Brian Tracy","You can only grow if you\'re willing to feel awkward and uncomfortable when you try something new."\n' +
        '"Joan Didion","To free us from the expectations of others, to give us back to ourselves, there lies the great, singular power of self-respect."\n' +
        '"Mabel Newcomber","It is more important to know where you are going than to get there quickly. Do not mistake activity for achievement."\n' +
        '"Robert Graves","Intuition is the supra-logic that cuts out all the routine processes of thought and leaps straight from the problem to the answer."\n' +
        '"Frank Wright","The thing always happens that you really believe in; and the belief in a thing makes it happen."\n' +
        '"Francois de La Rochefoucauld","A true friend is the most precious of all possessions and the one we take the least thought about acquiring."\n' +
        '"Epictetus","There is only one way to happiness and that is to cease worrying about things which are beyond the power of our will."\n' +
        '"Margaret Cousins","Appreciation can make a day, even change a life. Your willingness to put it into words is all that is necessary."\n' +
        '"Thomas Carlyle","This world, after all our science and sciences, is still a miracle; wonderful, inscrutable, magical and more, to whosoever will think of it."\n' +
        '"Pearl Buck","Every great mistake has a halfway moment, a split second when it can be recalled and perhaps remedied."\n' +
        '"Catherine Pulsifer","You can adopt the attitude there is nothing you can do, or you can see the challenge as your call to action."\n' +
        '"Alfred Tennyson","The happiness of a man in this life does not consist in the absence but in the mastery of his passions."\n' +
        '"Margaret Mead","Never doubt that a small group of thoughtful, committed people can change the world. Indeed. It is the only thing that ever has."\n' +
        '"Ovid","Let your hook always be cast; in the pool where you least expect it, there will be a fish."\n' +
        '"Remez Sasson","You get peace of mind not by thinking about it or imagining it, but by quietening and relaxing the restless mind."\n' +
        '"Richard Bach","Your friends will know you better in the first minute you meet than your acquaintances will know you in a thousand years."\n' +
        '"Pema Chodron","When you begin to touch your heart or let your heart be touched, you begin to discover that it\'s bottomless."\n' +
        '"Richard Bach","If you love someone, set them free. If they come back they\'re yours; if they don\'t they never were."\n' +
        '"David Jordan","Wisdom is knowing what to do next; Skill is knowing how to do it, and Virtue is doing it."\n' +
        '"Richard Bach","Bad things are not the worst things that can happen to us. Nothing is the worst thing that can happen to us!"\n' +
        '"Alan Watts","No valid plans for the future can be made by those who have no capacity for living now."\n' +
        '"Oscar Wilde","The aim of life is self-development. To realize ones nature perfectly, that is what each of us is here for."\n' +
        '"Anatole France","To accomplish great things, we must not only act, but also dream; not only plan, but also believe."\n' +
        '"Thomas Edison","The first requisite for success is the ability to apply your physical and mental energies to one problem incessantly without growing weary."\n' +
        '"John Steinbeck","If we could learn to like ourselves, even a little, maybe our cruelties and angers might melt away."\n' +
        '"Eleanor Roosevelt","Remember always that you not only have the right to be an individual, you have an obligation to be one."\n' +
        '"Denis Waitley","There are two primary choices in life: to accept conditions as they exist, or accept responsibility for changing them."\n' +
        '"Epictetus","If you seek truth you will not seek victory by dishonourable means, and if you find truth you will become invincible."\n' +
        '"Eknath Easwaran","Through meditation and by giving full attention to one thing at a time, we can learn to direct attention where we choose."\n' +
        '"Helen Keller","We could never learn to be brave and patient if there were only joy in the world."\n' +
        '"Marcus Aurelius","If it is not right do not do it; if it is not true do not say it."\n' +
        '"Norman Schwarzkopf","The truth of the matter is that you always know the right thing to do. The hard part is doing it."\n' +
        '"Julie Morgenstern","Some people thrive on huge, dramatic change. Some people prefer the slow and steady route. Do what\'s right for you."\n' +
        '"Blaise Pascal","Man is equally incapable of seeing the nothingness from which he emerges and the infinity in which he is engulfed."\n' +
        '"Laura Teresa Marquez","Arrogance and rudeness are training wheels on the bicycle of life, for weak people who cannot keep their balance without them."\n' +
        '"Chinese proverb","If you are patient in one moment of anger, you will escape one hundred days of sorrow."\n' +
        '"Abraham Lincoln","When you have got an elephant by the hind legs and he is trying to run away, it\'s best to let him run."\n' +
        '"Byron Pulsifer","Courage is not about taking risks unknowingly but putting your own being in front of challenges that others may not be able to."\n' +
        '"Richard Bach","Can miles truly separate you from friends... If you want to be with someone you love, aren\'t you already there?"\n' +
        '"Harry Kemp","The poor man is not he who is without a cent, but he who is without a dream."\n' +
        '"Benjamin Disraeli","The greatest good you can do for another is not just share your riches, but reveal to them their own."\n' +
        '"Buddha","Do not dwell in the past, do not dream of the future, concentrate the mind on the present moment."\n' +
        '"Helen Keller","Face your deficiencies and acknowledge them; but do not let them master you. Let them teach you patience, sweetness, insight."\n' +
        '"John Kennedy","Change is the law of life. And those who look only to the past or present are certain to miss the future."\n' +
        '"Marcus Aurelius","You have power over your mind, not outside events. Realize this, and you will find strength."\n' +
        '"Louis Pasteur","Let me tell you the secret that has led me to my goal: my strength lies solely in my tenacity."\n' +
        '"Buddha","We are what we think. All that we are arises with our thoughts. With our thoughts, we make the world."\n' +
        '"Henry Longfellow","He that respects himself is safe from others; he wears a coat of mail that none can pierce."\n' +
        '"Wayne Dyer","I cannot always control what goes on outside. But I can always control what goes on inside."\n' +
        '"Daisaku Ikeda","What matters is the value we\'ve created in our lives, the people we\'ve made happy and how much we\'ve grown as people."\n' +
        '"Epictetus","When you are offended at any man\'s fault, turn to yourself and study your own failings. Then you will forget your anger."\n' +
        '"Rumi","Everyone has been made for some particular work, and the desire for that work has been put in every heart."\n' +
        '"Napoleon Bonaparte","Take time to deliberate, but when the time for action has arrived, stop thinking and go in."\n' +
        '"Dalai Lama","With realization of ones own potential and self-confidence in ones ability, one can build a better world."\n' +
        '"Franklin Roosevelt","Happiness is not in the mere possession of money; it lies in the joy of achievement, in the thrill of creative effort."\n' +
        '"Pearl Buck","You cannot make yourself feel something you do not feel, but you can make yourself do right in spite of your feelings."\n' +
        '"Mary Kay Ash","Those who are blessed with the most talent don\'t necessarily outperform everyone else. It\'s the people with follow-through who excel."\n' +
        '"Albert Einstein","Try not to become a man of success, but rather try to become a man of value."\n' +
        '"Sophocles","Men of perverse opinion do not know the excellence of what is in their hands, till some one dash it from them."\n' +
        '"Rene Descartes","It is not enough to have a good mind; the main thing is to use it well."\n' +
        '"Byron Pulsifer","Responsibility is not inherited, it is a choice that everyone needs to make at some point in their life."\n' +
        '"Amelia Earhart","Never do things others can do and will do, if there are things others cannot do or will not do."\n' +
        '"Jimmy Dean","I can\'t change the direction of the wind, but I can adjust my sails to always reach my destination."\n' +
        '"George Allen","People of mediocre ability sometimes achieve outstanding success because they don\'t know when to quit. Most men succeed because they are determined to."\n' +
        '"Joseph Roux","A fine quotation is a diamond on the finger of a man of wit, and a pebble in the hand of a fool."\n' +
        '"Bernice Reagon","Life\'s challenges are not supposed to paralyse you, they\'re supposed to help you discover who you are."\n' +
        '"Socrates","The greatest way to live with honour in this world is to be what we pretend to be."\n' +
        '"Henri Bergson","To exist is to change, to change is to mature, to mature is to go on creating oneself endlessly."\n' +
        '"Albert Einstein","Try not to become a man of success but rather try to become a man of value."\n' +
        '"Byron Pulsifer","You can\'t create in a vacuum. Life gives you the material and dreams can propel new beginnings."\n' +
        '"Buddha","Your work is to discover your world and then with all your heart give yourself to it."\n' +
        '"Daisaku Ikeda","The person who lives life fully, glowing with life\'s energy, is the person who lives a successful life."\n' +
        '"Richard Bach","Don\'t turn away from possible futures before you\'re certain you don\'t have anything to learn from them."\n' +
        '"David Brinkley","A successful person is one who can lay a firm foundation with the bricks that others throw at him or her."\n' +
        '"Buddha","All that we are is the result of what we have thought. The mind is everything. What we think we become."\n' +
        '"Henri-Frederic Amiel","Work while you have the light. You are responsible for the talent that has been entrusted to you."\n' +
        '"William Shakespeare","How far that little candle throws its beams! So shines a good deed in a naughty world."\n' +
        '"Napoleon Hill","Every adversity, every failure, every heartache carries with it the seed of an equal or greater benefit."\n' +
        '"Tony Robbins","It is in your moments of decision that your destiny is shaped."\n' +
        '"Pierre Auguste Renoir","The pain passes, but the beauty remains."\n' +
        '"Bob Newhart","All I can say about life is, Oh God, enjoy it!"\n' +
        '"Rita Mae Brown","Creativity comes from trust. Trust your instincts. And never hope more than you work."\n' +
        '"Lululemon","Your outlook on life is a direct reflection on how much you like yourself."\n' +
        '"Lao Tzu","I have just three things to teach: simplicity, patience, compassion. These three are your greatest treasures."\n' +
        '"Kin Hubbard","You won\'t skid if you stay in a rut."\n' +
        '"Mary Morrissey","You block your dream when you allow your fear to grow bigger than your faith."\n' +
        '"Aristotle","Happiness depends upon ourselves."\n' +
        '"Albert Schweitzer","Wherever a man turns he can find someone who needs him."\n' +
        '"Maya Angelou","If one is lucky, a solitary fantasy can totally transform one million realities."\n' +
        '"Leo Buscaglia","Never idealize others. They will never live up to your expectations."\n' +
        '"Lao Tzu","When you realize there is nothing lacking, the whole world belongs to you."\n' +
        '"Dalai Lama","Happiness is not something ready made. It comes from your own actions."\n' +
        '"Peter Elbow","Meaning is not what you start with but what you end up with."\n' +
        '"Anne Frank","No one has ever become poor by giving."\n' +
        '"Mother Teresa","Be faithful in small things because it is in them that your strength lies."\n' +
        '"Heraclitus","All is flux; nothing stays still."\n' +
        '"Leonardo da Vinci","He who is fixed to a star does not change his mind."\n' +
        '"Marcus Aurelius","He who lives in harmony with himself lives in harmony with the universe."\n' +
        '"Sophocles","Ignorant men don\'t know what good they hold in their hands until they\'ve flung it away."\n' +
        '"Albert Einstein","When the solution is simple, God is answering."\n' +
        '"Napoleon Hill","All achievements, all earned riches, have their beginning in an idea."\n' +
        '"Publilius Syrus","Do not turn back when you are just at the goal."\n' +
        '"Byron Pulsifer","You can\'t trust without risk but neither can you live in a cocoon."\n' +
        '"Rudolf Arnheim","All perceiving is also thinking, all reasoning is also intuition, all observation is also invention."\n' +
        '"Channing","Error is discipline through which we advance."\n' +
        '"Pearl Buck","The truth is always exciting. Speak it, then. Life is dull without it."\n' +
        '"Confucius","The superior man is modest in his speech, but exceeds in his actions."\n' +
        '"Voltaire","The longer we dwell on our misfortunes, the greater is their power to harm us."\n' +
        '"Cervantes","Those who will play with cats must expect to be scratched."\n' +
        '"Aristotle","In all things of nature there is something of the marvellous."\n' +
        '"Marcus Aurelius","The universe is transformation; our life is what our thoughts make it."\n' +
        '"Samuel Johnson","Memory is the mother of all wisdom."\n' +
        '"Confucius","Silence is the true friend that never betrays."\n' +
        '"Napoleon Hill","You might well remember that nothing can bring you success but yourself."\n' +
        '"Benjamin Franklin","Watch the little things; a small leak will sink a great ship."\n' +
        '"William Shakespeare","God has given you one face, and you make yourself another."\n' +
        '"Confucius","To be wronged is nothing unless you continue to remember it."\n' +
        '"Tehyi Hsieh","Action will remove the doubts that theory cannot solve."\n' +
        '"Napoleon Hill","Your big opportunity may be right where you are now."\n' +
        '"Chinese proverb","People who say it cannot be done should not interrupt those who are doing it."\n' +
        '"Japanese proverb","The day you decide to do it is your lucky day."\n' +
        '"Cicero","We must not say every mistake is a foolish one."\n' +
        '"George Patton","Accept challenges, so that you may feel the exhilaration of victory."\n' +
        '"Anatole France","It is better to understand a little than to misunderstand a lot."\n' +
        '"Johann Wolfgang von Goethe","Correction does much, but encouragement does more."\n' +
        '"Epictetus","Know, first, who you are, and then adorn yourself accordingly."\n' +
        '"Oprah Winfrey","The biggest adventure you can ever take is to live the life of your dreams."\n' +
        '"Charles Swindoll","Life is 10% what happens to you and 90% how you react to it."\n' +
        '"Cynthia Ozick","To want to be what one can be is purpose in life."\n' +
        '"Dalai Lama","Remember that sometimes not getting what you want is a wonderful stroke of luck."\n' +
        '"Winston Churchill","History will be kind to me for I intend to write it."\n' +
        '"Wayne Dyer","Our lives are a sum total of the choices we have made."\n' +
        '"Leonardo da Vinci","Time stays long enough for anyone who will use it."\n' +
        '"Denis Waitley","You must welcome change as the rule but not as your ruler."\n' +
        '"Jim Rohn","Give whatever you are doing and whoever you are with the gift of your attention."\n' +
        '"Lena Horne","Always be smarter than the people who hire you."\n' +
        '"Tom Peters","Formula for success: under promise and over deliver."\n' +
        '"Henri Bergson","The eye sees only what the mind is prepared to comprehend."\n' +
        '"Lee Mildon","People seldom notice old clothes if you wear a big smile."\n' +
        '"Shakti Gawain","The more light you allow within you, the brighter the world you live in will be."\n' +
        '"Walter Anderson","Nothing diminishes anxiety faster than action."\n' +
        '"Andre Gide","Man cannot discover new oceans unless he has the courage to lose sight of the shore."\n' +
        '"Carl Jung","Everything that irritates us about others can lead us to an understanding about ourselves."\n' +
        '"Sun Tzu","Can you imagine what I would do if I could do all I can?"\n' +
        '"Benjamin Disraeli","Ignorance never settle a question."\n' +
        '"Paul Cezanne","The awareness of our own strength makes us modest."\n' +
        '"Confucius","They must often change, who would be constant in happiness or wisdom."\n' +
        '"Tom Krause","There are no failures. Just experiences and your reactions to them."\n' +
        '"Frank Tyger","Your future depends on many things, but mostly on you."\n' +
        '"Dorothy Thompson","Fear grows in darkness; if you think theres a bogeyman around, turn on the light."\n' +
        '"Shunryu Suzuki","The most important point is to accept yourself and stand on your two feet."\n' +
        '"Tomas Eliot","Do not expect the world to look bright, if you habitually wear gray-brown glasses."\n' +
        '"Donald Trump","As long as your going to be thinking anyway, think big."\n' +
        '"John Dewey","Without some goals and some efforts to reach it, no man can live."\n' +
        '"Richard Braunstein","He who obtains has little. He who scatters has much."\n' +
        '"George Orwell","Myths which are believed in tend to become true."\n' +
        '"Buddha","The foot feels the foot when it feels the ground."\n' +
        '"John Petit-Senn","Not what we have but what we enjoy constitutes our abundance."\n' +
        '"George Eliot","It is never too late to be what you might have been."\n' +
        '"Mary Wollstonecraft","The beginning is always today."\n' +
        '"Sheldon Kopp","In the long run we get no more than we have been willing to risk giving."\n' +
        '"Ralph Emerson","Self-trust is the first secret of success."\n' +
        '"Satchel Paige","Don\'t look back. Something might be gaining on you."\n' +
        '"Marcus Aurelius","Look back over the past, with its changing empires that rose and fell, and you can foresee the future, too."\n' +
        '"George Bernard Shaw","A life spent making mistakes is not only more honourable, but more useful than a life spent doing nothing."\n' +
        '"Epictetus","Men are disturbed not by things, but by the view which they take of them."\n' +
        '"Blaise Pascal","Imagination disposes of everything; it creates beauty, justice, and happiness, which are everything in this world."\n' +
        '"Mark Twain","Happiness is a Swedish sunset, it is there for all, but most of us look the other way and lose it."\n' +
        '"Byron Pulsifer","Look forward to spring as a time when you can start to see what nature has to offer once again."\n' +
        '"Billy Wilder","Trust your own instinct. Your mistakes might as well be your own, instead of someone elses."\n' +
        '"Blaise Pascal","The least movement is of importance to all nature. The entire ocean is affected by a pebble."\n' +
        '"Pablo Picasso","I am always doing that which I can not do, in order that I may learn how to do it."\n' +
        '"Niccolo Machiavelli","Men in general judge more from appearances than from reality. All men have eyes, but few have the gift of penetration."\n' +
        '"Henry Ward Beecher","Every artist dips his brush in his own soul, and paints his own nature into his pictures."\n' +
        '"James Faust","If you take each challenge one step at a time, with faith in every footstep, your strength and understanding will increase."\n' +
        '"Denis Waitley","Happiness cannot be travelled to, owned, earned, worn or consumed. Happiness is the spiritual experience of living every minute with love, grace and gratitude."\n' +
        '"Hasidic saying","Everyone should carefully observe which way his heart draws him, and then choose that way with all his strength."\n' +
        '"Joseph Campbell","When we quit thinking primarily about ourselves and our own self-preservation, we undergo a truly heroic transformation of consciousness."\n' +
        '"Dhammapada","Do not give your attention to what others do or fail to do; give it to what you do or fail to do."\n' +
        '"Peter Drucker","Follow effective action with quiet reflection. From the quiet reflection will come even more effective action."\n' +
        '"Bernice Reagon","Life\'s challenges are not supposed to paralyze you, they\'re supposed to help you discover who you are."\n' +
        '"Fannie Hamer","There is one thing you have got to learn about our movement. Three people are better than no people."\n' +
        '"Ralph Waldo Emerson","Happiness is a perfume you cannot pour on others without getting a few drops on yourself."\n' +
        '"Byron Roberts","It is not the mistake that has the most power, instead, it is learning from the mistake to advance your own attributes."\n' +
        '"Thich Nhat Hanh","The amount of happiness that you have depends on the amount of freedom you have in your heart."\n' +
        '"Carl Jung","Your vision will become clear only when you look into your heart. Who looks outside, dreams. Who looks inside, awakens."\n' +
        '"Babatunde Olatunji","Yesterday is history. Tomorrow is a mystery. And today? Today is a gift. That is why we call it the present."\n' +
        '"Tony Robbins","The way we communicate with others and with ourselves ultimately determines the quality of our lives."\n' +
        '"Tony Blair","Sometimes it is better to lose and do the right thing than to win and do the wrong thing."\n' +
        '"Mother Teresa","Let us always meet each other with smile, for the smile is the beginning of love."\n' +
        '"Aristotle","We are what we repeatedly do. Excellence, then, is not an act, but a habit."\n' +
        '"Ray Bradbury","Living at risk is jumping off the cliff and building your wings on the way down."\n' +
        '"Albert Camus","In the depth of winter, I finally learned that there was within me an invincible summer."\n' +
        '"Madame de Stael","Wit lies in recognizing the resemblance among things which differ and the difference between things which are alike."\n' +
        '"Elbert Hubbard","A failure is a man who has blundered but is not capable of cashing in on the experience."\n' +
        '"Herbert Swope","I cannot give you the formula for success, but I can give you the formula for failure: which is: Try to please everybody."\n' +
        '"Laozi","The power of intuitive understanding will protect you from harm until the end of your days."\n' +
        '"Abraham Lincoln","The best thing about the future is that it only comes one day at a time."\n' +
        '"Epictetus","We have two ears and one mouth so that we can listen twice as much as we speak."\n' +
        '"Byron Pulsifer","Fear of failure is one attitude that will keep you at the same point in your life."\n' +
        '"Ed Cunningham","Friends are those rare people who ask how we are and then wait to hear the answer."\n' +
        '"Pema Chodron","If we learn to open our hearts, anyone, including the people who drive us crazy, can be our teacher."\n' +
        '"Eleanor Roosevelt","People grow through experience if they meet life honestly and courageously. This is how character is built."\n' +
        '"Ralph Waldo Emerson","A hero is no braver than an ordinary man, but he is braver five minutes longer."\n' +
        '"Angela Schwindt","While we try to teach our children all about life, our children teach us what life is all about."\n' +
        '"Wayne Dyer","When you dance, your purpose is not to get to a certain place on the floor. It\'s to enjoy each step along the way."\n' +
        '"Dalai Lama","Genuine love should first be directed at oneself, if we do not love ourselves, how can we love others?"\n' +
        '"Orison Marden","The Creator has not given you a longing to do that which you have no ability to do."\n' +
        '"Sam Levenson","It\'s so simple to be wise. Just think of something stupid to say and then don\'t say it."\n' +
        '"Dalai Lama","Consider that not only do negative thoughts and emotions destroy our experience of peace, they also undermine our health."\n' +
        '"Doris Mortman","Until you make peace with who you are, you will never be content with what you have."\n' +
        '"Buddha","No one saves us but ourselves. No one can and no one may. We ourselves must walk the path."\n' +
        '"Henry Miller","The moment one gives close attention to anything, it becomes a mysterious, awesome, indescribably magnificent world in itself."\n' +
        '"Mohandas Gandhi","Happiness is when what you think, what you say, and what you do are in harmony."\n' +
        '"Dalai Lama","The greatest antidote to insecurity and the sense of fear is compassion, it brings one back to the basis of one\'s inner strength"\n' +
        '"Byron Pulsifer","To be thoughtful and kind only takes a few seconds compared to the timeless hurt caused by one rude gesture."\n' +
        '"Mortimer Adler","The purpose of learning is growth, and our minds, unlike our bodies, can continue growing as we continue to live."\n' +
        '"Buddha","When you realize how perfect everything is you will tilt your head back and laugh at the sky."\n' +
        '"Mary Kay Ash","For every failure, there\'s an alternative course of action. You just have to find it. When you come to a roadblock, take a detour."\n' +
        '"Walter Linn","It is surprising what a man can do when he has to, and how little most men will do when they don\'t have to."\n' +
        '"Tenzin Gyatso","To be aware of a single shortcoming in oneself is more useful than to be aware of a thousand in someone else."\n' +
        '"Edmund Burke","Nobody made a greater mistake than he who did nothing because he could do only a little."\n' +
        '"Albert Schweitzer","Constant kindness can accomplish much. As the sun makes ice melt, kindness causes misunderstanding, mistrust, and hostility to evaporate."\n' +
        '"Rene Descartes","The greatest minds are capable of the greatest vices as well as of the greatest virtues."\n' +
        '"Albert Einstein","A man should look for what is, and not for what he thinks should be."\n' +
        '"William Channing","Difficulties are meant to rouse, not discourage. The human spirit is to grow strong by conflict."\n' +
        '"Byron Pulsifer","If you have no respect for your own values how can you be worthy of respect from others."\n' +
        '"Alphonse Karr","Some people are always grumbling because roses have thorns; I am thankful that thorns have roses."\n' +
        '"W. H. Auden","To choose what is difficult all ones days, as if it were easy, that is faith."\n' +
        '"Lou Holtz","Ability is what you\'re capable of doing. Motivation determines what you do.Attitude determines how well you do it."\n' +
        '"Thomas Carlyle","Do not be embarrassed by your mistakes. Nothing can teach us better than our understanding of them. This is one of the best ways of self-education."\n' +
        '"Buddha","Thousands of candles can be lighted from a single candle, and the life of the candle will not be shortened. Happiness never decreases by being shared."\n' +
        '"Michel de Montaigne","I care not so much what I am to others as what I am to myself. I will be rich by myself, and not by borrowing."\n' +
        '"Margaret Laurence","Know that although in the eternal scheme of things you are small, you are also unique and irreplaceable, as are all your fellow humans everywhere in the world."\n' +
        '"Napoleon Bonaparte","To do all that one is able to do, is to be a man; to do all that one would like to do, is to be a god."\n' +
        '"Ajahn Chah","If you let go a little, you will have a little peace. If you let go a lot, you will have a lot of peace."\n' +
        '"Dalai Lama","There is no need for temples, no need for complicated philosophies. My brain and my heart are my temples; my philosophy is kindness."\n' +
        '"Vincent Lombardi","The spirit, the will to win, and the will to excel, are the things that endure. These qualities are so much more important than the events that occur."\n' +
        '"Jean-Paul Sartre","Man is not sum of what he has already, but rather the sum of what he does not yet have, of what he could have."\n' +
        '"Richard Bach","Don\'t believe what your eyes are telling you. All they show is limitation. Look with your understanding, find out what you already know, and you\'ll see the way to fly."\n' +
        '"Elisabeth Kubler-Ross","I believe that we are solely responsible for our choices, and we have to accept the consequences of every deed, word, and thought throughout our lifetime."\n' +
        '"Byron Pulsifer","Wishes can be your best avenue of getting what you want when you turn wishes into action. Action moves your wish to the forefront from thought to reality."\n' +
        '"Kahlil Gibran","To understand the heart and mind of a person, look not at what he has already achieved, but at what he aspires to do."\n' +
        '"Bernard Shaw","I am of the opinion that my life belongs to the community, and as long as I live it is my privilege to do for it whatever I can."\n' +
        '"Albert Einstein","Imagination is more important than knowledge. For while knowledge defines all we currently know and understand, imagination points to all we might yet discover and create."\n' +
        '"Confucius","When you see a good person, think of becoming like him. When you see someone not so good, reflect on your own weak points."\n' +
        '"Anne Lindbergh","If one is estranged from oneself, then one is estranged from others too. If one is out of touch with oneself, then one cannot touch others."\n' +
        '"Dale Carnegie","Most of the important things in the world have been accomplished by people who have kept on trying when there seemed to be no hope at all."\n' +
        '"John Lennon","You may say Im a dreamer, but Im not the only one, I hope someday you will join us, and the world will live as one."\n' +
        '"Nathaniel Hawthorne","Happiness is as a butterfly which, when pursued, is always beyond our grasp, but which if you will sit down quietly, may alight upon you."\n' +
        '"Buddha","He who experiences the unity of life sees his own Self in all beings, and all beings in his own Self, and looks on everything with an impartial eye."\n' +
        '"Buddha","In the sky, there is no distinction of east and west; people create distinctions out of their own minds and then believe them to be true."\n' +
        '"Caroline Myss","You cannot change anything in your life with intention alone, which can become a watered-down, occasional hope that you\'ll get to tomorrow. Intention without action is useless."\n' +
        '"Winston Churchill","Before you can inspire with emotion, you must be swamped with it yourself. Before you can move their tears, your own must flow. To convince them, you must yourself believe."\n' +
        '"William James","The greatest discovery of our generation is that human beings can alter their lives by altering their attitudes of mind. As you think, so shall you be."\n' +
        '"Henry David Thoreau","If one advances confidently in the direction of his dream, and endeavours to live the life which he had imagines, he will meet with a success unexpected in common hours."\n' +
        '"Pearl Buck","The secret of joy in work is contained in one word, excellence. To know how to do something well is to enjoy it."\n' +
        '"Confucius","When you meet someone better than yourself, turn your thoughts to becoming his equal. When you meet someone not as good as you are, look within and examine your own self."\n' +
        '"Uta Hagen","We must overcome the notion that we must be regular. It robs you of the chance to be extraordinary and leads you to the mediocre."\n' +
        '"Orison Marden","Most of our obstacles would melt away if, instead of cowering before them, we should make up our minds to walk boldly through them."\n' +
        '"Victor Frankl","Everything can be taken from a man but ... the last of the human freedoms, to choose ones attitude in any given set of circumstances, to choose ones own way."\n' +
        '"Edward de Bono","It is better to have enough ideas for some of them to be wrong, than to be always right by having no ideas at all."\n' +
        '"Abraham Lincoln","Character is like a tree and reputation like a shadow. The shadow is what we think of it; the tree is the real thing."\n' +
        '"Lao Tzu","By letting it go it all gets done. The world is won by those who let it go. But when you try and try. The world is beyond the winning."\n' +
        '"Amy Tan","I am like a falling star who has finally found her place next to another in a lovely constellation, where we will sparkle in the heavens forever."\n' +
        '"Epictetus","Not every difficult and dangerous thing is suitable for training, but only that which is conducive to success in achieving the object of our effort."\n' +
        '"Stephen Covey","We are not animals. We are not a product of what has happened to us in our past. We have the power of choice."\n' +
        '"Paul Graham","The most dangerous way to lose time is not to spend it having fun, but to spend it doing fake work. When you spend time having fun, you know you\'re being self-indulgent."\n' +
        '"Buddha","Thousands of candles can be lit from a single, and the life of the candle will not be shortened. Happiness never decreases by being shared."\n' +
        '"Chuck Norris","A lot of times people look at the negative side of what they feel they can\'t do. I always look on the positive side of what I can do."\n' +
        '"Amiel","Without passion man is a mere latent force and possibility, like the flint which awaits the shock of the iron before it can give forth its spark."\n' +
        '"Amy Bloom","Love at first sight is easy to understand; its when two people have been looking at each other for a lifetime that it becomes a miracle."\n' +
        '"Keshavan Nair","With courage you will dare to take risks, have the strength to be compassionate, and the wisdom to be humble. Courage is the foundation of integrity."\n' +
        '"Margaret Smith","The right way is not always the popular and easy way. Standing for right when it is unpopular is a true test of moral character."\n' +
        '"Frederick Douglass","I prefer to be true to myself, even at the hazard of incurring the ridicule of others, rather than to be false, and to incur my own abhorrence."\n' +
        '"Helen Keller","No pessimist ever discovered the secrets of the stars, or sailed to an uncharted land, or opened a new heaven to the human spirit."\n' +
        '"Marcus Aurelius","When you arise in the morning, think of what a precious privilege it is to be alive, to breathe, to think, to enjoy, to love."\n' +
        '"Helen Keller","Character cannot be developed in ease and quiet. Only through experience of trial and suffering can the soul be strengthened, vision cleared, ambition inspired, and success achieved."\n' +
        '"Oprah Winfrey","Although there may be tragedy in your life, there\'s always a possibility to triumph. It doesn\'t matter who you are, where you come from. The ability to triumph begins with you. Always."\n' +
        '"Ingrid Bergman","You must train your intuition, you must trust the small voice inside you which tells you exactly what to say, what to decide."\n' +
        '"Marcus Aurelius","Accept the things to which fate binds you, and love the people with whom fate brings you together, but do so with all your heart."\n' +
        '"John Kennedy","Let us resolve to be masters, not the victims, of our history, controlling our own destiny without giving way to blind suspicions and emotions."\n' +
        '"Marie Curie","Nothing in life is to be feared, it is only to be understood. Now is the time to understand more, so that we may fear less."\n' +
        '"Anne Frank","Parents can only give good advice or put them on the right paths, but the final forming of a persons character lies in their own hands."\n' +
        '"Byron Pulsifer","Adversity isn\'t set against you to fail; adversity is a way to build your character so that you can succeed over and over again through perseverance."\n' +
        '"Robert Fulghum","If you break your neck, if you have nothing to eat, if your house is on fire, then you got a problem. Everything else is inconvenience."\n' +
        '"Albert Schweitzer","Success is not the key to happiness. Happiness is the key to success. If you love what you are doing, you will be successful."\n' +
        '"Albert Einstein","If A is success in life, then A equals x plus y plus z. Work is x; y is play; and z is keeping your mouth shut."\n' +
        '"Thornton Wilder","My advice to you is not to inquire why or whither, but just enjoy your ice cream while its on your plate, that\'s my philosophy."\n' +
        '"John Dewey","Conflict is the gadfly of thought. It stirs us to observation and memory. It instigates to invention. It shocks us out of sheeplike passivity, and sets us at noting and contriving."\n' +
        '"Lao Tzu","He who conquers others is strong; He who conquers himself is mighty."\n' +
        '"Wayne Dyer","Anything you really want, you can attain, if you really go after it."\n' +
        '"John Dewey","Arriving at one point is the starting point to another."\n' +
        '"James Oppenheim","The foolish man seeks happiness in the distance, the wise grows it under his feet."\n' +
        '"Martha Washington","The greatest part of our happiness depends on our dispositions, not our circumstances."\n' +
        '"Margaret Bonnano","It is only possible to live happily ever after on a day to day basis."\n' +
        '"Goethe","A man sees in the world what he carries in his heart."\n' +
        '"Benjamin Disraeli","Action may not always bring happiness, but there is no happiness without action."\n' +
        '"Joe Paterno","Believe deep down in your heart that you\'re destined to do great things."\n' +
        '"Richard Bach","Sooner or later, those who win are those who think they can."\n' +
        '"Tony Robbins","The only limit to your impact is your imagination and commitment."\n' +
        '"Cathy Pulsifer","You are special, you are unique, you are the best!"\n' +
        '"William Arthur Ward","Four steps to achievement: Plan purposefully. Prepare prayerfully. Proceed positively. Pursue persistently."\n' +
        '"Bruce Lee","To know oneself is to study oneself in action with another person."\n' +
        '"Bishop Desmond Tutu","We must not allow ourselves to become like the system we oppose."\n' +
        '"Thich Nhat Hanh","Smile, breathe and go slowly."\n' +
        '"Albert Einstein","Reality is merely an illusion, albeit a very persistent one."\n' +
        '"Franklin Roosevelt","When you come to the end of your rope, tie a knot and hang on."\n' +
        '"Buddha","Always be mindful of the kindness and not the faults of others."\n' +
        '"Carl Jung","Everything that irritates us about others can lead us to an understanding of ourselves."\n' +
        '"Dale Carnegie","When fate hands us a lemon, lets try to make lemonade."\n' +
        '"Mohandas Gandhi","The weak can never forgive. Forgiveness is the attribute of the strong."\n' +
        '"Chanakya","A man is great by deeds, not by birth."\n' +
        '"Dale Carnegie","Success is getting what you want. Happiness is wanting what you get."\n' +
        '"Byron Pulsifer","Truth isn\'t all about what actually happens but more about how what has happened is interpreted."\n' +
        '"Robert Stevenson","Don\'t judge each day by the harvest you reap but by the seeds that you plant."\n' +
        '"Demosthenes","Small opportunities are often the beginning of great enterprises."\n' +
        '"Gail Sheehy","To be tested is good. The challenged life may be the best therapist."\n' +
        '"English proverb","Take heed: you do not find what you do not seek."\n' +
        '"Richard Bach","Happiness is the reward we get for living to the highest right we know."\n' +
        '"Cervantes","Be slow of tongue and quick of eye."\n' +
        '"Mohandas Gandhi","Freedom is not worth having if it does not connote freedom to err."\n' +
        '"John Locke","I have always thought the actions of men the best interpreters of their thoughts."\n' +
        '"Soren Kierkegaard","To dare is to lose ones footing momentarily. To not dare is to lose oneself."\n' +
        '"David Eddings","No day in which you learn something is a complete loss."\n' +
        '"Albert Einstein","Peace cannot be kept by force. It can only be achieved by understanding."\n' +
        '"David McCullough","Real success is finding your lifework in the work that you love."\n' +
        '"Buddha","Better than a thousand hollow words, is one word that brings peace."\n' +
        '"Joseph Campbell","Your sacred space is where you can find yourself again and again."\n' +
        '"Bruce Lee","As you think, so shall you become."\n' +
        '"William Blake","In seed time learn, in harvest teach, in winter enjoy."\n' +
        '"Cheng Yen","Happiness does not come from having much, but from being attached to little."\n' +
        '"Richard Bach","Every gift from a friend is a wish for your happiness."\n' +
        '"Ralph Emerson","Go put your creed into the deed. Nor speak with double tongue."\n' +
        '"Euripides","The wisest men follow their own direction."\n' +
        '"William Sloane Coffin","Hope arouses, as nothing else can arouse, a passion for the possible."\n' +
        '"Confucius","Everything has beauty, but not everyone sees it."\n' +
        '"Pema Chodron","Nothing ever goes away until it has taught us what we need to know."\n' +
        '"Maya Angelou","When you learn, teach. When you get, give."\n' +
        '"Dorothy Thompson","Only when we are no longer afraid do we begin to live."\n' +
        '"Andy Rooney","If you smile when no one else is around, you really mean it."\n' +
        '"Martin Luther King, Jr.","Love is the only force capable of transforming an enemy into friend."\n' +
        '"Carl Jung","In all chaos there is a cosmos, in all disorder a secret order."\n' +
        '"Winston Churchill","The price of greatness is responsibility."\n' +
        '"Paul Tillich","Decision is a risk rooted in the courage of being free."\n' +
        '"William Burroughs","Your mind will answer most questions if you learn to relax and wait for the answer."\n' +
        '"Albert Einstein","We cannot solve our problems with the same thinking we used when we created them."\n' +
        '"Richard Bach","Learning is finding out what you already know."\n' +
        '"Alfred Painter","Saying thank you is more than good manners. It is good spirituality."\n' +
        '"Lao Tzu","Silence is a source of great strength."\n' +
        '"Anne Lamott","Joy is the best makeup."\n' +
        '"Seneca","There is no great genius without some touch of madness."\n' +
        '"Buddha","A jug fills drop by drop."\n' +
        '"Doris Mortman","Until you make peace with who you are, you\'ll never be content with what you have."\n' +
        '"Ralph Emerson","We aim above the mark to hit the mark."\n' +
        '"Catherine Pulsifer","Being angry never solves anything."\n' +
        '"Orison Marden","All men who have achieved great things have been great dreamers."\n' +
        '"Arthur Conan Doyle","Mediocrity knows nothing higher than itself, but talent instantly recognizes genius."\n' +
        '"Walter Lippmann","Where all think alike, no one thinks very much."\n' +
        '"Marcus Aurelius","Everything that exists is in a manner the seed of that which will be."\n' +
        '"Marie Curie","Be less curious about people and more curious about ideas."\n' +
        '"Charles Perkhurst","The heart has eyes which the brain knows nothing of."\n' +
        '"Robert Kennedy","Only those who dare to fail greatly can ever achieve greatly."\n' +
        '"Richard Whately","Lose an hour in the morning, and you will spend all day looking for it."\n' +
        '"Bruce Lee","Mistakes are always forgivable, if one has the courage to admit them."\n' +
        '"William Shakespeare","Go to your bosom: Knock there, and ask your heart what it doth know."\n' +
        '"Dalai Lama","Happiness mainly comes from our own attitude, rather than from external factors."\n' +
        '"Lao Tzu","If you do not change direction, you may end up where you are heading."\n' +
        '"Marsha Petrie Sue","Stay away from what might have been and look at what will be."\n' +
        '"William James","Act as if what you do makes a difference. It does."\n' +
        '"Byron Pulsifer","Passion creates the desire for more and action fuelled by passion creates a future."\n' +
        '"Alexander Pope","Do good by stealth, and blush to find it fame."\n' +
        '"Napoleon Hill","Opportunity often comes disguised in the form of misfortune, or temporary defeat."\n' +
        '"Thomas Jefferson","Don\'t talk about what you have done or what you are going to do."\n' +
        '"Seneca","Most powerful is he who has himself in his own power."\n' +
        '"Bernard Shaw","We don\'t stop playing because we grow old; we grow old because we stop playing."\n' +
        '"Byron Pulsifer","Experience can only be gained by doing not by thinking or dreaming."\n' +
        '"Mark Twain","Always tell the truth. That way, you don\'t have to remember what you said."\n' +
        '"Lao Tzu","From wonder into wonder existence opens."\n' +
        '"Napoleon Bonaparte","He who fears being conquered is sure of defeat."\n' +
        '"John Lennon","Life is what happens while you are making other plans."\n' +
        '"Wayne Dyer","Doing what you love is the cornerstone of having abundance in your life."\n' +
        '"Johann Wolfgang von Goethe","Kindness is the golden chain by which society is bound together."\n' +
        '"Nietzsche","You need chaos in your soul to give birth to a dancing star."\n' +
        '"Byron Pulsifer","It can\'t be spring if your heart is filled with past failures."\n' +
        '"Brendan Francis","No yesterdays are ever wasted for those who give themselves to today."\n' +
        '"Tom Krause","There are no failures, just experiences and your reactions to them."\n' +
        '"Pablo Picasso","Action is the foundational key to all success."\n' +
        '"Abraham Maslow","What is necessary to change a person is to change his awareness of himself."\n' +
        '"Zig Ziglar","Positive thinking will let you do everything better than negative thinking will."\n' +
        '"Mother Teresa","We shall never know all the good that a simple smile can do."\n' +
        '"Frances de Sales","Nothing is so strong as gentleness. Nothing is so gentle as real strength."\n' +
        '"Ralph Waldo Emerson","Imagination is not a talent of some men but is the health of every man."\n' +
        '"Kenji Miyazawa","We must embrace pain and burn it as fuel for our journey."\n' +
        '"Chinese proverb","A gem cannot be polished without friction, nor a man perfected without trials."\n' +
        '"George Matthew Adams","Each day can be one of triumph if you keep up your interests."\n' +
        '"Robert M. Pirsig","The place to improve the world is first in one\'s own heart and head and hands."\n' +
        '"Winston Churchill","The pessimist sees difficulty in every opportunity. The optimist sees the opportunity in every difficulty."\n' +
        '"Albert Gray","Winners have simply formed the habit of doing things losers don\'t like to do."\n' +
        '"Ralph Emerson","Nature is a mutable cloud which is always and never the same."\n' +
        '"Grandma Moses","Life is what you make of it. Always has been, always will be."\n' +
        '"Swedish proverb","Worry often gives a small thing a big shadow."\n' +
        '"Confucius","I want you to be everything that\'s you, deep at the center of your being."\n' +
        '"William Shakespeare","We know what we are, but know not what we may be."\n' +
        '"Jean-Paul Sartre","Freedom is what you do with what\'s been done to you."\n' +
        '"Felix Adler","The truth which has made us free will in the end make us glad also."\n' +
        '"Joseph Joubert","He who has imagination without learning has wings but no feet."\n' +
        '"Elizabeth Browning","Whoso loves, believes the impossible."\n' +
        '"Ella Fitzgerald","It isn\'t where you come from, it\'s where you\'re going that counts."\n' +
        '"Pema Chodron","The greatest obstacle to connecting with our joy is resentment."\n' +
        '"C. Pulsifer","When anger use your energy to do something productive."\n' +
        '"Blaise Pascal","We are all something, but none of us are everything."\n' +
        '"Albert Einstein","If you can\'t explain it simply, you don\'t understand it well enough."\n' +
        '"Marcus Aurelius","He who lives in harmony with himself lives in harmony with the world."\n' +
        '"Lao Tzu","He who knows himself is enlightened."\n' +
        '"Ralph Emerson","Build a better mousetrap and the world will beat a path to your door."\n' +
        '"Abraham Lincoln","As our case is new, we must think and act anew."\n' +
        '"Mother Teresa","If you can\'t feed a hundred people, then feed just one."\n' +
        '"Robert Frost","In three words I can sum up everything Ive learned about life: it goes on."\n' +
        '"Tony Robbins","You always succeed in producing a result."\n' +
        '"Wayne Dyer","Everything you are against weakens you. Everything you are for empowers you."\n' +
        '"Fran Watson","As we risk ourselves, we grow. Each new experience is a risk."\n' +
        '"Mary Almanac","Who we are never changes. Who we think we are does."\n' +
        '"Elbert Hubbard","The final proof of greatness lies in being able to endure criticism without resentment."\n' +
        '"Victor Hugo","An invasion of armies can be resisted, but not an idea whose time has come."\n' +
        '"Ralph Marston","Excellence is not a skill. It is an attitude."\n' +
        '"Lewis Cass","People may doubt what you say, but they will believe what you do."\n' +
        '"Thomas Paine","The most formidable weapon against errors of every kind is reason."\n' +
        '"Danilo Dolci","It\'s important to know that words don\'t move mountains. Work, exacting work moves mountains."'
    var textByLine = text.split("\n");
    var randomQuoteAndAuthor = textByLine[Math.floor(Math.random() * 999)].split('","');
    var randomQuote = '"' + randomQuoteAndAuthor[1].substring(0, randomQuoteAndAuthor[1].length - 1);
    var randomAuthor = randomQuoteAndAuthor[0].substring(1,randomQuoteAndAuthor[0].length);
    var quoteAndAuthor = randomQuote + " -" + randomAuthor;

    document.getElementById("quote").innerHTML = quoteAndAuthor;
}