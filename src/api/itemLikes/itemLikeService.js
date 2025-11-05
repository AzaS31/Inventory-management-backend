import { itemLikeRepository } from "./itemLikeRepository.js";
import { NotFoundError, BadRequestError } from "../../utils/errors.js";

export const itemLikeService = {
    async toggleLike(itemId, userId) {
        if (!itemId || !userId) throw new BadRequestError("Item ID and User ID are required.");

        const item = await itemLikeRepository.findItemById(itemId);
        if (!item) throw new NotFoundError("Item not found.");

        const existingLike = await itemLikeRepository.findLike(itemId, userId);

        if (existingLike) {
            await itemLikeRepository.runTransaction([
                itemLikeRepository.deleteLike(existingLike.id),
                itemLikeRepository.decrementItemLikes(itemId),
            ]);
            return { message: "Unliked successfully.", liked: false };
        } else {
            await itemLikeRepository.runTransaction([
                itemLikeRepository.createLike(itemId, userId),
                itemLikeRepository.incrementItemLikes(itemId),
            ]);
            return { message: "Liked successfully.", liked: true };
        }
    },

    async isItemLikedByUser(itemId, userId) {
        const like = await itemLikeRepository.findLike(itemId, userId);
        return !!like;
    },
};
