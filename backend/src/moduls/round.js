import z from "zod";

export const bodyStartRound = z.object({
  bet: z.number().int().min(1, "Bet must to be minimum 1"),
});
