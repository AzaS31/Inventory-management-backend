import * as accessService from "./inventoryAccess.service.js";

export const addAccess = async (req, res) => {
  try {
    const { inventoryId, userId } = req.body;
    const access = await accessService.grantAccess(inventoryId, userId);
    res.json(access);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const removeAccess = async (req, res) => {
  try {
    const { inventoryId, userId } = req.params;
    await accessService.revokeAccess(inventoryId, userId);
    res.json({ message: "Access revoked" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const listAccess = async (req, res) => {
  try {
    const { inventoryId } = req.params;
    const accessList = await accessService.getAccessList(inventoryId);
    res.json(accessList);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
