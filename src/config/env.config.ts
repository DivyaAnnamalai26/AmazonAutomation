export interface EnvConfig {
  baseURL: string; username: string; password: string; product: string;
}

export const config: EnvConfig = {
  baseURL: process.env.BASE_URL || 'https://www.amazon.ca/', //  https://www.amazon.ca/ or https://www.amazon.com/
  username: process.env.AMAZON_USERNAME || 'Sample@gmail.com',
  password: process.env.AMAZON_PASSWORD || 'Sample123',
  product: (process.env.AMAZON_PRODUCT || 'Atomic Habits: An Easy & Proven Way to Build Good Habits & Break Bad Ones').trim()

  // product: process.env.AMAZON_PRODUCT ||'Insider Buy Superstocks: The Super Laws of How I Turned $46K into $6.8 Million (14,972%) in 28 Months'

};
