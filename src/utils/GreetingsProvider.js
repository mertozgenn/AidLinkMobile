const greetingsProvider = () => {
    var hours = new Date().getHours();
    if(hours >= 22 || hours <= 6) {
        return "İyi geceler";
    }

    if(hours >= 18) {
        return "İyi akşamlar";
    }

    if(hours >= 12) {
        return "İyi günler";
    }

    return "Günaydın";
}

export default greetingsProvider;