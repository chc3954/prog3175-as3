class GreetingRequest {
  constructor(timeOfDay, language, tone) {
    this.timeOfDay = capitalize(timeOfDay);
    this.language = capitalize(language);
    this.tone = capitalize(tone);
  }
}

class GreetingResponse {
  constructor(greetingMessage) {
    this.greetingMessage = greetingMessage;
  }
}

const capitalize = (str) => {
  str = str + ""; // convert to string, even null or undefined values be able to be converted
  const capitalized = str[0].toUpperCase() + str.slice(1);
  return capitalized;
};

module.exports = { GreetingRequest, GreetingResponse };
