export class StringSimilarity {
	/**
	 * Check similarity using all available methods
	 * Returns true if any method meets the threshold
	 */
	public static checkAllMethods(str1: string, str2: string, threshold: number = 70): boolean {
		const methods = [
			(s1: string, s2: string) => this._simpleSimilarity(s1, s2),
			(s1: string, s2: string) => this._levenshteinDistance(s1, s2),
			(s1: string, s2: string) => this._jaccardSimilarity(s1, s2),
			(s1: string, s2: string) => this._cosineSimilarity(s1, s2)
		];

		return methods.some(method => method(str1, str2) >= threshold);
	}

	/**
	 * Get detailed similarity results from all methods
	 */
	public static getDetailedSimilarity(str1: string, str2: string): {
		levenshtein: number;
		cosine: number;
		jaccard: number;
		simple: number;
		average: number;
	} {
		const results = {
			levenshtein: this._levenshteinDistance(str1, str2),
			cosine: this._cosineSimilarity(str1, str2),
			jaccard: this._jaccardSimilarity(str1, str2),
			simple: this._simpleSimilarity(str1, str2),
		};

		const values = Object.values(results);
		const average = values.reduce((sum, value) => sum + value, 0) / values.length;

		return {
			...results,
			average
		};
	}

	/**
	 * Calculate similarity using Levenshtein distance algorithm
	 * Returns percentage similarity (0-100)
	 */
	private static _levenshteinDistance(str1: string, str2: string): number {
		if (str1 === str2) return 100;

		const matrix: number[][] = Array(str2.length + 1)
			.fill(null)
			.map(() => Array(str1.length + 1).fill(0));

		// Initialize first row and column
		for (let i = 0; i <= str2.length; i++) matrix[i][0] = i;
		for (let j = 0; j <= str1.length; j++) matrix[0][j] = j;

		// Fill the matrix
		for (let i = 1; i <= str2.length; i++) {
			for (let j = 1; j <= str1.length; j++) {
				const cost = str2[i - 1] === str1[j - 1] ? 0 : 1;
				matrix[i][j] = Math.min(
					matrix[i - 1][j] + 1,     // deletion
					matrix[i][j - 1] + 1,     // insertion
					matrix[i - 1][j - 1] + cost // substitution
				);
			}
		}

		const maxLength = Math.max(str1.length, str2.length);
		return maxLength === 0 ? 100 : ((maxLength - matrix[str2.length][str1.length]) / maxLength) * 100;
	}

	/**
	 * Calculate similarity using cosine similarity on character frequencies
	 * Returns percentage similarity (0-100)
	 */
	private static _cosineSimilarity(str1: string, str2: string): number {
		if (str1 === str2) return 100;

		const freq1: Map<string, number> = new Map();
		const freq2: Map<string, number> = new Map();

		// Count character frequencies (case insensitive)
		for (const char of str1.toLowerCase()) {
			freq1.set(char, (freq1.get(char) || 0) + 1);
		}
		for (const char of str2.toLowerCase()) {
			freq2.set(char, (freq2.get(char) || 0) + 1);
		}

		// Get all unique characters from both strings
		const allChars = new Set([...freq1.keys(), ...freq2.keys()]);

		// Calculate dot product and magnitudes
		let dotProduct = 0;
		let mag1 = 0;
		let mag2 = 0;

		for (const char of allChars) {
			const f1 = freq1.get(char) || 0;
			const f2 = freq2.get(char) || 0;

			dotProduct += f1 * f2;
			mag1 += f1 * f1;
			mag2 += f2 * f2;
		}

		const magnitude = Math.sqrt(mag1) * Math.sqrt(mag2);
		return magnitude === 0 ? 0 : (dotProduct / magnitude) * 100;
	}

	/**
	 * Calculate similarity using Jaccard index on character sets
	 * Returns percentage similarity (0-100)
	 */
	private static _jaccardSimilarity(str1: string, str2: string): number {
		if (str1 === str2) return 100;

		const set1 = new Set(str1.toLowerCase());
		const set2 = new Set(str2.toLowerCase());

		const intersection = new Set([...set1].filter(char => set2.has(char)));
		const union = new Set([...set1, ...set2]);

		return union.size === 0 ? 100 : (intersection.size / union.size) * 100;
	}

	/**
	 * Simple substring-based similarity check
	 * Returns 100 if one string contains the other, 0 otherwise
	 */
	private static _simpleSimilarity(str1: string, str2: string): number {
		const s1 = str1.toLowerCase();
		const s2 = str2.toLowerCase();

		return (s1.includes(s2) || s2.includes(s1)) ? 100 : 0;
	}
}