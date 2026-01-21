import { connectDB } from "./mongodbUtilities";
import { FAQ } from "../models/faq.model";
import { faqSeedData } from "../data/faq.seed";
import { logger } from '@/lib/utils/logger';

/**
 * Seeds the FAQ collection with initial data
 * Only seeds if the collection is empty
 */
export async function seedFAQData() {
  try {
    await connectDB();

    // Check if FAQ data already exists
    const existingFAQ = await FAQ.findOne();
    
    if (existingFAQ) {
      logger.info('FAQ data already exists, skipping seed');
      return { success: true, message: 'FAQ data already exists' };
    }

    // Create new FAQ document with seed data
    const faqDocument = new FAQ(faqSeedData);
    await faqDocument.save();

    logger.info('FAQ data seeded successfully');
    return { success: true, message: 'FAQ data seeded successfully' };
    
  } catch (error) {
    logger.error('Error seeding FAQ data', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

/**
 * Forces a complete reset and reseed of FAQ data
 * WARNING: This will delete all existing FAQ data
 */
export async function resetAndSeedFAQData() {
  try {
    await connectDB();

    // Delete all existing FAQ documents
    await FAQ.deleteMany({});
    logger.info('Existing FAQ data cleared');

    // Create new FAQ document with seed data
    const faqDocument = new FAQ(faqSeedData);
    await faqDocument.save();

    logger.info('FAQ data reset and seeded successfully');
    return { success: true, message: 'FAQ data reset and seeded successfully' };
    
  } catch (error) {
    logger.error('Error resetting and seeding FAQ data', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}