function Timey() {

    this.now = new Date();
    this.days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    this.months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
}

/* get the current day of the month as a numeric value
/
/	@return: 	a number between 1-31 representing the day of the month
*/
Timey.prototype.getDate = function () {

    return this.now.getDate();

}

/*
/	increments the day by one
/
*/
Timey.prototype.forwardDay = function () {

    if (this.getDate() + 1 > this.daysInCurrentMonth())
        return this.setMonth(this.getMonth() + 1, this.getDate() + 1);
    else
        this.setDate(this.getDate() + 1);
}

Timey.prototype.backDay = function () {
    if (this.getDate() - 1 === 0)
        this.setMonth(this.getMonth() + 1, -1);
    else
        this.setDate(this.getDate() - 1);
}

/*
/	sets a new date e.g. 31
/
/	@param		a number representing the new date
*/
Timey.prototype.setDate = function (date) {

    this.now.setDate(date)
}


/*
/	gets the the number of days in the current month
/
/	@return		the number of days in the current month
*/
Timey.prototype.daysInCurrentMonth = function () {

    return new Date(this.now.getFullYear(), this.now.getMonth() + 1, 0).getDate();

}

/* get the current day of the week as a numeric value
/
/	@return: 	a number between 0-6 representing the day of the week
*/
Timey.prototype.getDay = function () {

    return this.now.getDay();
}

/* add a leading zero to a number if it's a single digit
/
/	@param: 	number to add leading zeros to
/
/   @return: 	on success: the number with a leading zero (string)
/				on failure: the number (number)
*/
Timey.prototype.leadingZero = function (num) {

    var numStr = num.toString();

    if (numStr.match(/^[0-9]$/g))
        return "0" + numStr;
    else
        return num;
}

/* get the textual representation of the current day e.g. Friday
/
/	@return 	on success: the textual version of the numeric version of the current day
				on failure: false
*/
Timey.prototype.getTextualDay = function () {

    // the day as an integer value
    var day_number = this.now.getDay();

    if (day_number < this.days.length)
        return this.days[day_number];
    else
        return false;
}


/* get current month as a numeric value
/
/	@return: 	a number between 0-11 representing the month of the year
*/
Timey.prototype.getMonth = function () {

    return this.now.getMonth();

}

/* sets the current month 
/
/	@param		a number representing the month 0-11 and a number representing the day to start on e.g. 1-31
*/
Timey.prototype.setMonth = function (month, day) {

    if (day)
        this.now.setMonth(month, day);
    else
        this.now.setMonth(month, 1);
}

/* get the textual representation of the current month e.g. January
/
/	@return 	on success: the textual version of the numeric version of the current month
				on failure: false
*/
Timey.prototype.getTextualMonth = function () {

    // the month as an integer value
    var month_number = this.now.getMonth();

    if (month_number < this.months.length)
        return this.months[month_number];
    else
        return false;
}

/*
/	@param 	a full textual version of the month e.g. January
/	@return 	on success: a shortened versio of the passed month e.g. Jan
/				on failure: false 
/	
*/
Timey.prototype.getTextualShortMonth = function (textualMonth) {

    if (this.months.indexOf(textualMonth) !== -1)
        return textualMonth.substr(0, 3);
    else
        return false;

}

/* get the current year as a 4 digit number
/
/	@return: 	a 4 digit number representing the year e.g. 2015
*/
Timey.prototype.getFullYear = function () {

    return this.now.getFullYear();

}


