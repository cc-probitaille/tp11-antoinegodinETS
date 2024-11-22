/**
 * StringCalculator est une classe qui permet d'additionner des nombres
 * fournis sous forme de chaîne de caractères avec différents délimiteurs.
 *
 * @example
 * const calculator = new StringCalculator();
 * console.log(calculator.add("1,2,3")); // Affiche 6 (1 + 2 + 3)
 * console.log(calculator.add("4\n5,6")); // Affiche 15 (4 + 5 + 6)
 * console.log(calculator.add("//;\n7;8;9")); // Affiche 24 (7 + 8 + 9)
 */
export class StringCalculator {
  private sum = 0;
  private callCount = 0;

  /**
   * Adds the numbers in the input string and returns their sum.
   * @param input Input string containing numbers to sum.
   * @returns The sum of the numbers.
   */
  add(input: string): number {
    this.callCount++;
    if (!input) return 0;

    const { numbers, negatives } = this.parseInput(input);

    if (negatives.length > 0) {
      throw new Error(`Negatives not allowed: ${negatives.join(", ")}`);
    }

    return numbers
      .filter((n) => n <= 1000) // Ignore numbers greater than 1000
      .reduce((sum, n) => sum + n, 0);
  }

  getCalledCount(): number {
    return this.callCount;
  }

  /**
   * Parses the input string to extract numbers and check for negatives.
   */
  private parseInput(input: string): {
    numbers: number[];
    negatives: number[];
  } {
    // Default delimiters include comma and newline
    let delimiters: RegExp = /[,\n]/;
    let cleanedInput = input;

    // Check for custom delimiters
    if (input.startsWith("//")) {
      const delimiterSection = input.match(/^\/\/(.+)\n/);
      if (delimiterSection) {
        const delimiterPart = delimiterSection[1];

        // Handle multiple delimiters with potential multiple character lengths
        const multiDelimiterMatches = delimiterPart.match(/\[(.+?)\]/g);

        if (multiDelimiterMatches) {
          // Extract and escape all delimiters
          const escapedDelimiters = multiDelimiterMatches.map((match) =>
            match.slice(1, -1).replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
          );

          delimiters = new RegExp(escapedDelimiters.join("|"), "g");
        } else {
          // Single custom delimiter
          const escapedDelimiter = delimiterPart.replace(
            /[.*+?^${}()|[\]\\]/g,
            "\\$&"
          );
          delimiters = new RegExp(escapedDelimiter, "g");
        }

        // Remove the delimiter definition line
        cleanedInput = input.slice(delimiterSection[0].length);
      }
    }

    // Split and convert numbers
    const numbers = cleanedInput
      .split(delimiters)
      .map((n) => parseInt(n, 10))
      .filter((n) => !isNaN(n));

    const negatives = numbers.filter((n) => n < 0);

    return { numbers, negatives };
  }

  /**
   * Transforme la chaîne d'entrée en un tableau de nombres.
   * @param input La chaîne d'entrée à parser.
   * @returns Un tableau de nombres extraits de la chaîne d'entrée.
   */
  private splitInput(input: string): number[] {
    const defaultDelimiters = /[,\n]/;
    let customDelimiter: string | undefined;

    // Vérifie si un délimiteur personnalisé est spécifié
    if (input.startsWith("//")) {
      customDelimiter = this.extractCustomDelimiter(input);
      // Retire la ligne de définition du délimiteur personnalisé
      input = input.split("\n").slice(1).join("\n");
    }

    const inputArray = customDelimiter
      ? input.split(customDelimiter)
      : input.split(defaultDelimiters);

    return inputArray.map(Number);
  }

  /**
   * Extrait le délimiteur personnalisé de la chaîne d'entrée.
   * @param input La chaîne d'entrée contenant le délimiteur personnalisé.
   * @returns Le délimiteur personnalisé.
   */
  private extractCustomDelimiter(input: string): string {
    return input[2];
  }
}
