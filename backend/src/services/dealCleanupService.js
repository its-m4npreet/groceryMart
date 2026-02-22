const Product = require('../models/productModel');
const { getIO } = require('../sockets');

/**
 * Clean up expired deals - resets isHotDeal, discount, and discountExpiry
 * for products whose discount expiry date has passed.
 * This runs automatically so expired deals are removed from the Hot Deals page
 * and products show their original price in their respective categories.
 */
const cleanupExpiredDeals = async () => {
    try {
        const now = new Date();

        // Find all products with expired discounts that haven't been cleaned up yet
        const expiredProducts = await Product.find({
            discountExpiry: { $ne: null, $lte: now },
            $or: [
                { isHotDeal: true },
                { discount: { $gt: 0 } },
            ],
        });

        if (expiredProducts.length === 0) {
            return { cleaned: 0 };
        }

        // Reset expired deals in bulk
        const result = await Product.updateMany(
            {
                discountExpiry: { $ne: null, $lte: now },
                $or: [
                    { isHotDeal: true },
                    { discount: { $gt: 0 } },
                ],
            },
            {
                $set: {
                    isHotDeal: false,
                    discount: 0,
                    discountExpiry: null,
                },
            }
        );

        if (result.modifiedCount > 0) {
            const expiredInfo = expiredProducts.map(p => ({
                id: p._id,
                name: p.name,
                category: p.category,
            }));
            const productNames = expiredInfo.map(p => p.name).join(', ');
            console.log(`[Deal Cleanup] Cleaned up ${result.modifiedCount} expired deal(s): ${productNames}`);

            // Emit socket event so frontend pages can refresh in real-time
            const io = getIO();
            if (io) {
                io.emit('deals-expired', {
                    count: result.modifiedCount,
                    products: expiredInfo,
                    message: `${result.modifiedCount} deal(s) expired and cleaned up`,
                });
            }
        }

        return { cleaned: result.modifiedCount, products: expiredProducts.map(p => p.name) };
    } catch (error) {
        console.error('[Deal Cleanup] Error cleaning up expired deals:', error.message);
        return { cleaned: 0, error: error.message };
    }
};

let cleanupInterval = null;

/**
 * Start the deal cleanup scheduler
 * Runs every 30 seconds to check for and clean up expired deals
 */
const startDealCleanupScheduler = () => {
    // Run immediately on startup
    cleanupExpiredDeals().then(result => {
        if (result.cleaned > 0) {
            console.log(`[Deal Cleanup] Initial cleanup: ${result.cleaned} expired deal(s) reset`);
        }
    });

    // Then run every 30 seconds for near-real-time cleanup
    cleanupInterval = setInterval(cleanupExpiredDeals, 30 * 1000);
    console.log('[Deal Cleanup] Scheduler started - checking every 30 seconds');
};

/**
 * Stop the deal cleanup scheduler
 */
const stopDealCleanupScheduler = () => {
    if (cleanupInterval) {
        clearInterval(cleanupInterval);
        cleanupInterval = null;
        console.log('[Deal Cleanup] Scheduler stopped');
    }
};

module.exports = {
    cleanupExpiredDeals,
    startDealCleanupScheduler,
    stopDealCleanupScheduler,
};
