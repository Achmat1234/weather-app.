function displayUserOutput() {
    var temperature = document.getElementById("temp").value;
    // Creating a temp variable

    //  Giving the temp is greater than 25 degree
    if (temperature <= 25 &&  temperature >=13) {
        document.getElementById("text").innerHTML = "T-shirts, shorts, shades and some sun block.";
        //  Giving the temp is greater than 12 but less than 15
    } else if (temperature >= 12 && temperature <= 15) {
        document.getElementById("text").innerHTML = "Wear a wind breaker jacket";
        //  Giving the temp is greater than -10 but less than -1
    } else if (temperature >= -10 && temperature <= -1) {
        document.getElementById("text").innerHTML = "Dress warmly and bring out your shovel cause its snowy";
        //  Giving that the temp is less than 10 but greater than 1   
    } else if (temperature <= 10 && temperature >= -15) {
        document.getElementById("text").innerHTML = "wear a rain coat and take your umbrela";
        //  Giving that if any of the above values aren't entered then its invalid   
    } else {
        document.getElementById("text").innerHTML = "Not a valid weather temperature";
    }

}