/* generates a date in the requested format
/	
/	@param	a date format to parse
/   @return	the formatted date
*/
Timey.prototype.formatDate = function (dateFormat) {

    // the end result of parsing the passed date string
    var formatted_date = "";

	/*
		formats --
	
		DAYS
		d = day with leading zeros e.g. 01 - 31
		D = textual representation of day e.g. Monday, Tuesday
		j = day without leading zeros e.g. 1 - 31

		MONTHS
		m = month with leading zeros e.g. 01 - 12
		F = full text represenation e.g. January
		M = month short name e.g. Jan
		n = number month without leading zeros

		YEAR
		Y = 4 digit representation of year e.g. 2015
	*/

    // the date format object holding all possible format characters
    date_formats = {
        d: this.leadingZero(this.now.getDate()),
        D: this.getTextualDay(),
        j: this.now.getDate().toString(),
        m: this.leadingZero(this.now.getMonth() + 1),
        F: this.getTextualMonth(),
        M: this.getTextualShortMonth(this.getTextualMonth()),
        n: this.getMonth() + 1,
        Y: this.getFullYear()
    }


    for (var i = 0; i < dateFormat.length; i++)
        if (date_formats.hasOwnProperty(dateFormat[i]))
            formatted_date += date_formats[dateFormat[i]];
        else
            formatted_date += dateFormat[i];

    return formatted_date;

}




