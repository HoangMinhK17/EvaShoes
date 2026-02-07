import Fincancial from "../models/fincancial.js";

const getFinancials = async (req, res) => {
    try {
        const financials = await Fincancial.find();
        res.status(200).json(financials);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
export { getFinancials };