module.exports = {
  getTitleCase: (word) => {
		//takes a string as an argument and returns a string (getTitleCase("hello") => returns "Hello")
		if(word.length === 0) return word;
		return `${word.substring(0,1).toUpperCase()}${word.substring(1).toLowerCase()}`;
	}
}
