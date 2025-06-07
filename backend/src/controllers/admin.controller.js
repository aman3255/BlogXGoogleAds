

const adminController = async (req, res ) => {
    try {
        res.status(200).json({
            message: "Admin controller is working"
        });
    } catch (error) {
        console.error("Error in adminController:", error);
    }
}

module.exports = {
    adminController
}