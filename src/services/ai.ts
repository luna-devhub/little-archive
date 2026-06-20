import Constants from 'expo-constants';

// API keys from environment variables
const GOOGLE_CLOUD_VISION_API_KEY = Constants.expoConfig?.extra?.googleCloudVisionApiKey || process.env.EXPO_PUBLIC_GOOGLE_CLOUD_VISION_API_KEY;
const REMOVE_BG_API_KEY = Constants.expoConfig?.extra?.removeBgApiKey || process.env.EXPO_PUBLIC_REMOVE_BG_API_KEY;

interface IdentificationResult {
  name: string;
  description: string;
  funFacts: string;
}

/**
 * Identify an object using Google Cloud Vision API
 * @param imageBase64 - Base64 encoded image
 * @returns Identification result with name, description, and fun facts
 */
export async function identifyObject(imageBase64: string): Promise<IdentificationResult> {
  if (!GOOGLE_CLOUD_VISION_API_KEY) {
    throw new Error('Google Cloud Vision API key not configured');
  }

  try {
    // Call Google Cloud Vision API
    const response = await fetch(
      `https://vision.googleapis.com/v1/images:annotate?key=${GOOGLE_CLOUD_VISION_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          requests: [
            {
              image: {
                content: imageBase64,
              },
              features: [
                { type: 'LABEL_DETECTION', maxResults: 10 },
                { type: 'WEB_DETECTION', maxResults: 5 },
              ],
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to identify object');
    }

    const data = await response.json();
    const result = data.responses[0];

    // Extract labels
    const labels = result.labelAnnotations?.map((label: any) => label.description) || [];

    // Extract web entities
    const webEntities = result.webDetection?.webEntities?.map((entity: any) => entity.description) || [];

    // Extract best guess
    const bestGuess = result.webDetection?.bestGuessLabels?.[0]?.label || '';

    // Generate identification result
    const name = bestGuess || labels[0] || 'Unknown Object';
    const description = generateDescription(labels, webEntities);
    const funFacts = generateFunFacts(name, labels);

    return { name, description, funFacts };
  } catch (error: any) {
    console.error('Error identifying object:', error);
    throw error;
  }
}

/**
 * Remove background from an image using Remove.bg API
 * @param imageBase64 - Base64 encoded image
 * @returns Base64 encoded image with background removed
 */
export async function removeBackground(imageBase64: string): Promise<string> {
  if (!REMOVE_BG_API_KEY) {
    throw new Error('Remove.bg API key not configured');
  }

  try {
    const response = await fetch('https://api.remove.bg/v1.0/removebg', {
      method: 'POST',
      headers: {
        'X-Api-Key': REMOVE_BG_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image_file_b64: imageBase64,
        size: 'auto',
        format: 'png',
        response_type: 'base64',
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.errors?.[0]?.title || 'Failed to remove background');
    }

    const data = await response.json();
    return data.data.result_b64;
  } catch (error: any) {
    console.error('Error removing background:', error);
    throw error;
  }
}

/**
 * Generate a description from labels and web entities
 */
function generateDescription(labels: string[], webEntities: string[]): string {
  const allTerms = [...new Set([...labels, ...webEntities])].slice(0, 5);

  if (allTerms.length === 0) {
    return 'An interesting object worth cataloging.';
  }

  if (allTerms.length === 1) {
    return `A ${allTerms[0].toLowerCase()} found and cataloged.`;
  }

  return `Identified as: ${allTerms.join(', ')}.`;
}

/**
 * Generate fun facts based on the identified object
 */
function generateFunFacts(name: string, labels: string[]): string {
  const lowercaseName = name.toLowerCase();
  const lowercaseLabels = labels.map(l => l.toLowerCase());

  // Simple fun fact generation based on common categories
  if (lowercaseLabels.some(l => l.includes('flower') || l.includes('plant') || l.includes('botany'))) {
    return 'Plants have been collected and preserved for centuries. Herbarium specimens can last for hundreds of years when properly dried and stored.';
  }

  if (lowercaseLabels.some(l => l.includes('rock') || l.includes('mineral') || l.includes('stone'))) {
    return 'Rocks and minerals are classified into three main types: igneous, sedimentary, and metamorphic. Each tells a story about Earth\'s history.';
  }

  if (lowercaseLabels.some(l => l.includes('insect') || l.includes('bug') || l.includes('butterfly'))) {
    return 'Insects are the most diverse group of animals on Earth, with over a million described species. They play crucial roles in ecosystems.';
  }

  if (lowercaseLabels.some(l => l.includes('shell') || l.includes('seashell'))) {
    return 'Seashells are the exoskeletons of marine mollusks. Their spiral patterns often follow the golden ratio found in nature.';
  }

  if (lowercaseLabels.some(l => l.includes('antique') || l.includes('vintage') || l.includes('old'))) {
    return 'Antiques gain value through age, rarity, condition, and historical significance. Each piece carries stories of the past.';
  }

  return 'Every object has a story. Cataloging helps preserve the memory and context of the things we find interesting.';
}
