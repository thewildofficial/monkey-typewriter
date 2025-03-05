# Monkey Typewriter Simulation

A fun, interactive simulation of the famous "Infinite Monkey Theorem" which states that a monkey hitting keys at random on a typewriter keyboard for an infinite amount of time will eventually type any given text.

![Monkey Typewriter Simulation](https://via.placeholder.com/800x400?text=Monkey+Typewriter+Simulation)

## Live Demo

Visit the live demo [here](https://github.com/thewildofficial/money-typewriter.git) (replace with your GitHub Pages URL once deployed).
## Features

- **Interactive Simulation**: Input your own paragraph and watch a virtual "monkey" randomly type letters to match it
- **Real-time Visualization**: See characters turn green as they're matched, similar to MonkeyType
- **Customizable Parameters**: Set your own alphabet and typing speed
- **Comprehensive Statistics**: View detailed stats about the simulation, including:
  - Total time taken
  - Total keystrokes
  - Average keystrokes per character
  - Theoretical predictions
- **Multiple Simulation Runs**: Run hundreds of simulations in the background and view distribution statistics
- **Beautiful Charts**: Visualize keystroke data with interactive charts

## How It Works

1. Enter a paragraph in the input field
2. (Optional) Customize the alphabet and typing speed
3. Click "Start Simulation" to begin
4. The virtual monkey will randomly type letters from the specified alphabet
5. When a correct letter is typed, it turns green and the simulation advances to the next character
6. Once the entire paragraph is matched, statistics are displayed
7. Optionally, run multiple simulations to see distribution of results

## The Mathematics Behind It

The Infinite Monkey Theorem is a fascinating probabilistic concept. For each character in your paragraph, the probability of the monkey typing the correct letter is `1/n` where `n` is the size of the alphabet.

- **Expected Keystrokes per Character**: Equal to the alphabet size
- **Expected Total Keystrokes**: Paragraph length × alphabet size

The distribution of total keystrokes follows a negative binomial distribution, which is visualized in the multiple simulations histogram.

## Technologies Used

- HTML5
- CSS3 (Flexbox for responsive design)
- Vanilla JavaScript
- Chart.js for data visualization

## Development

This project is entirely frontend-based with all processing happening client-side. To run it locally, simply clone the repository and open `index.html` in your browser.

```bash
git clone https://github.com/thewildofficial/monkey-typewriter.git
cd monkey-typewriter
# Open index.html in your browser
```

## Deployment

The site is deployed on GitHub Pages directly from the main branch.

## Contributing

Feel free to fork this repository and submit pull requests, or open issues to suggest improvements or report bugs.

## License

MIT License - see LICENSE file for details.

## Credits

- Inspired by the [Infinite Monkey Theorem](https://en.wikipedia.org/wiki/Infinite_monkey_theorem)
- Charts powered by [Chart.js](https://www.chartjs.org/)
- Emoji graphics by [Twitter Emoji (Twemoji)](https://twemoji.twitter.com/)