window.initialize = function () {
    //setUpInterface();

    // create a geocoder object
    var geocoder = new google.maps.Geocoder();

    // a reference to the form element on the page
    var address_form = document.getElementById("address_form");

    // get the address query
    var address = "";

    // the latlng object
    var latlng = "";

    // the found lat value
    var lat = "";

    // the found lng value
    var lng = "";

    // base url
    var endpoint = "https://api.forecast.io/forecast/0d1600b94e8755ddc5060393e2374d89/";

    // the options for the forecast io api request
    var options = {
        dataType: "jsonp"
    }

    // an array holding weekly information
    var weeklyForecast = [];


    // relevant weather borders to display
    var weatherBorders = {
        "clear-day": "border-yellow",
        "clear-night": "border-darkgray",
        "cloudy": "border-white",
        "default": "border-yellow",
        "fog": "border-white",
        "partly-cloudy-day": "border-yellow",
        "partly-cloudy-night": "border-darkgray",
        "rain": "border-blue",
        "sleet": "border-blue",
        "snow": "border-white",
        "wind": "border-white"
    }

    // an object consisting of weather icon urls
    var weatherIcons = {
        "clear-day": "https://lh3.googleusercontent.com/dtrq3qwdmFnw4pe3OBCl0nyjLOGZbyK2MeBHC4a_cSE0JIs5Dd4vCky5FkeB3TvnoBZgPbub5Gkw1uaA2slWQO3--V4B6I2Gb7Z7F3bKhRHmomMueUEe-UVsZUSokrEZd6ctmUPATpjtdk4GNqVKSp_KECDDCes3EMtc0s8DGDC5YvY3Rd_perbFiQDQcrH8Gwq5PUr8qQW_DuLmGhMU6JdHsH65k8emK6zR62ikILqP2nFevlEHm2lcrfbNY25y34uj8fxmaatWw_8GNjajf1R-f_d6d9zqsfjEQpr4eurJTd6PIMJza6_jnha6XAKCh9ckAxarpzx7OFl46fHs74lcGh6xJB-JhZJCQ5Pn42wNRdVp7i7TaG7Y0z6r9kQUMUICyL2ATRrZecQhw7C41mzdgXHMaYXLh0ARs8-ETl3v0ETWnEOLISEYFujJwoUmq_G1VxYBJ3mz5lLKyVEoGk6PZNzzX88Upr6jKAtYyodKm7FvFnVnT9xSMsv8nXW0Nmi4xflWrwbzDuhTkQ3TlHrK1o6noeilj9kYo9B5dQ=s128-no",
        "clear-night": "https://lh3.googleusercontent.com/q_PIjw9bq8FpjRip_bxePCtY4l-lc3r7B2EPq752t9zUBgs7VSB-zVMm5NjblusEkITQG04SagUXrmFXTn6BqIxLlFGkG0fNJlb3tZwggAvxElAi1_J7tl0dix77mhcIxxNbGxlVgPRc9exeYGPBms03vORjKKYuCTW5Zx3aNdLLtwVtp-pptRyg5bp8RlZBIiYVpsKQTdfFdpaqQ58QWPGPvq-rqnLQE9XIFqwHy6WJCby2Dcui1XKvOg3CrUjax8P7deUmX5M9HzVxevkrufmfJ3ncFpsjhN-6s3WRwlUfXKioIikGa2HijXz_62TmK1GCH7jsRE39ByMYUHnnqiM98BYY85BYf2TcJpbl63od4YxXMmCQb8K-imKQxtFdj2r9XnWd_B5YHogSW1bH0DQKDUAnFWGgMmtdyxJfhvuPeo87pUJgvd2xhhgRSDI28-2xPlfkEZnik2t9wq_NSccqUS52GqmCKodccxKJaLP8nSNpEo-Ie5EHJwMjWD8FEwTbAVZWWmcdT1BLUC1tiqJqNbzFibWSfWTwRZ5uYQ=s128-no",
        "cloudy": "https://lh3.googleusercontent.com/Vphk4CwElQvKyLcTyWHXESJGX4syY59DHh1c842c3FKnZ34xH5FvrpNdtO5zZj8k8bN3FSxH3t7r-JMCkOtI33D4bhaE9ResRp2uVtSEYdxmkmpK8sMA2FJMvdHABsrvpT6paKqrmSjpwvtPRZawio2lm7eSNKhwzxwDBe48jMXczS5M0KhWBquGPEubbM8fzw01zMkPCQO8MTaNQgzjcn2JNlVCfeUzIVqeIV-qxz8MAJS2XNboVJU-CA59K6VrnS5aPG_vVMrgapgLjun0gIwsay9Qysw4goNv-ibqEYECqWWAkP_MF5_--dPEBdEpDWPEaDBRDRrCWQVqLIXzpzOtiYR2oXk7uaiUECF2oDYkfv6EGnj4C1k-YBaenVFYeKk1GqFUM3ix4DrBbC5TZpYnxBdpOB7pdv_vT9EpFmc5nL5VebxxMJt2anMd6QIw2q5cdttn-gdA6bpycqhtJhHy5DUgZ7f88CRgiAT4kePNXef3qPDkj0eKMWtkd9hU9vI88WRLj-xyEhh_awtlPr9tX6hLWWssYRpvb4Y3mw=s128-no",
        "default": "https://lh3.googleusercontent.com/nRiCouECHPBPc_9cBut6KDuFSxl516nm6Y6jovE7aZ1uZQFTbYxnK7PDS1_jxVkszKn4358r2zWigGhjPOYFY3HcobgfWnwG6IXzoIYeNEG7Dy1yqjByZXIgcDROAQIqGPA5hY1pNrQ6Ms7FPGabU1LpdFsqE-ruECPPYPjTu1CNV-SsgWpBlXD2x40Kc4NwegGrdsgEL_yxShYh3UiJMy-KX0IHLaiGiIk0-fjZTfOhFpu8l0pccDCh3PmsihJXTue2YgthKwqBi09nuBULD3Zp0bqM8HuqlRWNHrGBjmQV9J_MWI9RDl9sAenjkw4JtoHnLggdXyYTkeayjyK7TMZPIRjOdxzVZdh_hK6GC3Skz5Rc8XVTXf07Yrtcrt9rwIT0xZKHKxQwPKuYR5Dx2hP6hW-Xe0HNDj6jrcXxJjAI49fZs16R8z7PrATThI4GQYzx5sjWZ3MXoLeoOqKjhFmkaRc8W-keJ2wkOx0zQkWebddY5U_VV1T2ml2MTEPHTqbPB-dUOtvUHO0e7SKQyMr9PbFiS9_gn_MpT4TXPQ=s128-no",
        "fog": "https://lh3.googleusercontent.com/Vphk4CwElQvKyLcTyWHXESJGX4syY59DHh1c842c3FKnZ34xH5FvrpNdtO5zZj8k8bN3FSxH3t7r-JMCkOtI33D4bhaE9ResRp2uVtSEYdxmkmpK8sMA2FJMvdHABsrvpT6paKqrmSjpwvtPRZawio2lm7eSNKhwzxwDBe48jMXczS5M0KhWBquGPEubbM8fzw01zMkPCQO8MTaNQgzjcn2JNlVCfeUzIVqeIV-qxz8MAJS2XNboVJU-CA59K6VrnS5aPG_vVMrgapgLjun0gIwsay9Qysw4goNv-ibqEYECqWWAkP_MF5_--dPEBdEpDWPEaDBRDRrCWQVqLIXzpzOtiYR2oXk7uaiUECF2oDYkfv6EGnj4C1k-YBaenVFYeKk1GqFUM3ix4DrBbC5TZpYnxBdpOB7pdv_vT9EpFmc5nL5VebxxMJt2anMd6QIw2q5cdttn-gdA6bpycqhtJhHy5DUgZ7f88CRgiAT4kePNXef3qPDkj0eKMWtkd9hU9vI88WRLj-xyEhh_awtlPr9tX6hLWWssYRpvb4Y3mw=s128-no",
        "partly-cloudy-day": "https://lh3.googleusercontent.com/xKdmZ_lkfkh8wBvzLr9VCttpUsjtqsh8lalnMWWDKhI3w07sSQrXQNotIUh5Ciptlzvlim-kIw8hsq43ln1mec2IjKvrCRqGzSydkQKlUxiar4ZBRoh1R0X8DPXGNwmLAPpRonhQHz2Od1mUo-TVuGkbhqIA_B__rTWwVEZl5EuCJc0754XXIkw-rDh0O9p70O7h5XmB4bCQu1H3xySsrfiny-hb93MnZKl-SXX4X6PYRoII4RDuuv3o6r16IrnBMKQ56I7ZNpFUhPeOuItqIrelVHbpM10DE0novMHFSPrRHAdeRKcDBohKwnRP6d9aWTgOsHUo_kSYQWRpmTt3t8QhrhSZcZt1V34PjF6LpZm_a4lHqDfnz2zOnrlZpMJRLQpJxzB97CYwQhbHgQHr72I5JXlEl7ui9UEApFOBTCN80hg23xvD6Ll4_7DIdgl7lN8RvBSSgNT3uiwzHtNJ-dxIAeQEG3aXqOc8k3L4H3QAfswgDy-MPQ35RMH3d7O4-pJiFO1mUx--nZ133zrE5Y3kj0tFOm3j8_hoHZMSJA=s128-no",
        "partly-cloudy-night": "https://lh3.googleusercontent.com/Ie1tcqz-wk4D8_7O9epDt9avLa3wYzGpszQF0MgEwEWlqGKJ4hS45jbmdXEz6C0B4Zp58wdYzEx_k7eXY8JnHHhRcfOov3IqAYi-qxwspslIxDUoGErk1utk6Sa5PO8fPuwNSkocHHvg1pJEnAcYPETfKHGf91SJjo2-WGi-72phW2qACHKH0HKpBsH6Zko7HGUOuMKkgsSuD2QEi4QDqa7c9V6UUOROkscJkQxN9RZ65oIMCGPnWN4giusdNfsP-XRPmUURYjXL_8Flyoum_IorPtL1VZYXbw6Nm5g0yU2ZghgT54hXudBsF5PBZazn1w9YomZRM0oTejrQsU7DHlwe5eoUfj1XP9Q-Hatv2avU70zjM9owBjGTfqJqHevc3tFLAOrlwK10v2DCVSWWgP2Uh19ZOc2Pe8xz1wpst8Vhf2MGjRWNh-ZSFjLG3sbAzuDi7Psr4llx-gOQsc7ouqKJ8nFz0Q620Je48N3c_hXig3yqaR0oVTzktRgLGItX2qKK1EYEHwHYZsHqdrsaHjI_2rRhx0snHAz06cbk6w=s128-no",
        "rain": "https://lh3.googleusercontent.com/7h1UmPs9lH-F4etf9eHsiMNPRYVfZvEtMBN73IXnmWEidaUMxu8i_x8-90_SkGvyxn0GkN6tYbNJxEnrMSDTQv8LX83OxqvFKhCFm8nuk14BmejE5s7-Eit3xsU1haGl3n1EloJdhhwVJ_05-D4SlAVluN_MCwliVyok6eaUFUprxNJ9DRgHu3RmVdfzhZTAvS_gwZoQxeL91i-51QdfIOJ2qypIOEgKIpCXb1qjm6GmstxvQzJtSgqWRrcnbOipcG2OyGRCIUXHJlDQPHXk4l9V3mkHLsdVgh1gVkjtOSPl9Gm7ET2J-87V6wa86MkTVt3HCJ2sBGgn0mzgS6oMHSkZ8V5Jq2phszPAm8q4O82LPJIudwm9swU8K6URO5ajW92t5PF0V6xgmn8LE7FZ1f-Ez_rKHy2hA4m5sS5lS-dkNxJI4GIUsY4_c5SoNM_qUZD7ZmFCYk-sx3WhyM1fyjwmTZSOVPXyEPSLBuGAaf6NupIULnDAEipzsdCj4VM5hhNq2rCf_lRq7JcY68fU8pK4492wK9Q9zwWOKwTAhw=s128-no",
        "sleet": "https://lh3.googleusercontent.com/Z0nZzgbEBLRzMgnSBKaMb-7o5mNRbdlMQNZhKoty_BvbYy7Gt-RC9-N4TrXekPuFV7ZQP55aX7hktEapcT9xetr6vCRUmcQDkqk72l2LGXvQW9N7_tywV53KDH2KOPpF5mV10PVpWpPpRss4Xafb5xkAybvqW_o3FRWBOAnHnPpu_GGp8wSmPLMCa6aLP63ZKqWk0UZgE7cF9w1sLSDtk4J7hEPLwNOn4PmWmF-dhnOdXoEwwgW7wPd7iQXAfYXe71dQlp3FzTGLD0671GjRegJLw0Io5hr-6MUr0cPxtGGSc62H9Btmu5x0heI366gPzS_jOUHo8Q_o4_PxFvEX-wWm-0Wz9WrwwUSnddzStgzg76WabRAsLvLy6UufJQkhCHbZCL60ZB5qykeUREKMhAY9eTobPwbFqp9hc8-z0DZ4o_3i94dXG8lDZlMa2StW8n6nxH-0c5uhUESumbYULqxp776UQqL_WS6U62c480cV5NfuQ03w3JkNrP2b6F3Kb5MZCO6s5wLj5ObGqx2elDlbyBtoebf3fSWTwx0XJw=s128-no",
        "snow": "https://lh3.googleusercontent.com/NeEnZK4nXkNFlres4hvdtHiIctSu3-O0D0VuHDI1QnGPS_N3tXO_AxAzoMC8Q2mmCBK2NjQOagfeAeqBvbWvlPPYYvemm_LR8jNtAp2v40W1tLh5yxDxicMG3R0y5pfTqLj2FvAvkutIHShvcBfvqg-nCbnHxDm54NjtJHz67tj-llXggSODmPG4dp0XhGeVUamZWReViD9U5VYpVyUAtqtjwTZMtML2QQA9-eWpP0IhTeTSsZJfiUi3zLUKDgOlrRQje8EcO_7OHv0wMmeeCW05uljqswMMkdeeuPsCFhRbUyj7x20q9K7cxu-uR6bl8ybYEKTT5aCMWtnW_27WDqLfif9u7aH300Lee5LVqt57bpoP1FJR3mMejmj9tGXDRCynuefqcnDGKs4Qg-iYBEYOpk2wkdLMKxCAhpgOZtRYzfF4h76fxGORq4C08rTElmQB44DVP4dOlQk4N9Pz_6-t2v7R7gvi412ioCVS01MulGQ2it9kXhGyHRCdJQkdMQ95ciIN5rp0j6Owt6q6eMENocCLCOZcbXSb9C871A=s128-no",
        "wind": "https://lh3.googleusercontent.com/5PK1IueT8Zmx0ypbVRjxHHvXVOHwd0g9K-K24Q7gfFaWvn9-rNPqGWJDK5_aaqD037yyIX847xIWiXkJvZtcd5Bj9wD9Rhn2nlWfo4mWtfOj76xmmI6G6AHjaJkwd_oBP5ZhUziN2YnYJjTl0Kt3vF_PzVLOQqE-0T5gMQdE2e3gvGSqbvqyUhwpcUtNUEOE5V1GBxLKBzkUo2uXZg7OHfvY8V0IpEPypdj1zp8eRpbsJe7am6UzGiNKRa-oC5GWEgjEOjMeftwiYvtWxrkX4EX5iagraTvfdYlcd34dGTlmk9QojvsvQ-V5s9YtFefwaAw3utd_jiKkZx8jQP-iPnSeTx4R27ZvSQKN5dumNix9PIGRClJBHgmfc-QlGpROx4TZjalLc5wpA8mOpULUnWRuWTD7u4E7eWTLLqy711eXd7ZMsP_s-Rpnwguu5dtI5Z_J9i2ko4GNILH3-p-Ph1fZziNosq6r1tMr-ID85m0ok9RmEAncmNPKgCBFuxnUHSuLJ1Q_D1IcK5AiTIHv3XKgteHUBVyLBLtJ6b1gMw=s128-no"
    }

    // index of the currently visible forecast
    //current_weather_forecast_show = 0;


    // convert the address typed in by the user and convert it to geographical coordinates
    function geocoding(callback) {

        geocoder.geocode({ 'address': address }, function (results, status) {

            if (status == google.maps.GeocoderStatus.OK) {
                latlng = results[0].geometry.location;
                lat = latlng.lat();
                lng = latlng.lng();

                callback();
            } else {
                alert("That address can't be found.");
            }
        });
    }

    // takes latitude and longitude values and turns them into an address
    function reverse_geocoding(callback) {
        geocoder.geocode({ 'location': latlng }, function (results, status) {
            if (status === google.maps.GeocoderStatus.OK) {
                address = results[1].formatted_address;

                callback(address);
            } else {
                alert("Can't find your current address");
            }
        });
    }

    // make the api request
    function makeApiRequest(options) {

        // construct the url using the endpoint and geographical coordinates
        var requested_url = construct_request_url(endpoint, lat, lng);

        $.ajax({
            url: requested_url,
            dataType: options.dataType,
            success: function (results) { display(results) } // display the results
        });
    }

    // display the address as the heading
    function displayHeading() {
        if (address)
            document.getElementsByTagName("h1")[0].innerText = address;
        else
            document.getElementsByTagName("h1")[0].innerText = "Unknown Address";
    }

    // validates an array of nested properties against a root object
    function traceProperties(obj, propArr) {

        var found = true;

        for (var i = 0; i < propArr.length; i++) {
            if (obj.hasOwnProperty(propArr[i]))
                obj = obj[propArr[i]];
            else
                found = false;
        }

        return found;

    }

    // get weekly forecast
    function getWeeklyForecast(results) {

        // create time object
        timey = new Timey();


        // for the seven expected days
        for (var i = 0; i < 7; i++) {
            weeklyForecast.push({
                icon: traceProperties(results, ["daily", "data", i, "icon"]) ? results["daily"]["data"][i]["icon"] : "default",
                summary: traceProperties(results, ["daily", "data", i, "summary"]) ? results["daily"]["data"][i]["summary"] : "Summary Unavailable",
                temperatureMax: traceProperties(results, ["daily", "data", i, "apparentTemperatureMax"]) ? results["daily"]["data"][i]["apparentTemperatureMax"] : "0",
                weatherBorder: traceProperties(results, ["daily", "data", i, "icon"]) ? weatherBorders[results["daily"]["data"][i]["icon"]] : "white",
                date: timey.formatDate("D d M Y"),
            });

            timey.forwardDay();
        }
    }

    // get tomorrows data
    function getTomorow(results, index) {

        if (results["daily"] && results["daily"]["data"] && results["daily"]["data"][index] && results["daily"]["data"][index]["icon"]) {

            tomorrowIcon = results["daily"]["data"][index]["icon"];
            current_temp = results["daily"]["data"][index]["temperatureMax"];

            checkIcon(tomorrowIcon, function () {
                setImage("#tomorrow img", iconUrl);
                $("#tomorrow .temperature").html(current_temp + "&deg;");
            });
        }
    }

    // read the current data
    function readCurrently(results) {

        currentIcon = results["currently"]["icon"];
        current_temp = results["currently"]["temperature"];

        checkIcon(currentIcon, function () {
            setImage("#today img", iconUrl);
            $("#today .temperature").html(current_temp + "&deg;");
        });
    }

    function setUpInterface() {

        // cache a reference to the daily forecast element
        $daily_forecast_days = $("#daily_forecast .day");

        var iconUrl = "";

        var days_on_show = $daily_forecast_days.length;

        for (var i = 0; i < days_on_show; i++) {
            iconUrl = "Weather App/../images/" + weeklyForecast[i].icon + ".png";

            $daily_forecast_days.eq(i).find(".time").text(weeklyForecast[i].date);
            $daily_forecast_days.eq(i).find("img").attr("src", weatherIcons[weeklyForecast[i].icon]);
            $daily_forecast_days.eq(i).find(".temperature").html(weeklyForecast[i].temperatureMax + "<span class='temp_unit'>&#8457;</span>");
            $daily_forecast_days.eq(i)[0].className = $daily_forecast_days.eq(i)[0].className.replace(/border.+/g, "");
            console.log(weeklyForecast[i].weatherBorder);
            $daily_forecast_days.eq(i).addClass(weeklyForecast[i].weatherBorder);
        }

        loadReport(0);
    }

    function loadReport(index) {
        console.log($(this));
        $(".summary-date").text(weeklyForecast[index].date);
        $("#summary").text(weeklyForecast[index].summary);

    }


    // the main display method that will showcase the data
    function display(results) {

        console.log(results);

        if (results != null) {

            if (!address) {
                reverse_geocoding(function () {
                    displayHeading();
                    getWeeklyForecast(results);
                    setUpInterface();

                    //readCurrently(results);
                    //getTomorow(results, 1);
                });
            } else {
                displayHeading();
                getWeeklyForecast(results);
                setUpInterface();
                //readCurrently(results);
            }

        } else {
            throw new error("Didnt work");
        }

        $("body").addClass("loaded");
        $(".quick_info_wrapper").addClass("unselected");
        $("#today").removeClass("unselected");
    }

    // set the default coordinates
    function setDefaultLatlng(makeApiRequest) {

        // Altrincham
        latlng = { lat: 53.39023659999999, lng: -2.3126412999999957 }
        lat = latlng.lat;
        lng = latlng.lng;

        makeApiRequest();

    }

    // construct the url  
    function construct_request_url(endpoint, lat, lng) {

        return endpoint + lat + "," + lng;

    }

    // grab the coordinates of our address and execute the callback
    function getLatLng(getLatLng, callback) {

        getLatLng(function () {
            callback();
        });
    }

    // retrieve the users geolocation based on the navigator object
    function getUserLatlngWeather(makeApiRequest) {

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (pos) {

                latlng = { lat: pos.coords.latitude, lng: pos.coords.longitude }
                lat = latlng.lat;
                lng = latlng.lng;

            }, setDefaultLatlng(makeApiRequest));

        } else {
            setDefaultLatlng(makeApiRequest);
        }
    }

    window.onload = function () {

        /*
        /   CLICK EVENTS
        /
        */

        // check to see if a daily forecast has been clicked
        $(".quick_info_wrapper").on("click", function () {

            $(".quick_info_wrapper").addClass("unselected");
            $(this).removeClass("unselected");

            loadReport($(this).index());
        });

        // forward a day to be used with the forward and back buttons - *no longer being used*
        /*
        $("#forwardBTN").on("click", function(){
    
          $(".quick_info_wrapper").eq(current_weather_forecast_show).css("display", "none");
          current_weather_forecast_show++;
    
        });
        
        // back a day to be used with the forward and back buttons - *no longer being used*
        $("#previousBTN").on("click", function(){
    
          current_weather_forecast_show--;
          $(".quick_info_wrapper").eq(current_weather_forecast_show).css("display", "inherit");
    
        });
        */

        // convert celsius to fahrenheit and vice versa
        $("#convertBTN").on("click", function () {

            // get the current data conversion value
            conversion_type = document.getElementById("convertBTN").getAttribute("data-conversion");

            if (conversion_type === "celsius") {
                if (!weeklyForecast.hasOwnProperty("celsius")) {
                    // loop through all the days in the weekly forecast array
                    for (var i = 0; i < weeklyForecast.length; i++)
                        // create a new property and give it the value of the current temperature in fahrenheit but in celsius
                        weeklyForecast[i].celsius = Math.round((weeklyForecast[i].temperatureMax - 32) * 0.55 * 100) / 100;
                }

                // for each daily forecast wrapper change the value to celsius
                $(".quick_info_wrapper").each(function (element) {
                    $(this).find(".temperature").html(weeklyForecast[$(this).index()].celsius + "&deg;");
                });

                // change the attribute of the convert button to fahrenheit
                document.getElementById("convertBTN").setAttribute("data-conversion", "fahrenheit");
                // change the value of the convert button to fahrenheit
                document.getElementById("convertBTN").innerHTML = "Fahrenheit &#8457;";

            } else {

                // change the value of each daily forecast to the temperature in fahrenheit
                $(".quick_info_wrapper").each(function (element) {
                    $(this).find(".temperature").html(weeklyForecast[$(this).index()].temperatureMax + "&#8457;");
                });

                // change the attribute of the convert button to celsius
                document.getElementById("convertBTN").setAttribute("data-conversion", "celsius");
                // change the value of the convert button to fahrenheit
                document.getElementById("convertBTN").innerHTML = "Celsius &deg;";
            }


        });

        // whenever a link from a daily forecast is clicked take the user to the summary section
        $(".summary-link").on("click", function () {

            id = ($(this).attr("href"));
            scrollVertical = $(id).offset().top - $(id).height();
            $("body, html").animate({ scrollTop: scrollVertical }, 300);

        });

        weeklyForecast = [];

        // try to retrieve the users current location
        getLatLng(getUserLatlngWeather, function () {

            makeApiRequest(options);

        });
    }

    // on form submission
    address_form.onsubmit = function (event) {

        $("body").removeClass("loaded");

        // prevent the default behaviour of submitting the form
        event.preventDefault();

        // set the address variable to what the user typed
        address = document.getElementById("address_query").value;

        weeklyForecast = [];

        // get the geographical coordinates of what the user entered using geocoding
        getLatLng(geocoding, function () {
            makeApiRequest(options);
        });
    }
}